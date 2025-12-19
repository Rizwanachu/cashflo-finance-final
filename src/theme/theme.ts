/**
 * Centralized theme system for Ledgerly
 * All colors must come from these tokens - NO raw hex values in components
 */

export const theme = {
  light: {
    // Backgrounds
    appBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    sidebarBg: "#F1F5F9",
    hoverSurface: "#E2E8F0",
    
    // Text
    primaryText: "#0F172A",
    secondaryText: "#475569",
    mutedText: "#64748B",
    disabledText: "#94A3B8",
    
    // Borders
    defaultBorder: "#E2E8F0",
    subtleDivider: "#CBD5E1",
    
    // Brand (Emerald)
    brandPrimary: "#10B981",
    brandHover: "#059669",
    brandSoftBg: "#D1FAE5",
    
    // Status
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
    
    // Chart colors
    chartAxisText: "#334155",
    chartGridLine: "#E2E8F0",
    chartTooltipBg: "#FFFFFF",
    chartTooltipBorder: "#CBD5E1",
    chartIncome: "#10B981",
    chartExpense: "#EF4444",
  },
  dark: {
    // Backgrounds
    appBg: "#020617",
    cardBg: "#020617",
    sidebarBg: "#020617",
    hoverSurface: "#1E293B",
    
    // Text
    primaryText: "#F8FAFC",
    secondaryText: "#CBD5E1",
    mutedText: "#94A3B8",
    disabledText: "#64748B",
    
    // Borders
    defaultBorder: "#1E293B",
    subtleDivider: "#334155",
    
    // Brand (Emerald)
    brandPrimary: "#34D399",
    brandHover: "#10B981",
    brandSoftBg: "#064E3B",
    
    // Status
    success: "#22C55E",
    warning: "#FBBF24",
    error: "#EF4444",
    
    // Chart colors
    chartAxisText: "#CBD5E1",
    chartGridLine: "#1E293B",
    chartTooltipBg: "#020617",
    chartTooltipBorder: "#334155",
    chartIncome: "#34D399",
    chartExpense: "#F87171",
  },
} as const;

export type ThemeMode = "light" | "dark";

export function getThemeColors(mode: ThemeMode) {
  return theme[mode];
}

