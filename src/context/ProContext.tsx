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

  // Load Pro status from localStorage on mount or login
  useEffect(() => {
    const dId = getOrCreateDeviceId();
    setDeviceId(dId);
    
    const loadStatus = () => {
      // 1. Check local storage for this specific user if logged in
      if (isAuthenticated && user) {
        const userProKey = `pro_status_${user.userId}`;
        const cachedPro = safeGet<ProStatus | null>(userProKey, null);
        if (cachedPro) {
          setProStatus(cachedPro);
          setIsProUser(cachedPro.isPro);
          return;
        }
      }

      // 2. Strict check for Pro status
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
  }, [isAuthenticated, user]);

  const restoreProStatus = async () => {
    if (!isAuthenticated || !user) return;
    
    // In a real app, this calls the backend /api/billing/status
    // Simulation for Spendory requirements:
    const mockProStatus: ProStatus = {
      isPro: false,
      plan: "Free",
      validUntil: null,
      lastVerifiedAt: new Date().toISOString()
    };

    const userProKey = `pro_status_${user.userId}`;
    safeSet(userProKey, JSON.stringify(mockProStatus));
    setProStatus(mockProStatus);
    setIsProUser(mockProStatus.isPro);
    
    // Also bind to device for offline access
    safeSet(PRO_DEVICE_KEY, deviceId);
  };

  const unlockPro = (code: string): { success: boolean; message: string } => {
    const dId = getOrCreateDeviceId();
    
    if (verifyUnlockCode(code, dId)) {
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
      }
      
      return {
        success: true,
        message: "Pro unlocked! Your subscription is now tied to your account."
      };
    }
    
    return {
      success: false,
      message: "Invalid unlock code. Please check and try again."
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
