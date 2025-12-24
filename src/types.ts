export type TransactionType = "income" | "expense";

export type TransactionCategory = string; // Now supports custom categories

export type AccountType = "cash" | "bank" | "credit" | "savings" | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface RecurringRule {
  frequency: "daily" | "weekly" | "monthly";
  interval: number; // e.g., every 2 weeks = interval: 2
  endDate?: string; // ISO YYYY-MM-DD, optional
  lastGenerated?: string; // ISO YYYY-MM-DD, last time we generated
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // ISO YYYY-MM-DD
  description: string;
  accountId: string;
  currency: string;
  recurringRuleId?: string; // If this is part of a recurring transaction
  isRecurring?: boolean; // If this was auto-generated
}




