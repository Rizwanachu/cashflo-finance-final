import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGet, safeSet, safeRemove, getOrCreateDeviceId } from "../utils/storage";

interface ProContextValue {
  isProUser: boolean;
  unlockPro: (code: string) => { success: boolean; message: string };
  resetPro: () => void;
  showGoProModal: boolean;
  setShowGoProModal: (show: boolean) => void;
  lockedFeature?: string;
  setLockedFeature: (feature?: string) => void;
}

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_KEY = "cashflo_pro";
const PRO_DEVICE_KEY = "cashflo_pro_device";

// Device-locked unlock codes mapping
// In production, this would be managed server-side, but for no-backend solution:
// Each code is bound to a specific device ID
const UNLOCK_CODES: Record<string, string> = {
  "CASHFLO2025": "device_demo_1",
  "LIFETIME": "device_demo_2",
  "PRO123": "device_demo_3",
  // Add more codes as needed for customer deliveries
};

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isProUser, setIsProUser] = useState(false);
  const [showGoProModal, setShowGoProModal] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>();

  // Load Pro status from localStorage on mount
  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    
    // Check if this device has pro unlocked
    const proDeviceId = safeGet<string>(PRO_DEVICE_KEY, "");
    const isUnlocked = proDeviceId === deviceId;
    
    setIsProUser(isUnlocked);
  }, []);

  const unlockPro = (code: string): { success: boolean; message: string } => {
    const deviceId = getOrCreateDeviceId();
    const upperCode = code.toUpperCase().trim();
    
    // Check if code exists
    if (!UNLOCK_CODES[upperCode]) {
      return {
        success: false,
        message: "Invalid unlock code. Please check and try again."
      };
    }
    
    const codeDeviceId = UNLOCK_CODES[upperCode];
    
    // Check if code is bound to a device
    if (!codeDeviceId) {
      return {
        success: false,
        message: "This unlock code is not valid."
      };
    }
    
    // Check if code already used on another device
    if (codeDeviceId !== deviceId && codeDeviceId !== `device_demo_${Object.keys(UNLOCK_CODES).indexOf(upperCode) + 1}`) {
      // Allow demo codes to work on any device for testing
      const allowDemoMode = upperCode.startsWith("PRO") || upperCode === "CASHFLO2025" || upperCode === "LIFETIME";
      
      if (!allowDemoMode && codeDeviceId !== "device_demo_1" && codeDeviceId !== "device_demo_2" && codeDeviceId !== "device_demo_3") {
        return {
          success: false,
          message: "This code is already used on another device."
        };
      }
    }
    
    // Unlock Pro
    setIsProUser(true);
    safeSet(PRO_KEY, "true");
    safeSet(PRO_DEVICE_KEY, deviceId);
    
    return {
      success: true,
      message: "Pro unlocked! You now have access to all features."
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
        setLockedFeature
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
