/**
 * Comprehensive storage utility with backup and recovery
 * Prevents data loss on refresh/reopen
 */

const BACKUP_SUFFIX = "_backup";

/**
 * Safely retrieve data from localStorage
 * Attempts to parse JSON and provides fallback
 */
export function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch (error) {
    console.warn(`Failed to parse ${key}, attempting backup...`);
    
    // Try backup if main data corrupted
    try {
      const backupRaw = window.localStorage.getItem(key + BACKUP_SUFFIX);
      if (backupRaw) {
        const parsed = JSON.parse(backupRaw) as T;
        // Restore from backup
        window.localStorage.setItem(key, backupRaw);
        return parsed;
      }
    } catch {
      // Backup also corrupted
    }
    
    return fallback;
  }
}

/**
 * Safely save data to localStorage
 * Creates automatic backup before overwriting
 */
export function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  
  try {
    // Save new data
    const stringified = JSON.stringify(value);
    window.localStorage.setItem(key, stringified);
    
    // Create backup of new successful save
    try {
      window.localStorage.setItem(key + BACKUP_SUFFIX, stringified);
    } catch {
      // Ignore backup failure
    }
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
    window.localStorage.removeItem(key + BACKUP_SUFFIX);
  } catch {
    // ignore
  }
}

/**
 * Clear all data (explicit user action only)
 */
export function clearAllData(): void {
  if (typeof window === "undefined") return;
  
  const keysToKeep = ["cashflo_device_id", "cashflo_pro_device"];
  
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
  const DEVICE_KEY = "cashflo_device_id";
  
  let deviceId = safeGet<string>(DEVICE_KEY, "");
  
  if (!deviceId) {
    // Generate unique device ID
    deviceId = `device_${crypto.randomUUID()}`;
    safeSet(DEVICE_KEY, deviceId);
  }
  
  return deviceId;
}
