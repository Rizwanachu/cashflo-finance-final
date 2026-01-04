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
import { GoalsProvider } from "./context/GoalsContext";
import { PrivacyProvider } from "./context/PrivacyContext";
import { AppLockProvider } from "./context/AppLockContext";
import { ToastProvider } from "./context/ToastContext";
import { RecurringProvider } from "./context/RecurringContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { ProProvider } from "./context/ProContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { FreeLimitsProvider } from "./context/FreeLimitsContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { RetentionProvider } from "./context/RetentionContext";
import { LaunchModeProvider } from "./context/LaunchModeContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <LaunchModeProvider>
        <ProProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <PrivacyProvider>
              <AppLockProvider>
                <NotificationsProvider>
                <AccountsProvider>
                  <CategoriesProvider>
                    <TransactionsProvider>
                      <FreeLimitsProvider>
                        <RetentionProvider>
                          <BudgetProvider>
                            <GoalsProvider>
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
                            </GoalsProvider>
                          </BudgetProvider>
                        </RetentionProvider>
                      </FreeLimitsProvider>
                    </TransactionsProvider>
                  </CategoriesProvider>
                </AccountsProvider>
                </NotificationsProvider>
              </AppLockProvider>
            </PrivacyProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </ProProvider>
    </LaunchModeProvider>
  </React.StrictMode>
);



