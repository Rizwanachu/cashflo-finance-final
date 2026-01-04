import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Card } from "./Card";
import { LogIn, UserPlus, Shield, Globe } from "lucide-react";

export const AuthScreen: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...", { isRegister, email });
    if (isRegister) {
      register({ email, password });
    } else {
      login({ email, password });
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
