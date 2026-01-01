import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useCurrency, CurrencyCode } from "../context/CurrencyContext";
import { usePrivacy } from "../context/PrivacyContext";
import { useAppLock } from "../context/AppLockContext";
import { useNotifications } from "../context/NotificationsContext";
import { ToastViewport } from "../context/ToastContext";
import GoproModal from "../components/GoproModal";
import AppLockModal from "../components/AppLockModal";
import { usePro } from "../context/ProContext";
import { 
  Bell, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Home, 
  CreditCard, 
  Target, 
  Star, 
  RefreshCw, 
  MoreHorizontal,
  Settings,
  BarChart3,
  DollarSign,
  AlertTriangle,
  LayoutDashboard,
  Info
} from "lucide-react";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { privacyMode, togglePrivacyMode } = usePrivacy();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { showGoProModal, setShowGoProModal, lockedFeature } = usePro();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isAppLocked } = useAppLock();

  const baseClass =
    "flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl text-[10px] font-medium transition-colors min-w-0 flex-1";
  const inactive =
    baseClass + " text-slate-500 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 hover:bg-slate-900 dark:hover:bg-gray-100";
  const active =
    baseClass + " bg-slate-900 dark:bg-gray-100 text-white dark:text-slate-900 border border-slate-800 dark:border-gray-200 shadow-sm";

  return (
    <div className="h-screen flex overflow-hidden transition-colors bg-slate-50 dark:bg-[var(--bg-primary)] text-slate-900 dark:text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 dark:border-[var(--border-subtle)] flex items-center px-3 sm:px-4 md:px-8 justify-between bg-transparent shrink-0">
          <div className="flex items-center gap-2 md:hidden min-w-0">
            <img src="/logo.png" alt="Spendory" className="h-8 w-8 rounded-lg shadow-sm shrink-0" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)] truncate">
                Spendory
              </h1>
            </div>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-secondary)] hover:border-emerald-500 dark:hover:border-[var(--brand-primary)] hover:text-emerald-600 dark:hover:text-[var(--brand-primary)] transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[80vh] sm:max-h-96 overflow-y-auto rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-tertiary)] shadow-xl z-40 max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-20 max-sm:w-auto max-sm:mt-0">
                    <div className="p-3 border-b border-slate-200 dark:border-[var(--border-subtle)] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <div className="flex gap-2">
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-emerald-600 dark:text-[var(--brand-primary)] hover:underline"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={clearAll}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="flex justify-center mb-2">
                            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                          </div>
                          <p className="text-sm text-slate-500 dark:text-[var(--text-paragraph)]">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {notifications.slice(0, 10).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                setShowNotifications(false);
                                if (n.type === "budget_warning" || n.type === "budget_exceeded") {
                                  navigate("/budgets");
                                } else if (n.type === "payment_due") {
                                  navigate("/recurring");
                                }
                              }}
                              className={`p-3 rounded-xl cursor-pointer transition-colors ${
                                n.read 
                                  ? "bg-slate-50 dark:bg-[var(--bg-secondary)] hover:bg-slate-100 dark:hover:bg-[var(--bg-tertiary)]" 
                                  : "bg-emerald-50 dark:bg-[var(--brand-primary)]/10 hover:bg-emerald-100 dark:hover:bg-[var(--brand-primary)]/20"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="mt-0.5">
                                  {n.type === "budget_exceeded" ? <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> : 
                                   n.type === "budget_warning" ? <BarChart3 className="w-3.5 h-3.5 text-amber-500" /> : 
                                   n.type === "payment_due" ? <CreditCard className="w-3.5 h-3.5 text-blue-500" /> : <Info className="w-3.5 h-3.5 text-slate-400" />}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900 dark:text-[var(--text-primary)]">
                                    {n.title}
                                  </div>
                                  <div className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] mt-0.5 truncate">
                                    {n.message}
                                  </div>
                                </div>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-200 dark:border-[var(--border-subtle)]">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/settings");
                        }}
                        className="w-full text-center text-xs text-emerald-600 dark:text-[var(--brand-primary)] hover:underline py-1"
                      >
                        Manage notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={togglePrivacyMode}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-secondary)] hover:border-emerald-500 dark:hover:border-[var(--brand-primary)] hover:text-emerald-600 dark:hover:text-[var(--brand-primary)] transition-colors"
              title={privacyMode ? "Disable Privacy Mode" : "Enable Privacy Mode"}
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-secondary)] hover:border-emerald-500 dark:hover:border-[var(--brand-primary)] hover:text-emerald-600 dark:hover:text-[var(--brand-primary)] transition-colors"
              title={resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden xs:flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-full border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-2 sm:px-3 py-1.5 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </header>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-900 bg-white/95 dark:bg-black/95 backdrop-blur-md z-20 safe-area-pb">
          <div className="flex justify-between px-1 py-1 text-xs">
            <NavLink to="/" end className={({ isActive }) => (isActive ? active : inactive)}>
              <Home className="w-[18px] h-[18px]" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              <CreditCard className="w-[18px] h-[18px]" />
              <span>Transactions</span>
            </NavLink>
            <NavLink
              to="/budgets"
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              <Target className="w-[18px] h-[18px]" />
              <span>Budgets</span>
            </NavLink>
            <NavLink
              to="/goals"
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              <Star className="w-[18px] h-[18px]" />
              <span>Goals</span>
            </NavLink>
            <NavLink
              to="/recurring"
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              <RefreshCw className="w-[18px] h-[18px]" />
              <span>Recurring</span>
            </NavLink>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`${inactive}`}
              >
                <MoreHorizontal className="w-[18px] h-[18px]" />
                <span>More</span>
              </button>
              {showMobileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowMobileMenu(false)}
                  />
                  <div className="absolute bottom-12 right-0 w-56 rounded-2xl border border-slate-900 dark:border-[var(--border-subtle)] bg-slate-900 dark:bg-[var(--bg-tertiary)] shadow-xl z-40">
                    <NavLink
                      to="/settings"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-5 py-4 text-sm border-b border-slate-700 dark:border-[var(--border-subtle)] ${
                          isActive 
                            ? "bg-slate-800 dark:bg-gray-100 text-white dark:text-slate-900 font-medium" 
                            : "text-slate-50 dark:text-[var(--text-primary)] hover:bg-slate-800 dark:hover:bg-[var(--bg-secondary)]"
                        }`
                      }
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </NavLink>
                    <NavLink
                      to="/analytics"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-5 py-4 text-sm border-b border-slate-700 dark:border-[var(--border-subtle)] ${
                          isActive 
                            ? "bg-slate-800 dark:bg-gray-100 text-white dark:text-slate-900 font-medium" 
                            : "text-slate-50 dark:text-[var(--text-primary)] hover:bg-slate-800 dark:hover:bg-[var(--bg-secondary)]"
                        }`
                      }
                    >
                      <BarChart3 className="w-4 h-4" /> Analytics
                    </NavLink>
                    <NavLink
                      to="/pricing"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-5 py-4 text-sm border-b border-slate-700 dark:border-[var(--border-subtle)] ${
                          isActive 
                            ? "bg-slate-800 dark:bg-gray-100 text-white dark:text-slate-900 font-medium" 
                            : "text-slate-50 dark:text-[var(--text-primary)] hover:bg-slate-800 dark:hover:bg-[var(--bg-secondary)]"
                        }`
                      }
                    >
                      <DollarSign className="w-4 h-4" /> Pricing
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGoProModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm text-left bg-slate-800 hover:bg-slate-700 text-gray-100 font-medium rounded-b-xl transition-all"
                    >
                      <Star className="w-4 h-4" /> Spendory Pro
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto px-2 xs:px-3 sm:px-4 md:px-8 py-3 sm:py-6 pb-24 sm:pb-20 md:pb-8">
          <Outlet />
        </div>
      </main>
      <ToastViewport />
      <GoproModal
        isOpen={showGoProModal}
        onClose={() => setShowGoProModal(false)}
        feature={lockedFeature}
      />
      <AppLockModal
        isOpen={isAppLocked}
        onUnlock={() => {}}
      />
    </div>
  );
};

export default MainLayout;



