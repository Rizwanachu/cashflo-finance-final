import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePro } from "../context/ProContext";
import { safeGet, safeSet } from "../utils/storage";

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { unlockPro } = usePro();
  const [displayCode] = useState<string>(() => {
    // Generate a temporary unlock code for display
    // In production, this would come from PayPal webhook verification
    const existingCode = safeGet<string>("temp_unlock_code", "");
    if (existingCode) {
      safeSet("temp_unlock_code", ""); // Clear after use
      return existingCode;
    }
    return "PRO-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In production, verify payment with PayPal via your backend
    const paymentId = searchParams.get("payment_id");
    if (!paymentId) {
      // No payment ID, redirect back
      setTimeout(() => navigate("/"), 3000);
    }
  }, [searchParams, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlockNow = () => {
    const result = unlockPro(displayCode);
    if (result.success) {
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 text-center mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
          Thank you for your purchase. Your unlock code is ready.
        </p>

        {/* Unlock Code Display */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-6">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-3 font-medium">
            YOUR UNLOCK CODE
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-50 text-center break-all">
              {displayCode}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 text-xs font-medium transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleUnlockNow}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold transition-colors"
          >
            Unlock Pro Now
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Next Steps */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Next Steps:
          </h3>
          <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">1.</span>
              <span>Save your unlock code somewhere safe</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">2.</span>
              <span>Click "Unlock Pro Now" above</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">3.</span>
              <span>Enjoy unlimited Pro features!</span>
            </li>
          </ol>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          Your unlock is permanent on this device. No account required.
        </p>
      </div>
    </div>
  );
};

export default Success;
