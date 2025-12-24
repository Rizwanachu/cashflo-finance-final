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
import { ProProvider } from "./context/ProContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { FreeLimitsProvider } from "./context/FreeLimitsContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ProProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <PrivacyProvider>
            <NotificationsProvider>
              <AccountsProvider>
                <CategoriesProvider>
                  <TransactionsProvider>
                    <FreeLimitsProvider>
                      <BudgetProvider>
                        <RecurringProvider>
                          <ToastProvider>
                            <AnalyticsProvider>
                              <OnboardingProvider>
                                <BrowserRouter>
                                  <App />
                                </BrowserRouter>
                              </OnboardingProvider>
                            </AnalyticsProvider>
                          </ToastProvider>
                        </RecurringProvider>
                      </BudgetProvider>
                    </FreeLimitsProvider>
                  </TransactionsProvider>
                </CategoriesProvider>
              </AccountsProvider>
            </NotificationsProvider>
          </PrivacyProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ProProvider>
  </React.StrictMode>
);



