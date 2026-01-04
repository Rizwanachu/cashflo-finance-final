import React, { useMemo } from "react";
import { useTransactionsContext } from "../context/TransactionsContext";
import { usePro } from "../context/ProContext";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import MonthlyComparisonChart from "../components/charts/MonthlyComparisonChart";
import TagSummary from "../components/TagSummary";
import MonthlySummary from "../components/MonthlySummary";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { exportAnalyticsToCsv, exportAnalyticsToPdf } from "../utils/exportCsv";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useBudgets } from "../context/BudgetContext";
import { useCategories } from "../context/CategoriesContext";

const AnalyticsPage: React.FC = () => {
  const { transactions } = useTransactionsContext();
  const { currency } = useCurrency();
  const { theme } = useTheme();
  const { pushToast } = useToast();
  const { isProUser, setShowGoProModal, setLockedFeature } = usePro();
  const { budgets } = useBudgets();
  const { categories } = useCategories();

  const [isExporting, setIsExporting] = React.useState(false);

  // Compute effective dark mode - checks actual HTML state
  const isDarkMode =
    theme === "dark" ? true :
    theme === "light" ? false :
    // System mode - check HTML class (most accurate)
    typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? true :
    // Fallback to prefers-color-scheme
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? true :
    false;

  const handleExport = async (type: "csv" | "pdf") => {
    if (transactions.length === 0) {
      pushToast("No data to export.", "warning");
      return;
    }

    setIsExporting(true);
    try {
      if (type === "csv") {
        if (!isProUser && transactions.length > 50) {
          setLockedFeature("Export for more than 50 transactions");
          setShowGoProModal(true);
          return;
        }
        exportAnalyticsToCsv(transactions, budgets, categories, currency);
        pushToast("Analytics CSV exported successfully.", "success");
      } else {
        if (!isProUser) {
          setLockedFeature("Detailed Analytics PDF");
          setShowGoProModal(true);
          return;
        }
        exportAnalyticsToPdf(transactions, budgets, categories, currency);
        pushToast("Analytics PDF exported successfully.", "success");
      }
    } catch (error) {
      pushToast("Export failed. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">Analytics</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport("csv")}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !isProUser && transactions.length > 50
                ? "border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/20"
                : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span className="inline">{!isProUser && transactions.length > 50 ? `CSV (${transactions.length})` : "CSV Report"}</span>
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport("pdf")}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isProUser
                ? "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                : "border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/20"
            }`}
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span className="inline">{isProUser ? "PDF Report" : "PDF (Pro)"}</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdownChart transactions={transactions} />
        <MonthlyComparisonChart transactions={transactions} />
      </div>

      {/* Monthly & Yearly Summaries (Pro Feature) */}
      <div className="relative">
        {!isProUser && (
          <div
            className={`absolute inset-0 rounded-2xl z-10 flex items-center justify-center backdrop-blur-sm cursor-pointer ${
              isDarkMode ? "bg-black/60" : "bg-black/40"
            }`}
            onClick={() => {
              setLockedFeature("Time-based insights");
              setShowGoProModal(true);
            }}
          >
            <div className="text-center">
              <p className="text-white font-semibold text-sm">⭐ Pro Feature</p>
              <p className="text-white/80 text-xs mt-1">Upgrade to unlock time-based insights</p>
            </div>
          </div>
        )}
        <MonthlySummary transactions={transactions} />
      </div>
      
      {/* Tag Summary (Pro Feature) */}
      <div className="relative">
        {!isProUser && (
          <div
            className={`absolute inset-0 rounded-2xl z-10 flex items-center justify-center backdrop-blur-sm cursor-pointer ${
              isDarkMode ? "bg-black/60" : "bg-black/40"
            }`}
            onClick={() => {
              setLockedFeature("Tag Analytics");
              setShowGoProModal(true);
            }}
          >
            <div className="text-center">
              <p className="text-white font-semibold text-sm">⭐ Pro Feature</p>
              <p className="text-white/80 text-xs mt-1">Upgrade to see tag-based analytics</p>
            </div>
          </div>
        )}
        <TagSummary transactions={transactions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;



