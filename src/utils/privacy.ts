/**
 * Privacy mode utilities
 */

/**
 * Format amount with privacy mode support
 */
export function formatAmountWithPrivacy(
  amount: number,
  formatFn: (amount: number) => string,
  privacyMode: boolean
): string {
  if (privacyMode) {
    return "****";
  }
  return formatFn(amount);
}

/**
 * Format currency with privacy mode
 */
export function formatCurrencyWithPrivacy(
  amount: number,
  currency: string,
  privacyMode: boolean
): string {
  if (privacyMode) {
    return "****";
  }
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });
}

/**
 * Get privacy class for blur effect
 */
export function getPrivacyClass(privacyMode: boolean): string {
  return privacyMode ? "privacy-blur" : "";
}

