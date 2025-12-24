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

  if (!isOpen) return null;

  const handleUnlock = () => {
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!unlockCode.trim()) {
      setErrorMessage("Please enter your unlock code");
      return;
    }

    if (unlockPro(unlockCode)) {
      setSuccessMessage("✓ Pro unlocked! You now have access to all features.");
      setUnlockCode("");
      setTimeout(() => {
        setShowGoProModal(false);
        onClose();
      }, 1500);
    } else {
      setErrorMessage("Invalid unlock code. Please check and try again.");
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

        <div className="space-y-4 mb-6">
          <a
            href="https://paypal.me/cashflo"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors text-center"
          >
            💳 Pay once. Use forever.
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Have an unlock code?
              </span>
            </div>
          </div>

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
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
            >
              Restore Purchase
            </button>
          </div>

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

        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 text-sm font-medium transition-colors"
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
