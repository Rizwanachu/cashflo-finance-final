import React, { createContext, useContext, useState, useEffect } from "react";

interface ProContextValue {
  isProUser: boolean;
  unlockPro: (code: string) => boolean;
  resetPro: () => void;
  showGoProModal: boolean;
  setShowGoProModal: (show: boolean) => void;
  lockedFeature?: string;
  setLockedFeature: (feature?: string) => void;
}

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_KEY = "cashflo_pro";
const VALID_UNLOCK_CODES = ["CASHFLO2025", "LIFETIME", "PRO123"];

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isProUser, setIsProUser] = useState(false);
  const [showGoProModal, setShowGoProModal] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>();

  // Load Pro status from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PRO_KEY);
      setIsProUser(stored === "true");
    } catch {
      setIsProUser(false);
    }
  }, []);

  const unlockPro = (code: string): boolean => {
    const isValid = VALID_UNLOCK_CODES.includes(code.toUpperCase().trim());
    if (isValid) {
      setIsProUser(true);
      window.localStorage.setItem(PRO_KEY, "true");
    }
    return isValid;
  };

  const resetPro = () => {
    setIsProUser(false);
    window.localStorage.removeItem(PRO_KEY);
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
