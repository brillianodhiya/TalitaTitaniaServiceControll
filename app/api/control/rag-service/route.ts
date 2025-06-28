import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    console.log(`🎮 RAG Service Control: ${action}`);

    // Forward command to RAG service
    const response = await fetch("http://localhost:3001/control/rag-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      action,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error controlling RAG service:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control RAG service",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get RAG service status
    const response = await fetch(
      "http://localhost:3001/control/rag-service/status"
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data,
    });
  } catch (error) {
    console.error("❌ Error getting RAG service status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get RAG service status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
