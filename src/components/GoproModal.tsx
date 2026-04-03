import React, { useState } from "react";
import { usePro } from "../context/ProContext";
import { useCountry } from "../hooks/useCountry";

interface GoproModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

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

const GoproModal: React.FC<GoproModalProps> = ({ isOpen, onClose, feature }) => {
  const { setShowGoProModal, unlockPro } = usePro();
  const { isIndia, loading: countryLoading } = useCountry();
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

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
      // client-only mode if backend fails
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
        setShowGoProModal(false);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl flex flex-col">
        <div className="sticky top-0 bg-white dark:bg-[var(--bg-tertiary)] border-b border-slate-200 dark:border-[var(--border-subtle)] p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Spendory Pro
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full whitespace-nowrap">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Lifetime Access
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Price display */}
          <div className="text-center">
            {countryLoading ? (
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 animate-pulse">…</div>
            ) : isIndia ? (
              <>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">₹249</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">One-time payment · No subscription · No renewal</p>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">$9.99</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">One-time payment · No subscription · No renewal</p>
              </>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Lifetime access. One-time payment.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {feature
                ? `Unlock ${feature} and all Pro features permanently.`
                : "Unlock all Pro features permanently."}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Pro Benefits:
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>CSV &amp; PDF export</li>
              <li>Advanced analytics</li>
              <li>Budget tracking</li>
              <li>App lock &amp; privacy mode</li>
              <li>Financial goals</li>
              <li>Unlimited usage &amp; Priority support</li>
              <li>All future updates included</li>
            </ul>
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            {!countryLoading && isIndia ? (
              <>
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  UPI · PhonePe · GPay · Cards · Netbanking
                </p>
                <button
                  onClick={handleRazorpay}
                  disabled={paying}
                  className="block w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors text-center"
                >
                  {paying ? "Opening payment…" : "Pay once. Use forever. (₹249)"}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  Click the button below to complete your one-time payment via PayPal.
                </p>
                <a
                  href={PAYPAL_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-semibold transition-colors text-center"
                >
                  Pay once. Use forever. ($9.99)
                </a>
              </>
            )}
          </div>

          <div className="space-y-2 border-t border-slate-200 dark:border-[var(--border-subtle)] pt-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">Your unlock is permanent on this device</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">Tied to your Google account</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">Works offline</p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 text-sm font-medium transition-colors"
          >
            Continue free
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoproModal;
