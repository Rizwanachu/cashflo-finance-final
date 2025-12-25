import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGet, safeSet, safeRemove, getOrCreateDeviceId } from "../utils/storage";
import { verifyUnlockCode } from "../utils/crypto";

interface ProContextValue {
  isProUser: boolean;
  unlockPro: (code: string) => { success: boolean; message: string };
  resetPro: () => void;
  showGoProModal: boolean;
  setShowGoProModal: (show: boolean) => void;
  lockedFeature?: string;
  setLockedFeature: (feature?: string) => void;
  deviceId: string;
}

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_KEY = "cashflo_pro";
const PRO_DEVICE_KEY = "cashflo_pro_device";

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isProUser, setIsProUser] = useState(false);
  const [showGoProModal, setShowGoProModal] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>();
  const [deviceId, setDeviceId] = useState("");

  // Load Pro status from localStorage on mount
  useEffect(() => {
    const dId = getOrCreateDeviceId();
    setDeviceId(dId);
    
    // Check if this device has pro unlocked
    const proDeviceId = safeGet<string>(PRO_DEVICE_KEY, "");
    const isUnlocked = proDeviceId === dId;
    
    setIsProUser(isUnlocked);
  }, []);

  const unlockPro = (code: string): { success: boolean; message: string } => {
    const dId = getOrCreateDeviceId();
    
    if (verifyUnlockCode(code, dId)) {
      // Unlock Pro
      setIsProUser(true);
      safeSet(PRO_KEY, "true");
      safeSet(PRO_DEVICE_KEY, dId);
      
      return {
        success: true,
        message: "Pro unlocked! You now have access to all features."
      };
    }
    
    return {
      success: false,
      message: "Invalid unlock code. Please check and try again."
    };
  };

  const resetPro = () => {
    setIsProUser(false);
    safeRemove(PRO_KEY);
    safeRemove(PRO_DEVICE_KEY);
  };

  return (
    <ProContext.Provider
      value={{
        isProUser,
        unlockPro,
        resetPro,
        showGoProModal,
        setShowGoProModal,
        lockedFeature,
        setLockedFeature,
        deviceId
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
