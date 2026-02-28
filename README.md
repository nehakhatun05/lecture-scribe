# ?? LectureScribe — AI-Powered Lecture Notes Generator

Transform your lecture audio files and video links into comprehensive, structured study notes using Google Gemini AI.

[![Live Demo](https://img.shields.io/badge/??_Live_Demo-lecture--scribe--ten.vercel.app-6366f1?style=for-the-badge)](https://lecture-scribe-ten.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-nehakhatun05%2Flecture--scribe-181717?style=for-the-badge&logo=github)](https://github.com/nehakhatun05/lecture-scribe)

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)

---

## ?? Live Pages

| Page | URL | Description |
|------|-----|-------------|
| ?? Home | [/](https://lecture-scribe-ten.vercel.app/) | Landing page |
| ?? Audio Upload | [/audio-upload](https://lecture-scribe-ten.vercel.app/audio-upload) | Upload audio files to generate notes |
| ?? Video Converter | [/video-converter](https://lecture-scribe-ten.vercel.app/video-converter) | Convert YouTube/video URLs to notes |
| ?? Dashboard | [/dashboard](https://lecture-scribe-ten.vercel.app/dashboard) | Manage all your notes |
| ?? About | [/about](https://lecture-scribe-ten.vercel.app/about) | About LectureScribe |
| ?? Contact | [/contact](https://lecture-scribe-ten.vercel.app/contact) | Contact page |

---

## ? Features

- ?? **Audio Transcription** — Upload lecture recordings (MP3, WAV, M4A, OGG, WebM) and get accurate transcriptions
- ?? **Video/YouTube Converter** — Paste YouTube or lecture links to extract content and generate notes
- ?? **AI-Powered Notes** — Generate structured notes with summaries, key points, and definitions
- ?? **Three Note Modes** — Summary, Full Notes (2000+ words), or Key Concepts
- ?? **Smart Dashboard** — Manage, search, filter, and sort all your notes
- ?? **Modern UI** — Beautiful, responsive interface with smooth animations
- ?? **Persistent Storage** — Notes saved locally using Zustand with persistence
- ?? **Export Options** — Download notes as text, print, or share links

---

## ?? Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** — Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nehakhatun05/lecture-scribe.git
   cd lecture-scribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   GEMINI_MODEL=gemini-2.5-flash
   API_REQUEST_TIMEOUT=300000
   MAX_FILE_SIZE_MB=500
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** at [http://localhost:3000](http://localhost:3000)

---

## ??? Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| State | Zustand (with persistence) |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel |
| Source Control | GitHub |

---

## ?? Project Structure

```
lecture-scribe/
+-- src/
¦   +-- app/
¦   ¦   +-- api/
¦   ¦   ¦   +-- transcribe/route.ts          # Audio transcription endpoint
¦   ¦   ¦   +-- generate-notes/route.ts      # Note generation endpoint
¦   ¦   ¦   +-- youtube-transcript/route.ts  # YouTube transcript fetcher
¦   ¦   +-- audio-upload/page.tsx            # Audio upload page
¦   ¦   +-- video-converter/page.tsx         # Video converter page
¦   ¦   +-- dashboard/page.tsx               # Notes dashboard
¦   ¦   +-- notes/[id]/page.tsx              # Individual note viewer
¦   ¦   +-- about/page.tsx                   # About page
¦   ¦   +-- contact/page.tsx                 # Contact page
¦   ¦   +-- globals.css                      # Global styles
¦   +-- components/
¦   ¦   +-- Navbar.tsx
¦   ¦   +-- Footer.tsx
¦   ¦   +-- Toast.tsx
¦   +-- store/
¦   ¦   +-- useNotesStore.ts
¦   +-- lib/
¦       +-- gemini.ts                        # Google Gemini AI integration
+-- package.json
```

---

## ?? Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ? Yes | — | Your Google Gemini API key |
| `GEMINI_MODEL` | ? No | `gemini-2.5-flash` | Gemini model version |
| `API_REQUEST_TIMEOUT` | ? No | `300000` | Timeout in ms |
| `MAX_FILE_SIZE_MB` | ? No | `500` | Max upload file size |

---

## ?? Deployment

**Live URL:** https://lecture-scribe-ten.vercel.app
**GitHub Repo:** https://github.com/nehakhatun05/lecture-scribe

To deploy your own copy:
1. Fork the repo
2. Import it on [vercel.com/new](https://vercel.com/new)
3. Add `GEMINI_API_KEY` in Vercel Environment Variables
4. Deploy!

---

## ?? Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## ?? License

MIT License — free to use for learning and personal projects.

---

**Made with ?? by Neha Khatun — using Next.js and Google Gemini AI**
