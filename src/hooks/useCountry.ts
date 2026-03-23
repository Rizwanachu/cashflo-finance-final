import { useState, useEffect } from "react";

const STORAGE_KEY = "userCountry";

export function useCountry() {
  const [country, setCountry] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });
  const [loading, setLoading] = useState(!localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setCountry(cached);
      setLoading(false);
      return;
    }

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) })
      .then((res) => res.json())
      .then((data) => {
        const code = data.country_code || "US";
        localStorage.setItem(STORAGE_KEY, code);
        setCountry(code);
      })
      .catch(() => {
        setCountry("US");
      })
      .finally(() => setLoading(false));
  }, []);

  const isIndia = country === "IN";

  return { country, loading, isIndia };
}
