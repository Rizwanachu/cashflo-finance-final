export const STORAGE_KEYS = [
  "spendory-transactions-v1",
  "spendory-accounts-v1",
  "spendory-budgets-v1",
  "spendory-categories-v1",
  "spendory-currency-v2",
  "spendory-theme-v1",
  "spendory-privacy-mode-v1",
  "spendory-recurring-v1",
  "spendory-notifications-v1",
  "spendory-notifications-enabled-v1",
  "spendory-onboarding-v1",
  "spendory-goals-v1",
  "spendory_device_id",
  "spendory_pro_device"
];

export interface BackupData {
  version: string;
  timestamp: string;
  data: Record<string, any>;
}

export function exportBackup(): BackupData | null {
  if (typeof window === "undefined") return null;
  const data: Record<string, any> = {};
  STORAGE_KEYS.forEach((key) => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) data[key] = JSON.parse(value);
    } catch {}
  });
  const backup: BackupData = {
    version: "1.1.0",
    timestamp: new Date().toISOString(),
    data
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `spendory-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return backup;
}

export function importBackup(backup: BackupData): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window not available" };
  try {
    const rawData = backup.data || backup;
    STORAGE_KEYS.forEach(key => window.localStorage.removeItem(key));
    Object.entries(rawData).forEach(([key, value]) => {
      let targetKey = key;
      if (key.includes('transactions')) targetKey = 'spendory-transactions-v1';
      else if (key.includes('accounts')) targetKey = 'spendory-accounts-v1';
      else if (key.includes('budgets')) targetKey = 'spendory-budgets-v1';
      else if (key.includes('categories')) targetKey = 'spendory-categories-v1';
      else if (key.includes('currency')) targetKey = 'spendory-currency-v2';
      else if (key.includes('recurring')) targetKey = 'spendory-recurring-v1';
      else if (key.includes('goals')) targetKey = 'spendory-goals-v1';
      window.localStorage.setItem(targetKey, JSON.stringify(value));
    });
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => window.location.reload(), 100);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export function factoryReset(): void {
  if (typeof window === "undefined") return;
  STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
  window.location.reload();
}

export function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.readAsText(file);
  });
}
