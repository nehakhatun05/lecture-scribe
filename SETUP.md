# 🚀 LectureScribe Setup Instructions

## Step-by-Step Setup Guide

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@google/generative-ai` - Google Gemini API client for audio transcription and text generation
- All existing dependencies (Next.js, React, Tailwind, etc.)

### 2. Get Your Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. **Important**: Save it securely!

### 3. Configure Environment Variables

The project includes `.env.local` with your API key. If you need to change it, update:

```env
# Open .env.local and replace with your key:
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

**Example**:
```env
GEMINI_API_KEY=AIzaSyDEkbPtaIu-FkPvL4EZlnBihaXa6yq2s1M
```

### 4. Verify Setup

Start the development server:

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 2.5s
```

### 5. Test the Integration

#### Option A: Quick Test with Audio Upload

1. Open http://localhost:3000
2. Navigate to "Upload Audio"
3. Upload a short audio file (30 seconds to 1 minute recommended for first test)
4. Select language (English by default)
5. Click "Convert to Notes"
6. Wait 30-60 seconds for processing

**Expected Result**: You'll see a progress bar, then be redirected to your notes with:
- Full transcript of the audio
- AI-generated summary
- Key points extracted
- Definitions and terms
- Structured notes

#### Option B: Test with Video Link

1. Navigate to "Video Converter"
2. Paste any educational YouTube URL
3. Select output format
4. Click "Convert to Notes"
5. View the generated content

**Note**: Video converter currently uses URL-based content generation. Full video transcription requires additional server-side setup.

### 6. Troubleshooting

#### ❌ "Gemini API key is not configured"

**Solution**:
1. Check that `.env.local` exists in the project root (same folder as `package.json`)
2. Verify your API key is correct
3. Restart the development server: Stop (Ctrl+C) and run `npm run dev` again

#### ❌ "Module not found: Can't resolve '@google/generative-ai'"

**Solution**:
```bash
npm install @google/generative-ai
```

#### ❌ API returns 401 Unauthorized

**Causes**:
- Invalid API key
- API key was regenerated/deleted from OpenAI dashboard
- Typo in the key

**Solution**:
- Generate a new API key from OpenAI dashboard
- Update `.env.local`
- Restart server

#### ❌ API returns 429 Rate Limit

**Causes**:
- Too many requests in short time
- Free tier limitations

**Solution**:
- Wait a few minutes
- Upgrade your OpenAI account tier
- Check your usage at platform.openai.com

#### ❌ "File size exceeds 25MB limit"

**Causes**:
- OpenAI Whisper has a 25MB file size limit

**Solution**:
- Compress your audio file using Audacity or similar tools
- Convert to MP3 with lower bitrate
- Split long recordings into segments

### 7. Understanding API Costs

#### Whisper API (Transcription)
- **Price**: $0.006 per minute
- **Examples**:
  - 5-minute lecture: ~$0.03
  - 30-minute lecture: ~$0.18
  - 1-hour lecture: ~$0.36

#### GPT-4 Turbo (Note Generation)
- **Price**: ~$0.01 input + $0.03 output per 1K tokens
- **Examples**:
  - Short transcript (5 min): ~$0.03-0.05
  - Medium transcript (30 min): ~$0.10-0.15
  - Long transcript (1 hour): ~$0.20-0.30

#### Total Cost Per Lecture
- **5-minute lecture**: ~$0.06-0.08
- **30-minute lecture**: ~$0.28-0.33  
- **1-hour lecture**: ~$0.56-0.66

**💡 Tips to Save Money**:
1. Start with short audio files (1-5 minutes) to test
2. Use "Summary Only" mode instead of "Full Notes" when appropriate
3. Review transcripts before generating notes
4. Set up billing alerts in OpenAI dashboard

### 8. Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### 9. Optional: Enable Debug Mode

For detailed logging during development, update `.env.local`:

```env
DEBUG_MODE=true
```

This will show:
- API request/response details
- Error stack traces
- Processing timestamps

### 10. Next Steps

✅ **You're all set!** Now you can:
- Upload audio files and get instant transcriptions
- Generate AI-powered study notes
- Organize notes in the dashboard
- Export and share your notes

#### Advanced Features (Coming Soon)
- Real YouTube video transcription
- Batch processing multiple files
- Custom note templates
- Cloud sync across devices

### 11. Getting Help

If you encounter issues:

1. **Check the logs** in your terminal where `npm run dev` is running
2. **Review error messages** - they usually indicate the problem
3. **Verify your setup**:
   ```bash
   # Check if .env.local exists
   ls .env.local
   
   # Verify dependencies are installed
   npm list openai
   ```
4. **Test your API key** directly at platform.openai.com
5. **Check OpenAI status** at status.openai.com

### 12. Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Set environment variables** in your hosting platform:
   - Go to project settings
   - Add `OPENAI_API_KEY` with your key
   - Optionally add other variables

2. **Never commit** `.env.local` to Git (it's already in `.gitignore`)

3. **Use HTTPS** - Required for security and API access

4. **Monitor usage** - Set up billing alerts in OpenAI dashboard

5. **Rate limiting** - Consider implementing usage limits per user

---

## Quick Reference

```bash
# Installation
npm install

# Configure
# Edit .env.local and add: OPENAI_API_KEY=sk-your-key

# Start
npm run dev

# Test
# Open http://localhost:3000 and upload a short audio file
```

**Happy note-taking! 📚✨**
