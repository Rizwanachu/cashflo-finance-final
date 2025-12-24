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
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌟</span>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Thank you for supporting this app!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Your Pro membership helps keep Spendory ad-free and privacy-first.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProUserDelight;
