import React, { createContext, useContext, useEffect, useState } from "react";
import { Account, AccountType } from "../types";
import { safeGet, safeSet } from "../utils/storage";

interface AccountsContextValue {
  accounts: Account[];
  addAccount: (account: Omit<Account, "id" | "balance">) => void;
  updateAccount: (id: string, account: Partial<Omit<Account, "id" | "balance">>) => void;
  deleteAccount: (id: string) => void;
  getAccount: (id: string) => Account | undefined;
  resetAccounts: () => void;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(undefined);

const ACCOUNTS_KEY = "spendory-accounts-v1";
const OLD_ACCOUNTS_KEY = "ledgerly-accounts-v1";

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

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    let stored = safeGet<Account[]>(ACCOUNTS_KEY, []);
    if (stored.length === 0) {
      stored = safeGet<Account[]>(OLD_ACCOUNTS_KEY, []);
    }
    return stored.length > 0 ? stored : defaultAccounts;
  });

  useEffect(() => {
    safeSet(ACCOUNTS_KEY, accounts);
  }, [accounts]);

  const addAccount = (account: Omit<Account, "id" | "balance">) => {
    const newAccount: Account = {
      ...account,
      id: `acc-${Date.now()}`,
      balance: 0
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const updateAccount = (
    id: string,
    account: Partial<Omit<Account, "id" | "balance">>
  ) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...account } : acc))
    );
  };

  const deleteAccount = (id: string) => {
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
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        getAccount,
        resetAccounts
      }}
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
