import React, { useMemo, useState } from "react";
import { useBudgets } from "../context/BudgetContext";
import { useTransactionsContext } from "../context/TransactionsContext";
import { TransactionCategory } from "../types";
import { useCurrency } from "../context/CurrencyContext";

const categoryLabel: Record<TransactionCategory, string> = {
  rent: "Home Rent",
  food: "Food & Dining",
  transport: "Transport",
  utilities: "Utilities",
  misc: "Miscellaneous"
};

const BudgetOverview: React.FC = () => {
  const { budgets, setOverallBudget, setCategoryBudget } = useBudgets();
  const { transactions } = useTransactionsContext();
  const { formatAmount } = useCurrency();
  const [overallInput, setOverallInput] = useState(
    budgets.overall ? budgets.overall.toString() : ""
  );

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const monthlyExpensesByCategory = useMemo(() => {
    const result: Record<TransactionCategory, number> = {
      rent: 0,
      food: 0,
      transport: 0,
      utilities: 0,
      misc: 0
    };
    transactions
      .filter(
        (t) =>
          t.type === "expense" && t.date.slice(0, 7) === currentMonthKey
      )
      .forEach((t) => {
        result[t.category] += t.amount;
      });
    return result;
  }, [transactions, currentMonthKey]);

  const overallSpent = Object.values(monthlyExpensesByCategory).reduce(
    (sum, v) => sum + v,
    0
  );

  const overallUsage =
    budgets.overall && budgets.overall > 0
      ? Math.min(100, Math.round((overallSpent / budgets.overall) * 100))
      : 0;

  const handleOverallBlur = () => {
    if (!overallInput.trim()) {
      setOverallBudget(null);
      return;
    }
    const value = Number(overallInput);
    if (!isFinite(value) || value <= 0) return;
    setOverallBudget(value);
  };

  const alertColor = (usedPercent: number) => {
    if (usedPercent >= 100) return "bg-rose-500";
    if (usedPercent >= 80) return "bg-amber-400";
    return "bg-zinc-900 dark:bg-[var(--brand-primary)]";
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm dark:bg-[var(--bg-tertiary)] dark:border-[var(--border-subtle)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight dark:text-[var(--text-primary)]">
            Monthly budgets
          </h3>
          <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
            Track how this month&apos;s spending compares to your limits.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-600 dark:text-[var(--text-secondary)]">
              Overall budget
            </span>
            <span className="text-slate-400 dark:text-[var(--text-muted)]">
              {budgets.overall
                ? `${overallUsage}% used • ${formatAmount(
                    Math.max(budgets.overall - overallSpent, 0)
                  )} left`
                : "No limit set"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] overflow-hidden">
              <div
                className={`h-full rounded-full ${alertColor(overallUsage)}`}
                style={{ width: `${overallUsage}%` }}
              />
            </div>
            <input
              type="number"
              placeholder="Set limit"
              value={overallInput}
              onChange={(e) => setOverallInput(e.target.value)}
              onBlur={handleOverallBlur}
              className="w-28 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-right text-slate-700 placeholder:text-slate-400 dark:bg-[var(--bg-secondary)] dark:border-[var(--border-subtle)] dark:text-[var(--text-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {(Object.keys(
            monthlyExpensesByCategory
          ) as TransactionCategory[]).map((cat) => {
            const spent = monthlyExpensesByCategory[cat];
            const limit = budgets.perCategory[cat];
            const percent =
              limit && limit > 0
                ? Math.min(100, Math.round((spent / limit) * 100))
                : 0;

            return (
              <div
                key={cat}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs flex flex-col gap-1 dark:bg-[var(--bg-secondary)] dark:border-[var(--border-subtle)]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-600 dark:text-[var(--text-secondary)]">
                    {categoryLabel[cat]}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[var(--text-muted)]">
                    {limit
                      ? `${percent}% • ${formatAmount(
                          Math.max(limit - spent, 0)
                        )} left`
                      : "No limit"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-[var(--bg-tertiary)] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${alertColor(percent)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Limit"
                    defaultValue={limit ?? ""}
                    onBlur={(e) => {
                      const raw = e.target.value;
                      if (!raw.trim()) {
                        setCategoryBudget(cat, null);
                        return;
                      }
                      const value = Number(raw);
                      if (!isFinite(value) || value <= 0) return;
                      setCategoryBudget(cat, value);
                    }}
                    className="w-20 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-right text-slate-700 placeholder:text-slate-400 dark:bg-[var(--bg-secondary)] dark:border-[var(--border-subtle)] dark:text-[var(--text-primary)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;


