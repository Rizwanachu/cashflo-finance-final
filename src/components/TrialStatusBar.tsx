import React from "react";
import { usePro } from "../context/ProContext";

interface TrialStatusBarProps {
  onUpgradeClick?: () => void;
}

const TrialStatusBar: React.FC<TrialStatusBarProps> = ({ onUpgradeClick }) => {
  const { trialInfo, isTrialExpired, proStatus, setShowGoProModal } = usePro();

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      setShowGoProModal(true);
    }
  };

  if (isTrialExpired) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
              Your 7-day Pro trial has ended
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400/80">
              Purchase Pro to continue using premium features.
            </p>
          </div>
          <button
            onClick={handleUpgrade}
            className="ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  if (!trialInfo || !trialInfo.isActive || proStatus.plan !== "Pro Trial") {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            Pro Trial Active
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400/80 mt-0.5">
            {trialInfo.daysRemaining} day{trialInfo.daysRemaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <button
          onClick={handleUpgrade}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Upgrade Now
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-indigo-600 dark:text-indigo-400/80">
          <span>Started: {formatDate(trialInfo.startDate)}</span>
          <span>Ends: {formatDate(trialInfo.endDate)}</span>
        </div>
        
        <div className="relative h-2 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${trialInfo.progressPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-indigo-500 dark:text-indigo-500">
          <span>Day 1</span>
          <span>Day 7</span>
        </div>
      </div>
    </div>
  );
};

export default TrialStatusBar;
