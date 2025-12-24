import React, { createContext, useContext, useState, useEffect } from "react";
import { useTransactionsContext } from "./TransactionsContext";
import { safeGet, safeSet } from "../utils/storage";

interface RetentionContextValue {
  daysOpened: number;
  daysWithTransactions: number;
  consistencyBadge: string | null;
  getConsistencyMessage: () => string;
}

const RetentionContext = createContext<RetentionContextValue | undefined>(undefined);

const RETENTION_KEY = "spendory_retention";

interface RetentionData {
  daysOpened: number;
  lastOpenDate: string;
  transactionDates: string[];
}

export const RetentionProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [retention, setRetention] = useState<RetentionData>({
    daysOpened: 0,
    lastOpenDate: new Date().toISOString().slice(0, 10),
    transactionDates: []
  });
  const { transactions } = useTransactionsContext();

  // Initialize and update retention
  useEffect(() => {
    const defaultData: RetentionData = {
      daysOpened: 1,
      lastOpenDate: new Date().toISOString().slice(0, 10),
      transactionDates: []
    };
    
    const stored = safeGet<RetentionData>(RETENTION_KEY, defaultData);
    const today = new Date().toISOString().slice(0, 10);
    
    if (stored.lastOpenDate !== today) {
      stored.daysOpened += 1;
      stored.lastOpenDate = today;
    }

    setRetention(stored);
    safeSet(RETENTION_KEY, stored);
  }, []);

  // Track transaction dates
  useEffect(() => {
    const dates = new Set(transactions.map(t => t.date));
    setRetention(prev => ({
      ...prev,
      transactionDates: Array.from(dates)
    }));
  }, [transactions]);

  const daysWithTransactions = retention.transactionDates.length;
  
  let consistencyBadge: string | null = null;
  if (retention.daysOpened >= 90) consistencyBadge = "🏆 90-Day Tracker";
  else if (retention.daysOpened >= 30) consistencyBadge = "⭐ 30-Day Tracker";
  else if (retention.daysOpened >= 7) consistencyBadge = "🔥 7-Day Streak";

  const getConsistencyMessage = () => {
    if (retention.daysOpened === 1) return "Start of something great!";
    if (retention.daysOpened < 7) return `You've tracked for ${retention.daysOpened} days. Keep it up! 🎯`;
    if (retention.daysOpened === 7) return `🔥 Week 1 complete! You're on a roll!`;
    if (retention.daysOpened < 30) return `${retention.daysOpened} days strong. Nice consistency! 💪`;
    if (retention.daysOpened === 30) return `⭐ 30-day milestone! You're dedicated!`;
    if (retention.daysOpened < 90) return `${retention.daysOpened} days of tracking. Keep going! 🚀`;
    return `🏆 90+ days! You're a finance tracking pro!`;
  };

  return (
    <RetentionContext.Provider
      value={{
        daysOpened: retention.daysOpened,
        daysWithTransactions,
        consistencyBadge,
        getConsistencyMessage
      }}
    >
      {children}
    </RetentionContext.Provider>
  );
};

export function useRetention(): RetentionContextValue {
  const ctx = useContext(RetentionContext);
  if (!ctx) {
    throw new Error("useRetention must be used within RetentionProvider");
  }
  return ctx;
}
