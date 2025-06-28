import { Request, Response } from "express";
import { SendMessageCommand } from "../../lib/types/commands";
import { ragService } from "../../lib/rag-service";
import { sendEventToKafka } from "../../pipelines/kafka-producer";

// Endpoint command: menerima perintah dari Next.js untuk mengirim pesan ke user tertentu
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const command: SendMessageCommand = req.body;

    console.log("📨 Processing send message command:", {
      userId: command.userId,
      message: command.data.message,
    });

    // Kirim event ke Kafka untuk tracking
    await sendEventToKafka(
      `send_message_${command.userId}`,
      {
        id: `send_message_${Date.now()}`,
        commandId: command.id,
        userId: command.userId,
        message: command.data.message,
        source: "express",
        type: "send_message_command",
        timestamp: new Date().toISOString(),
      },
      "normal"
    );

    // 1. Kirim pesan ke Discord user
    const discordResponse = await sendToDiscord(
      command.userId,
      command.data.message
    );

    // 2. Kirim ke RAG service untuk analisis/response
    const ragResponse = await ragService.query({
      query: command.data.message,
      context: {
        userId: command.userId,
        message: command.data.message,
        expressResponse: discordResponse,
        timestamp: new Date().toISOString(),
      },
    });

    // 3. Jika RAG memberikan response yang berbeda, kirim ke Discord
    if (ragResponse.answer && ragResponse.answer !== command.data.message) {
      await sendToDiscord(command.userId, ragResponse.answer);
    }

    // 4. Return response ke Next.js
    res.json({
      success: true,
      commandId: command.id,
      discordResponse,
      ragResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in send message command:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
      details: String(error),
    });
  }
}

// Helper function untuk kirim ke Discord
async function sendToDiscord(userId: string, message: string) {
  // Implementasi Discord bot send message
  // Ini akan diintegrasikan dengan Discord bot yang sudah ada
  console.log(`🤖 Sending to Discord user ${userId}: ${message}`);

  // Simulasi untuk sekarang
  return {
    sent: true,
    userId,
    message,
    timestamp: new Date().toISOString(),
  };
}
