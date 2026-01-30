export const verifyUnlockCode = (code: string, deviceId: string): { valid: boolean; type: 'lifetime' | 'invalid' } => {
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
