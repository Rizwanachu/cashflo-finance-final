/**
 * Migration utilities for upgrading old data formats
 */

import { Transaction } from "../types";

const OLD_STORAGE_KEY = "finance-tracker-transactions-v1";
const NEW_STORAGE_KEY = "ledgerly-transactions-v1";

/**
 * Migrate old transactions to new format (add accountId and currency)
 */
export function migrateOldTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  
  try {
    const oldData = window.localStorage.getItem(OLD_STORAGE_KEY);
    if (!oldData) return [];
    
    const oldTransactions = JSON.parse(oldData) as any[];
    if (!Array.isArray(oldTransactions)) return [];
    
    // Migrate to new format
    const migrated = oldTransactions.map((tx) => ({
      ...tx,
      accountId: "acc-cash", // Default to Cash account
      currency: "USD", // Default currency
      recurringRuleId: undefined,
      isRecurring: false
    }));
    
    // Save to new key
    window.localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(migrated));
    
    // Optionally remove old key (keep for now in case of rollback)
    // window.localStorage.removeItem(OLD_STORAGE_KEY);
    
    return migrated;
  } catch {
    return [];
  }
}

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  if (typeof window === "undefined") return false;
  const hasNew = window.localStorage.getItem(NEW_STORAGE_KEY);
  const hasOld = window.localStorage.getItem(OLD_STORAGE_KEY);
  return !hasNew && !!hasOld;
}

