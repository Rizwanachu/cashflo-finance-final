import React, { useState } from "react";
import { TransactionCategory, TransactionType } from "../types";

interface SearchFilterBarProps {
  onSearchChange: (search: string) => void;
  onAmountChange: (minAmount: number | null, maxAmount: number | null) => void;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  onCategoryChange: (category: TransactionCategory | null) => void;
  onTypeChange: (type: TransactionType | "all") => void;
  onTagChange?: (tag: string | null) => void;
  availableTags?: string[];
  resultCount: number;
  isProUser?: boolean;
}

const categoryLabels: Record<TransactionCategory, string> = {
  housing: "Housing",
  utilities: "Utilities",
  transport: "Transportation",
  groceries: "Groceries",
  dining: "Dining Out",
  personal: "Personal Care",
  health: "Health/Medical",
  insurance: "Insurance",
  debt: "Debt Payments",
  savings: "Savings",
  entertainment: "Entertainment",
  subscriptions: "Subscriptions",
  clothing: "Clothing",
  household: "Household",
  gifts: "Gifts",
  travel: "Travel",
  income: "Income",
  other: "Other"
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onSearchChange,
  onAmountChange,
  onDateRangeChange,
  onCategoryChange,
  onTypeChange,
  onTagChange,
  availableTags,
  resultCount,
  isProUser
}) => {
  const [searchText, setSearchText] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [type, setType] = useState<TransactionType | "all">("all");
  const [tag, setTag] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onSearchChange(value);
  };

  const handleMinAmountChange = (value: string) => {
    setMinAmount(value);
    onAmountChange(
      value ? parseFloat(value) : null,
      maxAmount ? parseFloat(maxAmount) : null
    );
  };

  const handleMaxAmountChange = (value: string) => {
    setMaxAmount(value);
    onAmountChange(
      minAmount ? parseFloat(minAmount) : null,
      value ? parseFloat(value) : null
    );
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onDateRangeChange(value || null, endDate || null);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onDateRangeChange(startDate || null, value || null);
  };

  const handleCategoryChange = (value: TransactionCategory | null) => {
    setCategory(value);
    onCategoryChange(value);
  };

  const handleTypeChange = (value: TransactionType | "all") => {
    setType(value);
    onTypeChange(value);
  };

  const handleTagChange = (value: string | null) => {
    setTag(value);
    onTagChange?.(value);
  };

  const hasActiveFilters =
    searchText ||
    minAmount ||
    maxAmount ||
    startDate ||
    endDate ||
    category ||
    type !== "all" ||
    tag;

  const handleClearFilters = () => {
    setSearchText("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setCategory(null);
    setType("all");
    setTag(null);
    onSearchChange("");
    onAmountChange(null, null);
    onDateRangeChange(null, null);
    onCategoryChange(null);
    onTypeChange("all");
    onTagChange?.(null);
  };

  return (
    <div className="space-y-3 rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search description..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-sm text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            🔍
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50 dark:bg-[var(--bg-secondary)] text-slate-700 dark:text-[var(--text-secondary)] text-xs font-medium hover:bg-slate-100 dark:hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {showAdvanced ? "Hide Filters" : "Advanced"}
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-[var(--text-paragraph)]">Advanced Filters</span>
            {availableTags && availableTags.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                Pro
              </span>
            )}
          </div>
          {/* Type and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] block mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  handleTypeChange(e.target.value as TransactionType | "all")
                }
                className="w-full rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] block mb-1.5">
                Category
              </label>
              <select
                value={category || ""}
                onChange={(e) =>
                  handleCategoryChange(
                    (e.target.value as TransactionCategory) || null
                  )
                }
                className="w-full rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Categories</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] block mb-1.5">
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                min="0"
                step="0.01"
                className="rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                min="0"
                step="0.01"
                className="rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] block mb-1.5">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tag Filter (Pro Feature) */}
          {isProUser && availableTags && availableTags.length > 0 && (
            <div>
              <label className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] block mb-1.5">
                Tags (Pro)
              </label>
              <select
                value={tag || ""}
                onChange={(e) => handleTagChange(e.target.value || null)}
                className="w-full rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] px-3 py-2 text-xs text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Tags</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
        {resultCount} transaction{resultCount !== 1 ? "s" : ""} found
      </div>
    </div>
  );
};

export default SearchFilterBar;
