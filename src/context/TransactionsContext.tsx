import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Transaction, RecurringRule } from "../types";
import { loadTransactions, saveTransactions } from "../utils/localStorage";
import { safeGet, safeSet } from "../utils/storage";

interface RecurringTransaction {
  id: string;
  rule: RecurringRule;
  transaction: Omit<Transaction, "id" | "date" | "isRecurring">;
}

interface TransactionsContextValue {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (tx: Omit<Transaction, "id" | "date" | "isRecurring">, rule: RecurringRule) => void;
  updateRecurringTransaction: (id: string, tx: Partial<Omit<Transaction, "id" | "date" | "isRecurring">>, rule?: Partial<RecurringRule>) => void;
  deleteRecurringTransaction: (id: string) => void;
  generateRecurringTransactions: () => void;
  resetTransactions: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined
);

const RECURRING_KEY = "spendory-recurring-v1";
const OLD_RECURRING_KEY = "ledgerly-recurring-v1";

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactions()
  );
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() =>
    safeGet<RecurringTransaction[]>(RECURRING_KEY, safeGet<RecurringTransaction[]>(OLD_RECURRING_KEY, []))
  );

  // Persist transactions
  useEffect(() => {
    saveTransactions(transactions);
    
    // Explicitly sync for mobile browsers on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveTransactions(transactions);
      }
    };
    
    window.addEventListener('pagehide', () => saveTransactions(transactions));
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('pagehide', () => saveTransactions(transactions));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [transactions]);

  // Persist recurring transactions
  useEffect(() => {
    safeSet(RECURRING_KEY, recurringTransactions);
  }, [recurringTransactions]);

  // Generate recurring transactions on mount and when recurring rules change
  useEffect(() => {
    if (recurringTransactions.length > 0) {
      generateRecurringTransactions();
    }
  }, []);

  const generateRecurringTransactions = useCallback(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const newTransactions: Transaction[] = [];

    recurringTransactions.forEach(({ rule, transaction }) => {
      if (rule.frequency === "monthly" && rule.dayOfMonth) {
        const nextDate = new Date(currentYear, currentMonth, rule.dayOfMonth);
        if (nextDate >= today && !transactions.some(
          (tx) => tx.accountId === transaction.accountId &&
                 tx.category === transaction.category &&
                 tx.amount === transaction.amount &&
                 new Date(tx.date).getDate() === rule.dayOfMonth
        )) {
          newTransactions.push({
            ...transaction,
            id: `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: nextDate.toISOString().split("T")[0],
            isRecurring: true,
            recurringRuleId: rule.id
          });
        }
      }
    });

    if (newTransactions.length > 0) {
      setTransactions((prev) => [...prev, ...newTransactions]);
    }
  }, [recurringTransactions, transactions]);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...tx,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, tx: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...tx, id } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addRecurringTransaction = (
    tx: Omit<Transaction, "id" | "date" | "isRecurring">,
    rule: RecurringRule
  ) => {
    const newRecurring: RecurringTransaction = {
      id: `recurring-rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rule,
      transaction: tx
    };
    setRecurringTransactions((prev) => [...prev, newRecurring]);
  };

  const updateRecurringTransaction = (
    id: string,
    tx: Partial<Omit<Transaction, "id" | "date" | "isRecurring">>,
    rule?: Partial<RecurringRule>
  ) => {
    setRecurringTransactions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              transaction: { ...r.transaction, ...tx },
              rule: rule ? { ...r.rule, ...rule } : r.rule
            }
          : r
      )
    );
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions((prev) => prev.filter((r) => r.id !== id));
  };

  const resetTransactions = () => {
    setTransactions([]);
    setRecurringTransactions([]);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        recurringTransactions,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        generateRecurringTransactions,
        resetTransactions
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return ctx;
}

export function useTransactionsContext(): TransactionsContextValue {
  return useTransactions();
}
