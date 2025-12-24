import React, { createContext, useContext, useCallback, useState } from "react";

type ToastVariant = "success" | "warning" | "error";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  pushToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = crypto.randomUUID();
      const toast: Toast = { id, message, variant };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, pushToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export const ToastViewport: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs">
      {toasts.map((toast) => {
        const bg =
          toast.variant === "error"
            ? "bg-rose-600"
            : toast.variant === "warning"
            ? "bg-amber-500"
            : "bg-emerald-600";
        return (
          <div
            key={toast.id}
            className={`${bg} text-white text-xs px-3 py-2 rounded-xl shadow-lg flex items-start justify-between gap-2`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-[10px] opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};



