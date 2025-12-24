import React from "react";
import { useFreeLimits } from "../context/FreeLimitsContext";
import { usePro } from "../context/ProContext";
import { Card } from "./Card";

const FreeLimitsBanner: React.FC = () => {
  const { hasReachedLimit, transactionCount, transactionLimit } = useFreeLimits();
  const { isProUser, setShowGoProModal } = usePro();

  if (isProUser || !hasReachedLimit) return null;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
            You've reached the free limit
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            You have {transactionCount} of {transactionLimit} transactions. Upgrade to Pro for unlimited transactions and full history.
          </p>
        </div>
        <button
          onClick={() => setShowGoProModal(true)}
          className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          Upgrade
        </button>
      </div>
    </Card>
  );
};

export default FreeLimitsBanner;
