"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "muted";
  label?: string;
}

export function Spinner({ size = "md", color = "primary", label }: SpinnerProps) {
  const sizeClass = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  }[size];

  const colorClass = {
    primary: "text-primary",
    white: "text-white",
    muted: "text-text-muted",
  }[color];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 size={sizeClass} className={`${colorClass} animate-spin`} />
      {label && (
        <p className="text-sm text-text-muted font-medium animate-pulse">{label}</p>
      )}
    </div>
  );
}

export function DotSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  }[size];

  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSize} rounded-full bg-primary`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full bg-primary/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-4 w-4 rounded-full bg-primary"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-surface-dark via-border to-surface-dark bg-[length:200%_100%] rounded-lg ${className}`}
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    />
  );
}

interface LoadingCardProps {
  count?: number;
}

export function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <SkeletonLoader className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonLoader className="h-4 w-3/4" />
              <SkeletonLoader className="h-3 w-1/2" />
            </div>
          </div>
          <SkeletonLoader className="h-20 w-full" />
          <div className="flex gap-2">
            <SkeletonLoader className="h-8 w-24" />
            <SkeletonLoader className="h-8 w-24" />
          </div>
        </div>
      ))}
    </>
  );
}
