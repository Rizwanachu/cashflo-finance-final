import JSZip from "jszip";

/**
 * BRAND NEW CSV/ZIP Restore system for Spendory
 * Atomic, validated, and safe.
 */

const STORAGE_KEYS: Record<string, string> = {
  categories: "spendory-categories-v1",
  accounts: "spendory-accounts-v1",
  goals: "spendory-goals-v1",
  transactions: "spendory-transactions-v1",
  budgets: "spendory-budgets-v1",
  recurring: "spendory-recurring-v1",
  settings: "spendory-settings-v1", // Note: mapped from multiple internal keys
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
 * Simple CSV Parser
 */
function parseCsv(content: string): { headers: string[], rows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = [];
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

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });

  return { headers, rows };
}

export async function importZipBackup(file: File): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined") return { success: false, error: "Window not available" };

  try {
    (window as any).spendoryRestoreInProgress = true;
    
    const zip = await JSZip.loadAsync(file);
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
      const zipFile = zip.file(filename);
      if (!zipFile) {
        console.warn(`Missing file: ${filename}, skipping...`);
        continue;
      }

      const content = await zipFile.async("string");
      const { headers, rows } = parseCsv(content);

      // Validate headers
      const expected = EXPECTED_HEADERS[filename];
      if (!expected.every(h => headers.includes(h))) {
        throw new Error(`Invalid headers in ${filename}. Expected: ${expected.join(", ")}`);
      }

      // Transform rows to internal structures
      const dataKey = filename.replace(".csv", "");
      if (dataKey === "categories") {
        staging[STORAGE_KEYS.categories] = rows.map(r => ({
          ...r,
          isDefault: r.isDefault === "true"
        }));
      } else if (dataKey === "accounts") {
        staging[STORAGE_KEYS.accounts] = rows.map(r => ({
          ...r,
          balance: Number(r.balance)
        }));
      } else if (dataKey === "goals") {
        staging[STORAGE_KEYS.goals] = rows.map(r => ({
          ...r,
          targetAmount: Number(r.targetAmount),
          currentAmount: Number(r.currentAmount)
        }));
      } else if (dataKey === "transactions") {
        staging[STORAGE_KEYS.transactions] = rows.map(r => ({
          ...r,
          amount: Number(r.amount),
          isRecurring: r.isRecurring === "true",
          category: r.categoryId, // Remap categoryId back to category
          tags: r.tags ? r.tags.split(";") : []
        }));
      } else if (dataKey === "budgets") {
        const perCategory: Record<string, number> = {};
        rows.forEach(r => {
          perCategory[r.categoryId] = Number(r.limit);
        });
        staging[STORAGE_KEYS.budgets] = { perCategory };
      } else if (dataKey === "recurring") {
        staging[STORAGE_KEYS.recurring] = rows.map(r => ({
          ...r,
          amount: Number(r.amount),
          isActive: r.isActive === "true",
          category: r.categoryId
        }));
      } else if (dataKey === "settings") {
        rows.forEach(r => {
          if (r.key === "theme") staging["spendory-theme-v1"] = r.value;
          if (r.key === "privacy_mode") staging["spendory-privacy-mode-v1"] = r.value === "true";
          if (r.key === "currency") staging["spendory-currency-v2"] = r.value;
        });
      } else if (dataKey === "onboarding") {
        const completed = rows.find(r => r.key === "completed")?.value === "true";
        staging[STORAGE_KEYS.onboarding] = completed;
      }
    }

    // Atomic Commit
    Object.keys(STORAGE_KEYS).forEach(key => {
      const storageKey = STORAGE_KEYS[key];
      // Special case for settings which maps to multiple keys
      if (key === "settings") {
        const settingKeys = ["spendory-theme-v1", "spendory-privacy-mode-v1", "spendory-currency-v2"];
        settingKeys.forEach(sk => {
          if (staging[sk] !== undefined) {
            localStorage.setItem(sk, JSON.stringify(staging[sk]));
          }
        });
      } else if (staging[storageKey] !== undefined) {
        localStorage.setItem(storageKey, JSON.stringify(staging[storageKey]));
      }
    });

    (window as any).spendoryRestoreInProgress = false;
    window.dispatchEvent(new CustomEvent("spendory:rehydrate"));

    return { success: true };
  } catch (error) {
    (window as any).spendoryRestoreInProgress = false;
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
