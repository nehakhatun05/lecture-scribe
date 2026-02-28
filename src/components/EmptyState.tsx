"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  iconColor?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor = "text-primary/50",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {Icon && (
        <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-6 ${iconColor}`}>
          <Icon size={36} />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-text-muted max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <>
          {action.href ? (
            <Link href={action.href} className="btn-primary">
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary">
              {action.label}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}

interface EmptySearchProps {
  query: string;
  onClear: () => void;
}

export function EmptySearch({ query, onClear }: EmptySearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-dark mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-lg font-bold mb-2">No results found</h3>
      <p className="text-sm text-text-muted max-w-sm mb-4">
        No notes match &quot;{query}&quot;. Try adjusting your search or filter.
      </p>
      <button onClick={onClear} className="btn-secondary text-sm">
        Clear Search
      </button>
    </motion.div>
  );
}
