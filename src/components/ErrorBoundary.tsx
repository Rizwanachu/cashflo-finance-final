import React from "react";

interface State {
  hasError: boolean;
  errorMessage: string | null;
  errorStack: string | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: null, errorStack: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || String(error),
      errorStack: error?.stack || null,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const summary = `[${new Date().toISOString()}] ${error?.name}: ${error?.message}\n${info.componentStack}`;
    console.error("App crashed:", error, info);
    try {
      localStorage.setItem("spendory_last_crash", summary.slice(0, 2000));
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#000",
            color: "#fff",
            textAlign: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ fontSize: "0.875rem", opacity: 0.7, maxWidth: 320 }}>
            The app encountered an unexpected error. Tap below to reload.
          </p>
          {this.state.errorMessage && (
            <p
              style={{
                fontSize: "0.7rem",
                opacity: 0.4,
                maxWidth: 320,
                wordBreak: "break-word",
                fontFamily: "monospace",
              }}
            >
              {this.state.errorMessage}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              background: "#14b8a6",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Reload Spendory
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
