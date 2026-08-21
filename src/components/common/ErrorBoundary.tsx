import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backgroundColor: "var(--color-bg-page)",
          }}
        >
          <div
            className="card animate-fade-in-up"
            style={{
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-card)",
              padding: "2.5rem 2rem",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>*</div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--color-text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              Something went wrong
            </h1>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
              An unexpected error occurred. Reloading the page usually fixes this.
            </p>
            <Button
              label="Reload Page"
              type="button"
              variant="primary"
              disabled={false}
              onClick={() => { window.location.href = "/"; }}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
