import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGet, safeSet, safeRemove, getOrCreateDeviceId } from "../utils/storage";
import { verifyUnlockCode } from "../utils/crypto";
import { useAuth } from "./AuthContext";

interface ProStatus {
  isPro: boolean;
  plan: string;
  validUntil: string | null;
  lastVerifiedAt: string;
}

interface ProContextValue {
  isProUser: boolean;
  proStatus: ProStatus;
  unlockPro: (code: string) => { success: boolean; message: string };
  resetPro: () => void;
  showGoProModal: boolean;
  setShowGoProModal: (show: boolean) => void;
  lockedFeature?: string;
  setLockedFeature: (feature?: string) => void;
  deviceId: string;
  restoreProStatus: () => Promise<void>;
}

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_KEY = "cashflo_pro";
const PRO_DEVICE_KEY = "cashflo_pro_device";

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isProUser, setIsProUser] = useState(false);
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    plan: "Free",
    validUntil: null,
    lastVerifiedAt: new Date().toISOString()
  });
  const [showGoProModal, setShowGoProModal] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>();
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const dId = getOrCreateDeviceId();
    setDeviceId(dId);
    
    const loadStatus = async () => {
      if (isAuthenticated && user) {
        const userProKey = `pro_status_${user.userId}`;
        const cachedPro = safeGet<ProStatus | null>(userProKey, null);
        if (cachedPro && cachedPro.isPro) {
          setProStatus(cachedPro);
          setIsProUser(cachedPro.isPro);
          if (cachedPro.isPro) safeSet(PRO_KEY, "true");
          return;
        }
        
        await restoreProStatus();
        return;
      }

      const isUnlocked = safeGet<string>(PRO_KEY, "false") === "true";
      if (isUnlocked) {
        setIsProUser(true);
        setProStatus({
          isPro: true,
          plan: "Pro (Unlocked)",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        });
      } else {
        setIsProUser(false);
        setProStatus({
          isPro: false,
          plan: "Free",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        });
      }
    };

    loadStatus();
  }, [isAuthenticated, user?.userId]);

  const restoreProStatus = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token")}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const serverProStatus: ProStatus = {
          isPro: userData.isPro || false,
          plan: userData.proPlan || "Free",
          validUntil: null,
          lastVerifiedAt: new Date().toISOString()
        };

        const userProKey = `pro_status_${user.userId}`;
        safeSet(userProKey, JSON.stringify(serverProStatus));
        setProStatus(serverProStatus);
        setIsProUser(serverProStatus.isPro);
        
        if (serverProStatus.isPro) {
          safeSet(PRO_KEY, "true");
        }
      }
    } catch (error) {
      console.error("Failed to restore Pro status:", error);
    }
  };

  const unlockPro = (code: string): { success: boolean; message: string } => {
    const dId = getOrCreateDeviceId();
    const result = verifyUnlockCode(code, dId);
    
    if (!result.valid) {
      return {
        success: false,
        message: "Invalid unlock code. Please check and try again."
      };
    }
    
    setIsProUser(true);
    safeSet(PRO_KEY, "true");
    safeSet(PRO_DEVICE_KEY, dId);
    
    const newStatus = {
      isPro: true,
      plan: "Pro (Unlocked)",
      validUntil: null,
      lastVerifiedAt: new Date().toISOString()
    };
    setProStatus(newStatus);
    
    if (isAuthenticated && user) {
      safeSet(`pro_status_${user.userId}`, JSON.stringify(newStatus));
      fetch("/api/auth/pro", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify({ isPro: true, plan: "Pro (Unlocked)" })
      });
    }
    
    return {
      success: true,
      message: "Pro unlocked! Your subscription is now tied to your account."
    };
  };

  const resetPro = () => {
    setIsProUser(false);
    setProStatus({
      isPro: false,
      plan: "Free",
      validUntil: null,
      lastVerifiedAt: new Date().toISOString()
    });
    safeRemove(PRO_KEY);
    safeRemove(PRO_DEVICE_KEY);
    if (isAuthenticated && user) {
      safeRemove(`pro_status_${user.userId}`);
    }
  };

  return (
    <ProContext.Provider
      value={{
        isProUser,
        proStatus,
        unlockPro,
        resetPro,
        showGoProModal,
        setShowGoProModal,
        lockedFeature,
        setLockedFeature,
        deviceId,
        restoreProStatus
      }}
    >
      {children}
    </ProContext.Provider>
  );
};

export function usePro(): ProContextValue {
  const ctx = useContext(ProContext);
  if (!ctx) {
    throw new Error("usePro must be used within ProProvider");
  }
  return ctx;
}
