import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

interface PrivacyContextValue {
  privacyMode: boolean;
  togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined);

const PRIVACY_KEY = "ledgerly-privacy-mode-v1";

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [privacyMode, setPrivacyMode] = useState<boolean>(() =>
    safeGet<boolean>(PRIVACY_KEY, false)
  );

  useEffect(() => {
    safeSet(PRIVACY_KEY, privacyMode);
  }, [privacyMode]);

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => !prev);
  };

  return (
    <PrivacyContext.Provider value={{ privacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export function usePrivacy(): PrivacyContextValue {
  const ctx = useContext(PrivacyContext);
  if (!ctx) {
    throw new Error("usePrivacy must be used within PrivacyProvider");
  }
  return ctx;
}
