import React, { useMemo, useState } from "react";
import { useTransactionsContext } from "../context/TransactionsContext";
import { Transaction, TransactionCategory, TransactionType } from "../types";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import SearchFilterBar from "../components/SearchFilterBar";
import { useCurrency } from "../context/CurrencyContext";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "../utils/exportCsv";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { usePro } from "../context/ProContext";

const TransactionsPage: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactionsContext();
  const { currency } = useCurrency();
  const { theme } = useTheme();
  const { pushToast } = useToast();
  const { isProUser, setShowGoProModal, setLockedFeature } = usePro();
  const [editing, setEditing] = useState<Transaction | null>(null);
  
  // Search and filter states
  const [searchText, setSearchText] = useState("");
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [type, setType] = useState<TransactionType | "all">("all");

  const filtered = useMemo(() => {
    let result = transactions;

    // Type filter
    if (type !== "all") {
      result = result.filter((t) => t.type === type);
    }

    // Category filter
    if (category) {
      result = result.filter((t) => t.category === category);
    }

    // Search by description (case-insensitive)
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((t) =>
        t.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Amount range filter
    if (minAmount !== null) {
      result = result.filter((t) => t.amount >= minAmount);
    }
    if (maxAmount !== null) {
      result = result.filter((t) => t.amount <= maxAmount);
    }

    // Date range filter
    if (startDate) {
      result = result.filter((t) => t.date >= startDate);
    }
    if (endDate) {
      result = result.filter((t) => t.date <= endDate);
    }

    return result;
  }, [transactions, type, category, searchText, minAmount, maxAmount, startDate, endDate]);

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
      
      {/* Search and Filter Bar */}
      <SearchFilterBar
        onSearchChange={setSearchText}
        onAmountChange={(min, max) => {
          setMinAmount(min);
          setMaxAmount(max);
        }}
        onDateRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        resultCount={filtered.length}
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
              if (!isProUser) {
                setLockedFeature("PDF export");
                setShowGoProModal(true);
                return;
              }
              if (transactions.length === 0) {
                pushToast("No transactions to export.", "warning");
                return;
              }
              exportTransactionsToPdf(transactions, currency, theme);
              pushToast("PDF exported successfully.", "success");
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isProUser
                ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                : "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            }`}
          >
            <span>📑</span>
            <span className="hidden sm:inline">{isProUser ? "Export PDF" : "PDF (Pro)"}</span>
          </button>
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



