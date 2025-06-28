import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Forward health check to RAG service
    const response = await fetch("http://localhost:3001/rag/health");
    const data = await response.json();

    return NextResponse.json({
      service: "RAG",
      status: data.status || "unknown",
      timestamp: new Date().toISOString(),
      endpoint: process.env.RAG_ENDPOINT || "http://localhost:3001",
      details: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: "RAG",
        status: "error",
        error: String(error),
        timestamp: new Date().toISOString(),
        endpoint: process.env.RAG_ENDPOINT || "http://localhost:3001",
      },
      { status: 500 }
    );
  }
}
