import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

interface AppLockContextValue {
  isAppLocked: boolean;
  pin: string | null;
  isPinSet: boolean;
  setPin: (newPin: string) => void;
  removePin: () => void;
  lockApp: () => void;
  unlockApp: (enteredPin: string) => boolean;
  toggleAppLock: () => void;
}

const AppLockContext = createContext<AppLockContextValue | undefined>(undefined);

const PIN_KEY = "ledgerly-app-lock-pin-v1";
const LOCK_STATUS_KEY = "ledgerly-app-locked-v1";

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [isPinSet, setIsPinSet] = useState(false);

  useEffect(() => {
    const storedPin = safeGet<string | null>(PIN_KEY, null);
    setPin(storedPin);
    setIsPinSet(!!storedPin);
  }, []);

  const handleSetPin = (newPin: string) => {
    if (newPin.length < 4) {
      throw new Error("PIN must be at least 4 digits");
    }
    safeSet(PIN_KEY, newPin);
    setPin(newPin);
    setIsPinSet(true);
  };

  const handleRemovePin = () => {
    safeSet(PIN_KEY, null);
    setPin(null);
    setIsPinSet(false);
    setIsAppLocked(false);
  };

  const lockApp = () => {
    if (isPinSet) {
      setIsAppLocked(true);
      safeSet(LOCK_STATUS_KEY, true);
    }
  };

  const unlockApp = (enteredPin: string): boolean => {
    if (enteredPin === pin) {
      setIsAppLocked(false);
      safeSet(LOCK_STATUS_KEY, false);
      return true;
    }
    return false;
  };

  const toggleAppLock = () => {
    if (isPinSet) {
      setIsAppLocked(prev => !prev);
      safeSet(LOCK_STATUS_KEY, !isAppLocked);
    }
  };

  return (
    <AppLockContext.Provider
      value={{
        isAppLocked,
        pin,
        isPinSet,
        setPin: handleSetPin,
        removePin: handleRemovePin,
        lockApp,
        unlockApp,
        toggleAppLock
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
};

export function useAppLock(): AppLockContextValue {
  const ctx = useContext(AppLockContext);
  if (!ctx) {
    throw new Error("useAppLock must be used within AppLockProvider");
  }
  return ctx;
}
