import React from "react";

interface TrialStartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrialStartPopup: React.FC<TrialStartPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl max-w-sm w-full border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Your 7-day Pro trial has started!
          </h2>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Enjoy full access to all Pro features until your trial ends.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              What you can do now:
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 text-left">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> CSV & PDF export
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Budget tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Financial goals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> App lock & privacy mode
              </li>
            </ul>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialStartPopup;
