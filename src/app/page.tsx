"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Headphones,
  Video,
  FileText,
  Zap,
  Brain,
  Download,
  Clock,
  Globe,
  Shield,
  Star,
  ArrowRight,
  Upload,
  Link2,
  Sparkles,
  Quote,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Zap,
    title: "Fast Transcription",
    description:
      "Convert audio to text in seconds with industry-leading speech recognition technology.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Brain,
    title: "AI Notes Generation",
    description:
      "Automatically generate structured notes, summaries, and key points from any lecture.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Download,
    title: "Download Notes",
    description:
      "Export your notes in multiple formats — PDF, Word, or plain text for easy sharing.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Clock,
    title: "Save Time",
    description:
      "Stop taking manual notes. Focus on understanding while AI handles the documentation.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description:
      "Support for multiple languages. Upload lectures in English, Hindi, Spanish, and more.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your files and notes are encrypted and never shared. Complete privacy guaranteed.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Upload Audio",
    description: "Upload your lecture audio file in MP3, WAV, or other formats.",
    step: "01",
  },
  {
    icon: Link2,
    title: "Or Paste a Link",
    description:
      "Paste a YouTube URL or any lecture link and we'll extract the audio.",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    description:
      "Our AI transcribes the audio and generates structured, intelligent notes.",
    step: "03",
  },
  {
    icon: FileText,
    title: "Get Your Notes",
    description:
      "View, edit, download, or share your beautifully formatted lecture notes.",
    step: "04",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech Computer Science, 3rd Year",
    text: "LectureScribe saved me during exam season! I uploaded all my recorded lectures and got perfect study notes in minutes.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "MBA Student",
    text: "The AI summary feature is incredible. It picks out exactly the key points from hour-long business lectures.",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    role: "Medical Student, AIIMS",
    text: "Complex medical lectures turned into organized notes with definitions highlighted. This is exactly what I needed!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center w-full bg-gradient-to-b from-background via-purple-50/30 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 top-20 -left-32" />
          <div className="blob w-[400px] h-[400px] bg-gradient-to-br from-accent/20 to-primary/20 bottom-20 -right-24" style={{ animationDelay: '1s' }} />
          <div className="blob w-[350px] h-[350px] bg-gradient-to-br from-secondary/10 to-accent/10 top-1/2 left-1/3" style={{ animationDelay: '2s' }} />
        </div>

        <div className="block container-center relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="badge mx-auto mb-8"
          >
            <Sparkles size={16} />
            AI-Powered Lecture Notes — Free for Students
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight"
          >
            Convert Lectures into{" "}
            <span className="gradient-text">Smart Notes</span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Instantly with AI</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-8 mx-auto max-w-3xl text-xl text-text-muted leading-relaxed"
          >
            Upload your lecture recordings or paste a video link. Our AI will
            transcribe, summarize, and generate structured notes — so you can
            focus on learning, not scribbling.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/audio-upload"
              className="btn-primary group inline-flex items-center gap-2 text-base shadow-xl"
            >
              <Headphones size={20} />
              Upload Audio File
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/video-converter"
              className="btn-secondary group inline-flex items-center gap-2 text-base"
            >
              <Video size={20} />
              Convert Video Link
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-20 grid grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto"
          >
            {[
              { value: "10K+", label: "Notes Generated", color: "from-primary to-secondary" },
              { value: "50+", label: "Languages", color: "from-secondary to-accent" },
              { value: "99%", label: "Accuracy", color: "from-accent to-primary" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 mb-2 transition-transform group-hover:scale-110`}>
                  <p className="text-3xl sm:text-4xl font-black gradient-text">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm font-medium text-text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding w-full bg-gradient-to-b from-background to-slate-50/80">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <div className="badge mx-auto mb-5">
              <FileText size={16} />
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Four simple steps to turn any lecture into beautifully structured
              notes in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative group w-full"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -z-10" />
                )}
                
                <div className="card-hover p-8 text-center h-full bg-white relative overflow-hidden">
                  {/* Decorative corner gradient */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100px]" />
                  
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-black text-lg mb-4">
                      {step.step}
                    </span>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-white mb-5 shadow-lg shadow-primary/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <step.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding w-full bg-white">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <div className="badge mx-auto mb-5">
              <Sparkles size={16} />
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Powerful <span className="gradient-text">AI Features</span>
            </h2>
            <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Everything you need to transform lectures into study-ready
              material with cutting-edge AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group relative w-full"
              >
                <div className="card-hover p-8 h-full relative overflow-hidden">
                  {/* Animated gradient on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 gradient-bg" />
                  
                  <div className="relative">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} mb-6 shadow-lg transition-all group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <feature.icon size={26} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">{feature.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding w-full gradient-bg-soft">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <div className="badge mx-auto mb-5">
              <Star size={16} />
              Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Loved by <span className="gradient-text">Students</span>
            </h2>
            <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who are studying smarter with
              LectureScribe and achieving better results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group w-full"
              >
                <div className="card-hover p-8 h-full relative overflow-hidden">
                  {/* Decorative quote background */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-br-[100px]" />
                  
                  <div className="relative">
                    <Quote size={40} className="text-primary/30 mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-6" />
                    <p className="text-base text-text-muted leading-relaxed mb-6">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={18}
                          className="text-warning fill-warning transition-transform hover:scale-125"
                        />
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <p className="font-bold text-base">{t.name}</p>
                      <p className="text-sm text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding w-full bg-white">
        <div className="block container-center w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="relative overflow-hidden gradient-bg rounded-3xl p-12 sm:p-20 text-white text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-medium">Join 10,000+ Students</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                Ready to Transform Your Study Game?
              </h2>
              
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                Stop spending hours transcribing lectures manually. Let AI do the
                heavy lifting while you focus on what matters — understanding and retaining knowledge.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/audio-upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 hover:scale-105 group"
                >
                  Start Converting Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
