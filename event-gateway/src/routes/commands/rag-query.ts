import { Request, Response } from "express";
import axios from "axios";
import { sendEventToKafka } from "../../pipelines/kafka-producer";

// Interface untuk RAG request
interface RAGRequest {
  query: string;
  context: {
    userId: string;
    message: string;
    expressResponse: unknown;
    timestamp: string;
  };
}

// Interface untuk RAG response
interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
  metadata?: {
    processingTime?: number;
    model?: string;
    tokens?: number;
  };
}

// RAG service helper
async function queryRAGService(request: RAGRequest): Promise<RAGResponse> {
  const ragEndpoint =
    process.env.RAG_ENDPOINT || "http://localhost:3000/api/rag/query";

  try {
    const response = await axios.post(ragEndpoint, request);
    return response.data;
  } catch (error) {
    console.error("❌ RAG service error:", error);
    // Fallback response
    return {
      answer: `Simulated RAG response untuk: "${request.query}"`,
      sources: ["simulated_source"],
      confidence: 0.8,
      metadata: {
        processingTime: 500,
        model: "simulated",
        tokens: 100,
      },
    };
  }
}

export async function ragQuery(req: Request, res: Response): Promise<void> {
  try {
    const { query, context }: RAGRequest = req.body;

    console.log("🤖 Processing RAG query:", {
      query: query.substring(0, 50) + "...",
      userId: context.userId,
    });

    // Kirim event ke Kafka untuk tracking
    await sendEventToKafka(
      `rag_query_${context.userId}`,
      {
        id: `rag_query_${Date.now()}`,
        query,
        userId: context.userId,
        source: "express",
        type: "rag_query",
        context,
        timestamp: new Date().toISOString(),
      },
      "normal"
    );

    // Kirim ke RAG service
    const ragResponse = await queryRAGService({
      query,
      context,
    });

    // Return response
    res.json({
      success: true,
      ragResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in RAG query:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process RAG query",
      details: String(error),
    });
  }
}

// Endpoint untuk RAG dengan callback ke Discord
export async function ragQueryWithCallback(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      query,
      context,
      sendToDiscord = false,
    }: RAGRequest & { sendToDiscord?: boolean } = req.body;

    console.log("🤖 Processing RAG query with callback:", {
      query: query.substring(0, 50) + "...",
      userId: context.userId,
      sendToDiscord,
    });

    // Kirim event ke Kafka untuk tracking
    await sendEventToKafka(
      `rag_query_callback_${context.userId}`,
      {
        id: `rag_query_callback_${Date.now()}`,
        query,
        userId: context.userId,
        source: "express",
        type: "rag_query_callback",
        context,
        sendToDiscord,
        timestamp: new Date().toISOString(),
      },
      "normal"
    );

    // Kirim ke RAG service
    const ragResponse = await queryRAGService({
      query,
      context,
    });

    // Jika diminta, kirim response ke Discord
    if (sendToDiscord && ragResponse.answer) {
      await sendToDiscordUser(context.userId, ragResponse.answer);
    }

    // Return response
    res.json({
      success: true,
      ragResponse,
      sentToDiscord: sendToDiscord,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in RAG query with callback:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process RAG query with callback",
      details: String(error),
    });
  }
}

// Helper function untuk kirim ke Discord
async function sendToDiscordUser(userId: string, message: string) {
  // Implementasi Discord bot send message
  console.log(`🤖 Sending RAG response to Discord user ${userId}: ${message}`);

  // Simulasi untuk sekarang
  return {
    sent: true,
    userId,
    message,
    timestamp: new Date().toISOString(),
  };
}
