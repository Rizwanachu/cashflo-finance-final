import React, { useState, useEffect } from "react";
import { usePro } from "../context/ProContext";
import { Card } from "./Card";

const ProUserDelight: React.FC = () => {
  const { isProUser } = usePro();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isProUser) return;

    try {
      const hasSeenMessage = window.localStorage.getItem("spendory_pro_thank_you");
      if (!hasSeenMessage) {
        setShowMessage(true);
        window.localStorage.setItem("spendory_pro_thank_you", "true");
      }
    } catch {
      // ignore
    }
  }, [isProUser]);

  if (!isProUser || !showMessage) return null;

  return (
    <Card className="bg-zinc-900 dark:bg-[var(--bg-tertiary)] border-0 text-white shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="flex items-start gap-3 relative">
        <span className="text-2xl">🌟</span>
        <div>
          <h3 className="font-semibold text-white">
            Thank you for supporting this app!
          </h3>
          <p className="text-sm text-white/70 mt-1">
            Your Pro membership helps keep Spendory ad-free and privacy-first.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProUserDelight;
