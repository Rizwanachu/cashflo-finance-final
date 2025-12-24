import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

interface CategoriesContextValue {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "isDefault">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  resetCategories: () => void;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

const CATEGORIES_KEY = "ledgerly-categories-v1";

const defaultCategories: Category[] = [
  { id: "cat-housing", name: "Housing", icon: "🏠", color: "#6366F1", isDefault: true },
  { id: "cat-utilities", name: "Utilities", icon: "💡", color: "#EF4444", isDefault: true },
  { id: "cat-transport", name: "Transportation", icon: "🚗", color: "#F59E0B", isDefault: true },
  { id: "cat-groceries", name: "Food/Groceries", icon: "🛒", color: "#10B981", isDefault: true },
  { id: "cat-dining", name: "Dining Out", icon: "🍽️", color: "#EC4899", isDefault: true },
  { id: "cat-personal", name: "Personal Care", icon: "💅", color: "#8B5CF6", isDefault: true },
  { id: "cat-health", name: "Health/Medical", icon: "🏥", color: "#14B8A6", isDefault: true },
  { id: "cat-insurance", name: "Insurance", icon: "🛡️", color: "#0EA5E9", isDefault: true },
  { id: "cat-debt", name: "Debt Payments", icon: "💳", color: "#F43F5E", isDefault: true },
  { id: "cat-savings", name: "Savings/Investments", icon: "💰", color: "#22C55E", isDefault: true },
  { id: "cat-entertainment", name: "Entertainment", icon: "🎬", color: "#A855F7", isDefault: true },
  { id: "cat-subscriptions", name: "Subscriptions", icon: "📱", color: "#3B82F6", isDefault: true },
  { id: "cat-clothing", name: "Clothing/Apparel", icon: "👕", color: "#F97316", isDefault: true },
  { id: "cat-household", name: "Household Supplies", icon: "🧹", color: "#84CC16", isDefault: true },
  { id: "cat-gifts", name: "Gifts/Donations", icon: "🎁", color: "#E879F9", isDefault: true },
  { id: "cat-travel", name: "Travel/Vacation", icon: "✈️", color: "#06B6D4", isDefault: true },
  { id: "cat-income", name: "Income", icon: "💵", color: "#10B981", isDefault: true },
  { id: "cat-other", name: "Other", icon: "📦", color: "#64748B", isDefault: true },
];

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = safeGet<Category[]>(CATEGORIES_KEY, []);
    if (stored.length === 0) return defaultCategories;
    const merged = [...defaultCategories];
    stored.forEach((cat) => {
      if (!cat.isDefault && !merged.find((c) => c.id === cat.id)) {
        merged.push(cat);
      }
    });
    return merged;
  });

  useEffect(() => {
    safeSet(CATEGORIES_KEY, categories);
  }, [categories]);

  const addCategory = (category: Omit<Category, "id" | "isDefault">) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      isDefault: false
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const getCategory = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  const resetCategories = () => {
    setCategories(defaultCategories);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategory,
        resetCategories
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategories(): CategoriesContextValue {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return ctx;
}
