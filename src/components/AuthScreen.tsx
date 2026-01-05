import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Card } from "./Card";
import { LogIn, UserPlus, Shield, Globe } from "lucide-react";

export const AuthScreen: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting form...", { isRegister, email });
    try {
      if (isRegister) {
        await register({ email, password });
      } else {
        await login({ email, password });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Spendory</h1>
          <p className="text-muted-foreground text-lg">Your privacy-first financial companion</p>
        </div>

        <Card className="p-8 space-y-6 shadow-xl border-t-4 border-t-primary text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Login to protect your Pro access and identify yourself across devices.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  console.log("Initiating Google Auth redirect...");
                  // Use absolute URL to avoid any relative path issues on custom domains
                  const authUrl = `${window.location.origin}/api/auth/google`;
                  console.log("Redirecting to:", authUrl);
                  window.location.href = authUrl;
                }}
                className="flex items-center justify-center gap-2 w-full p-2.5 bg-white text-black rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
              {isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-sm text-primary hover:underline"
          >
            {isRegister ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>

          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-[10px] text-muted-foreground uppercase tracking-widest text-center">
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
      </div>
    </div>
  );
};
