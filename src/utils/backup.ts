/**
 * Backup and restore utilities for Ledgerly
 */

const STORAGE_KEYS = [
  "ledgerly-transactions-v1",
  "ledgerly-accounts-v1",
  "ledgerly-budgets-v1",
  "ledgerly-categories-v1",
  "ledgerly-currency-v1",
  "ledgerly-theme-v1",
  "ledgerly-privacy-mode-v1",
  "ledgerly-recurring-v1",
  "cashflo-recurring-v1",
  "cashflo-notifications-v1",
  "cashflo-notifications-enabled-v1"
];

export interface BackupData {
  version: string;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Export all Ledgerly data as JSON
 */
export function exportBackup(): BackupData | null {
  if (typeof window === "undefined") return null;

  const data: Record<string, any> = {};

  STORAGE_KEYS.forEach((key) => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        data[key] = JSON.parse(value);
      }
    } catch {
      // ignore
    }
  });

  const backup: BackupData = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    data
  };

  // Download as JSON file
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().slice(0, 10);
  link.setAttribute("download", `ledgerly-backup-${date}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return backup;
}

/**
 * Import backup data from JSON
 */
export function importBackup(backup: BackupData): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Window not available" };
  }

  try {
    // Validate backup structure
    if (!backup.data || typeof backup.data !== "object") {
      return { success: false, error: "Invalid backup format" };
    }

    // Restore each key
    Object.entries(backup.data).forEach(([key, value]) => {
      try {
        if (STORAGE_KEYS.includes(key)) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // ignore individual key errors
      }
    });

    // Trigger a storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
    
    // Hard reload to ensure all contexts re-initialize with new data
    window.location.reload();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Factory reset - clear all Ledgerly data
 */
export function factoryReset(): void {
  if (typeof window === "undefined") return;

  STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}

/**
 * Read backup file from input
 */
export function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content) as BackupData;
        resolve(backup);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

