import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { usePrivacy } from "../context/PrivacyContext";
import { useAppLock } from "../context/AppLockContext";
import { useCurrency, CurrencyCode } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";
import { useTransactionsContext } from "../context/TransactionsContext";
import { useAccounts } from "../context/AccountsContext";
import { useCategories } from "../context/CategoriesContext";
import { useBudgets } from "../context/BudgetContext";
import { useRecurring } from "../context/RecurringContext";
import { useNotifications } from "../context/NotificationsContext";
import { useAnalytics } from "../context/AnalyticsContext";
import { usePro } from "../context/ProContext";
import { generateUnlockCode } from "../utils/crypto";
import { exportBackup, importBackup, factoryReset, readBackupFile } from "../utils/backup";
import { Card } from "../components/Card";
import TrustAndPrivacy from "../components/TrustAndPrivacy";
import DataOwnership from "../components/DataOwnership";
import { Sun, Moon, Monitor, Lock, Unlock, Download, Upload, Trash2, Bell, Eye, EyeOff, Globe } from "lucide-react";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { privacyMode, togglePrivacyMode } = usePrivacy();
  const { isPinSet, setPin, removePin, lockApp } = useAppLock();
  const { currency, setCurrency } = useCurrency();
  const { pushToast } = useToast();
  const [newPin, setNewPin] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  const { resetTransactions } = useTransactionsContext();
  const { resetAccounts } = useAccounts();
  const { resetCategories } = useCategories();
  const { resetBudgets } = useBudgets();
  const { resetPayments } = useRecurring();
  const { notifications, unreadCount, enabled: notificationsEnabled, setEnabled: setNotificationsEnabled, markAllAsRead, clearAll: clearNotifications, resetNotifications, requestPermission, permissionStatus } = useNotifications();
  const { analyticsEnabled, setAnalyticsEnabled } = useAnalytics();
  const { deviceId, resetPro, isProUser } = usePro();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [simulatorClicks, setSimulatorClicks] = useState(0);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleSimulatorClick = () => {
    // Only allow simulator if user is already a Pro user or has a secret override
    // For production, you might want to hide this behind a more secure check
    const newCount = simulatorClicks + 1;
    setSimulatorClicks(newCount);
    if (newCount === 5) {
      if (!isProUser) {
        pushToast("Pro features required for simulator access", "warning");
        setSimulatorClicks(0);
        return;
      }
      setShowSimulator(true);
      pushToast("Simulator mode enabled", "success");
    }
  };

  const handleSetPin = () => {
    if (!newPin || !confirmPin) {
      pushToast("Please enter PIN in both fields", "error");
      return;
    }
    if (newPin !== confirmPin) {
      pushToast("PINs do not match", "error");
      return;
    }
    if (newPin.length < 4) {
      pushToast("PIN must be at least 4 digits", "error");
      return;
    }
    try {
      setPin(newPin);
      setNewPin("");
      setConfirmPin("");
      setShowPinSetup(false);
      pushToast("PIN set successfully", "success");
    } catch (error) {
      pushToast("Failed to set PIN", "error");
    }
  };

  const handleRemovePin = () => {
    removePin();
    pushToast("PIN removed", "success");
  };

  const handleLockApp = () => {
    if (!isPinSet) {
      pushToast("Please set a PIN first", "error");
      return;
    }
    lockApp();
    pushToast("App locked", "success");
  };

  const handleCopyCode = () => {
    const code = generateUnlockCode(deviceId);
    navigator.clipboard.writeText(code);
    pushToast("Code copied to clipboard!", "success");
  };

  const handleExportBackup = () => {
    try {
      exportBackup();
      pushToast("Backup exported successfully", "success");
    } catch (error) {
      pushToast("Failed to export backup", "error");
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const backup = await readBackupFile(file);
      const result = importBackup(backup);
      
      if (result.success) {
        pushToast("Backup imported successfully", "success");
        resetTransactions();
        resetAccounts();
        resetCategories();
        resetBudgets();
        resetPayments();
        resetNotifications();
        navigate("/");
      } else {
        pushToast(result.error || "Failed to import backup", "error");
      }
    } catch (error) {
      pushToast("Invalid backup file", "error");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFactoryReset = () => {
    factoryReset();
    resetTransactions();
    resetAccounts();
    resetCategories();
    resetBudgets();
    resetPayments();
    resetNotifications();
    setShowResetModal(false);
    pushToast("All data has been reset", "success");
    navigate("/");
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
          Settings
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage your app preferences and data
        </p>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[var(--text-primary)] mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] mb-2 block">
              Theme
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  theme === "light"
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50"
                    : "bg-slate-100 dark:bg-[var(--bg-secondary)] text-slate-700 dark:text-[var(--text-secondary)]"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50"
                    : "bg-slate-100 dark:bg-[var(--bg-secondary)] text-slate-700 dark:text-[var(--text-secondary)]"
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  theme === "system"
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50"
                    : "bg-slate-100 dark:bg-[var(--bg-secondary)] text-slate-700 dark:text-[var(--text-secondary)]"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
            {theme === "system" && (
              <p className="text-xs text-slate-500 dark:text-[var(--text-muted)] mt-2">
                Currently using: {resolvedTheme === "dark" ? "Dark" : "Light"} mode
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-900 dark:text-[var(--text-primary)] font-medium">
                Privacy Mode
              </div>
              <div className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] mt-0.5">
                Blur all monetary values
              </div>
            </div>
            <button
              onClick={togglePrivacyMode}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                privacyMode ? "bg-slate-400 dark:bg-slate-600" : "bg-slate-300 dark:bg-[var(--bg-secondary)]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-[var(--bg-primary)] rounded-full transition-transform ${
                  privacyMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {isProUser && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-slate-900 dark:text-[var(--text-primary)]" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[var(--text-primary)]">
              App Lock & PIN Protection
            </h3>
          </div>
          <div className="space-y-4">
            {!isPinSet ? (
              <>
                <p className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">
                  Set up a PIN to lock your app and protect your financial data
                </p>
                <button
                  onClick={() => setShowPinSetup(!showPinSetup)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
                >
                  Set PIN
                </button>
                {showPinSetup && (
                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-[var(--bg-secondary)] rounded-lg">
                    <input
                      type="password"
                      placeholder="Enter PIN (4+ digits)"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-primary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                    <input
                      type="password"
                      placeholder="Confirm PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-primary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowPinSetup(false);
                          setNewPin("");
                          setConfirmPin("");
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] text-slate-700 dark:text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSetPin}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-3 bg-emerald-50 dark:bg-[var(--brand-primary)]/10 rounded-lg border border-emerald-200 dark:border-[var(--border-subtle)]">
                  <p className="text-sm text-emerald-900 dark:text-[var(--brand-primary)] font-medium">
                    ✓ PIN is set
                  </p>
                  <p className="text-xs text-emerald-800 dark:text-[var(--text-paragraph)] mt-1">
                    Your app is protected with PIN security
                  </p>
                </div>
                <button
                  onClick={handleLockApp}
                  className="w-full px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Lock App Now
                </button>
                <button
                  onClick={handleRemovePin}
                  className="w-full px-4 py-2 rounded-xl border border-red-200 dark:border-[var(--danger-bg)] text-red-600 dark:text-[var(--danger-text)] text-sm font-medium hover:bg-red-50 dark:hover:bg-[var(--danger-bg)]/20 transition-colors"
                >
                  Remove PIN
                </button>
              </>
            )}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[var(--text-primary)] mb-4">
          Currency
        </h3>
        <div>
          <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] mb-2 block">
            Default Transaction Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="CNY">CNY - Chinese Yuan</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="AED">AED - UAE Dirham</option>
            <option value="SAR">SAR - Saudi Riyal</option>
            <option value="ZAR">ZAR - South African Rand</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
            <option value="SEK">SEK - Swedish Krona</option>
            <option value="NOK">NOK - Norwegian Krone</option>
            <option value="DKK">DKK - Danish Krone</option>
            <option value="KRW">KRW - South Korean Won</option>
            <option value="THB">THB - Thai Baht</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="PHP">PHP - Philippine Peso</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
            <option value="BRL">BRL - Brazilian Real</option>
            <option value="MXN">MXN - Mexican Peso</option>
            <option value="TRY">TRY - Turkish Lira</option>
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="BDT">BDT - Bangladeshi Taka</option>
            <option value="LKR">LKR - Sri Lankan Rupee</option>
            <option value="BGN">BGN - Bulgarian Lev</option>
            <option value="HRK">HRK - Croatian Kuna</option>
            <option value="CZK">CZK - Czech Koruna</option>
            <option value="HUF">HUF - Hungarian Forint</option>
            <option value="ISK">ISK - Icelandic Króna</option>
            <option value="PLN">PLN - Polish Zloty</option>
            <option value="RON">RON - Romanian Leu</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            All amounts are stored exactly as entered. Format only changes on display.
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                System Notifications
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {permissionStatus === 'granted' ? '✓ System notifications enabled' : 'Receive alerts on your device lock screen'}
              </div>
            </div>
            {permissionStatus !== 'granted' ? (
              <button
                onClick={requestPermission}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 text-xs font-semibold rounded-lg transition-colors"
              >
                Enable
              </button>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Granted</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                In-App Notifications
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Get alerts for budgets and payments
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notificationsEnabled ? "bg-slate-400 dark:bg-slate-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] text-slate-700 dark:text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between"
          >
            <span>View Notifications ({notifications.length})</span>
            <span>{showNotifications ? "▲" : "▼"}</span>
          </button>

          {showNotifications && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No notifications yet
                </p>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border ${
                        n.read 
                          ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" 
                          : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            {n.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {n.message}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {formatTimeAgo(n.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Privacy & Analytics
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="rounded"
              />
              Optional Analytics
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
              Help improve the app by sharing usage data (disabled by default, local-only)
            </p>
          </div>
        </div>
      </Card>

      <TrustAndPrivacy />
      <DataOwnership />

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Data Management
        </h3>
        <div className="space-y-3">
          <div>
            <button
              onClick={handleExportBackup}
              className="w-full px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 text-sm font-medium transition-colors"
            >
              📤 Export Backup
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Download all your data as a JSON file
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              📥 Import Backup
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Restore data from a backup file
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <div>
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            🗑️ Reset All Data
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permanently delete all your data. This cannot be undone.
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2" onClick={handleSimulatorClick}>
          About Spendory
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Version 1.0.0 • Your personal finance tracker
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          All data is stored locally in your browser. No data is sent to any server.
        </p>
        {deviceId && (
          <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2">
            Device ID: {deviceId}
          </p>
        )}
      </Card>

      {showSimulator && (
        <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10">
          <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            🚀 Admin Simulator
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                This simulates the code generation that would normally happen on your server after a successful PayPal payment.
              </p>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 break-all">
                  {generateUnlockCode(deviceId)}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all"
                >
                  Copy Unique Pro Code
                </button>
              </div>
            </div>
            
            {isProUser && (
              <button
                onClick={() => {
                  resetPro();
                  pushToast("Pro status reset", "success");
                }}
                className="w-full px-4 py-2 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-all"
              >
                Reset Pro Status (for testing)
              </button>
            )}
          </div>
        </Card>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Reset All Data?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete all your transactions, budgets, recurring payments, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFactoryReset}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
