"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  BookOpen,
  Headphones,
  Video,
  LayoutDashboard,
  Info,
  Mail,
  Sparkles,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/audio-upload", label: "Upload", icon: Headphones },
  { href: "/video-converter", label: "Convert", icon: Video },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (

    <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg bg-gradient-to-r from-white/90 via-primary/5 to-white/90 backdrop-blur-xl w-full">
      <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/30 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:rotate-3">
              <Sparkles className="text-white drop-shadow-lg" size={22} />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block tracking-tight">
              LectureScribe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 bg-white/50 rounded-full px-2 py-2 border border-border/50 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25"
                      : "text-foreground/70 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-sm"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <link.icon size={16} className="relative z-10 drop-shadow-sm" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/audio-upload"
              className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5"
            >
              <Sparkles size={16} />
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-dark/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/20 bg-white/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "gradient-bg text-white shadow-lg"
                          : "text-foreground/70 hover:bg-surface-dark"
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/audio-upload"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 btn-primary flex items-center justify-center gap-2 w-full"
                >
                  <Sparkles size={16} />
                  Get Started Free
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
