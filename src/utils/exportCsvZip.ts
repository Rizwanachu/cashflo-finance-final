import JSZip from "jszip";

/**
 * BRAND NEW CSV/ZIP Export system for Spendory
 */

interface CsvConfig {
  filename: string;
  headers: string[];
  data: any[];
  keyMap: Record<string, string>;
}

const STORAGE_KEYS = {
  transactions: "spendory-transactions-v1",
  accounts: "spendory-accounts-v1",
  budgets: "spendory-budgets-v1",
  goals: "spendory-goals-v1",
  categories: "spendory-categories-v1",
  recurring: "spendory-recurring-v1",
  settings_theme: "spendory-theme-v1",
  settings_privacy: "spendory-privacy-mode-v1",
  settings_currency: "spendory-currency-v2",
  onboarding: "spendory-onboarding-v1"
};

/**
 * Escapes CSV values to handle commas, quotes, and newlines
 */
function escapeCsv(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Converts data array to CSV string
 */
function convertToCsv(config: CsvConfig): string {
  const headerRow = config.headers.join(",");
  const rows = config.data.map((item) => {
    return config.headers
      .map((header) => {
        const key = config.keyMap[header] || header;
        let value = item[key];
        
        // Handle special formatting if needed (like tags array)
        if (header === "tags" && Array.isArray(value)) {
          value = value.join(";");
        }
        
        return escapeCsv(value);
      })
      .join(",");
  });
  
  return [headerRow, ...rows].join("\n");
}

/**
 * Exports all data as a ZIP of CSVs
 */
export async function exportZipBackup() {
  const zip = new JSZip();
  const now = new Date();
  
  // 1. Transactions
  const transactionsRaw = localStorage.getItem(STORAGE_KEYS.transactions);
  const transactions = transactionsRaw ? JSON.parse(transactionsRaw) : [];
  zip.file("transactions.csv", convertToCsv({
    filename: "transactions.csv",
    headers: ["id", "type", "amount", "currency", "categoryId", "accountId", "date", "description", "tags", "isRecurring"],
    data: Array.isArray(transactions) ? transactions : [],
    keyMap: { categoryId: "category" } // Map 'category' internal to 'categoryId' CSV
  }));
  
  // 2. Accounts
  const accountsRaw = localStorage.getItem(STORAGE_KEYS.accounts);
  const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
  zip.file("accounts.csv", convertToCsv({
    filename: "accounts.csv",
    headers: ["id", "name", "type", "balance", "currency"],
    data: Array.isArray(accounts) ? accounts : [],
    keyMap: {}
  }));
  
  // 3. Budgets
  const budgetsRaw = localStorage.getItem(STORAGE_KEYS.budgets);
  const budgetsData = budgetsRaw ? JSON.parse(budgetsRaw) : { perCategory: {} };
  const budgetsRows = Object.entries(budgetsData.perCategory || {}).map(([catId, amount]) => ({
    id: `budget-${catId}`,
    categoryId: catId,
    limit: amount,
    period: "monthly"
  }));
  zip.file("budgets.csv", convertToCsv({
    filename: "budgets.csv",
    headers: ["id", "categoryId", "limit", "period"],
    data: budgetsRows,
    keyMap: {}
  }));
  
  // 4. Goals
  const goalsRaw = localStorage.getItem(STORAGE_KEYS.goals);
  const goals = goalsRaw ? JSON.parse(goalsRaw) : [];
  zip.file("goals.csv", convertToCsv({
    filename: "goals.csv",
    headers: ["id", "name", "targetAmount", "currentAmount", "category", "deadline", "description", "createdAt"],
    data: Array.isArray(goals) ? goals : [],
    keyMap: {}
  }));
  
  // 5. Categories
  const categoriesRaw = localStorage.getItem(STORAGE_KEYS.categories);
  const categories = categoriesRaw ? JSON.parse(categoriesRaw) : [];
  zip.file("categories.csv", convertToCsv({
    filename: "categories.csv",
    headers: ["id", "name", "icon", "color", "isDefault"],
    data: Array.isArray(categories) ? categories : [],
    keyMap: {}
  }));
  
  // 6. Recurring
  const recurringRaw = localStorage.getItem(STORAGE_KEYS.recurring);
  const recurring = recurringRaw ? JSON.parse(recurringRaw) : [];
  zip.file("recurring.csv", convertToCsv({
    filename: "recurring.csv",
    headers: ["id", "description", "amount", "currency", "categoryId", "nextDueDate", "frequency", "isActive"],
    data: Array.isArray(recurring) ? recurring : [],
    keyMap: { categoryId: "category" }
  }));
  
  // 7. Settings
  const settingsRows = [
    { key: "theme", value: localStorage.getItem(STORAGE_KEYS.settings_theme) || "system" },
    { key: "privacy_mode", value: localStorage.getItem(STORAGE_KEYS.settings_privacy) || "false" },
    { key: "currency", value: localStorage.getItem(STORAGE_KEYS.settings_currency) || "USD" }
  ];
  zip.file("settings.csv", convertToCsv({
    filename: "settings.csv",
    headers: ["key", "value"],
    data: settingsRows,
    keyMap: {}
  }));
  
  // 8. Onboarding
  const onboardingValue = localStorage.getItem(STORAGE_KEYS.onboarding);
  zip.file("onboarding.csv", convertToCsv({
    filename: "onboarding.csv",
    headers: ["key", "value"],
    data: [{ key: "completed", value: onboardingValue || "false" }],
    keyMap: {}
  }));
  
  // 9. Metadata
  zip.file("metadata.csv", convertToCsv({
    filename: "metadata.csv",
    headers: ["app", "version", "exportedAt", "timezone"],
    data: [{
      app: "Spendory",
      version: "1.0.0",
      exportedAt: now.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }],
    keyMap: {}
  }));
  
  // Generate and download ZIP
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  const dateStr = now.toISOString().split("T")[0];
  link.download = `spendory-backup-${dateStr}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
