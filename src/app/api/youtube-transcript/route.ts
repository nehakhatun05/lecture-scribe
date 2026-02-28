import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeTranscript } from "@/lib/gemini";

// POST /api/youtube-transcript
// Fetches YouTube video transcript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    console.log(`[YouTube Transcript API] Fetching transcript for: ${url}`);

    // Validate it's a YouTube URL
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    
    if (!isYouTube) {
      return NextResponse.json(
        { error: "Not a valid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch the transcript
    const result = await fetchYouTubeTranscript(url);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || "Failed to fetch transcript",
          success: false,
          title: result.title, // Include title even if transcript fetch failed
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript: result.transcript,
      title: result.title,
      duration: result.duration,
    });
  } catch (error: any) {
    console.error("[YouTube Transcript API] Error:", error);
    
    return NextResponse.json(
      { 
        error: error?.message || "Failed to fetch transcript",
        success: false
      },
      { status: 500 }
    );
  }
}
