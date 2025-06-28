import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const vtuberCommand = await request.json();

    console.log("🎭 VTuber Command received:", {
      commandType: vtuberCommand.commandType,
      priority: vtuberCommand.priority,
      source: vtuberCommand.metadata?.source,
    });

    // Forward command to RAG service
    const response = await fetch("http://localhost:3001/vtuber/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vtuberCommand),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      commandId: vtuberCommand.id,
      response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in VTuber command API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute VTuber command",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    // Get VTuber commands from RAG service
    const response = await fetch(
      `http://localhost:3001/vtuber/command?limit=${limit}`
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      commands: data.commands,
      total: data.total,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching VTuber commands:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch VTuber commands",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
