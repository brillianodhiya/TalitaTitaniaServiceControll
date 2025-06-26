import { NextResponse } from "next/server";
import { ragService } from "../../../lib/rag-service";

export async function GET() {
  try {
    const isHealthy = await ragService.healthCheck();

    return NextResponse.json({
      service: "RAG",
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      endpoint: process.env.RAG_ENDPOINT || "simulated",
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: "RAG",
        status: "error",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
