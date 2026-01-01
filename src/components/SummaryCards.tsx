import React, { useMemo } from "react";
import { Transaction } from "../types";
import { useCurrency } from "../context/CurrencyContext";
import { usePrivacy } from "../context/PrivacyContext";
import { formatAmountWithPrivacy } from "../utils/privacy";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

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
      <div className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
            Total Balance
          </span>
          <span className="h-7 w-7 rounded-xl bg-zinc-900 dark:bg-gray-100 text-white dark:text-slate-900 flex items-center justify-center">
            <Wallet size={14} />
          </span>
        </div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-[var(--text-primary)]">
          {formatAmountWithPrivacy(totalBalance, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-[var(--text-paragraph)] mt-1">
          Income - expenses across all transactions
        </div>
      </div>
      <div className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
            Total Income
          </span>
          <span className="h-7 w-7 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
            <TrendingUp size={14} />
          </span>
        </div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-[var(--text-primary)]">
          {formatAmountWithPrivacy(totalIncome, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-[var(--text-paragraph)] mt-1">
          All recorded incoming cash flow
        </div>
      </div>
      <div className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
            Total Expenses
          </span>
          <span className="h-7 w-7 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown size={14} />
          </span>
        </div>
        <div className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
          {formatAmountWithPrivacy(totalExpenses, formatAmount, privacyMode)}
        </div>
        <div className="text-xs text-slate-500 dark:text-[var(--text-paragraph)] mt-1">
          All outgoing payments and purchases
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;



