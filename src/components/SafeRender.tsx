import React from "react";

interface State {
  crashed: boolean;
}

export class SafeRender extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, State> {
  state: State = { crashed: false };

  static getDerivedStateFromError(): State {
    return { crashed: true };
  }

  componentDidCatch(error: Error) {
    console.warn("SafeRender caught:", error?.message);
  }

  render() {
    if (this.state.crashed) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
