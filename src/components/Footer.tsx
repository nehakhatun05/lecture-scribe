import Link from "next/link";
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Audio Upload", href: "/audio-upload" },
    { label: "Video Converter", href: "/video-converter" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "How It Works", href: "/#features" },
    { label: "Testimonials", href: "/#testimonials" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@lecturescribe.ai", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-foreground overflow-hidden shadow-2xl border-t border-gray-200 mt-auto w-full">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="block container-center relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="text-white" size={22} />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                LectureScribe
              </span>
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed mb-6 max-w-sm">
              Transform audio files and video lectures into clean, structured
              notes with AI-powered transcription and intelligent summarization technology.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-all hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg border border-gray-200"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-5 text-sm tracking-wider uppercase">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} LectureScribe. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            Made with <Heart size={14} className="text-danger fill-danger animate-pulse" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
