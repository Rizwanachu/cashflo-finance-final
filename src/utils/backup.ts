/**
 * Backup and restore utilities for Spendory
 */

export const STORAGE_KEYS = [
  "spendory-transactions-v1",
  "spendory-accounts-v1",
  "spendory-budgets-v1",
  "spendory-categories-v1",
  "spendory-currency-v2", // Note: CurrencyContext uses v2
  "spendory-theme-v1",
  "spendory-privacy-mode-v1",
  "spendory-recurring-v1",
  "spendory-notifications-v1",
  "spendory-notifications-enabled-v1",
  "spendory-onboarding-v1",
  "spendory-goals-v1",
  "spendory-app-lock-pin-v1",
  "spendory-app-locked-v1",
  "spendory_device_id",
  "spendory_pro_device"
];

export interface BackupData {
  version: string;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Export all Spendory data as JSON
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
    version: "1.1.0",
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
  link.setAttribute("download", `spendory-backup-${date}.json`);
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
        // Map old keys to the current STORAGE_KEYS
        let targetKey = key;
        if (key.startsWith('ledgerly-') || key.startsWith('cashflo-')) {
          targetKey = key.replace(/ledgerly-|cashflo-/, 'spendory-');
        }
        
        // Also support keys that might just be "transactions" etc from very old versions
        if (key === 'finance-tracker-transactions-v1') targetKey = 'spendory-transactions-v1';
        
        // Specific mapping for device IDs if they use underscore
        if (key.includes('device_id')) targetKey = 'spendory_device_id';
        if (key.includes('pro_device')) targetKey = 'spendory_pro_device';
        
        // Save to the target spendory- prefix
        window.localStorage.setItem(targetKey, JSON.stringify(value));
        
        // CRITICAL: If we are importing into a targetKey, also clear the old key to prevent conflicts
        if (targetKey !== key) {
          // window.localStorage.removeItem(key); // Optional: keep for safety or remove to clean up
        }
      } catch (err) {
        console.error(`Failed to restore key ${key}`, err);
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
 * Factory reset - clear all Spendory data
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
