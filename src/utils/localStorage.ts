import { Transaction } from "../types";
import { migrateOldTransactions, needsMigration } from "./migration";

const STORAGE_KEY = "spendory-transactions-v1";
const FALLBACK_KEY = "ledgerly-transactions-v1";
const VERY_OLD_KEY = "finance-tracker-transactions-v1";

/**
 * Load transactions from LocalStorage.
 * Returns EMPTY array for first-time users (no seed data).
 */
export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    // 1. Try new Spendory key
    let raw = window.localStorage.getItem(STORAGE_KEY);
    
    // 2. Try Ledgerly fallback
    if (!raw) {
      raw = window.localStorage.getItem(FALLBACK_KEY);
    }

    // 3. Try very old Finance Tracker key
    if (!raw) {
      raw = window.localStorage.getItem(VERY_OLD_KEY);
    }
    
    // If no data exists, return empty array (first-time user)
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Transaction[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    // Ensure all transactions have required fields (migration for old data)
    const normalized = parsed.map((tx) => ({
      ...tx,
      accountId: tx.accountId || "default",
      currency: tx.currency || "USD",
      recurringRuleId: tx.recurringRuleId,
      isRecurring: tx.isRecurring || false
    }));
    
    return normalized;
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // ignore
  }
}
