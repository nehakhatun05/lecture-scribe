"use client";

import { useParams, useRouter } from "next/navigation";
import { useNotesStore } from "@/store/useNotesStore";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Headphones,
  Video,
  Link2,
  Copy,
  Download,
  CheckCircle2,
  BookOpen,
  FileText,
  Lightbulb,
  BookMarked,
  ClipboardCheck,
  Pencil,
  Printer,
  Share2,
  Check,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

const sourceIcon = {
  audio: Headphones,
  video: Video,
  link: Link2,
};

const sourceLabel = {
  audio: "Audio Upload",
  video: "YouTube Video",
  link: "Web Link",
};

type Tab = "notes" | "transcript" | "key-points" | "definitions";

export default function NotesViewerPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const note = useNotesStore((s) => s.getNoteById(params.id as string));
  const updateNote = useNotesStore((s) => s.updateNote);

  const [tab, setTab] = useState<Tab>("notes");
  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  if (!note) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="text-text-muted/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Note Not Found</h2>
          <p className="text-text-muted mb-6">
            This note may have been deleted or doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const Icon = sourceIcon[note.source];

  const startEditTitle = () => {
    setTitleDraft(note.title);
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 50);
  };

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== note.title) {
      updateNote(note.id, { title: trimmed });
      toast.success("Title updated!");
    }
    setEditingTitle(false);
  };

  const cancelEdit = () => {
    setEditingTitle(false);
    setTitleDraft("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.info("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\nDate: ${new Date(note.date).toLocaleDateString()}\nSource: ${note.sourceInfo}\n\n---\n\nFULL NOTES\n\n${note.fullNotes}\n\n---\n\nTRANSCRIPT\n\n${note.transcript}\n\n---\n\nKEY POINTS\n\n${note.keyPoints.map((p) => `• ${p}`).join("\n")}\n\n---\n\nDEFINITIONS\n\n${note.definitions.map((d) => `• ${d}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  const handlePrint = () => window.print();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const tabs: { value: Tab; label: string; icon: typeof FileText }[] = [
    { value: "notes", label: "Full Notes", icon: BookOpen },
    { value: "transcript", label: "Transcript", icon: FileText },
    { value: "key-points", label: "Key Points", icon: Lightbulb },
    { value: "definitions", label: "Definitions", icon: BookMarked },
  ];

  // Render inline markdown: bold (**text**), italic (*text*), code (`text`), strip lone asterisks
  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    // Remove separator lines that are all special chars
    if (/^[━─=\-*_]{3,}$/.test(text.trim())) return null;

    const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith("**")) {
        parts.push(<strong key={m.index} className="font-semibold text-foreground">{tok.slice(2, -2)}</strong>);
      } else if (tok.startsWith("`")) {
        parts.push(<code key={m.index} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono">{tok.slice(1, -1)}</code>);
      } else {
        parts.push(<em key={m.index} className="italic text-primary/80">{tok.slice(1, -1)}</em>);
      }
      last = m.index + tok.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return <>{parts}</>;
  };

  const renderNotesContent = () => {
    const lines = note.fullNotes.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    let bulletGroup: React.ReactNode[] = [];
    let numberedGroup: { num: string; text: string }[] = [];

    const flushBullets = () => {
      if (bulletGroup.length > 0) {
        elements.push(
          <ul key={`ul-${i}`} className="my-3 space-y-2">
            {bulletGroup.map((b, bi) => (
              <li key={bi} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shrink-0" />
                <span className="text-slate-600 text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        );
        bulletGroup = [];
      }
    };

    const flushNumbered = () => {
      if (numberedGroup.length > 0) {
        elements.push(
          <ol key={`ol-${i}`} className="my-3 space-y-2">
            {numberedGroup.map((item, ni) => (
              <li key={ni} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {item.num}
                </span>
                <span className="text-slate-600 text-sm leading-relaxed">{renderInline(item.text)}</span>
              </li>
            ))}
          </ol>
        );
        numberedGroup = [];
      }
    };

    while (i < lines.length) {
      const line = lines[i];

      // Separator lines – skip entirely
      if (/^[━─=\-*_✓•]{3,}$/.test(line.trim())) { i++; continue; }

      // Table block
      if (line.startsWith("|")) {
        flushBullets(); flushNumbered();
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        const rows = tableLines.filter((l) => !/^[\s|:\-]+$/.test(l));
        if (rows.length > 0) {
          const parseRow = (r: string) =>
            r.split("|").map((c) => c.trim()).filter(Boolean);
          const headers = parseRow(rows[0]);
          const bodyRows = rows.slice(1);
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-5 rounded-xl border border-indigo-100 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    {headers.map((h, hi) => (
                      <th key={hi} className="px-4 py-3 text-left font-semibold text-indigo-700 border-b border-indigo-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={`transition-colors ${ri % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-indigo-50/40`}>
                      {parseRow(row).map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 text-slate-600 border-b border-slate-100 text-sm">{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Code block
      if (line.startsWith("```")) {
        flushBullets(); flushNumbered();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <pre key={`code-${i}`} className="my-4 rounded-xl bg-slate-800 text-green-300 text-xs p-4 overflow-x-auto font-mono leading-relaxed">
            {codeLines.join("\n")}
          </pre>
        );
        continue;
      }

      // H1
      if (line.startsWith("# ")) {
        flushBullets(); flushNumbered();
        const title = line.replace(/^# /, "").replace(/\*\*/g, "");
        elements.push(
          <div key={i} className="mt-8 mb-4">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <div className="mt-1.5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        );
      }
      // H2
      else if (line.startsWith("## ")) {
        flushBullets(); flushNumbered();
        const title = line.replace(/^## /, "").replace(/\*\*/g, "");
        elements.push(
          <div key={i} className="mt-7 mb-3">
            <h2 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block shrink-0" />
              {title}
            </h2>
          </div>
        );
      }
      // H3
      else if (line.startsWith("### ")) {
        flushBullets(); flushNumbered();
        const title = line.replace(/^### /, "").replace(/\*\*/g, "");
        elements.push(
          <h3 key={i} className="mt-5 mb-2 text-base font-semibold text-slate-700 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block" />
            {title}
          </h3>
        );
      }
      // H4
      else if (line.startsWith("#### ")) {
        flushBullets(); flushNumbered();
        elements.push(
          <h4 key={i} className="mt-4 mb-1.5 text-sm font-semibold text-slate-600 uppercase tracking-wide">
            {line.replace(/^#### /, "").replace(/\*\*/g, "")}
          </h4>
        );
      }
      // Bullet
      else if (/^[-•] /.test(line)) {
        flushNumbered();
        bulletGroup.push(renderInline(line.replace(/^[-•] /, "")));
      }
      // Bold-only line (standalone **...**) as a sub-heading
      else if (/^\*\*[^*]+\*\*[:\s]*$/.test(line.trim())) {
        flushBullets(); flushNumbered();
        elements.push(
          <p key={i} className="mt-4 mb-1.5 text-sm font-semibold text-slate-700">
            {line.replace(/\*\*/g, "").replace(/:$/, "")}:
          </p>
        );
      }
      // Numbered list
      else if (/^\d+\. /.test(line)) {
        flushBullets();
        const m = line.match(/^(\d+)\. (.*)/);
        if (m) numberedGroup.push({ num: m[1], text: m[2] });
      }
      // Checkmark lines like "✓ ..."
      else if (/^[✓✗] /.test(line)) {
        flushBullets(); flushNumbered();
        const isCheck = line.startsWith("✓");
        elements.push(
          <div key={i} className="flex items-start gap-2.5 my-1.5 ml-1">
            <span className={`mt-0.5 text-sm shrink-0 ${isCheck ? "text-emerald-500" : "text-red-400"}`}>{isCheck ? "✓" : "✗"}</span>
            <span className="text-slate-600 text-sm leading-relaxed">{renderInline(line.replace(/^[✓✗] /, ""))}</span>
          </div>
        );
      }
      // Empty line
      else if (line.trim() === "") {
        flushBullets(); flushNumbered();
        elements.push(<div key={i} className="h-1" />);
      }
      // Regular paragraph text
      else {
        flushBullets(); flushNumbered();
        const cleaned = line.replace(/^\*\s/, "").trim();
        if (cleaned) {
          elements.push(
            <p key={i} className="text-slate-600 text-sm leading-relaxed my-1">
              {renderInline(cleaned)}
            </p>
          );
        }
      }
      i++;
    }
    flushBullets();
    flushNumbered();

    return <div className="space-y-0.5">{elements}</div>;
  };

  const renderContent = () => {
    switch (tab) {
      case "notes":
        return renderNotesContent();
      case "transcript":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <FileText size={15} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">This is the raw transcript or source content used to generate your notes.</p>
            </div>
            {note.transcript.split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-slate-600 leading-relaxed text-sm">{para}</p>
            ))}
          </div>
        );
      case "key-points":
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-4">{note.keyPoints.length} key points extracted</p>
            {note.keyPoints.map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{point.replace(/^\*+\s*/, "")}</p>
              </motion.div>
            ))}
          </div>
        );
      case "definitions":
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-4">{note.definitions.length} terms defined</p>
            {note.definitions.map((def, i) => {
              const [term, ...rest] = def.split(": ");
              const meaning = rest.join(": ");
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400 shrink-0" />
                    <p className="font-semibold text-indigo-700 text-sm">{term.replace(/^\*+/, "").replace(/\*+$/, "")}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-4">{meaning}</p>
                </motion.div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white py-10 print:py-4 print:bg-white flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="print:hidden mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-slate-100 shadow-lg p-6 sm:p-8 mb-6 print:shadow-none print:border-0 print:p-0"
        >
          {/* Title row */}
          <div className="flex items-start gap-4 mb-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${
              note.source === "audio" ? "bg-purple-100 text-purple-600" :
              note.source === "video" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-600"
            }`}>
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") cancelEdit(); }}
                    className="flex-1 text-xl font-bold rounded-lg border border-indigo-300 px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button onClick={saveTitle} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"><Check size={15} /></button>
                  <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"><X size={15} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/title">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">{note.title}</h1>
                  <button onClick={startEditTitle} title="Edit title"
                    className="print:hidden p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover/title:opacity-100 transition">
                    <Pencil size={14} />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={12} />
                  {new Date(note.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Icon size={12} />
                  {sourceLabel[note.source]}
                </span>
                {note.keyPoints.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                    {note.keyPoints.length} key points
                  </span>
                )}
                {note.definitions.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                    {note.definitions.length} terms
                  </span>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="print:hidden flex items-center gap-2 shrink-0">
              <button onClick={handleShare}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition">
                <Share2 size={13} /> Share
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition">
                <Printer size={13} /> Print
              </button>
            </div>
          </div>

          {/* Summary box */}
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 inline-block" />
              Summary
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">{note.summary}</p>
          </div>
        </motion.div>

        {/* Notes Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden print:shadow-none print:border-0"
        >
          {/* Tab Bar */}
          <div className="print:hidden flex border-b border-slate-100 overflow-x-auto scrollbar-hide bg-slate-50/60">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  tab === t.value
                    ? "border-indigo-500 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
                }`}
              >
                <t.icon size={15} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Copy / Download bar */}
          <div className="print:hidden flex items-center justify-between gap-2 px-6 py-2.5 border-b border-slate-100 bg-white">
            <p className="text-xs text-slate-400 capitalize">{tab.replace("-", " ")}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const c = tab === "notes" ? note.fullNotes
                    : tab === "transcript" ? note.transcript
                    : tab === "key-points" ? note.keyPoints.map((p) => `• ${p}`).join("\n\n")
                    : note.definitions.map((d) => `• ${d}`).join("\n\n");
                  handleCopy(c);
                }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                {copied ? <><ClipboardCheck size={13} className="text-emerald-500" /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition">
                <Download size={13} /> Download
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">{renderContent()}</div>
        </motion.div>

      </div>
    </div>
  );
}
