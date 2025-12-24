import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGet, safeSet, safeRemove } from "../utils/storage";

interface OnboardingContextValue {
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

const ONBOARDING_KEY = "spendory_onboarding_complete";

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() =>
    safeGet<boolean>(ONBOARDING_KEY, false)
  );

  // Persist onboarding state
  useEffect(() => {
    safeSet(ONBOARDING_KEY, isOnboardingComplete);
  }, [isOnboardingComplete]);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    safeRemove(ONBOARDING_KEY);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        completeOnboarding,
        resetOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
