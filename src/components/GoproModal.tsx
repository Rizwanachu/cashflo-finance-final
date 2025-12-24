import React, { useState } from "react";
import { usePro } from "../context/ProContext";

interface GoproModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Go Pro
          </h2>
          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Lifetime Access
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {feature
            ? `Unlock ${feature} and all Pro features with a one-time payment.`
            : "Unlock all Pro features with a one-time payment."}
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-50 mb-3">
            Pro Benefits:
          </h3>
          <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
            <li>✓ PDF & CSV export</li>
            <li>✓ Advanced analytics</li>
            <li>✓ App lock & privacy mode</li>
            <li>✓ Priority future features</li>
            <li>✓ Pay once, use forever</li>
          </ul>
        </div>

        {/* Payment Flow Steps */}
        <div className="mb-6">
          <div className="flex gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-4">
            <div className={`flex-1 text-center pb-2 border-b-2 ${step === "payment" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-slate-700"}`}>
              Step 1: Pay
            </div>
            <div className={`flex-1 text-center pb-2 border-b-2 ${step === "unlock" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-slate-700"}`}>
              Step 2: Unlock
            </div>
          </div>

          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Click the button below to complete your one-time payment via PayPal.
              </p>
              <a
                href="https://www.paypal.me/rizwanachoo123/9.99"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // After user returns from PayPal, they'll have the unlock code
                  setTimeout(() => setStep("unlock"), 500);
                }}
                className="block w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors text-center"
              >
                💳 Pay once. Use forever. ($9.99)
              </a>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                💡 After payment, you'll receive an unlock code via email.
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
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  onClick={handleUnlock}
                  className="w-full px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                >
                  Unlock Pro
                </button>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
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
        </div>

        {/* Helper Text */}
        <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
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
          className="w-full px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 text-sm font-medium transition-colors mt-4"
        >
          Continue free
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          Your data stays private. No cloud sync. Works offline.
        </p>
      </div>
    </div>
  );
};

export default GoproModal;
