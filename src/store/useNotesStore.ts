import { create } from "zustand";
import { persist } from "zustand/middleware";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface Note {
  id: string;
  title: string;
  date: string;
  source: "audio" | "video" | "link";
  sourceInfo: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
  definitions: string[];
  fullNotes: string;
}

interface NotesStore {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "date">) => string;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  getNoteById: (id: string) => Note | undefined;
  clearAllNotes: () => void;
}

// Sample notes for demo
const sampleNotes: Note[] = [
  {
    id: "demo-1",
    title: "Machine Learning Basics",
    date: new Date(2026, 1, 15).toISOString(),
    source: "audio",
    sourceInfo: "ml-lecture-01.mp3",
    transcript:
      "Welcome to the first lecture on Machine Learning. Today we will cover the fundamentals of ML, including supervised and unsupervised learning. Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. The key types are: Supervised Learning where we train models on labeled data, Unsupervised Learning where the model finds patterns in unlabeled data, and Reinforcement Learning where agents learn through trial and error.",
    summary:
      "This lecture covers the foundational concepts of Machine Learning, differentiating between supervised, unsupervised, and reinforcement learning paradigms. It explains how ML enables systems to learn from data without explicit programming.",
    keyPoints: [
      "Machine Learning is a subset of Artificial Intelligence",
      "Supervised Learning uses labeled training data",
      "Unsupervised Learning discovers hidden patterns in unlabeled data",
      "Reinforcement Learning uses reward-based trial and error",
      "ML systems improve from experience automatically",
    ],
    definitions: [
      "Machine Learning: A subset of AI that enables systems to learn from experience without explicit programming",
      "Supervised Learning: Training models using labeled input-output pairs",
      "Unsupervised Learning: Finding hidden patterns in data without labels",
      "Reinforcement Learning: Learning through interaction with environment via rewards",
    ],
    fullNotes:
      "# Machine Learning Basics\n\n## Introduction\nMachine Learning (ML) is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.\n\n## Types of Machine Learning\n\n### 1. Supervised Learning\n- Uses labeled training data\n- Input-output pairs guide the model\n- Examples: Classification, Regression\n- Common algorithms: Linear Regression, Decision Trees, Neural Networks\n\n### 2. Unsupervised Learning\n- Works with unlabeled data\n- Discovers hidden patterns and structures\n- Examples: Clustering, Dimensionality Reduction\n- Common algorithms: K-Means, PCA, Autoencoders\n\n### 3. Reinforcement Learning\n- Agent learns through environment interaction\n- Uses reward/penalty signals\n- Examples: Game AI, Robotics\n- Key concepts: State, Action, Reward, Policy\n\n## Key Takeaways\n- ML automates analytical model building\n- Choose the right learning paradigm based on your data and problem\n- Data quality is crucial for model performance",
  },
  {
    id: "demo-2",
    title: "Data Structures: Arrays and Linked Lists",
    date: new Date(2026, 1, 12).toISOString(),
    source: "video",
    sourceInfo: "https://youtube.com/watch?v=example123",
    transcript:
      "In today's lecture we explore two fundamental data structures: arrays and linked lists. Arrays store elements in contiguous memory locations providing O(1) access time. Linked lists use nodes connected by pointers, offering O(1) insertion and deletion at known positions.",
    summary:
      "A comparison of arrays and linked lists, covering their memory layout, time complexities, and ideal use cases in software development.",
    keyPoints: [
      "Arrays provide O(1) random access via index",
      "Linked lists allow O(1) insertion/deletion at known positions",
      "Arrays use contiguous memory; linked lists use scattered nodes",
      "Arrays have fixed size; linked lists grow dynamically",
      "Choose based on your access vs modification patterns",
    ],
    definitions: [
      "Array: A collection of elements stored in contiguous memory locations",
      "Linked List: A linear data structure where elements are connected via pointers",
      "Time Complexity: A measure of algorithm efficiency as input grows",
      "Node: A basic unit of a linked list containing data and a pointer",
    ],
    fullNotes:
      "# Data Structures: Arrays and Linked Lists\n\n## Arrays\n- Contiguous memory allocation\n- O(1) access by index\n- O(n) insertion/deletion (shifting required)\n- Fixed size in most languages\n\n## Linked Lists\n- Nodes connected via pointers\n- O(n) access (traversal required)\n- O(1) insertion/deletion at known positions\n- Dynamic size\n\n## Comparison\n| Feature | Array | Linked List |\n|---------|-------|-------------|\n| Access | O(1) | O(n) |\n| Insert | O(n) | O(1) |\n| Memory | Contiguous | Scattered |\n| Size | Fixed | Dynamic |",
  },
  {
    id: "demo-3",
    title: "Introduction to Web Development",
    date: new Date(2026, 1, 10).toISOString(),
    source: "link",
    sourceInfo: "https://example.com/web-dev-lecture",
    transcript:
      "Web development involves building websites and applications for the internet. The three core technologies are HTML for structure, CSS for styling, and JavaScript for interactivity.",
    summary:
      "An introductory overview of web development covering the core trio of HTML, CSS, and JavaScript, and how they work together to create modern web experiences.",
    keyPoints: [
      "HTML provides the structure and content of web pages",
      "CSS handles visual styling and layout",
      "JavaScript adds interactivity and dynamic behavior",
      "Frontend development focuses on what users see",
      "Backend development handles server-side logic and databases",
    ],
    definitions: [
      "HTML: HyperText Markup Language — the standard language for creating web page structure",
      "CSS: Cascading Style Sheets — used for describing the visual presentation of HTML",
      "JavaScript: A programming language that enables interactive and dynamic web content",
      "Frontend: The client-side part of a web application visible to users",
      "Backend: The server-side logic, databases, and APIs behind a web application",
    ],
    fullNotes:
      "# Introduction to Web Development\n\n## The Core Technologies\n\n### HTML\n- Defines page structure\n- Uses semantic elements\n- Forms the skeleton of every webpage\n\n### CSS\n- Styles and layouts\n- Responsive design with media queries\n- Modern tools: Flexbox, Grid, Tailwind\n\n### JavaScript\n- Adds interactivity\n- DOM manipulation\n- Modern frameworks: React, Vue, Angular\n\n## Career Paths\n- Frontend Developer\n- Backend Developer\n- Full-Stack Developer",
  },
];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: sampleNotes,

      addNote: (noteData) => {
        const id = generateId();
        const newNote: Note = {
          ...noteData,
          id,
          date: new Date().toISOString(),
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        return id;
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        }));
      },

      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id);
      },

      clearAllNotes: () => {
        set({ notes: [] });
      },
    }),
    {
      name: "lecturescribe-notes",
    }
  )
);
