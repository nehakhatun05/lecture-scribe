"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Headphones,
  Video,
  Link2,
  Download,
  Trash2,
  Calendar,
  ChevronRight,
  FolderOpen,
  SortAsc,
  Trash,
} from "lucide-react";
import { useNotesStore, Note } from "@/store/useNotesStore";
import { useToast } from "@/components/Toast";

const sourceIcon = {
  audio: Headphones,
  video: Video,
  link: Link2,
};

const sourceColor = {
  audio: "bg-purple-100 text-purple-600",
  video: "bg-red-100 text-red-600",
  link: "bg-blue-100 text-blue-600",
};

type SortMode = "newest" | "oldest" | "az" | "za";

export default function DashboardPage() {
  const notes = useNotesStore((s) => s.notes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const clearAllNotes = useNotesStore((s) => s.clearAllNotes);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "audio" | "video" | "link">("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const sorted = [...notes].sort((a, b) => {
    if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  const filtered = sorted.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.sourceInfo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.source === filter;
    return matchSearch && matchFilter;
  });

  const handleDownload = (note: Note) => {
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\nDate: ${new Date(note.date).toLocaleDateString()}\nSource: ${note.sourceInfo}\n\n---\n\n${note.fullNotes}\n\n---\n\nKey Points:\n${note.keyPoints.map((p) => `• ${p}`).join("\n")}\n\nDefinitions:\n${note.definitions.map((d) => `• ${d}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded "${note.title}"`);
  };

  const handleDelete = (note: Note) => {
    if (confirm(`Delete "${note.title}"?`)) {
      deleteNote(note.id);
      toast.success("Note deleted");
    }
  };

  const handleClearAll = () => {
    if (confirm("Delete ALL notes? This cannot be undone.")) {
      clearAllNotes();
      toast.info("All notes cleared");
    }
  };

  const filters: { value: typeof filter; label: string }[] = [
    { value: "all", label: "All Notes" },
    { value: "audio", label: "Audio" },
    { value: "video", label: "Video" },
    { value: "link", label: "Links" },
  ];

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "az", label: "A → Z" },
    { value: "za", label: "Z → A" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-indigo-50/20 to-white py-12">
      <div className="block container-center w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
        >
          <div>
            <div className="badge mb-4">
              <LayoutDashboard size={15} />
              Notes Dashboard
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Your <span className="gradient-text">Notes Library</span>
            </h1>
            <p className="mt-3 text-text-muted">
              All your converted lecture notes in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/audio-upload"
              className="btn-primary"
            >
              <Headphones size={18} />
              Upload Audio
            </Link>
            <Link
              href="/video-converter"
              className="btn-secondary"
            >
              <Video size={18} />
              Paste Link
            </Link>
            {notes.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition-all hover:border-red-500 hover:bg-red-50"
              >
                <Trash size={18} />
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full card p-6 mb-10 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search notes by title or source..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    filter === f.value
                      ? "gradient-bg text-white shadow-lg shadow-primary/30"
                      : "bg-surface border border-border text-text-muted hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-muted">
                <SortAsc size={16} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="bg-transparent focus:outline-none text-sm font-medium cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Total Notes", value: notes.length, gradient: "from-indigo-500 to-purple-600" },
            {
              label: "From Audio",
              value: notes.filter((n) => n.source === "audio").length,
              gradient: "from-purple-500 to-pink-600",
            },
            {
              label: "From Video",
              value: notes.filter((n) => n.source === "video").length,
              gradient: "from-red-500 to-rose-600",
            },
            {
              label: "From Links",
              value: notes.filter((n) => n.source === "link").length,
              gradient: "from-cyan-500 to-blue-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group card-hover p-6 text-center relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <p className={`text-4xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                <p className="text-sm text-text-muted font-medium mt-2">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Notes Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-6">
              <FolderOpen size={36} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No notes found</h3>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              {search || filter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Start by uploading an audio file or pasting a video link to generate your first notes."}
            </p>
          </motion.div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note, i) => {
              const Icon = sourceIcon[note.source];
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="w-full card-hover overflow-hidden group"
                >
                  <Link href={`/notes/${note.id}`} className="block p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${sourceColor[note.source]} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <Icon size={22} />
                      </div>
                      <ChevronRight
                        size={22}
                        className="text-text-muted/30 group-hover:text-primary group-hover:translate-x-1 transition"
                      />
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:gradient-text transition">
                      {note.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-3 mb-4 leading-relaxed">
                      {note.summary.slice(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                      <Calendar size={13} />
                      {new Date(note.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </Link>
                  <div className="flex border-t border-border">
                    <button
                      onClick={() => handleDownload(note)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-text-muted hover:text-primary hover:bg-primary/5 transition"
                    >
                      <Download size={15} />
                      Download
                    </button>
                    <div className="w-px bg-border" />
                    <button
                      onClick={() => handleDelete(note)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
