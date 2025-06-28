import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    console.log(`📡 Event Gateway Control: ${action}`);

    // Forward command to event gateway
    const response = await fetch(
      "http://localhost:3001/control/event-gateway",
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
    console.error("❌ Error controlling event gateway:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to control event gateway",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get event gateway status
    const response = await fetch(
      "http://localhost:3001/control/event-gateway/status"
    );
    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data,
    });
  } catch (error) {
    console.error("❌ Error getting event gateway status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get event gateway status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
