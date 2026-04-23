import React, { ReactNode } from "react";
import { MobileFrame } from "./MobileFrame";
import { AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching React errors
 * Falls back to a user-friendly error UI
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.retry)
      ) : (
        <MobileFrame>
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              {process.env.NODE_ENV === "development"
                ? this.state.error.message
                : "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button
              onClick={this.retry}
              className="mt-4 rounded-full bg-ink px-6 py-2 text-sm font-semibold text-ink-foreground transition-transform hover:scale-105"
            >
              Try again
            </button>
            <Link
              to="/"
              className="mt-2 text-xs text-muted-foreground underline"
            >
              Back home
            </Link>
          </div>
        </MobileFrame>
      );
    }

    return this.props.children;
  }
}

/**
 * Display error message component for showing errors inline
 */
export function ErrorMessage({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
