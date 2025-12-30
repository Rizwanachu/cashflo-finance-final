/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light Mode Backgrounds - Premium & Refined
        "ledger-bg": "#FAFBFC",
        "ledger-card": "#FFFFFF",
        "ledger-sidebar": "#F8F9FA",
        "ledger-hover": "#F1F3F5",
        
        // Light Mode Text - Premium hierarchy
        "ledger-text-primary": "#1A1F36",
        "ledger-text-secondary": "#525866",
        "ledger-text-muted": "#6B7280",
        "ledger-text-disabled": "#9CA3AF",
        
        // Light Mode Borders - Subtle & Refined
        "ledger-border": "#E5E7EB",
        "ledger-divider": "#F0F1F3",
        
        // Primary Brand (Calm Emerald)
        "ledger-primary": "#10B981",
        "ledger-primary-hover": "#059669",
        "ledger-primary-soft": "#ECFDF5",
        
        // Status Colors - Harmonious
        "ledger-success": "#10B981",
        "ledger-warning": "#F59E0B",
        "ledger-error": "#EF4444",
        
        // Chart Colors Light Mode
        "ledger-chart-axis": "#525866",
        "ledger-chart-grid": "#F0F1F3",
        "ledger-chart-tooltip-bg": "#FFFFFF",
        "ledger-chart-tooltip-border": "#E5E7EB",
        "ledger-chart-income": "#10B981",
        "ledger-chart-expense": "#EF4444"
      },
      boxShadow: {
        // Premium, subtle shadows
        "xs": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "sm": "0 1px 3px rgba(0, 0, 0, 0.05)",
        "soft": "0 4px 12px rgba(0, 0, 0, 0.06)",
        "md": "0 4px 16px rgba(0, 0, 0, 0.08)",
        "lg": "0 8px 24px rgba(0, 0, 0, 0.1)",
        "none": "none"
      },
      spacing: {
        // Premium spacing scale
        "0": "0px",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "12": "3rem",
        "16": "4rem",
        "20": "5rem",
        "24": "6rem"
      },
      borderRadius: {
        "none": "0px",
        "sm": "4px",
        "md": "6px",
        "lg": "8px",
        "xl": "12px",
        "full": "9999px"
      },
      fontSize: {
        // Premium typography
        "xs": ["12px", { lineHeight: "16px", letterSpacing: "-0.3px" }],
        "sm": ["13px", { lineHeight: "18px", letterSpacing: "-0.3px" }],
        "base": ["14px", { lineHeight: "20px", letterSpacing: "-0.3px" }],
        "lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.3px" }],
        "xl": ["18px", { lineHeight: "28px", letterSpacing: "-0.3px" }],
        "2xl": ["20px", { lineHeight: "32px", letterSpacing: "-0.3px" }]
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },
  plugins: []
};
