# Spendory - Finance Tracker

## Overview
Spendory is a personal finance tracking web application built with React and TypeScript. It helps users track their income, expenses, and manage budgets with an intuitive dashboard interface.

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **PDF Export**: jsPDF with jspdf-autotable

### Directory Structure
```
src/
├── components/       # Reusable UI components
│   └── charts/       # Chart components (CategoryBreakdown, MonthlySpending, etc.)
├── context/          # React Context providers for state management
├── layout/           # Layout components (MainLayout)
├── pages/            # Page components (Dashboard, Transactions, Budgets, etc.)
├── theme/            # Theme configuration
├── utils/            # Utility functions (backup, export, localStorage, etc.)
├── App.tsx           # Main app component with routing
├── main.tsx          # App entry point
└── types.ts          # TypeScript type definitions
```

### Data Storage
- Uses browser localStorage for data persistence
- No backend required - all data stays private in the user's browser

## Development

### Running Locally
The development server runs on port 5000:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
Output is generated in the `dist` folder.

## Features
- Dashboard with financial overview
- Transaction management
- Budget tracking
- Recurring transactions
- Analytics with charts
- Dark/Light theme support
- Multiple currency support
- Data export (CSV, PDF)
- Privacy controls

## Recent Changes
- December 24, 2025: Initial import and Replit environment setup
