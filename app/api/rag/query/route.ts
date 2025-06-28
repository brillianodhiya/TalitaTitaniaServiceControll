import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const ragRequest = await request.json();

    console.log("🤖 RAG Query received:", {
      query: ragRequest.query?.substring(0, 50) + "...",
      userId: ragRequest.context?.userId,
    });

    // Forward query to RAG service
    const response = await fetch("http://localhost:3001/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ragRequest),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      ragResponse: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in RAG query API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process RAG query",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
