# 🎓 LectureScribe - AI-Powered Lecture Notes Generator

Transform your lecture audio files and video links into comprehensive, structured study notes using Google Gemini 1.5 Pro.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4)

## ✨ Features

- 🎵 **Audio Transcription**: Upload lecture recordings (MP3, WAV, M4A, etc.) and get accurate transcriptions using Google Gemini 1.5 Pro
- 🎥 **Video/Link Converter**: Paste YouTube or lecture links to extract content
- 🤖 **AI-Powered Notes**: Automatically generate structured notes with summaries, key points, and definitions using Gemini Pro
- 📝 **Smart Organization**: Dashboard to manage all your notes in one place
- 🎨 **Modern UI**: Beautiful, responsive interface with smooth animations
- 💾 **Persistent Storage**: Notes saved locally using Zustand with persistence
- 📤 **Export Options**: Download notes, print, or share with others

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** - Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lecture-scribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and add your Gemini API key:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Audio Upload

1. Navigate to **Upload Audio** page
2. Drag & drop an audio file or click to browse
3. Select the lecture language (optional)
4. Click **Convert to Notes**
5. Wait for AI processing (transcription + note generation)
6. View your structured notes!

### Video Converter

1. Navigate to **Video Converter** page
2. Paste a YouTube or lecture video URL
3. Select output format (Summary, Full Notes, or Key Concepts)
4. Click **Convert to Notes**
5. AI analyzes the content and generates notes

### Managing Notes

- Access all notes from the **Dashboard**
- Search and filter by source type
- Sort by date or alphabetically
- Download notes as text files
- Delete individual notes or clear all

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Your Google Gemini API key |
| `GEMINI_MODEL` | ❌ No | `gemini-1.5-pro-latest` | Gemini model version |
| `API_REQUEST_TIMEOUT` | ❌ No | `300000` | API timeout in milliseconds |
| `MAX_FILE_SIZE_MB` | ❌ No | `500` | Maximum upload file size |
| `DEBUG_MODE` | ❌ No | `false` | Enable detailed error logging |

### Google Gemini API Costs

**Gemini 1.5 Pro** (Audio + Text Processing):
- $0.006 per minute of audio
**Gemini 1.5 Pro** (Audio + Text Processing):
- Free tier: 15 requests per minute, 1,500 requests per day
- Paid pricing:
  - Input (text): $0.00125 per 1K tokens (up to 128K tokens)
  - Input (audio): $0.00125 per 1K tokens
  - Output: $0.00375 per 1K tokens
- Example: A 1-hour lecture typically costs $0.10 - $0.30 (significantly cheaper than OpenAI)

**💡 Tip**: Gemini offers generous free tier - start with the free tier to test the system!

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **Google Gemini 1.5 Pro** - Audio transcription + Note generation

## 📁 Project Structure

```
lecture-scribe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transcribe/route.ts      # Audio transcription endpoint
│   │   │   └── generate-notes/route.ts  # Note generation endpoint
│   │   ├── audio-upload/page.tsx        # Audio upload page
│   │   ├── video-converter/page.tsx     # Video converter page
│   │   ├── dashboard/page.tsx           # Notes dashboard
│   │   ├── notes/[id]/page.tsx          # Individual note viewer
│   │   └── globals.css                  # Global styles & design system
│   ├── components/
│   │   ├── Navbar.tsx                   # Navigation bar
│   │   ├── Footer.tsx                   # Footer component
│   │   └── Toast.tsx                    # Notification system
│   ├── store/
│   │   └── useNotesStore.ts             # Zustand store for notes
│   └── lib/
│       └── gemini.ts                    # Google Gemini integration utilities
├── .env.local                           # Environment variables (gitignored)
├── .env.example                         # Environment template
└── package.json                         # Dependencies
```

## 🔐 Security & Privacy

- **API keys are secured**: Never exposed to the client-side
- **Local storage**: Notes are stored in your browser's localStorage
- **No cloud storage**: Your data stays on your device
- **HTTPS required**: In production, always use HTTPS

## 🐛 Troubleshooting

### "OpenAI API key is not configured"
- Ensure `.env.local` exists in the project root
- Verify `OPENAI_API_KEY=sk-...` is set correctly
- Restart the development server after adding the key

### "File size exceeds limit"
- OpenAI Whisper has a 25MB file limit
- Compress your audio file using tools like Audacity
- Consider splitting long recordings into segments

### "API rate limit exceeded"
- OpenAI has rate limits based on your usage tier
- Wait a few minutes and try again
- Upgrade your OpenAI account tier if needed

### "Transcription resulted in empty text"
- Check if the audio file contains clear speech
- Try a different audio file format
- Ensure the audio is not corrupted

## 📝 Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` in Environment Variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

**Important**: Always set environment variables in your deployment platform's settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and personal use.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for Whisper and GPT-4 APIs
- [Next.js](https://nextjs.org) team for the amazing framework
- [Vercel](https://vercel.com) for hosting solutions

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review OpenAI API documentation

---

**Made with ❤️ using Next.js and OpenAI**

