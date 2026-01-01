import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTransactionsContext } from "../context/TransactionsContext";
import { useCurrency } from "../context/CurrencyContext";
import { usePrivacy } from "../context/PrivacyContext";
import { useRetention } from "../context/RetentionContext";
import SummaryCards from "../components/SummaryCards";
import BudgetOverview from "../components/BudgetOverview";
import WeeklySpendingChart from "../components/charts/WeeklySpendingChart";
import MonthlySpendingChart from "../components/charts/MonthlySpendingChart";
import FreeLimitsBanner from "../components/FreeLimitsBanner";
import ProUserDelight from "../components/ProUserDelight";
import { Card, ChartContainer } from "../components/Card";
import { Transaction } from "../types";
import { formatCurrencyWithPrivacy } from "../utils/privacy";
import { 
  Plus, 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft 
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { transactions } = useTransactionsContext();
  const { currency } = useCurrency();
  const { privacyMode } = usePrivacy();
  const { getConsistencyMessage, consistencyBadge } = useRetention();
  const [sortNewest, setSortNewest] = useState(true);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.currency === currency || (!t.currency && currency === "USD"));
  }, [transactions, currency]);

  const recentTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return sortNewest ? dateCompare : -dateCompare;
      // If dates are same, use ID for stable sort
      return sortNewest ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
    });
    return sorted.slice(0, 5);
  }, [filteredTransactions, sortNewest]);

  const categoryLabel: Record<string, string> = {
    rent: "Home Rent",
    food: "Food & Shopping",
    transport: "Transport",
    utilities: "Bills & Utilities",
    misc: "Others"
  };

  const categorySpending = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      });
    return Object.entries(totals).map(([cat, value]) => ({
      key: cat,
      label: categoryLabel[cat] ?? cat,
      value
    }));
  }, [filteredTransactions]);

  const formatCurrency = (value: number) =>
    formatCurrencyWithPrivacy(value, currency, privacyMode);

  const formatDate = (value: string) =>
    new Date(value + "T00:00:00").toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const statusFromTransaction = (tx: Transaction) => {
    // Simple visual status similar to reference UI
    if (tx.type === "income") return "Completed";
    return "In progress";
  };

  const isFirstTimeUser = filteredTransactions.length === 0;

  // First-time user empty state
  if (isFirstTimeUser) {
    return (
      <div className="space-y-5">
        <ProUserDelight />
        <FreeLimitsBanner />
        <SummaryCards transactions={filteredTransactions} />
        
        {/* Welcome CTA */}
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-900 dark:text-[var(--text-primary)]">
              <Wallet size={32} />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-[var(--text-primary)] mb-2">
            Welcome to Spendory
          </h2>
          <p className="text-sm text-slate-500 dark:text-[var(--text-paragraph)] mb-6 max-w-md mx-auto">
            Start tracking your finances by adding your first transaction in {currency}. Your data stays private and secure in your browser.
          </p>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 dark:text-slate-900 text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add your first {currency} transaction</span>
          </Link>
        </Card>

        {/* Empty charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          <Card className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
                  Spending
                </div>
                <div className="text-sm text-slate-600 dark:text-[var(--text-secondary)]">
                  Overview of this week&apos;s expenses
                </div>
              </div>
            </div>
            <div className="h-[150px] sm:h-[180px] md:h-[220px] lg:h-[260px] flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-2 text-slate-400">
                  <BarChart3 size={32} />
                </div>
                <p className="text-sm text-slate-400 dark:text-[var(--text-disabled)]">No {currency} data yet</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
                  Portfolio
                </div>
                <div className="text-sm font-semibold mt-1 text-slate-900 dark:text-[var(--text-primary)]">
                  Cash position
                </div>
              </div>
            </div>
            <div className="h-[150px] sm:h-[180px] md:h-[220px] lg:h-[260px] flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-2 text-slate-400">
                  <TrendingUp size={32} />
                </div>
                <p className="text-sm text-slate-400 dark:text-[var(--text-disabled)]">No {currency} data yet</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProUserDelight />
      <FreeLimitsBanner />
      {consistencyBadge && (
        <Card className="bg-zinc-900 dark:bg-[var(--bg-tertiary)] border border-zinc-800 dark:border-[var(--border-subtle)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white dark:text-[var(--text-primary)]">
                {consistencyBadge}
              </p>
              <p className="text-sm text-white/70 dark:text-[var(--text-paragraph)] mt-1">
                {getConsistencyMessage()}
              </p>
            </div>
          </div>
        </Card>
      )}
      <SummaryCards transactions={filteredTransactions} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        <Card className="md:col-span-2 lg:col-span-2 bg-white dark:bg-[var(--bg-tertiary)] text-slate-900 dark:text-[var(--text-primary)] border border-slate-200 dark:border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-secondary)]">
                Spending
              </div>
              <div className="text-sm text-slate-600 dark:text-[var(--text-paragraph)]">
                Overview of this week&apos;s expenses ({currency})
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 dark:bg-black dark:border-slate-800 dark:text-slate-200 w-fit">
              Last 7 days
            </span>
          </div>
          <ChartContainer>
            <WeeklySpendingChart transactions={filteredTransactions} />
          </ChartContainer>
        </Card>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
                Portfolio
              </div>
              <div className="text-sm font-semibold mt-1 text-slate-900 dark:text-[var(--text-primary)]">
                Cash position ({currency})
              </div>
            </div>
            <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-secondary)] text-[11px] font-medium w-fit border border-slate-200 dark:border-[var(--border-subtle)]">
              +3.1% vs last month
            </span>
          </div>
          <ChartContainer>
            <MonthlySpendingChart transactions={filteredTransactions} />
          </ChartContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="md:col-span-2 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)]">
                Recent transactions
              </h3>
              <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                Latest activity across your accounts
              </p>
            </div>
            <div className="inline-flex rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] p-1 text-[11px] w-fit">
              <button
                type="button"
                onClick={() => setSortNewest(true)}
                className={`px-2 sm:px-2.5 py-0.5 rounded-full text-nowrap ${
                  sortNewest
                    ? "bg-white dark:bg-[var(--bg-tertiary)] shadow text-slate-900 dark:text-[var(--text-primary)]"
                    : "text-slate-500 dark:text-[var(--text-muted)]"
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setSortNewest(false)}
                className={`px-2 sm:px-2.5 py-0.5 rounded-full text-nowrap ${
                  !sortNewest
                    ? "bg-white dark:bg-[var(--bg-tertiary)] shadow text-slate-900 dark:text-[var(--text-primary)]"
                    : "text-slate-500 dark:text-[var(--text-muted)]"
                }`}
              >
                Oldest
              </button>
            </div>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-[var(--border-subtle)] text-sm">
            {recentTransactions.map((t) => (
              <li key={t.id} className="py-2.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-500 dark:text-[var(--text-muted)]">
                  {t.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium truncate text-slate-900 dark:text-[var(--text-primary)]">
                      {t.description}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        t.type === "income"
                          ? "text-zinc-900 dark:text-[var(--brand-primary)]"
                          : "text-red-600 dark:text-[var(--danger-text)]"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 text-[11px] text-slate-500 dark:text-[var(--text-paragraph)] gap-2">
                    <span>{categoryLabel[t.category] ?? t.category}</span>
                    <span className="flex items-center gap-2">
                      <span>{formatDate(t.date)}</span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${
                          t.type === "income"
                            ? "bg-zinc-100 dark:bg-[var(--brand-primary)]/10 text-zinc-900 dark:text-[var(--brand-primary)]"
                            : "bg-red-50 dark:bg-[var(--danger-bg)] text-red-600 dark:text-[var(--danger-text)]"
                        }`}
                      >
                        {statusFromTransaction(t)}
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 text-right">
            <Link
              to="/transactions"
              className="text-xs text-zinc-900 dark:text-[var(--brand-primary)] hover:underline"
            >
              View all transactions →
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold tracking-tight mb-3 text-slate-900 dark:text-[var(--text-primary)]">
            Spending by category ({currency})
          </h3>
          <div className="flex flex-col gap-2">
            {categorySpending.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                No {currency} expense data yet. Add an expense transaction to see this
                view.
              </p>
            )}
            {categorySpending.map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[var(--bg-secondary)] px-3 py-2"
              >
                <div>
                  <div className="text-xs text-slate-500 dark:text-[var(--text-muted)]">
                    {c.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                    {formatCurrency(c.value)}
                  </div>
                </div>
                <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-[var(--bg-tertiary)] overflow-hidden">
                  <div className="h-full w-3/4 bg-zinc-900 dark:bg-[var(--brand-primary)]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BudgetOverview />
      </div>
    </div>
  );
};

export default Dashboard;



