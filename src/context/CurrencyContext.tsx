import React, { createContext, useContext, useEffect, useState } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

export type CurrencyCode = 
  | "USD" | "EUR" | "INR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" 
  | "CNY" | "SGD" | "AED" | "SAR" | "ZAR" | "NZD" | "SEK" | "NOK" 
  | "DKK" | "KRW" | "THB" | "MYR" | "PHP" | "IDR" | "BRL" | "MXN" 
  | "TRY" | "PKR" | "BDT" | "LKR";

interface CurrencyContextValue {
  currency: CurrencyCode;
  symbol: string;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (amount: number, currencyCode?: CurrencyCode) => string;
  getCurrencyInfo: (code: CurrencyCode) => CurrencyInfo | undefined;
  allCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const CURRENCY_KEY = "ledgerly-currency-v2";

const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", country: "Sri Lanka" }
];

const CURRENCY_MAP = new Map(CURRENCIES.map(c => [c.code, c]));

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null;
    if (stored && CURRENCY_MAP.has(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCY_MAP.has(code)) {
      setCurrencyState(code);
    }
  };

  const getCurrencyInfo = (code: CurrencyCode) => {
    return CURRENCY_MAP.get(code);
  };

  const currencyInfo = CURRENCY_MAP.get(currency);
  const symbol = currencyInfo?.symbol ?? "$";

  const formatAmount = (amount: number, currencyCode?: CurrencyCode): string => {
    const code = currencyCode ?? currency;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      // Fallback if currency is not supported
      return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        formatAmount,
        getCurrencyInfo,
        allCurrencies: CURRENCIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
