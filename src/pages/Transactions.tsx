import React, { useMemo, useState } from "react";
import { useTransactionsContext } from "../context/TransactionsContext";
import { Transaction } from "../types";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { useCurrency } from "../context/CurrencyContext";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "../utils/exportCsv";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

const TransactionsPage: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactionsContext();
  const { currency } = useCurrency();
  const { theme } = useTheme();
  const { pushToast } = useToast();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const handleSubmit = (tx: Omit<Transaction, "id">) => {
    if (editing) {
      updateTransaction(editing.id, tx);
      setEditing(null);
      pushToast("Transaction updated.", "success");
    } else {
      addTransaction(tx);
      pushToast("Transaction added.", "success");
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditing(tx);
  };

  const handleDelete = (id: string) => {
    if (editing && editing.id === id) {
      setEditing(null);
    }
    deleteTransaction(id);
    pushToast("Transaction deleted.", "warning");
  };

  return (
    <div className="space-y-4">
      <TransactionForm
        onSubmit={handleSubmit}
        editingTransaction={editing ?? undefined}
        onCancelEdit={() => setEditing(null)}
      />
      <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Transaction history
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (transactions.length === 0) {
                pushToast("No transactions to export.", "warning");
                return;
              }
              exportTransactionsToCsv(transactions, currency);
              pushToast("CSV exported successfully.", "success");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>📄</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (transactions.length === 0) {
                pushToast("No transactions to export.", "warning");
                return;
              }
              exportTransactionsToPdf(transactions, currency, theme);
              pushToast("PDF exported successfully.", "success");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>📑</span>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 text-[11px]">
          <button
            type="button"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              filter === "all"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              filter === "income"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            }`}
            onClick={() => setFilter("income")}
          >
            Income
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 rounded-full transition-colors ${
              filter === "expense"
                ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            }`}
            onClick={() => setFilter("expense")}
          >
            Expenses
          </button>
          </div>
        </div>
      </div>
      <TransactionList
        transactions={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TransactionsPage;



