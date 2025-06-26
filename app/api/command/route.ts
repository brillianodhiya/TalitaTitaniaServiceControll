import { NextRequest, NextResponse } from "next/server";
import { sendCommandToExpress } from "../../lib/kafka-consumer";
import { ragService } from "../../lib/rag-service";

export async function POST(request: NextRequest) {
  try {
    const { userId, message, query } = await request.json();

    // 1. Kirim command ke Express event-gateway
    console.log("📤 Sending command to Express:", { userId, message });
    const expressResponse = await sendCommandToExpress(userId, message);

    // 2. Kirim request ke RAG
    console.log("🤖 Sending to RAG:", { query });
    const ragResponse = await ragService.query({
      query,
      context: {
        userId,
        message,
        expressResponse,
        timestamp: new Date().toISOString(),
      },
    });

    // 3. Return response ke frontend
    return NextResponse.json({
      success: true,
      expressResponse,
      ragResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in command API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process command",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
