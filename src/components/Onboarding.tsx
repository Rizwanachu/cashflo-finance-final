import React from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { Lock, Smartphone, Globe, Star } from "lucide-react";

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useOnboarding();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl max-w-md w-full p-8 shadow-xl border dark:border-[var(--border-subtle)]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Lock className="w-12 h-12 text-slate-700 dark:text-slate-200" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-50 mb-3">
          Track your money. Privately.
        </h1>
        
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          No signup. No cloud. No ads.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="mt-1">
              <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                Data stays on this device
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Everything is stored locally in your browser
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="mt-1">
              <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                Works offline
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No internet required once loaded
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="mt-1">
              <Star className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                Pro available
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pay once if you want advanced features
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={completeOnboarding}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold py-3 rounded-lg transition-colors shadow-sm"
        >
          Start using app
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
