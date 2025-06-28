import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    console.log(`🎭 VTuber Engine Control: ${action}`);

    // Forward command to RAG service (VTuber engine control)
    const response = await fetch(
      "http://localhost:3001/control/vtuber-engine",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      action,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error controlling VTuber engine:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control VTuber engine",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get VTuber engine status
    const response = await fetch(
      "http://localhost:3001/control/vtuber-engine/status"
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data,
    });
  } catch (error) {
    console.error("❌ Error getting VTuber engine status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get VTuber engine status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
