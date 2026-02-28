import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

export interface NoteGenerationResult {
  summary: string;
  keyPoints: string[];
  definitions: string[];
  fullNotes: string;
}

export interface YouTubeTranscriptResult {
  success: boolean;
  transcript?: string;
  error?: string;
  title?: string;
  duration?: number;
}

/**
 * Convert File to Base64 for Gemini API
 */
async function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const base64 = Buffer.from(bytes).toString('base64');
  
  return {
    data: base64,
    mimeType: file.type || 'audio/mpeg',
  };
}

/**
 * Transcribe audio file using Google Gemini 1.5 Pro
 * Gemini 1.5 Pro has native audio understanding capabilities
 * @param audioFile - Audio file to transcribe
 * @param language - Optional language hint (e.g., 'English', 'Spanish', 'French')
 * @returns Transcription result with text and metadata
 */
export async function transcribeAudio(
  audioFile: File,
  language?: string
): Promise<TranscriptionResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.');
    }

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' 
    });

    console.log(`[Gemini] Transcribing audio file: ${audioFile.name}, size: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB`);

    // Convert file to base64
    const { data, mimeType } = await fileToBase64(audioFile);

    // Enhanced prompt for better transcription accuracy
    const languageHint = language ? ` The audio is in ${language}.` : '';
    const prompt = `You are an expert transcriptionist. Please transcribe this audio file with the highest accuracy possible.

**Requirements:**
${languageHint}
- Transcribe EVERY word spoken in the audio
- Include natural speech patterns, pauses (indicated by ...)
- Maintain proper sentence structure and paragraphs
- Preserve technical terms, names, and acronyms correctly
- If there are multiple speakers, indicate speaker changes
- Include timestamps for long content (if applicable)
- Do NOT add explanations, comments, or metadata
- Output ONLY the transcription text

Begin transcription:`;

    // Call Gemini with audio - retry logic for reliability
    let result;
    let retries = 3;
    
    while (retries > 0) {
      try {
        result = await model.generateContent([
          {
            inlineData: {
              data,
              mimeType,
            },
          },
          prompt,
        ]);
        break; // Success, exit retry loop
      } catch (err: any) {
        retries--;
        if (retries === 0) throw err;
        console.log(`[Gemini] Retry ${3 - retries}/3...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }

    if (!result) {
      throw new Error('Failed to get response from Gemini after retries');
    }

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Transcription resulted in empty text. The audio may be silent or unclear.');
    }

    // Clean up the transcription
    const cleanedText = text.trim()
      .replace(/^\s*transcription:?\s*/i, '') // Remove "transcription:" prefix
      .replace(/^\s*begin transcription:?\s*/i, '') // Remove "begin transcription" prefix
      .trim();

    console.log(`[Gemini] Transcription complete. Length: ${cleanedText.length} characters`);

    return {
      text: cleanedText,
      language: language || 'Detected from audio',
    };
  } catch (error: any) {
    console.error('[Gemini] Transcription error:', error);
    
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your .env.local file.');
    } else if (error?.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your Google Cloud billing settings.');
    } else if (error?.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error?.message?.includes('timeout')) {
      throw new Error('Transcription timeout. The audio file may be too long. Try a shorter file.');
    }
    
    throw new Error(`Transcription failed: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Fetch YouTube transcript using YouTube's transcript API
 * @param videoUrl - YouTube video URL or ID
 * @returns Transcript result with text, title, and metadata
 */
export async function fetchYouTubeTranscript(
  videoUrl: string
): Promise<YouTubeTranscriptResult> {
  try {
    console.log(`[YouTube] Fetching transcript for: ${videoUrl}`);
    
    // Extract video ID from URL
    let videoId = '';
    
    // Handle various YouTube URL formats
    if (videoUrl.includes('youtube.com/watch')) {
      const url = new URL(videoUrl);
      videoId = url.searchParams.get('v') || '';
    } else if (videoUrl.includes('youtube.com/shorts/')) {
      // Handle YouTube Shorts URLs: youtube.com/shorts/VIDEO_ID
      videoId = videoUrl.split('shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (videoUrl.includes('youtube.com/embed/')) {
      videoId = videoUrl.split('embed/')[1]?.split('?')[0] || '';
    } else if (videoUrl.length === 11 || videoUrl.match(/^[A-Za-z0-9_-]{11}$/)) {
      // Assume it's a video ID
      videoId = videoUrl;
    }
    
    if (!videoId) {
      return {
        success: false,
        error: 'Invalid YouTube URL or video ID'
      };
    }

    console.log(`[YouTube] Video ID: ${videoId}`);

    // Try to fetch transcript using YouTube's transcript API
    // Note: This is a simplified approach. For production, consider using youtube-transcript npm package
    try {
      const transcriptUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`;
      
      const response = await fetch(transcriptUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const xmlText = await response.text();
        
        // Parse XML transcript (simplified parsing)
        const textMatches = xmlText.matchAll(/<text[^>]*>([^<]+)<\/text>/g);
        const transcriptParts: string[] = [];
        
        for (const match of textMatches) {
          if (match[1]) {
            // Decode HTML entities
            const decoded = match[1]
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/\n/g, ' ')
              .trim();
            
            if (decoded) {
              transcriptParts.push(decoded);
            }
          }
        }

        if (transcriptParts.length > 0) {
          const fullTranscript = transcriptParts.join(' ');
          
          console.log(`[YouTube] Transcript fetched successfully. Length: ${fullTranscript.length} chars`);
          
          return {
            success: true,
            transcript: fullTranscript,
            title: `YouTube Video ${videoId}`,
          };
        }
      }
    } catch (fetchError) {
      console.log('[YouTube] Direct transcript fetch failed, will try to get video title');
    }

    // Try to get at least the video title using YouTube oEmbed API (no auth required)
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      console.log(`[YouTube] Fetching video metadata from oEmbed API for video ID: ${videoId}`);
      
      const metadataResponse = await fetch(oembedUrl);
      console.log(`[YouTube] oEmbed API response status: ${metadataResponse.status}`);

      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        console.log(`[YouTube] oEmbed metadata:`, metadata);
        
        if (metadata.title) {
          const title = metadata.title.trim();
          console.log(`[YouTube] Successfully extracted video title: ${title}`);
          
          // Return with title but no transcript
          return {
            success: false,
            error: 'Transcript not available, but video title was extracted',
            title: title
          };
        } else {
          console.log('[YouTube] oEmbed returned no title');
        }
      } else {
        console.log(`[YouTube] oEmbed API failed with status ${metadataResponse.status}`);
      }
    } catch (oembedError: any) {
      console.log('[YouTube] oEmbed API exception:', oembedError?.message || oembedError);
    }

    // Fallback: Try to get the video title from the YouTube page
    try {
      console.log('[YouTube] Trying page scraping fallback...');
      const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const pageResponse = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      console.log(`[YouTube] Page fetch status: ${pageResponse.status}`);

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        console.log(`[YouTube] Fetched HTML length: ${html.length} chars`);
        
        // Try to extract title from various possible locations in the HTML
        let title = '';
        
        // Method 1: Look for og:title meta tag
        const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
        if (ogTitleMatch) {
          title = ogTitleMatch[1];
          console.log(`[YouTube] Found title via og:title: ${title}`);
        }
        
        // Method 2: Look for <title> tag
        if (!title) {
          const titleMatch = html.match(/<title>([^<]+)<\/title>/);
          if (titleMatch) {
            title = titleMatch[1].replace(/ - YouTube$/, '');
            console.log(`[YouTube] Found title via <title> tag: ${title}`);
          }
        }
        
        // Method 3: Look for name="title" meta tag
        if (!title) {
          const nameTitleMatch = html.match(/<meta name="title" content="([^"]+)"/);
          if (nameTitleMatch) {
            title = nameTitleMatch[1];
            console.log(`[YouTube] Found title via name="title": ${title}`);
          }
        }

        if (title) {
          // Decode HTML entities
          title = title
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();

          console.log(`[YouTube] Successfully extracted video title from page: ${title}`);
          
          // Return with title but no transcript
          return {
            success: false,
            error: 'Transcript not available, but video title was extracted',
            title: title
          };
        } else {
          console.log('[YouTube] No title found in page HTML');
        }
      } else {
        console.log(`[YouTube] Page fetch failed with status ${pageResponse.status}`);
      }
    } catch (titleError: any) {
      console.log('[YouTube] Page scraping exception:', titleError?.message || titleError);
    }

    // Alternative: Use Gemini to generate content about the video topic
    // This is a fallback when transcript is not available
    console.log('[YouTube] All title extraction methods failed. No transcript or title available.');
    return {
      success: false,
      error: 'YouTube transcript not available. Please provide a description of the video content or use audio upload instead.'
    };
    
  } catch (error: any) {
    console.error('[YouTube] Transcript fetch error:', error);
    return {
      success: false,
      error: `Failed to fetch transcript: ${error?.message || 'Unknown error'}`
    };
  }
}

/**
 * Generate structured notes from transcript using Gemini Pro
 * @param transcript - The full transcript text
 * @param title - Title of the lecture
 * @param mode - Generation mode: 'summary', 'full', or 'key-concepts'
 * @returns Structured notes with summary, key points, definitions, and full notes
 */
export async function generateNotes(
  transcript: string,
  title: string,
  mode: 'summary' | 'full' | 'key-concepts' = 'full'
): Promise<NoteGenerationResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' 
    });

    console.log(`[Gemini] Generating notes for "${title}", mode: ${mode}, transcript length: ${transcript.length} chars`);

    // Build prompt based on mode
    let prompt = '';
    
    if (mode === 'summary') {
      prompt = `You are an expert educational assistant. Create a concise but comprehensive summary of the following lecture/content titled "${title}".

**Content:**
${transcript}

**Requirements:**
- Write 2-3 well-structured paragraphs (150-250 words total)
- Focus on the main ideas and key takeaways
- Make it clear and easy to understand
- Highlight the most important concepts
- Write in an educational, informative tone
- Do NOT say you cannot access content

Provide only the summary, nothing else.`;
    } else if (mode === 'key-concepts') {
      prompt = `You are an expert educational assistant. Extract the key concepts, important terms, and definitions from the following content titled "${title}".

**Content:**
${transcript}

**Requirements:**
Provide the following in a CLEARLY STRUCTURED format:

1. **SUMMARY** (1-2 paragraphs):
Brief overview of the main topic and its importance

2. **KEY POINTS** (7-10 bullet points):
- Start each line with a hyphen (-)
- Make each point specific and informative
- Cover the most important takeaways
- Each point should be a complete thought

3. **DEFINITIONS** (6-8 terms):
Format EXACTLY as: "Term: Clear definition"
Example: "Algorithm: A step-by-step procedure for solving a problem"

Be specific, educational, and helpful. Do NOT say you cannot access content.`;
    } else {
      // full mode - improved comprehensive prompt
      prompt = `You are an expert educational content creator and study guide specialist.

**Title:** "${title}"

**Source Material:**
${transcript}

**Your Task:**
Create comprehensive, professional study notes for students. Generate detailed educational content that covers all key aspects of the topic.

**REQUIRED OUTPUT STRUCTURE:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SECTION 1: SUMMARY**
Write 2-3 comprehensive paragraphs (200-300 words):
- Explain what this topic is about
- Why it's important
- What students will learn
- Main concepts covered
- Do NOT mention videos, transcripts, or that you cannot access content
- Write as if teaching the subject directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SECTION 2: KEY POINTS**
Provide 8-12 key points:
- Start each line with a hyphen (-)
- Each point should be a complete, informative sentence
- Cover the most important concepts
- Be specific and actionable
- Focus on what students need to remember

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SECTION 3: DEFINITIONS**
Provide 8-12 important terms:
Format EXACTLY as: "Term: Definition"
Example: "Machine Learning: A branch of AI that enables systems to learn from data"
- Choose the most important terms for this topic
- Make definitions clear and exam-ready
- Be specific to the subject matter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SECTION 4: FULL NOTES**
Create comprehensive markdown study notes with this structure:

# ${title}

## Introduction
- Clear explanation of the topic
- Why it matters
- Learning objectives
- Context and background

## Core Concepts

### Concept 1: [Name]
Detailed explanation with:
- What it is
- Why it's important
- How it works
- Examples

### Concept 2: [Name]
Continue with more key concepts...

### Concept 3: [Name]
Keep adding relevant concepts...

## Theoretical Foundations
- Scientific/theoretical basis
- Key principles
- Important models or frameworks
- Historical development

## Practical Applications
- Real-world uses
- Industry applications
- Case studies
- Examples of implementation

## Step-by-Step Process (if applicable)
1. First step with explanation
2. Second step with details
3. Continue as needed...

## Common Challenges & Solutions
- Typical difficulties students face
- Misconceptions to avoid
- Tips for understanding
- Problem-solving strategies

## Advanced Topics
- More complex aspects
- Current research
- Future directions
- Related fields

## Study Tips & Exam Preparation
- How to effectively learn this topic
- Practice recommendations
- Mnemonic devices
- Common exam questions
- Quick review checklist

## Key Formulas/Rules (if applicable)
Present any important formulas, rules, or procedures

## Summary Table
| Concept | Description | Importance |
|---------|-------------|------------|
| [Concept] | [Brief desc] | [Why important] |

## Quick Reference Guide
**Main Ideas:**
- Bullet point 1
- Bullet point 2
- Bullet point 3

**Must Remember:**
- Critical point 1
- Critical point 2
- Critical point 3

**Common Mistakes:**
- Mistake 1 and correction
- Mistake 2 and correction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMATTING REQUIREMENTS:
✓ Use proper markdown headings: #, ##, ###
✓ Use hyphens (-) for bullet points, NOT asterisks (*)
✓ Use numbered lists (1. 2. 3.) for steps
✓ DO NOT use ** for bold — write terms plainly or emphasize with a colon (Term: description)
✓ Make sections clearly separated with heading hierarchy
✓ Add comparison tables where appropriate (use | pipes |)
✓ Use code blocks for formulas if needed

CONTENT REQUIREMENTS:
✓ Be comprehensive and detailed (aim for 2000+ words)
✓ Create realistic, specific educational content
✓ Be confident and informative
✓ Do NOT say "cannot access" or reference source materials
✓ Make it useful for actual study and exam preparation
✓ Focus on teaching the subject effectively
✓ Include examples and explanations
✓ Be accurate and factual

Generate the comprehensive study notes now, following this exact structure:`;
    }

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`[Gemini] Generated content length: ${text.length} characters`);

    // Parse the response to extract structured data
    const notes = parseNotesResponse(text, title, mode);
    
    return notes;
  } catch (error: any) {
    console.error('[Gemini] Note generation error:', error);
    
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key.');
    } else if (error?.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your billing settings.');
    } else if (error?.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    
    throw new Error(`Note generation failed: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Parse Gemini response into structured format with improved extraction
 */
function parseNotesResponse(
  response: string,
  title: string,
  mode: string
): NoteGenerationResult {
  // Split response into lines for parsing
  const lines = response.split('\n').map(line => line.trim());
  
  let summary = '';
  let keyPoints: string[] = [];
  let definitions: string[] = [];
  let fullNotes = response;

  // Try to parse structured sections with enhanced detection
  let currentSection = '';
  let summaryLines: string[] = [];
  let keyPointsBuffer: string[] = [];
  let definitionsBuffer: string[] = [];
  let inFullNotes = false;
  let fullNotesStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const lowerLine = line.toLowerCase();
    
    // Detect section headers with better patterns
    if (
      (lowerLine.includes('summary') || lowerLine.includes('overview')) && 
      (lowerLine.startsWith('**') || lowerLine.startsWith('#') || lowerLine.includes('section 1')) &&
      lowerLine.length < 100
    ) {
      currentSection = 'summary';
      summaryLines = [];
      continue;
    } else if (
      (lowerLine.includes('key point') || lowerLine.includes('main point') || lowerLine.includes('key takeaway') || lowerLine.includes('section 2')) && 
      lowerLine.length < 100
    ) {
      currentSection = 'keypoints';
      keyPointsBuffer = [];
      continue;
    } else if (
      (lowerLine.includes('definition') || lowerLine.includes('key term') || lowerLine.includes('terminology') || lowerLine.includes('section 3')) && 
      lowerLine.length < 100
    ) {
      currentSection = 'definitions';
      definitionsBuffer = [];
      continue;
    } else if (
      (lowerLine.includes('full note') || lowerLine.includes('detailed note') || lowerLine.includes('comprehensive note') || lowerLine.includes('section 4')) && 
      lowerLine.length < 100
    ) {
      currentSection = 'fullnotes';
      inFullNotes = true;
      fullNotesStartIndex = i + 1;
      continue;
    }

    // Skip separator lines
    if (line.match(/^[━─=\-_]{3,}$/)) {
      continue;
    }

    // Parse content based on current section
    if (currentSection === 'summary' && !inFullNotes) {
      // Collect summary lines (skip headers and section markers)
      if (
        !line.startsWith('#') && 
        !line.startsWith('**') && 
        !line.match(/^[\d]+\./) &&
        !line.match(/^section/i) &&
        line.length > 20
      ) {
        summaryLines.push(line);
      }
    } else if (currentSection === 'keypoints' && !inFullNotes) {
      // Extract bullet points or numbered items
      if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || line.match(/^\d+\./)) {
        const cleaned = line.replace(/^[\d\-\*•\.)\s]+/, '').trim();
        if (cleaned && cleaned.length > 15 && !cleaned.toLowerCase().includes('key point')) {
          keyPointsBuffer.push(cleaned);
        }
      }
    } else if (currentSection === 'definitions' && !inFullNotes) {
      // Extract definitions (usually "Term: Definition" format)
      if (line.includes(':') && !line.startsWith('#')) {
        const cleaned = line.replace(/^[\d\-\*•\.)\s]+/, '').trim();
        if (
          cleaned && 
          cleaned.length > 15 && 
          cleaned.length < 300 &&
          !cleaned.toLowerCase().startsWith('definition') &&
          !cleaned.toLowerCase().includes('section')
        ) {
          definitionsBuffer.push(cleaned);
        }
      }
    }
  }

  // Build summary from collected lines
  summary = summaryLines
    .filter(l => l.length > 0)
    .join(' ')
    .trim()
    .substring(0, 1500);
  
  // If no structured summary found, extract from beginning of response
  if (!summary || summary.length < 100) {
    // Look for substantial paragraphs near the start
    const paragraphs = response.split('\n\n').filter(p => {
      const lower = p.toLowerCase();
      const trimmed = p.trim();
      return trimmed && 
             trimmed.length > 80 && 
             trimmed.length < 2000 &&
             !trimmed.startsWith('#') && 
             !lower.includes('━') &&
             !lower.includes('section 2') &&
             !lower.includes('section 3') &&
             !lower.includes('section 4') &&
             !lower.match(/^\*\*key\s+point/i) &&
             !lower.match(/^\*\*definition/i);
    });
    
    summary = paragraphs
      .slice(0, 3)
      .join('\n\n')
      .trim()
      .substring(0, 1500);
  }

  // Use collected key points
  keyPoints = keyPointsBuffer.length > 0 ? keyPointsBuffer : [];

  // If we still didn't find key points, extract bullet points from response
  if (keyPoints.length === 0) {
    const bulletPoints = lines.filter(l => 
      (l.startsWith('-') || l.startsWith('*') || l.startsWith('•')) && 
      l.length > 20 && 
      l.length < 500 &&
      !l.toLowerCase().includes('summary') &&
      !l.toLowerCase().includes('section')
    );
    keyPoints = bulletPoints
      .slice(0, 15)
      .map(l => l.replace(/^[\-\*•\s]+/, '').trim())
      .filter(p => p.length > 15);
  }

  // Use collected definitions
  definitions = definitionsBuffer.length > 0 ? definitionsBuffer : [];

  // If we didn't find definitions, look for colon-separated items
  if (definitions.length === 0) {
    const colonItems = lines.filter(l => {
      const hasColon = l.includes(':');
      const properLength = l.length > 25 && l.length < 300;
      const notMetadata = !l.toLowerCase().includes('transcript') && 
                         !l.toLowerCase().includes('source') &&
                         !l.toLowerCase().includes('section');
      const startsWithWord = /^[A-Z][a-z]/.test(l) || l.startsWith('-') || l.startsWith('*');
      
      return hasColon && properLength && notMetadata && startsWithWord;
    });
    
    definitions = colonItems
      .map(l => l.replace(/^[\-\*•\s]+/, '').trim())
      .slice(0, 12);
  }

  // Extract full notes if section was marked
  if (fullNotesStartIndex > 0) {
    const fullNotesLines = lines.slice(fullNotesStartIndex);
    fullNotes = fullNotesLines.join('\n').trim();
  }

  // Enhance full notes with proper structure if needed
  if (!fullNotes.includes('# ') && !fullNotes.includes('## ')) {
    fullNotes = `# ${title}\n\n${fullNotes}`;
  }

  // Ensure we have at least some defaults if parsing failed
  if (keyPoints.length === 0) {
    keyPoints = [
      'Core concepts and fundamental principles explained in detail',
      'Practical examples and real-world applications demonstrated',
      'Key terminology, definitions, and technical vocabulary covered',
      'Important relationships and connections between concepts',
      'Problem-solving approaches and methodologies discussed',
    ];
  }

  if (definitions.length === 0) {
    definitions = [
      `${title}: The primary subject matter of this educational content`,
      'Core Concepts: Fundamental ideas and principles explored throughout',
      'Key Terms: Essential vocabulary and terminology related to the topic',
    ];
  }

  if (!summary || summary.length < 50) {
    summary = `This comprehensive study guide covers ${title}, providing detailed explanations of core concepts, practical applications, and key terminology. The material is designed to help students understand the fundamental principles and develop a strong foundation in the subject matter.`;
  }

  // Clean up and return with limits
  return {
    summary: summary.trim().substring(0, 1500),
    keyPoints: keyPoints.slice(0, 15).filter(p => p.length > 10),
    definitions: definitions.slice(0, 12).filter(d => d.includes(':')),
    fullNotes: fullNotes.trim(),
  };
}
