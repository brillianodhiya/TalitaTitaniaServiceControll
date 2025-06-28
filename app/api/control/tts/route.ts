import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();

    console.log(`🔊 TTS Control: ${enabled ? "Enable" : "Disable"}`);

    // Forward TTS control to RAG service
    const response = await fetch("http://localhost:3001/control/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled,
        timestamp: new Date().toISOString(),
        source: "dashboard",
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      enabled,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error controlling TTS:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control TTS",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get TTS status
    const response = await fetch("http://localhost:3001/control/tts/status");
    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data,
    });
  } catch (error) {
    console.error("❌ Error getting TTS status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get TTS status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
