import { NextRequest, NextResponse } from "next/server";
import { generateNotes } from "@/lib/gemini";

// POST /api/generate-notes
// Handles AI note generation from transcripts using Google Gemini Pro
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, title = "Lecture", mode = "full" } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    if (transcript.trim().length < 50) {
      return NextResponse.json(
        { error: "Transcript is too short. Please provide at least 50 characters." },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('[Generate Notes API] Gemini API key not configured');
      return NextResponse.json(
        { 
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.",
          instructions: "Get your API key from https://aistudio.google.com/app/apikey"
        },
        { status: 503 }
      );
    }

    console.log(`[Generate Notes API] Processing transcript: ${transcript.length} chars, mode: ${mode}`);

    // Generate notes using Gemini Pro
    const notes = await generateNotes(
      transcript,
      title,
      mode as 'summary' | 'full' | 'key-concepts'
    );

    console.log('[Generate Notes API] Notes generated successfully');

    return NextResponse.json({
      success: true,
      data: {
        mode,
        summary: notes.summary,
        keyPoints: notes.keyPoints,
        definitions: notes.definitions,
        fullNotes: notes.fullNotes,
      },
    });
  } catch (error: any) {
    console.error("[Generate Notes API] Error:", error);
    
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
