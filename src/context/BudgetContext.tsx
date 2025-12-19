import React, { createContext, useContext, useEffect, useState } from "react";

export interface Budgets {
  overall: number | null; // monthly
  perCategory: Record<string, number | null>; // category ID -> budget amount
}

interface BudgetContextValue {
  budgets: Budgets;
  setOverallBudget: (amount: number | null) => void;
  setCategoryBudget: (categoryId: string, amount: number | null) => void;
  resetBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

const BUDGET_KEY = "ledgerly-budgets-v1";

const defaultBudgets: Budgets = {
  overall: null,
  perCategory: {}
};

function loadBudgets(): Budgets {
  if (typeof window === "undefined") return defaultBudgets;
  try {
    const raw = window.localStorage.getItem(BUDGET_KEY);
    if (!raw) return defaultBudgets;
    const parsed = JSON.parse(raw) as Budgets;
    if (!parsed || typeof parsed !== "object") return defaultBudgets;
    return {
      ...defaultBudgets,
      ...parsed,
      perCategory: { ...defaultBudgets.perCategory, ...parsed.perCategory }
    };
  } catch {
    return defaultBudgets;
  }
}

function saveBudgets(budgets: Budgets) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  } catch {
    // ignore
  }
}

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [budgets, setBudgets] = useState<Budgets>(() => loadBudgets());

  useEffect(() => {
    saveBudgets(budgets);
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
      value={{ budgets, setOverallBudget, setCategoryBudget, resetBudgets }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export function useBudgets(): BudgetContextValue {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error("useBudgets must be used within BudgetProvider");
  }
  return ctx;
}



