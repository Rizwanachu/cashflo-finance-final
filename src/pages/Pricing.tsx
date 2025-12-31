import React from "react";
import { useNavigate } from "react-router-dom";
import { usePro } from "../context/ProContext";
import SocialProofBanner from "../components/SocialProofBanner";
import ShareButton from "../components/ShareButton";
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
      <SocialProofBanner location="pricing" />
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
        <Card className="flex flex-col relative border-slate-200 dark:border-[var(--border-subtle)]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-[var(--text-primary)]">
              Free
            </h2>
            <p className="text-sm text-slate-600 dark:text-[var(--text-secondary)] mt-1">
              Perfect to start
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <div className="space-y-3">
              {[
                { title: "Manual transactions", desc: "Add income and expenses" },
                { title: "Basic dashboard", desc: "View your balance & summary" },
                { title: "Transaction categories", desc: "Organize and track spending" },
                { title: "CSV export", desc: "Export data upto 50 transactions" },
                { title: "No signup required", desc: "Start immediately" },
                { title: "No ads", desc: "Clean, focused interface" }
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="text-zinc-400 dark:text-[var(--text-muted)] text-xl">✓</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-[var(--text-primary)]">
                      {f.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-[var(--bg-tertiary)] text-slate-900 dark:text-[var(--text-primary)] font-semibold transition-colors"
          >
            Continue Free
          </button>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col ring-2 ring-zinc-900 dark:ring-[var(--brand-primary)]/50 border-0 bg-zinc-900 dark:bg-[var(--bg-tertiary)] text-white dark:text-[var(--text-primary)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Pro
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold">
                  One-time
                </span>
                <span className="text-sm text-white/60 dark:text-[var(--text-muted)]">
                  payment
                </span>
              </div>
              <p className="text-sm text-white/80 dark:text-[var(--brand-primary)] font-medium mt-2">
                Pay once, use forever
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              <div className="space-y-3">
                {[
                  { title: "CSV & PDF export", desc: "Export data anytime in any format" },
                  { title: "Advanced analytics", desc: "Yearly insights, category breakdown" },
                  { title: "Budget tracking", desc: "Set and monitor spending limits" },
                  { title: "App lock & Privacy mode", desc: "PIN protection & value blurring" },
                  { title: "Financial goals", desc: "Track progress toward savings targets" },
                  { title: "Unlimited usage & Priority support", desc: "No limits, forever + dedicated help" }
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <span className="text-white dark:text-[var(--brand-primary)] text-xl">✓</span>
                    <div>
                      <p className="font-medium">
                        {f.title}
                      </p>
                      <p className="text-xs text-white/60 dark:text-[var(--text-paragraph)]">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isProUser ? (
              <div className="w-full px-6 py-3 rounded-xl bg-white/10 dark:bg-[var(--brand-primary)]/10 text-white dark:text-[var(--brand-primary)] font-semibold text-center">
                ✓ You&apos;re a Pro user
              </div>
            ) : (
              <button
                onClick={handleUpgradeToPro}
                className="w-full px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 font-semibold transition-colors"
              >
                Upgrade to Pro
              </button>
            )}
            
            <div className="inline-flex w-max mx-auto mt-4 bg-white/10 dark:bg-[var(--brand-primary)]/20 text-white dark:text-[var(--brand-primary)] px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
              ⭐ Recommended
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-slate-900 dark:bg-[var(--bg-tertiary)] rounded-2xl p-8 border border-slate-800 dark:border-[var(--border-subtle)]">
        <h3 className="text-lg font-semibold text-white dark:text-slate-50 mb-4">
          Why Spendory?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-medium text-white dark:text-slate-50">
                No tracking
              </p>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                Your data is yours
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">☁️</span>
            <div>
              <p className="font-medium text-white dark:text-slate-50">
                No cloud
              </p>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                Everything local
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-medium text-white dark:text-slate-50">
                Works offline
              </p>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                No internet needed
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">♾️</span>
            <div>
              <p className="font-medium text-white dark:text-slate-50">
                Pay once, forever
              </p>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                No subscriptions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <ShareButton />
      </div>
    </div>
  );
};

export default Pricing;
