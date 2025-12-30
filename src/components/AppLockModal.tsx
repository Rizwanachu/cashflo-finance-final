import React, { useState } from "react";
import { useAppLock } from "../context/AppLockContext";
import { useToast } from "../context/ToastContext";

interface AppLockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
}

const AppLockModal: React.FC<AppLockModalProps> = ({ isOpen, onUnlock }) => {
  const { unlockApp } = useAppLock();
  const { pushToast } = useToast();
  const [enteredPin, setEnteredPin] = useState("");
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handlePinInput = (digit: string) => {
    if (enteredPin.length < 6) {
      setEnteredPin(enteredPin + digit);
    }
  };

  const handleBackspace = () => {
    setEnteredPin(enteredPin.slice(0, -1));
  };

  const handleUnlock = () => {
    if (unlockApp(enteredPin)) {
      setEnteredPin("");
      setAttempts(0);
      onUnlock();
      pushToast("App unlocked", "success");
    } else {
      setEnteredPin("");
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        pushToast("Too many failed attempts. Try again later.", "error");
      } else {
        pushToast(`Incorrect PIN. ${3 - newAttempts} attempts remaining`, "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 text-center mb-2">
          🔒 App Locked
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8">
          Enter your PIN to unlock
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-900 dark:text-slate-50"
            >
              {enteredPin.length > i ? "●" : "○"}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              disabled={enteredPin.length >= 6}
              className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-50 text-lg font-semibold transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePinInput("0")}
            disabled={enteredPin.length >= 6}
            className="col-start-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-50 text-lg font-semibold transition-colors"
          >
            0
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBackspace}
            className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
          >
            ← Backspace
          </button>
          <button
            onClick={handleUnlock}
            disabled={enteredPin.length === 0}
            className="flex-1 p-3 rounded-xl bg-[var(--brand-primary)] hover:hover:bg-[var(--brand-hover)] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-semibold transition-colors"
          >
            Unlock
          </button>
        </div>

        {attempts >= 3 && (
          <p className="text-xs text-red-500 text-center mt-4">
            Too many failed attempts. Please restart the app.
          </p>
        )}
      </div>
    </div>
  );
};

export default AppLockModal;
