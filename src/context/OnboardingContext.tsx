import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ONBOARDING_KEY);
      setIsOnboardingComplete(stored === "true");
    } catch {
      setIsOnboardingComplete(false);
    }
  }, []);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    window.localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    window.localStorage.removeItem(ONBOARDING_KEY);
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
