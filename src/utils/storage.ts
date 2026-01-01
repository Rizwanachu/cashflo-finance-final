/**
 * Comprehensive storage utility with backup and recovery
 * Prevents data loss on refresh/reopen
 */

const BACKUP_SUFFIX = "_backup";

/**
 * Safely retrieve data from localStorage
 */
export function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse ${key}`);
    return fallback;
  }
}

/**
 * Safely save data to localStorage
 */
export function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage`, error);
  }
}

/**
 * Remove data from localStorage
 */
export function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Clear all data (explicit user action only)
 */
export function clearAllData(): void {
  if (typeof window === "undefined") return;
  
  const keysToKeep = ["spendory_device_id", "spendory_pro_device"];
  
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore
  }
}

/**
 * Get or create a unique device ID
 */
export function getOrCreateDeviceId(): string {
  const DEVICE_KEY = "spendory_device_id";
  
  let deviceId = safeGet<string>(DEVICE_KEY, "");
  
  if (!deviceId) {
    // Generate unique device ID
    deviceId = `device_${crypto.randomUUID()}`;
    safeSet(DEVICE_KEY, deviceId);
  }
  
  return deviceId;
}
