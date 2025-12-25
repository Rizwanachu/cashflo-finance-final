import CryptoJS from 'crypto-js';

// In a real app, this secret would be on a server.
// For this standalone web app, we'll use a hardcoded salt.
const APP_SECRET = 'spendory-offline-vault-2025';

/**
 * Generates a signed unlock code for a specific device.
 * Format: DEVICE_ID-SIGNATURE
 */
export const generateUnlockCode = (deviceId: string): string => {
  const message = `${deviceId}-PRO-LIFETIME`;
  const hash = CryptoJS.HmacSHA256(message, APP_SECRET).toString(CryptoJS.enc.Hex);
  // Take first 8 chars of hash to keep the code manageable
  const signature = hash.substring(0, 8).toUpperCase();
  return `SP-PRO-${signature}`;
};

/**
 * Verifies if a code is valid for the given device.
 */
export const verifyUnlockCode = (code: string, deviceId: string): boolean => {
  const upperCode = code.toUpperCase().trim();
  
  // 1. Support the legacy demo code
  if (upperCode === 'CASHFLO2025') return true;
  
  // 2. Verify signed dynamic code
  if (upperCode.startsWith('SP-PRO-')) {
    const signature = upperCode.replace('SP-PRO-', '');
    const expected = generateUnlockCode(deviceId);
    return upperCode === expected;
  }
  
  return false;
};
