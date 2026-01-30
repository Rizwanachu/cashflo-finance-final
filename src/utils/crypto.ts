import CryptoJS from 'crypto-js';

const APP_SECRET = 'spendory-offline-vault-2025';

export const generateUnlockCode = (deviceId: string): string => {
  const message = `${deviceId}-PRO-LIFETIME`;
  const hash = CryptoJS.HmacSHA256(message, APP_SECRET).toString(CryptoJS.enc.Hex);
  const signature = hash.substring(0, 8).toUpperCase();
  return `SP-PRO-${signature}`;
};

export const verifyUnlockCode = (code: string, deviceId: string): { valid: boolean; type: 'trial' | 'lifetime' | 'invalid' } => {
  const upperCode = code.toUpperCase().trim();
  
  if (upperCode.startsWith('SP-PRO-')) {
    const expected = generateUnlockCode(deviceId);
    if (upperCode === expected) {
      return { valid: true, type: 'lifetime' };
    }
  }
  
  return { valid: false, type: 'invalid' };
};

export const verifyUnlockCodeLegacy = (code: string, deviceId: string): boolean => {
  const result = verifyUnlockCode(code, deviceId);
  return result.valid;
};
