import React, { useMemo } from "react";
import { Transaction } from "../types";
import { useCurrency } from "../context/CurrencyContext";
import { usePrivacy } from "../context/PrivacyContext";
import { formatAmountWithPrivacy } from "../utils/privacy";

interface Props {
  transactions: Transaction[];
}

const SummaryCards: React.FC<Props> = ({ transactions }) => {
  const { formatAmount, currency } = useCurrency();
  const { privacyMode } = usePrivacy();

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income" && t.currency === currency)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense" && t.currency === currency)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses
    };
  }, [transactions, currency]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Balance
          </span>
          <span className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-[var(--brand-primary)]/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
            $
          </span>
        </div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {formatAmountWithPrivacy(totalBalance, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Income - expenses across all transactions
        </div>
      </div>
      <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <span className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-[var(--brand-primary)]/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
            +
          </span>
        </div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {formatAmountWithPrivacy(totalIncome, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          All recorded incoming cash flow
        </div>
      </div>
      <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <span className="h-7 w-7 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xs">
            −
          </span>
        </div>
        <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
          {formatAmountWithPrivacy(totalExpenses, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          All outgoing payments and purchases
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;



