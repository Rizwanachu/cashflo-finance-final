import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Recurring from "./pages/Recurring";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Landing from "./pages/Landing";
import PublicPrivacy from "./pages/PublicPrivacy";
import PublicTerms from "./pages/PublicTerms";
import RefundPolicy from "./pages/RefundPolicy";
import Onboarding from "./components/Onboarding";
import { useOnboarding } from "./context/OnboardingContext";
import { useAuth } from "./hooks/use-auth";
import { AuthScreen } from "./components/AuthScreen";

const App: React.FC = () => {
  const { isOnboardingComplete } = useOnboarding();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--app-bg)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: 'var(--brand-primary)' }}></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && !isOnboardingComplete && <Onboarding />}
      <Routes>
        {/* ── Always-public routes ── */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/privacy" element={<PublicPrivacy />} />
        <Route path="/terms" element={<PublicTerms />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthScreen />}
        />

        {/* ── Protected app routes ── */}
        {isAuthenticated ? (
          <>
            <Route path="/success" element={<Success />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/recurring" element={<Recurring />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/landing" replace />} />
        )}
      </Routes>
    </>
  );
};

export default App;
