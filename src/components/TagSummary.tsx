import React, { useMemo } from "react";
import { Transaction } from "../types";
import { useCurrency } from "../context/CurrencyContext";

interface TagSummaryProps {
  transactions: Transaction[];
}

const TagSummary: React.FC<TagSummaryProps> = ({ transactions }) => {
  const { formatAmount } = useCurrency();

  const tagStats = useMemo(() => {
    const stats = new Map<string, { count: number; totalAmount: number }>();

    transactions.forEach((t) => {
      if (t.tags) {
        t.tags.forEach((tag) => {
          const current = stats.get(tag) || { count: 0, totalAmount: 0 };
          stats.set(tag, {
            count: current.count + 1,
            totalAmount: current.totalAmount + (t.type === "expense" ? t.amount : 0)
          });
        });
      }
    });

    return Array.from(stats.entries())
      .sort((a, b) => b[1].totalAmount - a[1].totalAmount);
  }, [transactions]);

  if (tagStats.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No tags yet. Add tags to your transactions to see summaries here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Spending by Tag
        </h3>
        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
          Pro
        </span>
      </div>
      <div className="space-y-3">
        {tagStats.map(([tag, stats]) => (
          <div key={tag} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                {tag}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {stats.count} transaction{stats.count !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {formatAmount(stats.totalAmount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSummary;
