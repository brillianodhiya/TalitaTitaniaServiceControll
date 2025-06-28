import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();

    console.log(`🎤 STT Control: ${enabled ? "Enable" : "Disable"}`);

    // Forward STT control to RAG service
    const response = await fetch("http://localhost:3001/control/stt", {
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
    console.error("❌ Error controlling STT:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control STT",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get STT status
    const response = await fetch("http://localhost:3001/control/stt/status");
    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data,
    });
  } catch (error) {
    console.error("❌ Error getting STT status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get STT status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
