## Spendory

Smart money. Clear decisions.

Spendory is a fully functional personal finance tracking web app built with **React**, **Vite**, **Tailwind CSS**, **React Router**, **Recharts**, and **LocalStorage** (no backend).

### Features

- **Dashboard**
  - Total balance, total income, total expenses
  - Weekly spending bar chart (last 7 days, expenses only)
  - Monthly spending bar chart (last 6 months, expenses only)
- **Transactions**
  - Add **income** or **expense**
  - Category selection (rent, food, transport, utilities, misc)
  - Date input
  - Edit and delete transactions
  - All data persisted in **LocalStorage** and restored on reload
- **Analytics**
  - Category-wise expense breakdown (pie chart)
  - Monthly income vs expenses comparison chart
- **Navigation & UI**
  - Sidebar navigation (Dashboard, Transactions, Analytics) with active highlighting
  - Mobile bottom navigation
  - Modern fintech-style dark layout
  - Responsive for desktop and mobile

### Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the printed URL (default `http://localhost:5173`) in your browser.

### Data & persistence

- Transactions are stored under the key `spendory-transactions-v1` in `localStorage`.
- All CRUD operations (add, edit, delete) immediately update LocalStorage and refresh the dashboard and analytics.

### Tech stack

- **React + TypeScript** (UI + application logic)
- **Vite** (bundler & dev server)
- **Tailwind CSS** (styling, dark/light mode)
- **React Router v6** (routing)
- **Recharts** (charts)
- **LocalStorage** (data persistence for transactions, theme, budgets, and currency)
