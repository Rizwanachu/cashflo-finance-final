import React, { useMemo } from "react";
import { Transaction } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";

interface Props {
  transactions: Transaction[];
}

interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

const MonthlySummary: React.FC<Props> = ({ transactions }) => {
  const { theme } = useTheme();
  const { currency } = useCurrency();

  const summaries = useMemo(() => {
    const monthMap = new Map<string, MonthlySummary>();

    transactions.forEach((tx) => {
      const date = new Date(tx.date + "T00:00:00");
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthName,
          income: 0,
          expenses: 0,
          net: 0
        });
      }

      const summary = monthMap.get(monthKey)!;
      if (tx.type === "income") {
        summary.income += tx.amount;
      } else {
        summary.expenses += tx.amount;
      }
      summary.net = summary.income - summary.expenses;
    });

    return Array.from(monthMap.values())
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12); // Last 12 months
  }, [transactions]);

  // Calculate YTD
  const currentYear = new Date().getFullYear();
  const ytd = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      const date = new Date(tx.date + "T00:00:00");
      if (date.getFullYear() === currentYear) {
        if (tx.type === "income") {
          income += tx.amount;
        } else {
          expenses += tx.amount;
        }
      }
    });

    return { income, expenses, net: income - expenses };
  }, [transactions]);

  // Trend indicator
  const trend = useMemo(() => {
    if (summaries.length < 2) return null;
    const current = summaries[0];
    const previous = summaries[1];
    const currentIncome = current.income;
    const previousIncome = previous.income;
    
    if (previousIncome === 0) return null;
    const change = ((currentIncome - previousIncome) / previousIncome) * 100;
    return {
      direction: change > 0 ? "up" : "down",
      percentage: Math.abs(change).toFixed(1)
    };
  }, [summaries]);

  const currencySymbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "INR" ? "₹" : "£";

  // Compute effective dark mode - same logic as Analytics page
  const isDarkMode =
    theme === "dark" ? true :
    theme === "light" ? false :
    // System mode - check HTML class
    typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? true :
    // Fallback to prefers-color-scheme
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? true :
    false;

  const bgColor = isDarkMode ? "dark:bg-[var(--bg-secondary)]" : "bg-slate-50";
  const borderColor = isDarkMode ? "dark:border-[var(--border-subtle)]" : "border-slate-200";
  const textColor = isDarkMode ? "dark:text-[var(--text-primary)]" : "text-slate-900";
  const labelColor = isDarkMode ? "dark:text-[var(--text-paragraph)]" : "text-slate-600";

  return (
    <div className="space-y-4">
      {/* YTD Summary */}
      <div className={`rounded-lg border border-slate-200 ${bgColor} p-4`}>
        <h3 className={`font-semibold text-slate-900 ${textColor} mb-3`}>Year-to-Date ({currentYear})</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className={`text-sm text-slate-600 ${labelColor} mb-1`}>Income</p>
            <p className={`text-lg font-bold text-green-600 dark:text-green-400`}>
              {currencySymbol}{ytd.income.toFixed(2)}
            </p>
          </div>
          <div>
            <p className={`text-sm text-slate-600 ${labelColor} mb-1`}>Expenses</p>
            <p className={`text-lg font-bold text-red-600 dark:text-red-400`}>
              {currencySymbol}{ytd.expenses.toFixed(2)}
            </p>
          </div>
          <div>
            <p className={`text-sm text-slate-600 ${labelColor} mb-1`}>Net</p>
            <p className={`text-lg font-bold ${ytd.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {currencySymbol}{ytd.net.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Month-over-Month */}
      <div className={`rounded-lg border border-slate-200 ${bgColor} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold text-slate-900 ${textColor}`}>Month-over-Month</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.direction === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{trend.percentage}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {summaries.length === 0 ? (
            <p className={`text-sm text-slate-600 ${labelColor}`}>No transactions yet</p>
          ) : (
            summaries.map((summary, index) => (
              <div key={index} className={`flex items-center justify-between py-2 px-2 rounded hover:bg-slate-100/50 dark:hover:bg-[var(--bg-tertiary)]`}>
                <div>
                  <p className={`text-sm font-medium text-slate-900 ${textColor}`}>{summary.month}</p>
                  <div className="flex gap-4 text-xs mt-1">
                    <span className="text-green-600 dark:text-green-400">
                      +{currencySymbol}{summary.income.toFixed(0)}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      -{currencySymbol}{summary.expenses.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className={`text-right font-semibold text-sm ${
                  summary.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {currencySymbol}{summary.net.toFixed(0)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
