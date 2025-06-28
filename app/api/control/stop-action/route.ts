import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { reason = "emergency_stop" } = await request.json();

    console.log(`⏹️ Stop Action: ${reason}`);

    // Forward stop command to RAG service
    const response = await fetch("http://localhost:3001/control/stop-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason,
        timestamp: new Date().toISOString(),
        source: "dashboard",
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      reason,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error stopping action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to stop action",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
