import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
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
          <img src="/logo.png" alt="Cashflo" className="h-9 w-9 rounded-lg shadow-sm" />
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Cashflo
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
      </nav>
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div>Today</div>
        <div>
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



