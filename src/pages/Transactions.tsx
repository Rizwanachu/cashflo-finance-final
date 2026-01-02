import React, { useMemo, useState } from "react";
import { useTransactionsContext } from "../context/TransactionsContext";
import { Transaction, TransactionCategory, TransactionType } from "../types";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import SearchFilterBar from "../components/SearchFilterBar";
import CsvImport from "../components/CsvImport";
import { Download, FileText, Upload } from "lucide-react";
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCsvImport, setShowCsvImport] = useState(false);

  // Get all unique tags (Pro feature)
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    transactions.forEach((t) => {
      t.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [transactions]);

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

    // Tag filter (Pro feature)
    if (selectedTag && isProUser) {
      result = result.filter((t) => t.tags?.includes(selectedTag));
    }

    return result;
  }, [transactions, type, category, searchText, minAmount, maxAmount, startDate, endDate, selectedTag, isProUser]);

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
        onTagChange={setSelectedTag}
        availableTags={availableTags}
        resultCount={filtered.length}
        isProUser={isProUser}
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
              if (!isProUser && transactions.length > 50) {
                setLockedFeature("CSV export for more than 50 transactions");
                setShowGoProModal(true);
                return;
              }
              exportTransactionsToCsv(transactions, currency);
              pushToast("CSV exported successfully.", "success");
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !isProUser && transactions.length > 50
                ? "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-tertiary)] text-slate-700 dark:text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="inline">{!isProUser && transactions.length > 50 ? `CSV (${transactions.length})` : "Export CSV"}</span>
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
              const themeMode = theme === "system" ? "light" : theme;
              exportTransactionsToPdf(transactions, currency, themeMode);
              pushToast("PDF exported successfully.", "success");
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isProUser
                ? "border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-tertiary)] text-slate-700 dark:text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)]"
                : "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="inline">{isProUser ? "Export PDF" : "PDF (Pro)"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCsvImport(!showCsvImport)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="inline">Import CSV</span>
          </button>
        </div>
      </div>

      {showCsvImport && (
        <CsvImport onImportComplete={() => setShowCsvImport(false)} />
      )}

      <TransactionList
        transactions={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TransactionsPage;



