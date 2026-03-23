import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App crashed:", error, info);
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
            backgroundColor: "var(--app-bg, #0B0F0E)",
            color: "var(--primary-text, #E6F1EC)",
            textAlign: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ fontSize: "0.875rem", opacity: 0.7, maxWidth: 320 }}>
            The app encountered an unexpected error. Tap below to reload.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              background: "var(--brand-primary, #14b8a6)",
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
