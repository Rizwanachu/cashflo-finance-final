import React, { createContext, useContext, useState, useEffect } from "react";

interface AnalyticsContextValue {
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (enabled: boolean) => void;
  trackEvent: (event: string, data?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
  undefined
);

const ANALYTICS_KEY = "spendory_analytics_enabled";

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [analyticsEnabled, setAnalyticsEnabledState] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ANALYTICS_KEY);
      setAnalyticsEnabledState(stored === "true");
    } catch {
      setAnalyticsEnabledState(false);
    }
  }, []);

  const setAnalyticsEnabled = (enabled: boolean) => {
    setAnalyticsEnabledState(enabled);
    window.localStorage.setItem(ANALYTICS_KEY, enabled ? "true" : "false");
  };

  const trackEvent = (event: string, data?: Record<string, any>) => {
    if (!analyticsEnabled) return;
    
    // Log locally only (privacy-first)
    const timestamp = new Date().toISOString();
    console.debug(`[Analytics] ${event}`, { timestamp, ...data });
  };

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsEnabled,
        setAnalyticsEnabled,
        trackEvent
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return ctx;
}
