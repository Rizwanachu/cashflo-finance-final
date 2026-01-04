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
import { useAuth } from "./hooks/use-auth";
import { AuthScreen } from "./components/AuthScreen";

const App: React.FC = () => {
  const { isOnboardingComplete } = useOnboarding();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
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
