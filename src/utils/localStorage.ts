import { Transaction } from "../types";

const STORAGE_KEY = "spendory-transactions-v1";

/**
 * Load transactions from LocalStorage.
 * Returns EMPTY array for first-time users (no seed data).
 */
export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    
    if (!raw) return [];
    
    const transactions = JSON.parse(raw);
    
    if (!Array.isArray(transactions)) return [];
    
    return transactions.map((tx: any) => ({
      ...tx,
      accountId: tx.accountId || "default",
      currency: tx.currency || "USD",
      isRecurring: tx.isRecurring || false,
      date: tx.date || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Load transactions error:", error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Save transactions error:", error);
  }
}
