"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Oops! Something went wrong</h2>
            <p className="text-text-muted mb-6 leading-relaxed">
              We encountered an unexpected error. Don&apos;t worry, your data is safe.
              Try refreshing the page to continue.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-text-muted hover:text-primary">
                  View error details
                </summary>
                <pre className="mt-2 p-4 bg-surface-dark rounded-lg text-xs overflow-auto max-h-40 text-left">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Reload Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ title = "Error", message, retry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 border-danger/20 bg-danger/5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-danger mb-1">{title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-danger hover:text-danger/80 transition"
            >
              <RefreshCcw size={14} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
