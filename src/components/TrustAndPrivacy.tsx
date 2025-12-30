import React from "react";
import { Card } from "./Card";

const TrustAndPrivacy: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
          🔒 How This App Protects Your Data
        </h3>
      </div>

      <Card>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-emerald-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                All data stays on your device
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Nothing is sent to our servers
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                No accounts or logins required
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Start immediately, no signup needed
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                No cloud sync
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Your data never leaves your browser
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                No tracking by default
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Analytics are optional and disabled by default
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                Works offline
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                No internet needed after first load
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-[var(--brand-primary)]/20 border border-emerald-200 dark:border-emerald-800">
        <span className="text-sm">✓ Verified Privacy</span>
      </div>
    </div>
  );
};

export default TrustAndPrivacy;
