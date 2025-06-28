import { Request, Response } from "express";
import Redis from "ioredis";
import { sendEventToKafka } from "../../pipelines/kafka-producer";

// Inisialisasi Redis (gunakan URL jika ada, atau default localhost)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis();

// Enhanced logic: Menentukan prioritas dan event type
function determineEventInfo(eventData: Record<string, unknown>): {
  priority: "high" | "low" | "critical" | "normal";
  type: string;
} {
  let priority: "high" | "low" | "critical" | "normal" = "normal";
  let type = "webhook_event";

  // Priority detection
  if (eventData.type === "payment" || eventData.urgent === true) {
    priority = "high";
  } else if (eventData.emergency === true) {
    priority = "critical";
  }

  // Event type detection
  if (eventData.type === "payment") {
    type = "payment";
  } else if (eventData.type === "subscription") {
    type = "subscription";
    priority = "high";
  } else if (eventData.type === "donation") {
    type = "donation";
    priority = "high";
  }

  return { priority, type };
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
    const { priority, type } = determineEventInfo(eventData);
    const messageKey = getMessageKey(eventData);

    // Enhanced event data with metadata
    const enhancedEventData = {
      id: `webhook_${Date.now()}`,
      source: "webhook",
      type,
      ...eventData,
      timestamp: new Date().toISOString(),
    };

    if (priority === "high" || priority === "critical") {
      await sendEventToKafka(messageKey, enhancedEventData, priority);
    } else {
      if (!(await shouldSampleLowPriority())) {
        res.status(200).json({ status: "sampled_out" });
        return;
      }
      await sendEventToKafka(messageKey, enhancedEventData, priority);
    }
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error in webhook endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
