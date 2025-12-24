import React, { createContext, useContext } from "react";
import { useTransactionsContext } from "./TransactionsContext";
import { usePro } from "./ProContext";

interface FreeLimitsContextValue {
  transactionCount: number;
  transactionLimit: number;
  hasReachedLimit: boolean;
  visibleHistoryMonths: number;
  oldestVisibleDate: string | null;
}

const FreeLimitsContext = createContext<FreeLimitsContextValue | undefined>(
  undefined
);

const FREE_TRANSACTION_LIMIT = 50;
const FREE_HISTORY_MONTHS = 12;

export const FreeLimitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { transactions } = useTransactionsContext();
  const { isProUser } = usePro();

  const transactionCount = transactions.length;
  const transactionLimit = isProUser ? Infinity : FREE_TRANSACTION_LIMIT;
  const hasReachedLimit = !isProUser && transactionCount >= FREE_TRANSACTION_LIMIT;

  // Calculate oldest visible date
  const now = new Date();
  const oldestDate = new Date(now.getFullYear(), now.getMonth() - FREE_HISTORY_MONTHS, 1);
  const oldestVisibleDate = isProUser ? null : oldestDate.toISOString().slice(0, 10);

  const value: FreeLimitsContextValue = {
    transactionCount,
    transactionLimit,
    hasReachedLimit,
    visibleHistoryMonths: FREE_HISTORY_MONTHS,
    oldestVisibleDate
  };

  return (
    <FreeLimitsContext.Provider value={value}>
      {children}
    </FreeLimitsContext.Provider>
  );
};

export function useFreeLimits(): FreeLimitsContextValue {
  const ctx = useContext(FreeLimitsContext);
  if (!ctx) {
    throw new Error("useFreeLimits must be used within FreeLimitsProvider");
  }
  return ctx;
}
