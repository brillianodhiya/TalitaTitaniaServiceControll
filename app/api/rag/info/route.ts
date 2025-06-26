import { NextResponse } from "next/server";
import { ragService } from "../../../lib/rag-service";

export async function GET() {
  try {
    const serviceInfo = await ragService.getServiceInfo();

    return NextResponse.json({
      ...serviceInfo,
      timestamp: new Date().toISOString(),
      config: {
        endpoint: process.env.RAG_ENDPOINT || "simulated",
        hasApiKey: !!process.env.RAG_API_KEY,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: "unknown",
        status: "error",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
