import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/use-auth";
import { Card } from "./Card";
import { Shield, Globe } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

export const AuthScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { loginWithGoogleToken } = useAuth();
  const buttonDivRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Load GIS script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("GIS Frontend: Script loaded");
      initializeGoogle();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeGoogle = () => {
    if (!window.google || isInitialized.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: "570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com",
        ux_mode: "popup",
        callback: async (response: any) => {
          console.log("Google credential received", response.credential);
          if (response.credential) {
            try {
              await loginWithGoogleToken(response.credential);
            } catch (err: any) {
              console.error("Google Sign-In error:", err.message);
              setError(err.message || "Failed to sync with Spendory");
            }
          }
        },
      });

      if (buttonDivRef.current) {
        window.google.accounts.id.renderButton(buttonDivRef.current, {
          theme: "outline",
          size: "large",
          width: "320",
          text: "continue_with",
          shape: "rectangular",
        });
      }
      isInitialized.current = true;
    } catch (err) {
      console.error("GIS Frontend: Init error", err);
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
            <h2 className="text-2xl font-semibold text-white">Welcome</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in with Google to protect your Pro access.
              Financial data remains 100% private in your browser.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center w-full min-h-[50px]">
            <div ref={buttonDivRef} id="google-login-btn"></div>
          </div>

          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-[10px] text-muted-foreground uppercase tracking-widest text-center">
            <div className="flex items-center justify-center gap-1">
              <Shield size={12} />
              Privacy First
            </div>
            <div className="flex items-center justify-center gap-1">
              <Globe size={12} />
              Verified Identity
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
