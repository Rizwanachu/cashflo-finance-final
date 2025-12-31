import React, { useState } from "react";
import { usePro } from "../context/ProContext";

interface GoproModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const PAYPAL_PAYMENT_LINK = "https://www.paypal.com/ncp/payment/YBDH6PMKW462W";

const GoproModal: React.FC<GoproModalProps> = ({ isOpen, onClose, feature }) => {
  const { isProUser, unlockPro, setShowGoProModal } = usePro();
  const [unlockCode, setUnlockCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState<"payment" | "unlock">("payment");

  if (!isOpen) return null;

  const handleUnlock = () => {
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!unlockCode.trim()) {
      setErrorMessage("Please enter your unlock code");
      return;
    }

    const result = unlockPro(unlockCode);
    if (result.success) {
      setSuccessMessage("✓ Pro unlocked! You now have access to all features.");
      setUnlockCode("");
      setTimeout(() => {
        setShowGoProModal(false);
        onClose();
      }, 1500);
    } else {
      setErrorMessage(result.message);
      setUnlockCode("");
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
            <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full whitespace-nowrap">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
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

          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50 mb-2">
              💰 Lifetime access. One-time payment.
            </p>
            <p className="text-xs text-emerald-800 dark:text-emerald-200">
              {feature
                ? `Unlock ${feature} and all Pro features permanently.`
                : "Unlock all Pro features permanently."}
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-50 mb-3">
              Pro Benefits:
            </h3>
            <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
              <li>✓ CSV & PDF export</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Budget tracking</li>
              <li>✓ App lock & privacy mode</li>
              <li>✓ Financial goals</li>
              <li>✓ Unlimited usage & Priority support</li>
              <li>✓ All future updates included</li>
            </ul>
          </div>

          {/* Payment Flow Steps */}
          <div className="flex gap-2 text-xs font-semibold text-slate-600 dark:text-[var(--text-paragraph)] mb-4">
            <div 
              onClick={() => setStep("payment")}
              className={`flex-1 text-center pb-2 border-b-2 cursor-pointer transition-colors ${step === "payment" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-[var(--border-subtle)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"}`}
            >
              Step 1: Pay
            </div>
            <div 
              onClick={() => setStep("unlock")}
              className={`flex-1 text-center pb-2 border-b-2 cursor-pointer transition-colors ${step === "unlock" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-[var(--border-subtle)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"}`}
            >
              Step 2: Unlock
            </div>
          </div>

          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Click the button below to complete your one-time payment via PayPal.
              </p>
              <a
                href={PAYPAL_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-semibold transition-colors text-center"
              >
                💳 Pay once. Use forever. ($9.99)
              </a>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                💡 After payment, you'll be redirected to get your unlock code.
              </p>
            </div>
          )}

          {step === "unlock" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter the unlock code you received after payment.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={unlockCode}
                  onChange={(e) => {
                    setUnlockCode(e.target.value);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter unlock code"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  onClick={handleUnlock}
                  className="w-full px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-medium transition-colors"
                >
                  Unlock Pro
                </button>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-100 dark:bg-[var(--bg-secondary)] hover:bg-slate-200 dark:hover:bg-[var(--bg-tertiary)] text-slate-900 dark:text-[var(--text-primary)] text-sm font-medium transition-colors"
              >
                ← Back to Payment
              </button>

              {errorMessage && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-medium">
                  {successMessage}
                </p>
              )}
            </div>
          )}
          <div />

          {/* Helper Text */}
          <div className="space-y-2 border-t border-slate-200 dark:border-[var(--border-subtle)] pt-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              ✓ Your unlock is permanent on this device
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              ✓ No account required
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              ✓ Works offline
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 text-sm font-medium transition-colors"
          >
            Continue free
          </button>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Your data stays private. No cloud sync. Works offline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoproModal;
