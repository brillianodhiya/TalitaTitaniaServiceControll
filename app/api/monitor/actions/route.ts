import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const actionType = searchParams.get("actionType");
    const status = searchParams.get("status");

    // Get VTuber actions from RAG service
    const response = await fetch(
      `http://localhost:3001/monitor/actions?limit=${limit}&actionType=${
        actionType || ""
      }&status=${status || ""}`
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      actions: data.actions,
      total: data.total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching VTuber actions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch VTuber actions",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
