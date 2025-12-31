import React, { useState, useEffect } from "react";
import { Card } from "./Card";

const SocialProofBanner: React.FC<{ location: "pricing" | "dashboard" }> = ({ location }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissedKey = `spendory_social_proof_${location}_dismissed`;
      const isDismissed = window.localStorage.getItem(dismissedKey);
      setShow(!isDismissed);
    } catch {
      setShow(true);
    }
  }, [location]);

  if (!show) return null;

  const handleDismiss = () => {
    try {
      const dismissedKey = `spendory_social_proof_${location}_dismissed`;
      window.localStorage.setItem(dismissedKey, "true");
      setShow(false);
    } catch {
      // ignore
    }
  };

  return (
    <Card className="bg-zinc-900 dark:bg-[var(--bg-tertiary)] border-0 text-white shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex gap-3 flex-1">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-white">
              Built for people who value privacy
            </p>
            <p className="text-sm text-white/70 mt-1">
              Join others who trust Spendory with their financial data.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white text-lg shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>
    </Card>
  );
};

export default SocialProofBanner;
