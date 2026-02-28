# 🎯 Developer Guide — LectureScribe

## Project Overview

LectureScribe is a full-stack Next.js application that converts audio files and video lectures into structured study notes using Google Gemini AI.

### Tech Stack

- **Frontend**: Next.js 16.1.6, React 19.2.3, TypeScript 5
- **Styling**: Tailwind CSS 4, Custom CSS with gradients and animations
- **Animations**: Framer Motion 12
- **State Management**: Zustand 5 with persistence
- **AI Integration**: Google Gemini 2.5 Flash / 1.5 Pro
- **Icons**: Lucide React

---

## 🚀 Quick Start for Developers

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create or update `.env.local`:

```env
GEMINI_API_KEY=your-actual-api-key-here
GEMINI_MODEL=gemini-2.5-flash
DEBUG_MODE=true
```

Get your API key: https://aistudio.google.com/app/apikey

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📁 Project Structure

```
lecture-scribe/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with Navbar, Footer
│   │   ├── page.tsx             # Homepage
│   │   ├── audio-upload/        # Audio upload page
│   │   ├── video-converter/     # Video/link converter page
│   │   ├── dashboard/           # Notes dashboard
│   │   ├── notes/[id]/          # Individual note viewer
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page
│   │   ├── api/                 # API Routes
│   │   │   ├── transcribe/      # Audio transcription endpoint
│   │   │   └── generate-notes/  # Note generation endpoint
│   │   ├── loading.tsx          # Global loading component
│   │   ├── not-found.tsx        # 404 page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── Footer.tsx           # Footer
│   │   ├── Toast.tsx            # Toast notifications
│   │   ├── Progress.tsx         # Progress bars
│   │   ├── Spinner.tsx          # Loading spinners
│   │   ├── EmptyState.tsx       # Empty state displays
│   │   ├── Alert.tsx            # Alert messages
│   │   └── ErrorBoundary.tsx    # Error boundary component
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── gemini.ts            # Gemini AI integration
│   │   ├── hooks.ts             # Custom React hooks
│   │   └── utils.ts             # Utility functions
│   │
│   └── store/                   # State management
│       └── useNotesStore.ts     # Zustand store for notes
│
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in git)
├── .env.example                 # Example environment file
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
└── tailwind.config.ts           # Tailwind config (CSS in globals.css)
```

---

## 🔧 Key Features Implementation

### Audio Upload Flow
1. User uploads audio file
2. File validated (format, size)
3. Sent to `/api/transcribe`
4. API calls `transcribeAudio()` using Gemini
5. Gemini returns transcript
6. API calls `generateNotes()` to create structured notes
7. Note saved to Zustand store (persisted to localStorage)
8. User redirected to note viewer

### Video/Link Converter Flow
1. User pastes URL
2. Topic extracted from URL or user input
3. Sent to `/api/generate-notes` with context
4. Gemini generates notes based on topic knowledge
5. Note saved and displayed

### State Management
- **Zustand Store**: Manages all notes in memory + localStorage
- **Persistent**: Notes survive page refreshes
- **CRUD Operations**: Add, delete, update, clear notes

---

## 🎨 Styling Architecture

### CSS Variables (globals.css)
All colors, shadows, and design tokens defined in `:root`:
- `--primary`, `--secondary`, `--accent`
- `--gradient-bg`, `--glass-bg`
- Custom utility classes: `.badge`, `.btn-primary`, `.card-hover`

### Animations
- Framer Motion for page transitions
- Custom CSS animations: `float`, `pulse-glow`, `shimmer`
- Smooth hover effects on all interactive elements

---

## 🧩 Component Library

### Layout Components
- **Navbar**: Responsive navigation with active link indicators
- **Footer**: Multi-column footer with social links

### UI Components
- **Toast**: Notification system (success, error, warning, info)
- **Progress**: Linear and circular progress indicators
- **Spinner**: Multiple loading state variants
- **Alert**: Contextual messages
- **EmptyState**: Placeholder for empty views

### Utility Components
- **ErrorBoundary**: Catches React errors
- **LoadingCard**: Skeleton loaders

---

## 🔌 API Routes

### POST /api/transcribe
**Request:**
```typescript
FormData {
  file: File,
  language: string,
  mode: "summary" | "full" | "key-concepts"
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    transcript: string,
    title: string,
    summary: string,
    keyPoints: string[],
    definitions: string[],
    fullNotes: string
  }
}
```

### POST /api/generate-notes
**Request:**
```json
{
  "transcript": "string",
  "title": "string",
  "mode": "summary" | "full" | "key-concepts"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "string",
    "keyPoints": ["string"],
    "definitions": ["string"],
    "fullNotes": "string"
  }
}
```

---

## 🪝 Custom Hooks

### `useCopyToClipboard()`
```typescript
const { copied, copy } = useCopyToClipboard();
await copy("text to copy");
```

### `useDebounce(value, delay)`
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);
```

### `useLocalStorage(key, initialValue)`
```typescript
const [value, setValue] = useLocalStorage("myKey", "default");
```

### `useAsync(asyncFunction)`
```typescript
const { loading, error, data, execute } = useAsync(fetchData);
await execute(params);
```

---

## 🧪 Testing Notes

### Manual Testing Checklist

#### Audio Upload
- [ ] Upload valid audio file (MP3, WAV, M4A)
- [ ] Try invalid file format → should show error
- [ ] Try file > 500MB → should show error
- [ ] Select different languages
- [ ] Verify transcription works
- [ ] Verify notes generated correctly
- [ ] Check note appears in dashboard

#### Video Converter
- [ ] Paste YouTube URL
- [ ] Paste educational website URL
- [ ] Try invalid URL → should show error
- [ ] Add optional description
- [ ] Select different output modes
- [ ] Verify notes generated

#### Dashboard
- [ ] Search notes
- [ ] Filter by source (audio/video/link)
- [ ] Sort (newest, oldest, A-Z, Z-A)
- [ ] Download note
- [ ] Delete note
- [ ] Clear all notes

#### Note Viewer
- [ ] View full notes
- [ ] Switch tabs (Transcript, Key Points, Definitions)
- [ ] Edit title
- [ ] Copy content
- [ ] Download notes
- [ ] Print notes
- [ ] Share link

---

## 🚨 Common Issues & Solutions

### "Gemini API key is not configured"
- Check `.env.local` file exists
- Verify `GEMINI_API_KEY` is set
- Restart dev server after adding env vars

### "Module not found: Can't resolve '@google/generative-ai'"
```bash
npm install @google/generative-ai
```

### Transcription returns empty text
- Audio file may be corrupted
- Audio may be too short/silent
- Check Gemini API quota

### Notes not persisting
- Check localStorage is enabled in browser
- Clear browser cache and try again

---

## 🎯 Performance Optimization

### Current Optimizations
- React Compiler enabled (`reactCompiler: true`)
- Image optimization via Next.js
- CSS animations use GPU-accelerated transforms
- Lazy loading for routes
- Client-side state persistence

### Future Improvements
- Add streaming for long transcriptions
- Implement chunk-based uploads for large files
- Add service worker for offline support
- Optimize bundle size with dynamic imports

---

## 📦 Building for Production

### Build Command
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
Set these in your hosting platform:
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)
- `NODE_ENV=production`

---

## 🤝 Contributing

### Code Style
- TypeScript for all new files
- Use functional components with hooks
- Follow existing naming conventions
- Add comments for complex logic
- Use Prettier for formatting (auto-format on save)

### Component Guidelines
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use TypeScript interfaces for props
- Add JSDoc comments for utility functions

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Be descriptive: `feat: add video thumbnail preview to converter`

---

## 📄 License

This project is private.

---

## 👤 Author

**Neha Basandrai**
- Role: Full Stack Developer
- Project: LectureScribe — AI-Powered Lecture Notes Generator

---

## 📞 Support

For issues or questions:
- Check the README.md
- Review SETUP.md for configuration help
- Check the code comments
- Contact: hello@lecturescribe.ai

---

**Happy Coding! 🚀**
