"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileAudio,
  X,
  Loader2,
  Languages,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Clock,
  Volume2,
} from "lucide-react";
import { useNotesStore } from "@/store/useNotesStore";
import { useToast } from "@/components/Toast";

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German",
  "Chinese", "Japanese", "Arabic", "Portuguese", "Russian",
  "Bengali", "Urdu", "Marathi", "Tamil", "Telugu",
];

const ACCEPTED = ".mp3,.wav,.m4a,.ogg,.flac,.aac,.wma";

const PROCESSING_STEPS = [
  { at: 10, label: "Uploading file..." },
  { at: 25, label: "Analyzing audio..." },
  { at: 45, label: "Transcribing with Whisper AI..." },
  { at: 60, label: "Processing transcript..." },
  { at: 75, label: "Generating notes with AI..." },
  { at: 90, label: "Formatting output..." },
  { at: 100, label: "Done!" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function buildNoteContent(title: string, filename: string, language: string) {
  const clean = title.replace(/[^\w\s]/g, "");
  return {
    transcript: `[Auto-generated transcript of "${filename}" in ${language}]\n\nThis transcript was generated using AI speech-to-text technology. The lecture begins with an introduction to the core topic, followed by detailed explanations of key concepts and real-world examples.\n\n"Welcome everyone. Today we will be covering the topic of ${clean}. This is an important subject that forms the foundation of our course. Let's start by understanding the basics...\n\nFirstly, we need to establish what ${clean} means in context. The term refers to a set of principles and methodologies that are widely used in the field. As we progress through this lecture, you will see how these concepts build upon each other.\n\nMoving on to the practical aspects, there are several key areas we must examine. Each of these areas contributes to our overall understanding and provides the tools needed for real-world application.\n\nIn conclusion, ${clean} is a multifaceted topic that requires careful study. The key takeaways from today's session should guide your further learning."\n\n[End of transcript]`,

    summary: `This lecture on "${title}" covers the essential concepts and practical applications of the subject. Starting from foundational definitions, the instructor progressively builds understanding through examples and case studies. The session concludes with clear takeaways suitable for exam preparation and real-world application. Language: ${language}.`,

    keyPoints: [
      `Introduction to ${clean} â€” definitions and scope`,
      "Historical background and evolution of the subject",
      "Core principles and theoretical foundations",
      "Practical applications and real-world examples",
      "Common challenges and how to overcome them",
      "Tools and methodologies recommended by the instructor",
      "Summary of key takeaways for revision",
    ],

    definitions: [
      `${clean}: The primary subject of this lecture, encompassing core concepts and methodologies`,
      "Foundational Principle: A fundamental rule that underpins the entire subject area",
      "Application Framework: The structured approach used to apply knowledge in practice",
      "Key Methodology: The recommended systematic process for tackling problems in this domain",
    ],

    fullNotes: `# ${title}

**Source:** ${filename}  **Language:** ${language}

---

## 1. Introduction

This lecture introduces the fundamental concepts of **${clean}**. Understanding this topic is essential for building a strong foundation in the subject.

### Learning Objectives
- Understand the core definitions and terminology
- Identify the key principles governing the subject
- Apply concepts to real-world scenarios
- Connect this topic to broader academic frameworks

---

## 2. Core Concepts

### 2.1 Definitions & Terminology
- **${clean}**: The main subject explored in this lecture
- Key vocabulary is introduced progressively throughout the session
- Understanding precise definitions is critical for exam success

### 2.2 Theoretical Framework
- The subject is grounded in well-established academic theory
- Multiple perspectives are presented for balanced understanding
- Relationships between concepts are clearly illustrated

---

## 3. Practical Applications

### 3.1 Real-World Examples
- Case Study 1: Application in academic/professional settings
- Case Study 2: Problem-solving using the discussed methodology
- Case Study 3: Industry-standard implementation

### 3.2 Step-by-Step Process
1. Identify the problem or context
2. Apply the appropriate framework
3. Analyze results and refine
4. Document findings and conclusions

---

## 4. Advanced Topics

### 4.1 Current Trends
- Recent developments in the field
- Emerging research and innovations
- Future directions and open problems

### 4.2 Common Mistakes to Avoid
- Misapplying core definitions
- Overlooking edge cases
- Skipping foundational steps

---

## 5. Summary & Revision

| Topic | Key Point |
|-------|-----------|
| Definition | Core concept precisely stated |
| Principle | Fundamental rule to remember |
| Application | How to use in practice |
| Exam Focus | Most likely tested areas |

### Quick Revision Checklist
- [ ] Can I define the core concept in my own words?
- [ ] Do I understand the key principles?
- [ ] Can I provide a real-world example?
- [ ] Have I reviewed the definitions section?

---

*Notes generated by LectureScribe AI â€¢ ${new Date().toLocaleDateString()}*`,
  };
}

export default function AudioUploadPage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [language, setLanguage] = useState("English");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState("");

  // Clean up object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleFile = useCallback((f: File) => {
    setError("");
    const ext = f.name.split(".").pop()?.toLowerCase();
    const allowed = ["mp3", "wav", "m4a", "ogg", "flac", "aac", "wma"];
    if (!ext || !allowed.includes(ext)) {
      setError("Unsupported format. Please use MP3, WAV, M4A, OGG, FLAC, AAC, or WMA.");
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      setError("File too large. Maximum allowed size is 500 MB.");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setAudioUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setProcessing(true);
    setProgress(0);
    setError("");
    setProgressLabel("Preparing file...");

    try {
      // Create FormData to send file to API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      formData.append("mode", "full");

      setProgress(10);
      setProgressLabel("Uploading file...");

      // Call the transcription API
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      setProgress(30);
      setProgressLabel("Transcribing with AI...");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      setProgress(70);
      setProgressLabel("Generating notes...");

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid response from server");
      }

      setProgress(95);
      setProgressLabel("Finalizing...");

      const { data } = result;
      
      // Format title
      const rawTitle = data.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const title = rawTitle
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      // Add note to store with AI-generated content
      const noteId = addNote({
        title,
        source: "audio",
        sourceInfo: file.name,
        transcript: data.transcript,
        summary: data.summary,
        keyPoints: data.keyPoints,
        definitions: data.definitions,
        fullNotes: data.fullNotes,
      });

      setProgress(100);
      setProgressLabel("Done!");

      toast.success(`Notes generated for "${title}"!`);
      
      // Small delay to show completion
      await new Promise(r => setTimeout(r, 500));
      
      router.push(`/notes/${noteId}`);
    } catch (err: any) {
      console.error("Conversion error:", err);
      setError(err.message || "Failed to process audio. Please try again.");
      setProcessing(false);
      setProgress(0);
      toast.error("Conversion failed");
    }
  };

  const removeFile = () => {
    setFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setProgress(0);
  };

  const currentStep = PROCESSING_STEPS.findLast((s) => progress >= s.at);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-purple-50/30 to-white py-12">
      <div className="block container-center w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 mb-4">
            <FileAudio size={16} />
            Audio â†’ Notes
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Upload Your{" "}
            <span className="gradient-text">Lecture Audio</span>
          </h1>
          <p className="mt-3 text-[var(--text-muted)] max-w-lg mx-auto text-sm leading-relaxed">
            Upload an audio recording and our AI will transcribe it, then
            generate structured notes, summaries, and key points automatically.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="w-full card p-8 sm:p-10 space-y-6 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Drop Zone */}
            {!file && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-14 cursor-pointer transition-all select-none ${
                    dragOver
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-border hover:border-primary/40 hover:bg-primary/[0.02]"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <motion.div
                    animate={dragOver ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-bg text-white mb-5 shadow-lg shadow-primary/30"
                  >
                    <Upload size={34} />
                  </motion.div>
                  <p className="font-extrabold text-xl mb-2 text-foreground">
                    {dragOver ? "Drop it here!" : "Drag & drop your audio file"}
                  </p>
                  <p className="text-sm text-text-muted mb-6">
                    or click to browse from your device
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["MP3", "WAV", "M4A", "OGG", "FLAC", "AAC", "WMA"].map((f) => (
                      <span key={f} className="badge text-xs py-1 px-3">{f}</span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-text-muted">Maximum file size: 500 MB</p>
                </div>
              </motion.div>
            )}

            {/* â”€â”€ File Preview + Controls â”€â”€ */}
            {file && (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* File info bar */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-purple-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 shrink-0">
                    <FileAudio size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-foreground">{file.name}</p>
                    <div className="flex items-center gap-4 mt-0.5">
                      <span className="text-xs text-text-muted font-medium">{formatSize(file.size)}</span>
                      {duration > 0 && (
                        <span className="flex items-center gap-1 text-xs text-text-muted font-medium">
                          <Clock size={11} />
                          {formatDuration(duration)}
                        </span>
                      )}
                    </div>
                  </div>
                  {!processing && (
                    <button
                      onClick={removeFile}
                      className="p-2 rounded-xl hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Audio player */}
                {audioUrl && (
                  <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onLoadedMetadata={(e) =>
                        setDuration((e.target as HTMLAudioElement).duration)
                      }
                      onTimeUpdate={(e) =>
                        setCurrentTime((e.target as HTMLAudioElement).currentTime)
                      }
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4 px-5 py-4">
                      <button
                        onClick={togglePlay}
                        disabled={processing}
                        className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-white shadow-md shadow-primary/30 hover:shadow-lg transition-all disabled:opacity-50 shrink-0"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <input
                          type="range"
                          min={0}
                          max={duration || 1}
                          value={currentTime}
                          onChange={(e) => {
                            const t = parseFloat(e.target.value);
                            setCurrentTime(t);
                            if (audioRef.current) audioRef.current.currentTime = t;
                          }}
                          disabled={processing || !duration}
                          className="w-full accent-indigo-500 disabled:opacity-40"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                          <span>{formatDuration(currentTime)}</span>
                          <span>{formatDuration(duration)}</span>
                        </div>
                      </div>
                      <Volume2 size={15} className="text-text-muted shrink-0" />
                    </div>
                  </div>
                )}

                {/* Language */}
                <div>
                  <label className="input-label">
                    <Languages size={15} className="text-primary" />
                    Lecture Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={processing}
                    className="input-field"
                    style={{ paddingRight: "2rem" }}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Progress */}
                <AnimatePresence>
                  {processing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-primary font-semibold">
                            <Loader2 size={15} className="animate-spin" />
                            {currentStep?.label ?? "Processing..."}
                          </span>
                          <span className="font-mono font-bold text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                            {progress}%
                          </span>
                        </div>
                        <div className="progress-track">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.35 }}
                          />
                        </div>
                        <div className="flex justify-between">
                          {PROCESSING_STEPS.map((step) => (
                            <div
                              key={step.at}
                              className={`h-1.5 w-1.5 rounded-full transition-all ${
                                progress >= step.at ? "bg-primary scale-125" : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Convert button */}
                <button
                  onClick={handleConvert}
                  disabled={processing}
                  className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {processing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating Notes...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Convert to Notes
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              icon: CheckCircle2,
              title: "Full Transcript",
              desc: "Word-by-word transcription in your chosen language.",
              gradient: "from-indigo-500 to-purple-600",
            },
            {
              icon: CheckCircle2,
              title: "Structured Notes",
              desc: "AI-organized notes with headings and bullet points.",
              gradient: "from-purple-500 to-pink-600",
            },
            {
              icon: CheckCircle2,
              title: "Key Points & Defs",
              desc: "Important concepts and vocabulary extracted automatically.",
              gradient: "from-emerald-500 to-teal-600",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.07 }}
              className="w-full card-hover p-5 flex items-start gap-4 group"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
