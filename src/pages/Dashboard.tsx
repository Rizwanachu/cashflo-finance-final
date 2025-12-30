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

const Dashboard: React.FC = () => {
  const { transactions } = useTransactionsContext();
  const { currency } = useCurrency();
  const { privacyMode } = usePrivacy();
  const { getConsistencyMessage, consistencyBadge } = useRetention();
  const [sortNewest, setSortNewest] = useState(true);

  const recentTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) =>
      sortNewest
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );
    return sorted.slice(0, 5);
  }, [transactions, sortNewest]);

  const categoryLabel: Record<string, string> = {
    rent: "Home Rent",
    food: "Food & Shopping",
    transport: "Transport",
    utilities: "Bills & Utilities",
    misc: "Others"
  };

  const categorySpending = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      });
    return Object.entries(totals).map(([cat, value]) => ({
      key: cat,
      label: categoryLabel[cat] ?? cat,
      value
    }));
  }, [transactions]);

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

  const isFirstTimeUser = transactions.length === 0;

  // First-time user empty state
  if (isFirstTimeUser) {
    return (
      <div className="space-y-5">
        <ProUserDelight />
        <FreeLimitsBanner />
        <SummaryCards transactions={transactions} />
        
        {/* Welcome CTA */}
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-[var(--text-primary)] mb-2">
            Welcome to Spendory
          </h2>
          <p className="text-sm text-slate-500 dark:text-[var(--text-paragraph)] mb-6 max-w-md mx-auto">
            Start tracking your finances by adding your first transaction. Your data stays private and secure in your browser.
          </p>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-[var(--brand-primary)] dark:hover:bg-[var(--brand-secondary)] text-white dark:text-[var(--bg-primary)] text-sm font-medium transition-colors"
          >
            <span>➕</span>
            <span>Add your first transaction</span>
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
            <div className="h-[200px] md:h-[220px] lg:h-[260px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm text-slate-400 dark:text-[var(--text-disabled)]">No data yet</p>
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
            <div className="h-[200px] md:h-[220px] lg:h-[260px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <p className="text-sm text-slate-400 dark:text-[var(--text-disabled)]">No data yet</p>
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
        <Card className="bg-emerald-50 dark:bg-[var(--brand-primary)]/10 border border-emerald-200 dark:border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                {consistencyBadge}
              </p>
              <p className="text-sm text-slate-600 dark:text-[var(--text-paragraph)] mt-1">
                {getConsistencyMessage()}
              </p>
            </div>
          </div>
        </Card>
      )}
      <SummaryCards transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        <Card className="md:col-span-2 lg:col-span-2 bg-emerald-500 dark:bg-[var(--brand-primary)] text-white dark:text-[var(--bg-primary)] border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-white/90 dark:text-[var(--bg-primary)]/90">
                Spending
              </div>
              <div className="text-sm text-white/80 dark:text-[var(--bg-primary)]/80">
                Overview of this week&apos;s expenses
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/30 text-white dark:bg-[var(--bg-primary)]/20 dark:border-[var(--bg-primary)]/30 dark:text-[var(--bg-primary)] w-fit">
              Last 7 days
            </span>
          </div>
          <ChartContainer>
            <WeeklySpendingChart transactions={transactions} />
          </ChartContainer>
        </Card>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)]">
                Portfolio
              </div>
              <div className="text-sm font-semibold mt-1 text-slate-900 dark:text-[var(--text-primary)]">
                Cash position
              </div>
            </div>
            <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 dark:bg-[var(--brand-primary)]/10 text-emerald-600 dark:text-[var(--brand-primary)] text-[11px] font-medium w-fit">
              +3.1% vs last month
            </span>
          </div>
          <ChartContainer>
            <MonthlySpendingChart transactions={transactions} />
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
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-xs">
                  {t.type === "income" ? "⬇" : "⬆"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium truncate text-slate-900 dark:text-[var(--text-primary)]">
                      {t.description}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        t.type === "income"
                          ? "text-emerald-600 dark:text-[var(--brand-primary)]"
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
                            ? "bg-emerald-100 dark:bg-[var(--brand-primary)]/10 text-emerald-600 dark:text-[var(--brand-primary)]"
                            : "bg-amber-100 dark:bg-[var(--danger-bg)] text-amber-600 dark:text-[var(--danger-text)]"
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
              className="text-xs text-emerald-600 dark:text-[var(--brand-primary)] hover:text-emerald-700 dark:hover:text-[var(--brand-secondary)]"
            >
              View all transactions →
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold tracking-tight mb-3 text-slate-900 dark:text-[var(--text-primary)]">
            Spending by category
          </h3>
          <div className="flex flex-col gap-2">
            {categorySpending.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                No expense data yet. Add an expense transaction to see this
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
                  <div className="h-full w-3/4 bg-emerald-500 dark:bg-[var(--brand-primary)]" />
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



