import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("📨 DM received from bot:", data);

    // Forward DM to event gateway
    const response = await fetch("http://localhost:3001/webhook/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      status: "forwarded",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error forwarding DM:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to forward DM",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
