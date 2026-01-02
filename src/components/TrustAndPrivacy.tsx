import React from "react";
import { Card } from "./Card";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

const TrustAndPrivacy: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-slate-900 dark:text-slate-50" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          How This App Protects Your Data
        </h3>
      </div>

      <Card>
        <div className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-slate-50 shrink-0 mt-0.5" />
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
            <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-slate-50 shrink-0 mt-0.5" />
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
            <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-slate-50 shrink-0 mt-0.5" />
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
            <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-slate-50 shrink-0 mt-0.5" />
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
            <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-slate-50 shrink-0 mt-0.5" />
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

      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
        <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">Verified Privacy</span>
      </div>
    </div>
  );
};

export default TrustAndPrivacy;
