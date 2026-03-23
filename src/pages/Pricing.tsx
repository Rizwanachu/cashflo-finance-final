import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePro } from "../context/ProContext";
import { useCountry } from "../hooks/useCountry";
import SocialProofBanner from "../components/SocialProofBanner";
import ShareButton from "../components/ShareButton";
import { Card } from "../components/Card";
import { ShieldCheck, CloudOff, WifiOff, Infinity, Check, Star } from "lucide-react";

const PAYPAL_PAYMENT_LINK = "https://www.paypal.com/ncp/payment/YBDH6PMKW462W";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isProUser, setShowGoProModal, setLockedFeature, unlockPro } = usePro();
  const { isIndia, loading: countryLoading } = useCountry();
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRazorpay = async () => {
    setPaying(true);
    setMessage(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setMessage({ type: "error", text: "Failed to load payment. Please try again." });
      setPaying(false);
      return;
    }

    let orderId: string | undefined;
    try {
      const res = await fetch("/api/razorpay/create-order", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        orderId = data.order_id;
      }
    } catch {
      // client-only mode
    }

    const options: any = {
      key: RAZORPAY_KEY_ID,
      amount: 24900,
      currency: "INR",
      name: "Spendory",
      description: "Spendory Pro – Lifetime Access",
      theme: { color: "#10b981" },
      handler: () => {
        unlockPro();
        setMessage({ type: "success", text: "Payment successful! Spendory Pro is now unlocked." });
        setPaying(false);
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
    };

    if (orderId) options.order_id = orderId;

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setMessage({ type: "error", text: "Payment failed. Please try again." });
        setPaying(false);
      });
      rzp.open();
    } catch {
      setMessage({ type: "error", text: "Payment failed. Please try again." });
      setPaying(false);
    }
  };

  const handleUpgradeToPro = () => {
    setLockedFeature("Pro features");
    setShowGoProModal(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full px-4 overflow-hidden">
      <SocialProofBanner location="pricing" />
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 break-words">
          Simple. Private. No ads. No signup.
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
          Your financial data never leaves your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                  <Check className="w-5 h-5 text-zinc-400 dark:text-[var(--text-muted)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-[var(--text-primary)]">{f.title}</p>
                    <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">{f.desc}</p>
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
              <h2 className="text-2xl font-bold">Pro</h2>
              {countryLoading ? (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold animate-pulse">…</span>
                </div>
              ) : isIndia ? (
                <>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold">₹249</span>
                    <span className="text-sm text-white/60 dark:text-[var(--text-muted)]">INR</span>
                  </div>
                  <p className="text-sm text-white/80 dark:text-[var(--brand-primary)] font-medium mt-1">
                    One-time payment · No subscription · No renewal
                  </p>
                  <p className="text-xs text-white/60 dark:text-[var(--text-muted)] mt-1">
                    UPI · PhonePe · GPay · Cards · Netbanking
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold">$9.99</span>
                    <span className="text-sm text-white/60 dark:text-[var(--text-muted)]">USD</span>
                  </div>
                  <p className="text-sm text-white/80 dark:text-[var(--brand-primary)] font-medium mt-2">
                    Pay once, use forever
                  </p>
                </>
              )}
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
                    <Check className="w-5 h-5 text-white dark:text-[var(--brand-primary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{f.title}</p>
                      <p className="text-xs text-white/60 dark:text-[var(--text-paragraph)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700"
                    : "bg-red-900/40 text-red-300 border border-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {isProUser ? (
              <div className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-white/10 dark:bg-[var(--brand-primary)]/10 text-white dark:text-[var(--brand-primary)] font-semibold text-center">
                <Check className="w-5 h-5" /> You&apos;re a Pro user
              </div>
            ) : !countryLoading && isIndia ? (
              <button
                onClick={handleRazorpay}
                disabled={paying}
                className="w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-semibold transition-colors"
              >
                {paying ? "Opening payment…" : "Pay ₹249 — Unlock Forever"}
              </button>
            ) : (
              <a
                href={PAYPAL_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 font-semibold transition-colors text-center"
              >
                Pay $9.99 — Unlock Forever
              </a>
            )}

            <div className="inline-flex items-center gap-1.5 w-max mx-auto mt-4 bg-white/10 dark:bg-[var(--brand-primary)]/20 text-white dark:text-[var(--brand-primary)] px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
              <Star className="w-3.5 h-3.5 fill-current" /> Recommended
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl p-8 border border-slate-200 dark:border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Why Spendory?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: ShieldCheck, title: "No tracking", desc: "Your data is yours alone" },
            { icon: CloudOff, title: "No cloud sync", desc: "Everything stays on your device" },
            { icon: WifiOff, title: "Works offline", desc: "No internet connection needed" },
            { icon: Infinity, title: "Pay once, forever", desc: "No monthly subscriptions" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">{title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <ShareButton />
      </div>
    </div>
  );
};

export default Pricing;
