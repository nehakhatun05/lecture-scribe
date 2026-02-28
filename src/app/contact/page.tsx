"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen w-full py-16 bg-gradient-to-b from-white via-indigo-50/20 to-white">
      <div className="block container-center w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <div className="badge mx-auto mb-5">
            <Mail size={15} />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="mt-5 text-text-muted max-w-lg mx-auto leading-relaxed">
            Have a question, suggestion, or feedback? We&apos;d love to hear from
            you. Drop us a message and we&apos;ll get back within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 sm:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-success/10 text-success mb-6 shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 gradient-text">Message Sent Successfully!</h3>
                  <p className="text-text-muted max-w-sm leading-relaxed mb-8">
                    Thank you for reaching out. We&apos;ll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary shadow-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="input-label">
                      <User size={15} className="text-primary" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Enter your name"
                      className="input-field"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="input-label">
                      <Mail size={15} className="text-primary" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      className="input-field"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="input-label">
                      <MessageSquare size={15} className="text-primary" />
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Write your message here..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                  >
                    {sending ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="lg:col-span-2 space-y-6"
          >
            {[
              {
                icon: Mail,
                title: "Email Us",
                value: "hello@lecturescribe.ai",
                desc: "For general inquiries",
              },
              {
                icon: MapPin,
                title: "Location",
                value: "India",
                desc: "Building from India for the world",
              },
              {
                icon: Clock,
                title: "Response Time",
                value: "Within 24 hours",
                desc: "We reply to every message",
              },
              {
                icon: Phone,
                title: "Social Media",
                value: "@LectureScribe",
                desc: "Follow us on Twitter & LinkedIn",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 2}
                className="w-full bg-white rounded-2xl border border-border shadow-sm p-6 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">{item.title}</h3>
                    <p className="text-sm text-primary font-medium">
                      {item.value}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* FAQ hint */}
            <div className="bg-surface rounded-2xl border border-border p-6 text-center">
              <p className="text-sm text-text-muted">
                📌 <strong>Quick Tip:</strong> Most questions are answered on
                our{" "}
                <a href="/about" className="text-primary hover:underline">
                  About page
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
