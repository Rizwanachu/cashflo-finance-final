/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light Mode Backgrounds
        "ledger-bg": "#F8FAFC", // slate-50
        "ledger-card": "#FFFFFF",
        "ledger-sidebar": "#F1F5F9", // slate-100
        "ledger-hover": "#E2E8F0", // slate-200
        
        // Light Mode Text
        "ledger-text-primary": "#0F172A", // slate-900
        "ledger-text-secondary": "#475569", // slate-600
        "ledger-text-muted": "#64748B", // slate-500
        "ledger-text-disabled": "#94A3B8", // slate-400
        
        // Light Mode Borders
        "ledger-border": "#E2E8F0", // slate-200
        "ledger-divider": "#CBD5E1", // slate-300
        
        // Primary Brand (Fintech green)
        "ledger-primary": "#059669", // emerald-600
        "ledger-primary-hover": "#047857", // emerald-700
        "ledger-primary-soft": "#D1FAE5", // emerald-100
        
        // Status Colors
        "ledger-success": "#16A34A",
        "ledger-warning": "#F59E0B",
        "ledger-error": "#DC2626",
        
        // Chart Colors Light Mode
        "ledger-chart-axis": "#334155",
        "ledger-chart-grid": "#E2E8F0",
        "ledger-chart-tooltip-bg": "#FFFFFF",
        "ledger-chart-tooltip-border": "#CBD5E1",
        "ledger-chart-income": "#10B981",
        "ledger-chart-expense": "#EF4444"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15,23,42,0.9)"
      }
    }
  },
  plugins: []
};



