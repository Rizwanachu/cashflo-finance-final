import React, { createContext, useContext } from "react";

interface LaunchModeContextValue {
  isLaunchMode: boolean;
}

const LaunchModeContext = createContext<LaunchModeContextValue | undefined>(undefined);

export const LaunchModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Set to true for production launch
  const isLaunchMode = true;

  return (
    <LaunchModeContext.Provider value={{ isLaunchMode }}>
      {children}
    </LaunchModeContext.Provider>
  );
};

export function useLaunchMode(): LaunchModeContextValue {
  const ctx = useContext(LaunchModeContext);
  if (!ctx) {
    throw new Error("useLaunchMode must be used within LaunchModeProvider");
  }
  return ctx;
}
