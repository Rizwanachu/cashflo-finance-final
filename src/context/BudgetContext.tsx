import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

export interface Budgets {
  overall: number | null;
  perCategory: Record<string, number | null>;
}

interface BudgetContextValue {
  budgets: Budgets;
  setOverallBudget: (amount: number | null) => void;
  setCategoryBudget: (categoryId: string, amount: number | null) => void;
  resetBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

const BUDGET_KEY = "spendory-budgets-v1";
const OLD_BUDGET_KEY = "ledgerly-budgets-v1";

const defaultBudgets: Budgets = {
  overall: null,
  perCategory: {}
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [budgets, setBudgets] = useState<Budgets>(() =>
    safeGet<Budgets>(BUDGET_KEY, safeGet<Budgets>(OLD_BUDGET_KEY, defaultBudgets))
  );

  useEffect(() => {
    safeSet(BUDGET_KEY, budgets);
  }, [budgets]);

  const setOverallBudget = (amount: number | null) => {
    setBudgets((prev) => ({ ...prev, overall: amount }));
  };

  const setCategoryBudget = (
    categoryId: string,
    amount: number | null
  ) => {
    setBudgets((prev) => ({
      ...prev,
      perCategory: { ...prev.perCategory, [categoryId]: amount }
    }));
  };

  const resetBudgets = () => {
    setBudgets(defaultBudgets);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        setOverallBudget,
        setCategoryBudget,
        resetBudgets
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error("useBudget must be used within BudgetProvider");
  }
  return ctx;
}

export function useBudgets(): BudgetContextValue {
  return useBudget();
}
