import React from "react";
import { useNavigate } from "react-router-dom";
import { usePro } from "../context/ProContext";
import { Card } from "../components/Card";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isProUser, setShowGoProModal, setLockedFeature } = usePro();

  const handleUpgradeToPro = () => {
    setLockedFeature("Pro features");
    setShowGoProModal(true);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Simple. Private. No ads. No signup.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your financial data never leaves your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="flex flex-col relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Free
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Perfect to start
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    Manual transactions
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add income and expenses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    Basic dashboard
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    View your balance & summary
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    CSV export
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Export data anytime
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    No signup required
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Start immediately
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    No ads
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clean, focused interface
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 font-semibold transition-colors"
          >
            Continue Free
          </button>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col relative ring-2 ring-emerald-500/50">
          <div className="absolute -top-4 left-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Recommended
          </div>

          <div className="mb-6 pt-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Pro
            </h2>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                One-time
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                payment
              </span>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">
              Pay once, use forever
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    PDF export
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Export reports as PDF
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    Advanced analytics
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Yearly insights, category breakdown
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    App lock & Privacy mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PIN protection & value blurring
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    Unlimited usage
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No limits, forever
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    Priority future features
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Early access to updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isProUser ? (
            <div className="w-full px-6 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold text-center">
              ✓ You're a Pro user
            </div>
          ) : (
            <button
              onClick={handleUpgradeToPro}
              className="w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </Card>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Why Spendory?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                No tracking
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your data is yours
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">☁️</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                No cloud
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Everything local
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                Works offline
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No internet needed
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">♾️</span>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                Pay once, forever
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No subscriptions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
