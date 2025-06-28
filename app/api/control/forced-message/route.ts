import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, priority = "critical" } = await request.json();

    console.log(`⚡ Forced Message: ${message} (${priority})`);

    // Forward forced message to RAG service
    const response = await fetch(
      "http://localhost:3001/control/forced-message",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          priority,
          timestamp: new Date().toISOString(),
          source: "dashboard",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message,
      priority,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error sending forced message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send forced message",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
