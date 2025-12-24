import React from "react";
import { useTransactionsContext } from "../context/TransactionsContext";
import { usePro } from "../context/ProContext";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import MonthlyComparisonChart from "../components/charts/MonthlyComparisonChart";
import TagSummary from "../components/TagSummary";
import { useCurrency } from "../context/CurrencyContext";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "../utils/exportCsv";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

const AnalyticsPage: React.FC = () => {
  const { transactions } = useTransactionsContext();
  const { currency } = useCurrency();
  const { theme } = useTheme();
  const { pushToast } = useToast();
  const { isProUser, setShowGoProModal, setLockedFeature } = usePro();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">Analytics</h2>
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
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdownChart transactions={transactions} />
        <MonthlyComparisonChart transactions={transactions} />
      </div>
      
      {/* Tag Summary (Pro Feature) */}
      <div className="relative">
        {!isProUser && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-900/50 rounded-2xl z-10 flex items-center justify-center backdrop-blur-sm cursor-pointer"
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



