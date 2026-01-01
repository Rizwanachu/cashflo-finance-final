import JSZip from "jszip";

/**
 * BRAND NEW CSV-based restore engine for Spendory
 * This engine completely replaces all previous restore logic.
 */

const STORAGE_KEYS = {
  categories: "spendory-categories-v1",
  accounts: "spendory-accounts-v1",
  goals: "spendory-goals-v1",
  transactions: "spendory-transactions-v1",
  budgets: "spendory-budgets-v1",
  recurring: "spendory-recurring-v1",
  theme: "spendory-theme-v1",
  privacy: "spendory-privacy-mode-v1",
  currency: "spendory-currency-v2",
  onboarding: "spendory-onboarding-v1"
};

const EXPECTED_HEADERS: Record<string, string[]> = {
  "categories.csv": ["id", "name", "icon", "color", "isDefault"],
  "accounts.csv": ["id", "name", "type", "balance", "currency"],
  "goals.csv": ["id", "name", "targetAmount", "currentAmount", "category", "deadline", "description", "createdAt"],
  "transactions.csv": ["id", "type", "amount", "currency", "categoryId", "accountId", "date", "description", "tags", "isRecurring"],
  "budgets.csv": ["id", "categoryId", "limit", "period"],
  "recurring.csv": ["id", "description", "amount", "currency", "categoryId", "nextDueDate", "frequency", "isActive"],
  "settings.csv": ["key", "value"],
  "onboarding.csv": ["key", "value"]
};

/**
 * Safe CSV Parser
 */
function parseCsv(content: string, filename: string): { headers: string[], rows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
  
  const rows = lines.slice(1).map((line, index) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    if (values.length !== headers.length) {
      throw new Error(`Invalid row at ${filename}:${index + 2}. Expected ${headers.length} columns, found ${values.length}.`);
    }

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i];
    });
    return row;
  });

  return { headers, rows };
}

/**
 * Atomic Restore Engine
 */
export async function restoreFromCsvZip(zipFile: File): Promise<{ success: boolean; error?: string }> {
  try {
    (window as any).spendoryRestoreInProgress = true;
    const zip = await JSZip.loadAsync(zipFile);
    const staging: Record<string, any> = {};

    const restoreOrder = [
      "categories.csv",
      "accounts.csv",
      "goals.csv",
      "transactions.csv",
      "budgets.csv",
      "recurring.csv",
      "settings.csv",
      "onboarding.csv"
    ];

    for (const filename of restoreOrder) {
      const file = zip.file(filename);
      if (!file) {
        console.warn(`[Restore] Missing file ${filename}, skipping.`);
        continue;
      }

      const content = await file.async("string");
      const { headers, rows } = parseCsv(content, filename);

      const expected = EXPECTED_HEADERS[filename];
      if (!expected.every(h => headers.includes(h))) {
        throw new Error(`Invalid headers in ${filename}. Expected: ${expected.join(", ")}`);
      }

      const dataKey = filename.replace(".csv", "");
      switch (dataKey) {
        case "categories":
          staging[STORAGE_KEYS.categories] = rows.map(r => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
            color: r.color,
            isDefault: r.isDefault === "true"
          }));
          break;
        case "accounts":
          staging[STORAGE_KEYS.accounts] = rows.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            balance: Number(r.balance),
            currency: r.currency
          }));
          break;
        case "goals":
          staging[STORAGE_KEYS.goals] = rows.map(r => ({
            id: r.id,
            name: r.name,
            targetAmount: Number(r.targetAmount),
            currentAmount: Number(r.currentAmount),
            category: r.category,
            deadline: r.deadline,
            description: r.description,
            createdAt: r.createdAt
          }));
          break;
        case "transactions":
          staging[STORAGE_KEYS.transactions] = rows.map(r => ({
            id: r.id,
            type: r.type,
            amount: Number(r.amount),
            currency: r.currency,
            category: r.categoryId,
            accountId: r.accountId,
            date: r.date,
            description: r.description,
            tags: r.tags ? r.tags.split(";") : [],
            isRecurring: r.isRecurring === "true"
          }));
          break;
        case "budgets":
          const budgets: Record<string, number> = {};
          rows.forEach(r => {
            budgets[r.categoryId] = Number(r.limit);
          });
          staging[STORAGE_KEYS.budgets] = { perCategory: budgets };
          break;
        case "recurring":
          staging[STORAGE_KEYS.recurring] = rows.map(r => ({
            id: r.id,
            description: r.description,
            amount: Number(r.amount),
            currency: r.currency,
            category: r.categoryId,
            nextDueDate: r.nextDueDate,
            frequency: r.frequency,
            isActive: r.isActive === "true"
          }));
          break;
        case "settings":
          rows.forEach(r => {
            if (r.key === "theme") staging[STORAGE_KEYS.theme] = r.value;
            if (r.key === "privacy_mode") staging[STORAGE_KEYS.privacy] = r.value === "true";
            if (r.key === "currency") staging[STORAGE_KEYS.currency] = r.value;
          });
          break;
        case "onboarding":
          const onboarding = rows.find(r => r.key === "completed");
          staging[STORAGE_KEYS.onboarding] = onboarding?.value === "true";
          break;
      }
    }

    // Atomic Commit: All or nothing
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    Object.entries(staging).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    (window as any).spendoryRestoreInProgress = false;
    return { success: true };
  } catch (error) {
    (window as any).spendoryRestoreInProgress = false;
    console.error("[Restore Error]", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred during restore." };
  }
}
