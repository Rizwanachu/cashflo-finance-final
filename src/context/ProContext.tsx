import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGet, safeSet, safeRemove, getOrCreateDeviceId } from "../utils/storage";
import { verifyUnlockCode } from "../utils/crypto";
import { useAuth } from "./AuthContext";

interface TrialInfo {
  startDate: string;
  endDate: string;
  isActive: boolean;
  daysRemaining: number;
  progressPercent: number;
}

interface ProStatus {
  isPro: boolean;
  plan: string;
  validUntil: string | null;
  lastVerifiedAt: string;
  trialInfo?: TrialInfo;
}

interface ProContextValue {
  isProUser: boolean;
  proStatus: ProStatus;
  unlockPro: (code: string) => { success: boolean; message: string; showTrialPopup?: boolean };
  resetPro: () => void;
  showGoProModal: boolean;
  setShowGoProModal: (show: boolean) => void;
  lockedFeature?: string;
  setLockedFeature: (feature?: string) => void;
  deviceId: string;
  restoreProStatus: () => Promise<void>;
  trialInfo: TrialInfo | null;
  isTrialExpired: boolean;
  hasUsedTrial: boolean;
}

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_KEY = "cashflo_pro";
const PRO_DEVICE_KEY = "cashflo_pro_device";
const TRIAL_KEY = "cashflo_trial";
const TRIAL_USED_KEY = "cashflo_trial_used";

const calculateTrialInfo = (startDateStr: string): TrialInfo => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  
  const now = new Date();
  const totalMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = now.getTime() - startDate.getTime();
  const remainingMs = endDate.getTime() - now.getTime();
  
  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
  const isActive = now < endDate && now >= startDate;
  
  return {
    startDate: startDateStr,
    endDate: endDate.toISOString(),
    isActive,
    daysRemaining,
    progressPercent
  };
};

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
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);

  useEffect(() => {
    const dId = getOrCreateDeviceId();
    setDeviceId(dId);
    
    const trialUsed = safeGet<string>(TRIAL_USED_KEY, "false") === "true";
    setHasUsedTrial(trialUsed);
    
    const loadStatus = async () => {
      const trialData = safeGet<{ startDate: string } | null>(TRIAL_KEY, null);
      
      if (trialData && trialData.startDate) {
        const info = calculateTrialInfo(trialData.startDate);
        setTrialInfo(info);
        
        if (info.isActive) {
          setIsProUser(true);
          setProStatus({
            isPro: true,
            plan: "Pro Trial",
            validUntil: info.endDate,
            lastVerifiedAt: new Date().toISOString(),
            trialInfo: info
          });
          return;
        } else {
          setIsTrialExpired(true);
          safeRemove(TRIAL_KEY);
        }
      }
      
      if (isAuthenticated && user) {
        const userProKey = `pro_status_${user.userId}`;
        const cachedPro = safeGet<ProStatus | null>(userProKey, null);
        if (cachedPro && cachedPro.isPro && cachedPro.plan !== "Pro Trial") {
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
    
    const interval = setInterval(() => {
      const trialData = safeGet<{ startDate: string } | null>(TRIAL_KEY, null);
      if (trialData && trialData.startDate) {
        const info = calculateTrialInfo(trialData.startDate);
        setTrialInfo(info);
        
        if (!info.isActive) {
          setIsTrialExpired(true);
          setIsProUser(false);
          setProStatus({
            isPro: false,
            plan: "Free",
            validUntil: null,
            lastVerifiedAt: new Date().toISOString()
          });
          safeRemove(TRIAL_KEY);
        }
      }
    }, 60000);
    
    return () => clearInterval(interval);
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

  const unlockPro = (code: string): { success: boolean; message: string; showTrialPopup?: boolean } => {
    const dId = getOrCreateDeviceId();
    const result = verifyUnlockCode(code, dId);
    
    if (!result.valid) {
      return {
        success: false,
        message: "Invalid unlock code. Please check and try again."
      };
    }
    
    if (result.type === 'trial') {
      const trialUsed = safeGet<string>(TRIAL_USED_KEY, "false") === "true";
      if (trialUsed) {
        return {
          success: false,
          message: "You have already used your 7-day trial. Please purchase Pro to continue."
        };
      }
      
      const startDate = new Date().toISOString();
      const info = calculateTrialInfo(startDate);
      
      safeSet(TRIAL_KEY, JSON.stringify({ startDate }));
      safeSet(TRIAL_USED_KEY, "true");
      setHasUsedTrial(true);
      setTrialInfo(info);
      setIsTrialExpired(false);
      setIsProUser(true);
      
      const newStatus = {
        isPro: true,
        plan: "Pro Trial",
        validUntil: info.endDate,
        lastVerifiedAt: new Date().toISOString(),
        trialInfo: info
      };
      setProStatus(newStatus);
      
      if (isAuthenticated && user) {
        safeSet(`pro_status_${user.userId}`, JSON.stringify(newStatus));
      }
      
      return {
        success: true,
        message: "Your 7-day Pro trial has started!",
        showTrialPopup: true
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
    setTrialInfo(null);
    setIsTrialExpired(false);
    setProStatus({
      isPro: false,
      plan: "Free",
      validUntil: null,
      lastVerifiedAt: new Date().toISOString()
    });
    safeRemove(PRO_KEY);
    safeRemove(PRO_DEVICE_KEY);
    safeRemove(TRIAL_KEY);
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
        restoreProStatus,
        trialInfo,
        isTrialExpired,
        hasUsedTrial
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
