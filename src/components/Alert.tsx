"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const alertStyles = {
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "text-blue-500",
    Icon: Info,
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-900",
    icon: "text-green-500",
    Icon: CheckCircle2,
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50 text-yellow-900",
    icon: "text-yellow-500",
    Icon: AlertTriangle,
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
};

export function Alert({
  type = "info",
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
}: AlertProps) {
  const style = alertStyles[type];
  const Icon = style.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-xl border-2 px-4 py-3.5 ${style.container}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${style.icon} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm leading-relaxed">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 text-sm font-semibold underline hover:no-underline transition"
            >
              {action.label}
            </button>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 opacity-50 hover:opacity-100 transition"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface BannerProps {
  type?: AlertType;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Banner({ type = "info", message, dismissible, onDismiss }: BannerProps) {
  const style = alertStyles[type];
  const Icon = style.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center justify-center gap-3 px-4 py-3 ${style.container} border-b-2`}
    >
      <Icon size={18} className={style.icon} />
      <p className="text-sm font-medium flex-1 text-center">{message}</p>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 hover:scale-110 transition-transform"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}
