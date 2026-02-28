"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Target,
  Sparkles,
  GraduationCap,
  Heart,
  Globe,
  Lightbulb,
  Award,
  Rocket,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const values = [
  {
    icon: GraduationCap,
    title: "Student-First",
    description:
      "Everything we build starts with the question: how does this help students learn better?",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI for Good",
    description:
      "We use artificial intelligence to make education more accessible, not to replace learning.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    description:
      "Free core features, multi-language support, and mobile-friendly design for every student.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Lightbulb,
    title: "Always Improving",
    description:
      "We continuously enhance our AI models and features based on student feedback.",
    color: "bg-yellow-100 text-yellow-600",
  },
];

const team = [
  {
    name: "Neha Basandrai",
    role: "Founder & Lead Developer",
    bio: "Passionate about combining AI and education to help students learn smarter.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-gradient-to-b from-white to-background">
      {/* Hero */}
      <section className="relative w-full py-28 overflow-hidden bg-gradient-to-b from-background via-indigo-50/30 to-background">
        <div className="blob w-80 h-80 bg-primary/10 top-0 -right-20" />
        <div className="blob w-64 h-64 bg-accent/10 bottom-0 -left-10" />

        <div className="block container-center relative w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="badge mx-auto mb-6"
          >
            <BookOpen size={15} />
            About LectureScribe
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Making Lectures{" "}
            <span className="gradient-text">Actually Useful</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            LectureScribe is an AI-powered platform that transforms audio
            recordings and video lectures into clean, structured, and
            study-ready notes. We believe no student should struggle to keep up
            with fast-paced lectures.
          </motion.p>

          {/* Inline stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { value: "10K+", label: "Active Students" },
              { value: "50+", label: "Languages" },
              { value: "99%", label: "Accuracy" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black gradient-text">{s.value}</p>
                <p className="text-sm text-text-muted font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="w-full py-24">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-3xl font-bold mb-6">
                What <span className="gradient-text">We Do</span>
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  LectureScribe uses cutting-edge AI technology — including
                  OpenAI Whisper for speech-to-text and advanced language models
                  for note generation — to convert any lecture into organized,
                  comprehensive study material.
                </p>
                <p>
                  Whether you upload an MP3 recording from class, paste a
                  YouTube lecture link, or share any online lecture URL, our
                  system will:
                </p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Transcribe the audio with high accuracy",
                    "Generate structured notes with headings and bullet points",
                    "Extract key points and important concepts",
                    "Create a concise summary for quick revision",
                    "Identify and define important terminology",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, label: "10K+ Students", desc: "Active users" },
                { icon: Target, label: "99% Accuracy", desc: "Transcription" },
                { icon: Award, label: "50+ Languages", desc: "Supported" },
                { icon: Rocket, label: "< 30 Seconds", desc: "Processing time" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="w-full bg-white rounded-2xl p-6 border border-border shadow-sm text-center card-hover"
                >
                  <stat.icon size={28} className="text-primary mx-auto mb-3" />
                  <p className="font-bold text-lg">{stat.label}</p>
                  <p className="text-xs text-text-muted">{stat.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who It Helps */}
      <section className="w-full py-24 bg-surface">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Who It <span className="gradient-text">Helps</span>
            </h2>
            <p className="mt-4 text-text-muted max-w-xl mx-auto">
              LectureScribe is designed for anyone who learns from spoken
              content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "College Students",
                desc: "Record your lectures and get perfect study notes without missing a word.",
                emoji: "🎓",
              },
              {
                title: "Online Learners",
                desc: "Convert YouTube tutorials, MOOCs, and webinars into structured reference material.",
                emoji: "💻",
              },
              {
                title: "Researchers",
                desc: "Transcribe interviews, talks, and conference presentations efficiently.",
                emoji: "🔬",
              },
              {
                title: "Professionals",
                desc: "Turn training sessions and meetings into actionable notes and minutes.",
                emoji: "💼",
              },
              {
                title: "Teachers",
                desc: "Create study materials from your own lectures for students to review.",
                emoji: "📚",
              },
              {
                title: "Accessibility",
                desc: "Provide written versions of spoken content for hearing-impaired students.",
                emoji: "♿",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="w-full bg-white rounded-2xl p-6 border border-border shadow-sm card-hover"
              >
                <span className="text-3xl mb-4 block">{card.emoji}</span>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-text-muted">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full py-24">
        <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="mt-4 text-text-muted max-w-xl mx-auto">
              The principles that guide everything we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="w-full bg-white rounded-2xl p-6 border border-border shadow-sm card-hover text-center"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.color} mb-4`}
                >
                  <value.icon size={24} />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-text-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="w-full py-24 bg-surface">
        <div className="block container-center mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="gradient-bg rounded-3xl p-12 sm:p-16 text-white"
          >
            <Heart size={40} className="mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              To democratize education by making lecture content universally
              accessible, organized, and easy to study — empowering every
              student to learn at their own pace, in their own way.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
