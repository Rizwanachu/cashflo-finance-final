import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Recurring from "./pages/Recurring";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Success from "./pages/Success";
import Onboarding from "./components/Onboarding";
import { useOnboarding } from "./context/OnboardingContext";
import { useAuth } from "./context/AuthContext";
import { Card } from "./components/Card";
import { LogIn, Shield, Globe } from "lucide-react";

const App: React.FC = () => {
  const { isOnboardingComplete } = useOnboarding();
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Spendory</h1>
            <p className="text-muted-foreground text-lg">Your privacy-first financial companion</p>
          </div>

          <Card className="p-8 space-y-6 shadow-xl border-t-4 border-t-primary">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Login to protect your Pro access and identify yourself across devices.
                <br />
                <span className="font-medium text-primary mt-2 block">
                  "Your data stays on your device. Login only protects your Pro access."
                </span>
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={login}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
              >
                <LogIn size={20} />
                Sign in with Google
              </button>
              
              <button
                onClick={login}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-all border border-border"
              >
                Email + OTP (Passwordless)
              </button>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center justify-center gap-1">
                <Shield size={12} />
                Privacy First
              </div>
              <div className="flex items-center justify-center gap-1">
                <Globe size={12} />
                Offline Ready
              </div>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground px-4 leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy. 
            No transaction data is ever synced to our servers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isOnboardingComplete && <Onboarding />}
      <Routes>
        {/* Success page - not wrapped in MainLayout */}
        <Route path="/success" element={<Success />} />
        
        {/* Main app routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
