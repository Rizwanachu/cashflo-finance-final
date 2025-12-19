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
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setErrors({});
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setType("expense");
      setAmount("");
      setCategory("groceries");
      setDate(today);
      setDescription("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      date,
      description: description.trim(),
      currency
    });
    if (!editingTransaction) {
      const today = new Date().toISOString().slice(0, 10);
      setType("expense");
      setAmount("");
      setCategory("groceries");
      setDate(today);
      setDescription("");
    }
  };

  const isEditing = Boolean(editingTransaction);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 md:p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {isEditing ? "Edit transaction" : "Add new transaction"}
        </h2>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            Cancel edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-400">Type</label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-1">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
                type === "expense"
                  ? "bg-rose-500/20 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
                type === "income"
                  ? "bg-emerald-500/20 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Income
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-400">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-[11px] text-rose-500 dark:text-rose-400">{errors.amount}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-[11px] text-rose-500 dark:text-rose-400">{errors.category}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-400">Date</label>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          {errors.date && (
            <p className="text-[11px] text-rose-500 dark:text-rose-400">{errors.date}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-600 dark:text-slate-400">Description</label>
        <input
          type="text"
          value={description}
          maxLength={80}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g. Grocery run, rent, salary..."
          className="w-full rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
        {errors.description && (
          <p className="text-[11px] text-rose-500 dark:text-rose-400">{errors.description}</p>
        )}
      </div>
      <div className="flex justify-end pt-1">
          <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-500 dark:bg-emerald-400 text-white text-xs font-semibold shadow-sm hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
        >
          {isEditing ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;



