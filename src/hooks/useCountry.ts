import { useState, useEffect } from "react";

const STORAGE_KEY = "userCountry";

export function useCountry() {
  const [country, setCountry] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
  const [loading, setLoading] = useState(() => {
    try { return !localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setCountry(cached);
        setLoading(false);
        return;
      }
    } catch {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const code = (data && data.country_code) ? data.country_code : "US";
        try { localStorage.setItem(STORAGE_KEY, code); } catch {}
        setCountry(code);
      })
      .catch(() => {
        if (!cancelled) setCountry("US");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const isIndia = country === "IN";

  return { country, loading, isIndia };
}
