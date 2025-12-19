import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Transaction, RecurringRule } from "../types";
import { loadTransactions, saveTransactions } from "../utils/localStorage";

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

const RECURRING_KEY = "ledgerly-recurring-v1";

function loadRecurringTransactions(): RecurringTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECURRING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecurringTransaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecurringTransactions(recurring: RecurringTransaction[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECURRING_KEY, JSON.stringify(recurring));
  } catch {
    // ignore
  }
}

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactions()
  );
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() =>
    loadRecurringTransactions()
  );

  // Persist transactions
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Persist recurring transactions
  useEffect(() => {
    saveRecurringTransactions(recurringTransactions);
  }, [recurringTransactions]);

  // Generate recurring transactions on mount and when recurring rules change
  useEffect(() => {
    // Only generate if we have recurring transactions
    if (recurringTransactions.length > 0) {
      generateRecurringTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringTransactions.length]);

  const generateRecurringTransactions = useCallback(() => {
    setTransactions((prevTransactions) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newTransactions: Transaction[] = [];
      const updatedRecurring: RecurringTransaction[] = [];

      recurringTransactions.forEach((recurring) => {
        const { rule, transaction } = recurring;
        const lastGenerated = rule.lastGenerated
          ? new Date(rule.lastGenerated + "T00:00:00")
          : null;

        // Calculate next date
        let nextDate = new Date(today);
        if (lastGenerated) {
          nextDate = new Date(lastGenerated);
          if (rule.frequency === "daily") {
            nextDate.setDate(nextDate.getDate() + rule.interval);
          } else if (rule.frequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7 * rule.interval);
          } else if (rule.frequency === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + rule.interval);
          }
        }

        let currentLastGenerated = rule.lastGenerated;

        // Check if we need to generate (only generate up to today)
        while (nextDate <= today) {
          const nextDateStr = nextDate.toISOString().slice(0, 10);
          
          // Check if already generated
          const exists = prevTransactions.some(
            (t) =>
              t.recurringRuleId === recurring.id &&
              t.date === nextDateStr
          );

          if (!exists) {
            newTransactions.push({
              ...transaction,
              id: crypto.randomUUID(),
              date: nextDateStr,
              isRecurring: true,
              recurringRuleId: recurring.id
            });
          }

          currentLastGenerated = nextDateStr;

          // Calculate next
          if (rule.frequency === "daily") {
            nextDate.setDate(nextDate.getDate() + rule.interval);
          } else if (rule.frequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7 * rule.interval);
          } else if (rule.frequency === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + rule.interval);
          }

          // Check end date
          if (rule.endDate && nextDate > new Date(rule.endDate + "T00:00:00")) {
            break;
          }
        }

        // Update lastGenerated if changed
        if (currentLastGenerated !== rule.lastGenerated) {
          updatedRecurring.push({
            ...recurring,
            rule: { ...rule, lastGenerated: currentLastGenerated }
          });
        } else {
          updatedRecurring.push(recurring);
        }
      });

      // Update recurring transactions if needed
      if (updatedRecurring.some((r, i) => r.rule.lastGenerated !== recurringTransactions[i]?.rule.lastGenerated)) {
        setRecurringTransactions(updatedRecurring);
      }

      return newTransactions.length > 0 ? [...newTransactions, ...prevTransactions] : prevTransactions;
    });
  }, [recurringTransactions]);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID()
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, tx: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? { ...tx, id } : item))
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
      id: crypto.randomUUID(),
      rule,
      transaction: tx
    };
    setRecurringTransactions((prev) => [...prev, newRecurring]);
  };

  const updateRecurringTransaction = (
    id: string,
    txUpdates: Partial<Omit<Transaction, "id" | "date" | "isRecurring">>,
    ruleUpdates?: Partial<RecurringRule>
  ) => {
    setRecurringTransactions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              transaction: { ...r.transaction, ...txUpdates },
              rule: { ...r.rule, ...ruleUpdates }
            }
          : r
      )
    );
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions((prev) => prev.filter((r) => r.id !== id));
    // Also delete all generated transactions from this rule
    setTransactions((prev) => prev.filter((t) => t.recurringRuleId !== id));
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

export function useTransactionsContext(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactionsContext must be used within TransactionsProvider");
  }
  return ctx;
}



