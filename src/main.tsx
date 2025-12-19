import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AccountsProvider } from "./context/AccountsContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import { BudgetProvider } from "./context/BudgetContext";
import { PrivacyProvider } from "./context/PrivacyContext";
import { ToastProvider } from "./context/ToastContext";
import { RecurringProvider } from "./context/RecurringContext";
import { NotificationsProvider } from "./context/NotificationsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <PrivacyProvider>
          <NotificationsProvider>
            <AccountsProvider>
              <CategoriesProvider>
                <TransactionsProvider>
                  <BudgetProvider>
                    <RecurringProvider>
                      <ToastProvider>
                        <BrowserRouter>
                          <App />
                        </BrowserRouter>
                      </ToastProvider>
                    </RecurringProvider>
                  </BudgetProvider>
                </TransactionsProvider>
              </CategoriesProvider>
            </AccountsProvider>
          </NotificationsProvider>
        </PrivacyProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </React.StrictMode>
);



