import React, { createContext, useContext, useEffect, useState } from "react";
import { Account, AccountType } from "../types";

interface AccountsContextValue {
  accounts: Account[];
  addAccount: (account: Omit<Account, "id" | "balance">) => void;
  updateAccount: (id: string, account: Partial<Omit<Account, "id" | "balance">>) => void;
  deleteAccount: (id: string) => void;
  getAccount: (id: string) => Account | undefined;
  resetAccounts: () => void;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(undefined);

const ACCOUNTS_KEY = "ledgerly-accounts-v1";

// Default accounts created only when user adds first transaction
const defaultAccounts: Account[] = [
  {
    id: "acc-cash",
    name: "Cash",
    type: "cash",
    balance: 0,
    currency: "USD"
  },
  {
    id: "acc-bank",
    name: "Bank Account",
    type: "bank",
    balance: 0,
    currency: "USD"
  },
  {
    id: "acc-credit",
    name: "Credit Card",
    type: "credit",
    balance: 0,
    currency: "USD"
  }
];

/**
 * Load accounts from LocalStorage.
 * Returns default accounts structure (no balances) for first-time users.
 */
function loadAccounts(): Account[] {
  if (typeof window === "undefined") return defaultAccounts;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      // First time - return defaults but don't save yet
      return defaultAccounts;
    }
    const parsed = JSON.parse(raw) as Account[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultAccounts;
    }
    return parsed;
  } catch {
    return defaultAccounts;
  }
}

function saveAccounts(accounts: Account[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());

  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  const addAccount = (account: Omit<Account, "id" | "balance">) => {
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
      balance: 0
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Omit<Account, "id" | "balance">>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  };

  const deleteAccount = (id: string) => {
    // Don't allow deleting if it's the last account
    if (accounts.length <= 1) return;
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const getAccount = (id: string) => {
    return accounts.find((acc) => acc.id === id);
  };

  const resetAccounts = () => {
    setAccounts(defaultAccounts);
  };

  return (
    <AccountsContext.Provider
      value={{ accounts, addAccount, updateAccount, deleteAccount, getAccount, resetAccounts }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export function useAccounts(): AccountsContextValue {
  const ctx = useContext(AccountsContext);
  if (!ctx) {
    throw new Error("useAccounts must be used within AccountsProvider");
  }
  return ctx;
}

