import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Forward info request to RAG service
    const response = await fetch("http://localhost:3001/rag/info");
    const data = await response.json();

    return NextResponse.json({
      ...data,
      timestamp: new Date().toISOString(),
      config: {
        endpoint: process.env.RAG_ENDPOINT || "http://localhost:3001",
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
        endpoint: process.env.RAG_ENDPOINT || "http://localhost:3001",
      },
      { status: 500 }
    );
  }
}
