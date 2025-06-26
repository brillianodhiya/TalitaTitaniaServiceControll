import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Redis from "ioredis";
// Import Discord bot dan sources
import "./sources/discord";
// Import Kafka producer utility
import { sendEventToKafka } from "./pipelines/kafka-producer";
dotenv.config();

const app = express();
app.use(express.json());

// Inisialisasi Redis (gunakan URL jika ada, atau default localhost)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis();

// Dummy logic: Menentukan prioritas event
function determineImportance(
  eventData: Record<string, unknown>
): "high" | "low" {
  // Contoh hardcoded: event payment atau urgent dianggap high
  if (eventData.type === "payment" || eventData.urgent === true) {
    return "high";
  }
  return "low";
}

// Dummy logic: Mengambil messageKey dari event
function getMessageKey(eventData: Record<string, unknown>): string {
  return (
    (eventData.userId as string) || (eventData.sessionId as string) || "default"
  );
}

// Adaptive sampling: cek Redis state
async function shouldSampleLowPriority(): Promise<boolean> {
  const highActive = await redis.get("system:high_priority_active");
  if (highActive) return Math.random() < 0.01; // 1% jika ada event penting aktif
  return true; // 100% jika tidak ada event penting aktif
}

// Endpoint utama: menerima webhook, menentukan prioritas, sampling, dan publish ke Kafka
app.post("/webhook", async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = req.body as Record<string, unknown>;
    const priority = determineImportance(eventData);
    const messageKey = getMessageKey(eventData);

    if (priority === "high") {
      await sendEventToKafka(
        "webhook.events.high_priority",
        messageKey,
        eventData,
        priority
      );
    } else {
      if (!(await shouldSampleLowPriority())) {
        res.status(200).json({ status: "sampled_out" });
        return;
      }
      await sendEventToKafka(
        "webhook.events.low_priority",
        messageKey,
        eventData,
        priority
      );
    }
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error in webhook endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint command: menerima perintah dari Next.js untuk mengirim pesan ke user tertentu
app.post(
  "/command/send-message",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId }: { userId: string; message: string } = req.body;
      // Dummy: Kirim ke Discord/WA (implementasi asli di sini)
      // await sendToDiscord(userId, message);
      res.status(200).json({ status: "sent", userId });
    } catch (error) {
      console.error("Error in command endpoint:", error);
      res.status(500).json({ error: "Failed to send", detail: String(error) });
    }
  }
);

// Endpoint health check
app.get("/", (req: Request, res: Response) => {
  res.send("Event Gateway API is running");
});

const PORT = process.env.BOT_API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Event Gateway API listening on port ${PORT}`);
});
