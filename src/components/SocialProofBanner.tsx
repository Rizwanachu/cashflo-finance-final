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
    <Card className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 flex-1">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Built for people who value privacy
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Join others who trust Spendory with their financial data.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg shrink-0"
        >
          ✕
        </button>
      </div>
    </Card>
  );
};

export default SocialProofBanner;
