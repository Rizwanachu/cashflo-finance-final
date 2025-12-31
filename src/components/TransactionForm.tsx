import React, { useEffect, useState } from "react";
import {
  Transaction,
  TransactionCategory,
  TransactionType
} from "../types";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";

interface Props {
  onSubmit: (tx: Omit<Transaction, "id">) => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
}

interface Errors {
  amount?: string;
  date?: string;
  category?: string;
  description?: string;
}

const categories: { value: TransactionCategory; label: string }[] = [
  { value: "housing", label: "Housing" },
  { value: "utilities", label: "Utilities" },
  { value: "transport", label: "Transportation" },
  { value: "groceries", label: "Food/Groceries" },
  { value: "dining", label: "Dining Out" },
  { value: "personal", label: "Personal Care" },
  { value: "health", label: "Health/Medical" },
  { value: "insurance", label: "Insurance" },
  { value: "debt", label: "Debt Payments" },
  { value: "savings", label: "Savings/Investments" },
  { value: "entertainment", label: "Entertainment" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "clothing", label: "Clothing/Apparel" },
  { value: "household", label: "Household Supplies" },
  { value: "gifts", label: "Gifts/Donations" },
  { value: "travel", label: "Travel/Vacation" },
  { value: "income", label: "Income" },
  { value: "other", label: "Other" }
];

const TransactionForm: React.FC<Props> = ({
  onSubmit,
  editingTransaction,
  onCancelEdit
}) => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setTags(editingTransaction.tags || []);
      setTagsInput(editingTransaction.tags?.join(", ") || "");
      setErrors({});
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setType("expense");
      setAmount("");
      setCategory("groceries");
      setDate(today);
      setDescription("");
      setTags([]);
      setTagsInput("");
      setErrors({});
    }
  }, [editingTransaction]);

  const validate = (): boolean => {
    const next: Errors = {};
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      next.amount = "Enter a positive amount";
    }
    if (!date) {
      next.date = "Select a date";
    }
    if (!category) {
      next.category = "Choose a category";
    }
    if (!description.trim()) {
      next.description = "Add a short description";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAddTag = (tagText: string) => {
    const trimmed = tagText.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagsInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      date,
      description: description.trim(),
      currency,
      tags: tags.length > 0 ? tags : undefined
    });
    if (!editingTransaction) {
      const today = new Date().toISOString().slice(0, 10);
      setType("expense");
      setAmount("");
      setCategory("groceries");
      setDate(today);
      setDescription("");
      setTags([]);
      setTagsInput("");
    }
  };

  const isEditing = Boolean(editingTransaction);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 md:p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)]">
          {isEditing ? "Edit transaction" : "Add new transaction"}
        </h2>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 dark:text-[var(--text-secondary)] hover:text-slate-700 dark:hover:text-[var(--text-primary)]"
          >
            Cancel edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Type</label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] p-1">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
                type === "expense"
                  ? "bg-rose-500/20 dark:bg-[var(--danger-bg)] text-rose-600 dark:text-[var(--danger-text)]"
                  : "text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
                type === "income"
                  ? "bg-zinc-100 dark:bg-[var(--brand-primary)]/10 text-zinc-900 dark:text-[var(--brand-primary)]"
                  : "text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-900 dark:hover:text-[var(--text-primary)]"
              }`}
            >
              Income
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl bg-white dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-2 text-sm text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-[11px] text-rose-500 dark:text-[var(--danger-text)]">{errors.amount}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full rounded-xl bg-white dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-2 text-sm text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-[11px] text-rose-500 dark:text-[var(--danger-text)]">{errors.category}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Date</label>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-white dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-2 text-sm text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
          {errors.date && (
            <p className="text-[11px] text-rose-500 dark:text-[var(--danger-text)]">{errors.date}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Description</label>
        <input
          type="text"
          value={description}
          maxLength={80}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g. Grocery run, rent, salary..."
          className="w-full rounded-xl bg-white dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-2 text-sm text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
        />
        {errors.description && (
          <p className="text-[11px] text-rose-500 dark:text-[var(--danger-text)]">{errors.description}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)]">Tags (optional)</label>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-[var(--brand-primary)]/10 text-emerald-700 dark:text-[var(--brand-primary)] text-[11px] font-medium"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-emerald-900 dark:hover:text-[var(--brand-secondary)] font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddTag(tagsInput);
              }
            }}
            placeholder="Add tag and press Enter..."
            className="flex-1 rounded-xl bg-white dark:bg-[var(--bg-secondary)] border border-slate-200 dark:border-[var(--border-subtle)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
          <button
            type="button"
            onClick={() => handleAddTag(tagsInput)}
            className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-[var(--brand-primary)]/10 text-emerald-700 dark:text-[var(--brand-primary)] text-xs font-medium hover:bg-emerald-200 dark:hover:bg-[var(--brand-primary)]/20"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex justify-end pt-1">
          <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-100 dark:hover:bg-gray-200 text-slate-900 dark:text-slate-900 text-xs font-semibold shadow-sm transition-colors"
        >
          {isEditing ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;



