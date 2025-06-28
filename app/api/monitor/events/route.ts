import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const source = searchParams.get("source");
    const priority = searchParams.get("priority");

    // Get events from RAG service
    const response = await fetch(
      `http://localhost:3001/monitor/events?limit=${limit}&source=${
        source || ""
      }&priority=${priority || ""}`
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      events: data.events,
      total: data.total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
