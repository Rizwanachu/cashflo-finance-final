import React, { createContext, useContext, useEffect, useState } from "react";

interface PrivacyContextValue {
  privacyMode: boolean;
  togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined);

const PRIVACY_KEY = "ledgerly-privacy-mode-v1";

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [privacyMode, setPrivacyMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem(PRIVACY_KEY);
      return stored === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PRIVACY_KEY, String(privacyMode));
    } catch {
      // ignore
    }
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

