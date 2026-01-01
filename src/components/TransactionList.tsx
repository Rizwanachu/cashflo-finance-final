import React, { useMemo } from "react";
import { Transaction } from "../types";
import { useCurrency } from "../context/CurrencyContext";
import { useCategories } from "../context/CategoriesContext";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const { formatAmount, currency } = useCurrency();
  const { getCategory } = useCategories();

  const filteredTransactions = useMemo(
    () => transactions.filter(t => t.currency === currency),
    [transactions, currency]
  );

  const formatDate = (value: string) =>
    new Date(value + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  const categoryLabel: Record<string, string> = {
    rent: "Rent / Mortgage",
    food: "Food & Dining",
    transport: "Transport",
    utilities: "Utilities",
    misc: "Miscellaneous"
  };

  if (!filteredTransactions.length) {
    return (
      <div className="mt-4 text-sm text-slate-500 dark:text-[var(--text-paragraph)] border border-dashed border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl p-6 text-center">
        No transactions yet in {currency}. Add your first income or expense above.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-tertiary)] overflow-hidden shadow-sm">
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-[var(--text-muted)] border-b border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[var(--bg-secondary)]">
        <div className="col-span-3">Description</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-2 text-right">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-[var(--border-subtle)] max-h-[420px] overflow-y-auto scrollbar-thin">
        {filteredTransactions.map((t) => {
          const category = getCategory(t.category);
          return (
            <li
              key={t.id}
              className="px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <div className="md:grid md:grid-cols-12 md:gap-2 items-center">
                <div className="md:col-span-3">
                  <div className="font-medium text-slate-900 dark:text-[var(--text-primary)]">
                    {t.description}
                  </div>
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1.5">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[var(--brand-primary)]/10 text-emerald-700 dark:text-[var(--brand-primary)] text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="md:hidden text-xs text-slate-500 dark:text-[var(--text-paragraph)] mt-0.5">
                    {category?.name ?? t.category} •{" "}
                    {formatDate(t.date)}
                  </div>
                </div>
                <div className="md:col-span-2 mt-1 md:mt-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      t.type === "income"
                        ? "bg-emerald-100 dark:bg-[var(--brand-primary)]/10 text-emerald-600 dark:text-[var(--brand-primary)] border border-emerald-200 dark:border-[var(--brand-primary)]/30"
                        : "bg-red-100 dark:bg-[var(--danger-bg)] text-red-600 dark:text-[var(--danger-text)] border border-red-200 dark:border-[var(--danger-bg)]"
                    }`}
                  >
                    {t.type === "income" ? "Income" : "Expense"}
                  </span>
                </div>
                <div className="md:col-span-2 hidden md:flex items-center gap-2 text-xs text-slate-600 dark:text-[var(--text-secondary)]">
                  {category && <CategoryIcon icon={category.icon} size={14} className="opacity-70" />}
                  <span>{category?.name ?? t.category}</span>
                </div>
                <div className="md:col-span-2 md:text-right mt-1 md:mt-0">
                  <span
                    className={`font-semibold ${
                      t.type === "income" ? "text-emerald-600 dark:text-[var(--brand-primary)]" : "text-red-600 dark:text-[var(--danger-text)]"
                    }`}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {formatAmount(t.amount, t.currency as any)}
                  </span>
                </div>
                <div className="md:col-span-2 md:text-right hidden md:block text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                  {formatDate(t.date)}
                </div>
                <div className="md:col-span-1 md:text-right mt-2 md:mt-0 flex md:block justify-end gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className="text-[11px] text-emerald-600 dark:text-[var(--brand-primary)] hover:text-emerald-700 dark:hover:text-[var(--brand-secondary)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-[11px] text-red-600 dark:text-[var(--danger-text)] hover:text-red-700 dark:hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionList;



