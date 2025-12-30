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
    appBg: "#0B0F0E",
    cardBg: "#1A2321",
    sidebarBg: "#121817",
    hoverSurface: "#1A2321",
    
    // Text
    primaryText: "#E6F1EC",
    secondaryText: "#A8B8B2",
    mutedText: "#6F7F79",
    disabledText: "#4F5E59",
    
    // Borders
    defaultBorder: "#1F2A27",
    subtleDivider: "#1F2A27",
    
    // Brand
    brandPrimary: "#BFEBD6",
    brandHover: "#9FD9C0",
    brandSoftBg: "rgba(191, 235, 214, 0.1)",
    
    // Status
    success: "#BFEBD6",
    warning: "#6FBFA4",
    error: "#F2A1A1",
    
    // Chart colors
    chartAxisText: "#A8B8B2",
    chartGridLine: "#1F2A27",
    chartTooltipBg: "#121817",
    chartTooltipBorder: "#1F2A27",
    chartIncome: "#BFEBD6",
    chartExpense: "#6FBFA4",
  },
} as const;

export type ThemeMode = "light" | "dark";

export function getThemeColors(mode: ThemeMode) {
  return theme[mode];
}

