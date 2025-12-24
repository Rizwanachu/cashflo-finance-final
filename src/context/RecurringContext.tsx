import React, { createContext, useContext, useEffect, useState } from "react";

export interface RecurringPayment {
  id: string;
  description: string;
  amount: number;
  nextDueDate: string; // ISO date
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  category: string;
  isActive: boolean;
}

interface RecurringContextValue {
  payments: RecurringPayment[];
  addPayment: (payment: Omit<RecurringPayment, "id">) => void;
  updatePayment: (id: string, payment: Partial<Omit<RecurringPayment, "id">>) => void;
  deletePayment: (id: string) => void;
  togglePayment: (id: string) => void;
  resetPayments: () => void;
}

const RecurringContext = createContext<RecurringContextValue | undefined>(undefined);

const RECURRING_KEY = "cashflo-recurring-v1";

function loadPayments(): RecurringPayment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECURRING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecurringPayment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePayments(payments: RecurringPayment[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECURRING_KEY, JSON.stringify(payments));
  } catch {
    // ignore
  }
}

export const RecurringProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [payments, setPayments] = useState<RecurringPayment[]>(() => loadPayments());

  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  const addPayment = (payment: Omit<RecurringPayment, "id">) => {
    const newPayment: RecurringPayment = {
      ...payment,
      id: crypto.randomUUID()
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const updatePayment = (id: string, updates: Partial<Omit<RecurringPayment, "id">>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const resetPayments = () => {
    setPayments([]);
  };

  return (
    <RecurringContext.Provider
      value={{ payments, addPayment, updatePayment, deletePayment, togglePayment, resetPayments }}
    >
      {children}
    </RecurringContext.Provider>
  );
};

export function useRecurring(): RecurringContextValue {
  const ctx = useContext(RecurringContext);
  if (!ctx) {
    throw new Error("useRecurring must be used within RecurringProvider");
  }
  return ctx;
}

