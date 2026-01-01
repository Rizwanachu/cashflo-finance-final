import React from "react";
import { NavLink } from "react-router-dom";
import { usePro } from "../context/ProContext";
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  Star, 
  RefreshCw, 
  BarChart3, 
  Settings, 
  CircleDollarSign 
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { isProUser, setShowGoProModal } = usePro();
  const baseClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const inactive =
    baseClass + " text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-900 dark:hover:text-[var(--text-primary)] hover:bg-slate-200 dark:hover:bg-[var(--bg-tertiary)]";
  const active =
    baseClass + " bg-gray-100 dark:bg-gray-100 text-slate-900 dark:text-slate-900 shadow-md";

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-[var(--border-subtle)] bg-slate-100 dark:bg-[var(--bg-secondary)] backdrop-blur-xl">
      <div className="px-6 py-6 border-b border-slate-200 dark:border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Spendory" className="h-9 w-9 rounded-lg shadow-sm" />
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)]">
              Spendory
            </div>
            <div className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
              Track effortlessly
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <LayoutDashboard size={14} />
          </span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <CreditCard size={14} />
          </span>
          <span>Transactions</span>
        </NavLink>
        <NavLink
          to="/budgets"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <Target size={14} />
          </span>
          <span>Budgets</span>
        </NavLink>
        <NavLink
          to="/goals"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <Star size={14} />
          </span>
          <span>Goals</span>
        </NavLink>
        <NavLink
          to="/recurring"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <RefreshCw size={14} />
          </span>
          <span>Recurring</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <BarChart3 size={14} />
          </span>
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <Settings size={14} />
          </span>
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/pricing"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 dark:bg-black/20">
            <CircleDollarSign size={14} />
          </span>
          <span>Pricing</span>
        </NavLink>
      </nav>

      {!isProUser && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-[var(--border-subtle)]">
          <button
            onClick={() => setShowGoProModal(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Star size={14} fill="currentColor" />
            <span>Spendory Pro</span>
          </button>
        </div>
      )}

      <div className="px-4 py-3 border-t border-slate-200 dark:border-[var(--border-subtle)] space-y-2 text-xs">
        <NavLink
          to="/privacy"
          className="text-slate-500 dark:text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"
        >
          Privacy
        </NavLink>
        <NavLink
          to="/terms"
          className="text-slate-500 dark:text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"
        >
          Terms
        </NavLink>
        <div className="text-slate-400 dark:text-[var(--text-disabled)]">
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric"
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;



