import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  description?: string;
  createdAt: string;
}

interface GoalsContextValue {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  resetGoals: () => void;
}

const GoalsContext = createContext<GoalsContextValue | undefined>(undefined);

const GOALS_KEY = "spendory-goals-v1";

const defaultGoals: Goal[] = [];

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [goals, setGoals] = useState<Goal[]>(() =>
    safeGet<Goal[]>(GOALS_KEY, defaultGoals)
  );

  useEffect(() => {
    safeSet(GOALS_KEY, goals);
  }, [goals]);

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
          : goal
      )
    );
  };

  const resetGoals = () => {
    setGoals(defaultGoals);
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        updateGoalProgress,
        resetGoals
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) {
    throw new Error("useGoals must be used within GoalsProvider");
  }
  return ctx;
}
