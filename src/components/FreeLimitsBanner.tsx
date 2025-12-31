import React from "react";
import { useFreeLimits } from "../context/FreeLimitsContext";
import { usePro } from "../context/ProContext";
import { Card } from "./Card";

const FreeLimitsBanner: React.FC = () => {
  const { hasReachedLimit, transactionCount, transactionLimit } = useFreeLimits();
  const { isProUser, setShowGoProModal } = usePro();

  if (isProUser || !hasReachedLimit) return null;

  return (
    <Card className="bg-zinc-900 dark:bg-[var(--bg-tertiary)] border-0 text-white shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <span className="text-xl mt-0.5">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">
            You&apos;ve reached the free limit
          </h3>
          <p className="text-xs text-white/70 mt-1">
            You have {transactionCount} of {transactionLimit} transactions. Upgrade to Pro for unlimited transactions and full history.
          </p>
        </div>
        <button
          onClick={() => setShowGoProModal(true)}
          className="shrink-0 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-medium rounded-lg transition-colors"
        >
          Upgrade
        </button>
      </div>
    </Card>
  );
};

export default FreeLimitsBanner;
