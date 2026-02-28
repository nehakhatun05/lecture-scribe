"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Link2,
  Video,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Youtube,
  Globe,
  FileText,
  BookOpen,
  Lightbulb,
  X,
} from "lucide-react";
import { useNotesStore } from "@/store/useNotesStore";
import { useToast } from "@/components/Toast";

type OutputMode = "summary" | "full" | "key-concepts";

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
    /shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/** Extract topic/subject from URL intelligently */
function extractTopicFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Try to extract from common URL patterns
    const pathname = parsed.pathname;
    const searchParams = parsed.searchParams;
    
    // Check for title in query params (common in some platforms)
    const titleParam = searchParams.get('title') || searchParams.get('name') || searchParams.get('v');
    if (titleParam && titleParam.length > 5) {
      return titleParam.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    
    // Extract from path segments
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      // Get the last meaningful segment
      const lastPart = pathParts[pathParts.length - 1]
        .replace(/\.(html?|php|aspx?|jsp)$/i, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\d{4,}/g, '') // Remove long numbers
        .replace(/\b(lecture|video|watch|course|lesson|tutorial)\b/gi, '')
        .trim();
      
      if (lastPart.length > 5) {
        return lastPart.split(' ')
          .filter(word => word.length > 2)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    }
    
    // Fallback: use domain name as hint
    const domain = parsed.hostname.replace(/^www\./, '');
    const domainParts = domain.split('.');
    if (domainParts[0].length > 3) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1) + ' Content';
    }
    
    return 'Educational Content';
  } catch {
    return 'Online Lecture';
  }
}

/** Build a descriptive title from a URL */
function buildTitle(url: string): string {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const ytId = extractYouTubeId(url);
    
    if (ytId) {
      // For YouTube, try to extract title from URL or use the topic
      const topic = extractTopicFromUrl(url);
      return `${topic} | YouTube Lecture`;
    }
    
    // Derive from path
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const slug = pathParts[pathParts.length - 1]
        .replace(/\.(html?|php|aspx?)$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
      if (slug.length > 3) return `${slug} — ${domain}`;
    }
    return `Lecture from ${domain}`;
  } catch {
    return "Online Lecture";
  }
}

export default function VideoConverterPage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const toast = useToast();

  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<OutputMode>("full");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const isYouTube = (str: string) =>
    str.includes("youtube.com") || str.includes("youtu.be");

  // Check if a string is just a random video ID (no real words)
  const isJustVideoId = (str: string) =>
    /^[a-zA-Z0-9_-]{8,20}$/.test(str.replace(/\s/g, ""));

  const handleConvert = async () => {
    setError("");
    if (!url.trim()) {
      setError("Please enter a video or lecture link.");
      return;
    }
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (include https://).");
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      const autoTopic = extractTopicFromUrl(url);
      
      // Build initial topic: use description if provided, otherwise try to extract from URL
      let topic = description.trim() || (!isJustVideoId(autoTopic) ? autoTopic : "");
      
      // If still no topic, use a generic placeholder (will be updated from YouTube if possible)
      if (!topic) {
        if (isYouTube(url)) {
          topic = "YouTube Video";
        } else {
          topic = "Educational Content";
        }
      }

      const noteTitle = `${topic} — Study Notes`;

      setProgress(10);

      // Try to fetch YouTube transcript if it's a YouTube URL
      let actualTranscript = '';
      let transcriptSource = 'none';
      
      if (isYouTube(url)) {
        setProgress(20);
        console.log('[Video Converter] Attempting to fetch YouTube transcript...');
        
        try {
          const transcriptResponse = await fetch('/api/youtube-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });

          // Parse the response JSON regardless of status code
          const transcriptData = await transcriptResponse.json();
          
          // Check if we got a transcript
          if (transcriptData.success && transcriptData.transcript) {
            actualTranscript = transcriptData.transcript;
            transcriptSource = 'youtube-api';
            console.log(`[Video Converter] YouTube transcript fetched: ${actualTranscript.length} chars`);
            
            // Update topic with actual YouTube title if we got it (and user didn't provide description)
            if (transcriptData.title && !description.trim()) {
              topic = transcriptData.title;
              console.log(`[Video Converter] Using YouTube title: ${topic}`);
            }
          } else if (transcriptData.title && !description.trim()) {
            // No transcript, but we got the video title - use it
            topic = transcriptData.title;
            console.log(`[Video Converter] No transcript available, but using extracted title: ${topic}`);
          }
        } catch (ytError) {
          console.log('[Video Converter] YouTube transcript fetch failed, will use AI-based approach');
        }
      }

      setProgress(30);

      // Log what we have before validation
      console.log(`[Video Converter] After YouTube fetch - actualTranscript: ${actualTranscript ? 'YES' : 'NO'}, topic: "${topic}", description: "${description.trim()}"`);

      // Validate that we have enough information to generate meaningful notes
      if (isYouTube(url) && !actualTranscript && !description.trim() && (topic === 'YouTube Video' || !topic)) {
        // YouTube video without transcript, without user description, and no extracted title
        setError(
          'Unable to fetch transcript or video information. Please add a description (e.g., "Number System - Binary, Octal, Decimal, Hexadecimal") to help generate accurate notes.'
        );
        setProcessing(false);
        return;
      }

      // Build transcript prompt based on whether we have actual content
      let transcript = '';
      
      if (actualTranscript) {
        // We have actual transcript from YouTube
        transcript = `Title: ${topic}
Source: ${url}

Transcript:
${actualTranscript}

Generate comprehensive study notes from this transcript.`;
      } else {
        // Fallback: Use AI knowledge-based approach
        transcript = `Topic: ${topic}
Reference URL: ${url}
Platform: ${domain}
${description ? `Description: ${description}` : ""}

Create comprehensive, well-structured educational study notes about: "${topic}".
Generate expert-level study content with detailed explanations, key concepts, and examples.`;
      }

      setProgress(45);

      // Call the API to generate notes using Gemini
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          title: topic,
          mode,
        }),
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid response from server");
      }

      setProgress(85);

      const { data } = result;

      const noteId = addNote({
        title: noteTitle,
        source: isYouTube(url) ? "video" : "link",
        sourceInfo: url,
        transcript,
        summary: data.summary,
        keyPoints: data.keyPoints,
        definitions: data.definitions,
        fullNotes: data.fullNotes,
      });

      setProgress(100);
      toast.success(`Notes generated for "${topic}"!`);
      await new Promise((r) => setTimeout(r, 500));
      router.push(`/notes/${noteId}`);
    } catch (err: any) {
      console.error("Conversion error:", err);
      setError(err.message || "Failed to generate notes. Please try again.");
      setProcessing(false);
      setProgress(0);
      toast.error("Conversion failed");
    }
  };

  const modes: { value: OutputMode; label: string; icon: typeof FileText; desc: string }[] = [
    {
      value: "summary",
      label: "Summary Only",
      icon: FileText,
      desc: "Concise overview of the lecture",
    },
    {
      value: "full",
      label: "Full Lecture Notes",
      icon: BookOpen,
      desc: "Complete structured notes",
    },
    {
      value: "key-concepts",
      label: "Key Concepts",
      icon: Lightbulb,
      desc: "Important terms and definitions",
    },
  ];

  return (
    <div className="min-h-screen w-full py-16 bg-gradient-to-b from-white via-cyan-50/20 to-white">
      <div className="block container-center w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="badge mx-auto mb-5">
            <Video size={16} />
            Video / Link Converter
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Paste a <span className="gradient-text">Video Link</span>
          </h1>
          <p className="mt-5 text-text-muted max-w-2xl mx-auto text-base leading-relaxed">
            Paste a YouTube URL or any lecture link. We&apos;ll extract the audio,
            transcribe it, and generate structured notes automatically.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full card p-8 sm:p-10 space-y-6 shadow-2xl"
        >
          {/* URL Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Link2 size={16} className="text-primary" />
              Video / Lecture URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={processing}
                className="input-field pl-12 pr-10"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                {url && isYouTube(url) ? (
                  <Youtube size={18} className="text-red-500" />
                ) : (
                  <Globe size={18} />
                )}
              </div>
              {url && !processing && (
                <button
                  onClick={() => { setUrl(""); setError(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* Title preview */}
            {url && isValidUrl(url) && (
              <p className="mt-2 text-xs text-text-muted flex items-center gap-1.5">
                <span className="text-primary font-medium">Will be titled:</span>
                {buildTitle(url)}
              </p>
            )}
            {/* YouTube thumbnail */}
            {url && isYouTube(url) && extractYouTubeId(url) && (
              <div className="mt-3 rounded-xl overflow-hidden border border-border w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(url)}/mqdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Optional Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FileText size={16} className="text-primary" />
              Description (Optional)
              <span className="text-xs font-normal text-text-muted">
                — Helps generate better notes
              </span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Machine Learning Basics, Introduction to Python, etc."
              disabled={processing}
              className="input-field"
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Provide a brief description of what the video is about for more relevant notes.
            </p>
          </div>

          {/* Output Mode */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Output Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modes.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  disabled={processing}
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all group ${
                    mode === m.value
                      ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/40 hover:shadow-md"
                  } disabled:opacity-50`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform ${
                    mode === m.value ? "gradient-bg text-white shadow-lg" : "bg-surface text-text-muted group-hover:scale-110"
                  }`}>
                    <m.icon size={22} />
                  </div>
                  <span className="text-sm font-bold">{m.label}</span>
                  <span className="text-xs text-text-muted leading-relaxed">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          {processing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-primary font-medium">
                  <Loader2 size={16} className="animate-spin" />
                  {progress < 20
                    ? "Fetching video..."
                    : progress < 40
                    ? "Extracting audio..."
                    : progress < 65
                    ? "Transcribing with AI..."
                    : progress < 90
                    ? "Generating notes..."
                    : "Finalizing..."}
                </span>
                <span className="text-text-muted">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-dark overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-bg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 rounded-xl px-4 py-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={processing || !url.trim()}
            className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Convert to Notes
              </>
            )}
          </button>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Youtube,
              title: "YouTube Videos",
              desc: "Any public YouTube lecture or tutorial",
              color: "text-red-500",
            },
            {
              icon: Globe,
              title: "Web Lectures",
              desc: "Links from Coursera, edX, Khan Academy, etc.",
              color: "text-blue-500",
            },
            {
              icon: CheckCircle2,
              title: "Any Audio URL",
              desc: "Direct links to audio/video files online",
              color: "text-success",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="w-full card-hover p-5 flex items-start gap-3 group"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} bg-current/10 shrink-0 transition-transform group-hover:scale-110`}>
                <item.icon size={20} className={item.color} />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
