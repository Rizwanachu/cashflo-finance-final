import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Users2, X } from "lucide-react";

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
    <Card className="bg-black border-0 text-white shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Users2 className="w-5 h-5 text-white" />
          </div>
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
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};

export default SocialProofBanner;
