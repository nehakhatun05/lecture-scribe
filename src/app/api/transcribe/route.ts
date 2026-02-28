import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio, generateNotes } from "@/lib/gemini";

// POST /api/transcribe
// Handles audio transcription using Google Gemini 1.5 Pro
// Also generates structured notes from the transcript using Gemini Pro
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "English";
    const mode = (formData.get("mode") as string) || "full";

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/mp4",
      "audio/m4a",
      "audio/ogg",
      "audio/flac",
      "audio/aac",
      "audio/x-m4a",
      "audio/webm",
    ];
    
    const isValidType = allowedTypes.some((type) => 
      file.type === type || file.name.toLowerCase().endsWith(type.replace('audio/', '.'))
    );
    
    if (!isValidType) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload MP3, WAV, M4A, OGG, FLAC, or AAC files." },
        { status: 400 }
      );
    }

    // Check file size (max 20MB for Gemini API)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 20MB limit. Please use a smaller file or compress your audio." },
        { status: 400 }
      );
    }

    console.log(`[Transcribe API] Processing file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('[Transcribe API] Gemini API key not configured');
      return NextResponse.json(
        { 
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.",
          instructions: "Get your API key from https://aistudio.google.com/app/apikey"
        },
        { status: 503 }
      );
    }

    // Step 1: Transcribe audio using Gemini
    console.log('[Transcribe API] Starting transcription...');
    const transcriptionResult = await transcribeAudio(file, language);
    console.log(`[Transcribe API] Transcription complete. Length: ${transcriptionResult.text.length} chars`);

    if (!transcriptionResult.text || transcriptionResult.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcription resulted in empty text. The audio may be silent or unclear." },
        { status: 400 }
      );
    }

    // Step 2: Generate structured notes from transcript
    console.log('[Transcribe API] Generating notes...');
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, ' ');
    const notes = await generateNotes(
      transcriptionResult.text, 
      title,
      mode as 'summary' | 'full' | 'key-concepts'
    );
    console.log('[Transcribe API] Notes generated successfully');

    return NextResponse.json({
      success: true,
      data: {
        transcript: transcriptionResult.text,
        title: title,
        language: transcriptionResult.language || language,
        duration: transcriptionResult.duration,
        summary: notes.summary,
        keyPoints: notes.keyPoints,
        definitions: notes.definitions,
        fullNotes: notes.fullNotes,
      },
    });
  } catch (error: any) {
    console.error("[Transcribe API] Error:", error);
    
    const errorMessage = error?.message || "Internal server error";
    const statusCode = error?.status || 500;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.DEBUG_MODE === 'true' ? error?.stack : undefined
      },
      { status: statusCode }
    );
  }
}
