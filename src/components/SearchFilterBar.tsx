import React, { useState } from "react";
import { TransactionCategory, TransactionType } from "../types";

interface SearchFilterBarProps {
  onSearchChange: (search: string) => void;
  onAmountChange: (minAmount: number | null, maxAmount: number | null) => void;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  onCategoryChange: (category: TransactionCategory | null) => void;
  onTypeChange: (type: TransactionType | "all") => void;
  resultCount: number;
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
  resultCount
}) => {
  const [searchText, setSearchText] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [type, setType] = useState<TransactionType | "all">("all");
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

  const hasActiveFilters =
    searchText ||
    minAmount ||
    maxAmount ||
    startDate ||
    endDate ||
    category ||
    type !== "all";

  const handleClearFilters = () => {
    setSearchText("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setCategory(null);
    setType("all");
    onSearchChange("");
    onAmountChange(null, null);
    onDateRangeChange(null, null);
    onCategoryChange(null);
    onTypeChange("all");
  };

  return (
    <div className="space-y-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search description..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            🔍
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          {/* Type and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  handleTypeChange(e.target.value as TransactionType | "all")
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5">
                Category
              </label>
              <select
                value={category || ""}
                onChange={(e) =>
                  handleCategoryChange(
                    (e.target.value as TransactionCategory) || null
                  )
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5">
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
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                min="0"
                step="0.01"
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
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
