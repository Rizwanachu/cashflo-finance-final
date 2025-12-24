export type TransactionType = "income" | "expense";

export type TransactionCategory = string;

export type AccountType = "cash" | "bank" | "credit" | "savings" | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface RecurringRule {
  id: string;
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  dayOfMonth?: number;
  endDate?: string;
  lastGenerated?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string;
  description: string;
  accountId: string;
  currency: string;
  recurringRuleId?: string;
  isRecurring?: boolean;
}
