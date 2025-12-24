import React, { createContext, useContext, useEffect, useState } from "react";
import { getThemeColors, ThemeMode } from "../theme/theme";
import { safeGet, safeSet } from "../utils/storage";

type Theme = ThemeMode | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ThemeMode;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = "ledgerly-theme-v1";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = safeGet<Theme>(THEME_KEY, "system");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<ThemeMode>("dark");

  // Resolve theme (system -> light/dark)
  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(getSystemTheme());
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Apply theme class and CSS variables
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const colors = getThemeColors(resolvedTheme);
    
    // Apply dark class
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssKey = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssKey, value);
    });
  }, [resolvedTheme]);

  // Persist theme
  useEffect(() => {
    safeSet(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "system") {
      setThemeState(getSystemTheme() === "dark" ? "light" : "dark");
    } else {
      setThemeState(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
