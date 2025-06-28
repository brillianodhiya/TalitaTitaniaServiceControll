import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const decisionType = searchParams.get("decisionType");
    const emotion = searchParams.get("emotion");

    // Get AI decisions from RAG service
    const response = await fetch(
      `http://localhost:3001/monitor/decisions?limit=${limit}&decisionType=${
        decisionType || ""
      }&emotion=${emotion || ""}`
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      decisions: data.decisions,
      total: data.total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching AI decisions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch AI decisions",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
