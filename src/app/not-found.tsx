"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-10"
        >
          <div className="relative inline-block">
            <span className="text-[140px] font-black leading-none gradient-text select-none drop-shadow-xl">
              404
            </span>
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-accent/20 blob" />
            <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-primary/20 blob" style={{ animationDelay: '0.5s' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-text-muted mb-10 leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2 shadow-xl"
            >
              <Home size={18} />
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Search size={18} />
              Browse Notes
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
