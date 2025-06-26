import { Request, Response } from "express";
import Redis from "ioredis";
import { sendEventToKafka } from "../../pipelines/kafka-producer";

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
export const webhook = async (req: Request, res: Response): Promise<void> => {
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
};
