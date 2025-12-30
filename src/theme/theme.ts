/**
 * Centralized theme system for Spendory
 * Premium, minimalistic, modern design with calm, refined aesthetics
 */

export const theme = {
  light: {
    // Backgrounds - Refined & spacious
    appBg: "#FAFBFC",
    cardBg: "#FFFFFF",
    sidebarBg: "#F8F9FA",
    hoverSurface: "#F1F3F5",
    
    // Text - Premium hierarchy
    primaryText: "#1A1F36",
    secondaryText: "#525866",
    mutedText: "#6B7280",
    disabledText: "#9CA3AF",
    
    // Borders - Subtle & refined
    defaultBorder: "#E5E7EB",
    subtleDivider: "#F0F1F3",
    
    // Brand - Calm emerald
    brandPrimary: "#10B981",
    brandHover: "#059669",
    brandSoftBg: "#ECFDF5",
    
    // Status - Harmonious
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    
    // Chart colors
    chartAxisText: "#525866",
    chartGridLine: "#F0F1F3",
    chartTooltipBg: "#FFFFFF",
    chartTooltipBorder: "#E5E7EB",
    chartIncome: "#10B981",
    chartExpense: "#EF4444",
  },
  dark: {
    // Backgrounds - Deep & calm
    appBg: "#0D1117",
    cardBg: "#161B22",
    sidebarBg: "#0D1117",
    hoverSurface: "#1C2128",
    
    // Text - High contrast, premium
    primaryText: "#E6EDF3",
    secondaryText: "#8B949E",
    mutedText: "#6E7681",
    disabledText: "#484F58",
    
    // Borders - Subtle dark theme
    defaultBorder: "#30363D",
    subtleDivider: "#21262D",
    
    // Brand - Calm emerald (adjusted for dark)
    brandPrimary: "#3FB98E",
    brandHover: "#2EA076",
    brandSoftBg: "rgba(16, 185, 129, 0.12)",
    
    // Status - Harmonious
    success: "#3FB98E",
    warning: "#D29922",
    error: "#F85149",
    
    // Chart colors
    chartAxisText: "#8B949E",
    chartGridLine: "#21262D",
    chartTooltipBg: "#161B22",
    chartTooltipBorder: "#30363D",
    chartIncome: "#3FB98E",
    chartExpense: "#F85149",
  },
} as const;

export type ThemeMode = "light" | "dark";

export function getThemeColors(mode: ThemeMode) {
  return theme[mode];
}
