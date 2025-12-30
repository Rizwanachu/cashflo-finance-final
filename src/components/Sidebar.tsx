import React from "react";
import { NavLink } from "react-router-dom";
import { usePro } from "../context/ProContext";

const Sidebar: React.FC = () => {
  const { isProUser, setShowGoProModal } = usePro();
  const baseClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const inactive =
    baseClass + " text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-800";
  const active =
    baseClass + " bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 shadow-sm";

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 backdrop-blur-xl">
      <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Spendory" className="h-9 w-9 rounded-lg shadow-sm" />
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Spendory
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
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
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            🏠
          </span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            💳
          </span>
          <span>Transactions</span>
        </NavLink>
        <NavLink
          to="/budgets"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            🎯
          </span>
          <span>Budgets</span>
        </NavLink>
        <NavLink
          to="/goals"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            ⭐
          </span>
          <span>Goals</span>
        </NavLink>
        <NavLink
          to="/recurring"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            🔄
          </span>
          <span>Recurring</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            📊
          </span>
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            ⚙️
          </span>
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/pricing"
          className={({ isActive }) => (isActive ? active : inactive)}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-xs">
            💰
          </span>
          <span>Pricing</span>
        </NavLink>
      </nav>

      {!isProUser && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowGoProModal(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm"
          >
            ⭐ Spendory Pro
          </button>
        </div>
      )}

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <NavLink
          to="/privacy"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
        >
          Privacy
        </NavLink>
        <NavLink
          to="/terms"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
        >
          Terms
        </NavLink>
        <div className="text-slate-400 dark:text-slate-500">
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



