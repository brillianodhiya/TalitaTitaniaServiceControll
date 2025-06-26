import { Kafka } from "kafkajs";
import Redis from "ioredis";
import axios from "axios";
import {
  Event,
  DiscordEvent,
  YouTubeEvent,
  WhatsAppEvent,
  WebhookEvent,
} from "./types/events";
import { SendMessageCommand } from "./types/commands";

// Inisialisasi Kafka dan Redis
const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
// Inisialisasi Redis (gunakan URL jika ada, atau default localhost)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis();

// Kafka consumer untuk high dan low priority
const highConsumer = kafka.consumer({ groupId: "nextjs-high" });
const lowConsumer = kafka.consumer({ groupId: "nextjs-low" });

// State untuk tracking proses per messageKey
const processingState: Record<string, boolean> = {}; // messageKey -> isProcessing
const buffer: Record<string, Event[]> = {}; // messageKey -> queue of low-prio events

// Update state event penting di Redis
async function setHighPriorityActive(active: boolean) {
  if (active) {
    await redis.set("system:high_priority_active", "1", "EX", 10);
  } else {
    await redis.del("system:high_priority_active");
  }
}

// Simpan event ke Next.js API untuk diakses frontend
async function saveEventToAPI(event: Event) {
  try {
    await axios.post("http://localhost:3000/api/events", {
      ...event,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save event to API:", error);
  }
}

// Helper function untuk mendapatkan event content berdasarkan source
function getEventContent(event: Event): string {
  switch (event.source) {
    case "discord":
      return (event as DiscordEvent).discord.content;
    case "youtube":
      const ytEvent = event as YouTubeEvent;
      return ytEvent.youtube.commentText || ytEvent.youtube.videoTitle;
    case "whatsapp":
      return (event as WhatsAppEvent).whatsapp.content;
    case "webhook":
      return JSON.stringify((event as WebhookEvent).webhook.body);
    default:
      return "Unknown content";
  }
}

// Helper function untuk mendapatkan username berdasarkan source
function getEventUsername(event: Event): string {
  switch (event.source) {
    case "discord":
      return (event as DiscordEvent).discord.username;
    case "youtube":
      return (
        (event as YouTubeEvent).youtube.commentAuthor ||
        (event as YouTubeEvent).youtube.channelName
      );
    case "whatsapp":
      return (
        (event as WhatsAppEvent).whatsapp.contactName ||
        (event as WhatsAppEvent).whatsapp.phoneNumber
      );
    case "webhook":
      return (event as WebhookEvent).webhook.sourceSystem;
    default:
      return "Unknown user";
  }
}

// Proses event high priority
async function processHighPriorityEvent(event: Event, done: () => void) {
  const { messageKey } = event;
  processingState[messageKey] = true;
  await setHighPriorityActive(true);

  const content = getEventContent(event);
  const username = getEventUsername(event);

  console.log("🟢 Processing HIGH priority event:", {
    source: event.source,
    username,
    content: content.substring(0, 50) + "...",
    timestamp: new Date(event.timestamp).toISOString(),
  });

  // Simpan event ke API
  await saveEventToAPI(event);

  // Simulasi proses event penting
  setTimeout(async () => {
    processingState[messageKey] = false;
    await setHighPriorityActive(false);
    // Jika ada low-prio buffered, proses sekarang
    if (buffer[messageKey] && buffer[messageKey].length > 0) {
      const nextLow = buffer[messageKey].shift() as Event;
      await processLowPriorityEvent(nextLow, () => {});
    }
    done();
  }, 1000);
}

// Proses event low priority
async function processLowPriorityEvent(event: Event, done: () => void) {
  const { messageKey } = event;
  if (processingState[messageKey]) {
    buffer[messageKey] = buffer[messageKey] || [];
    buffer[messageKey].push(event);
    return done();
  }

  const content = getEventContent(event);
  const username = getEventUsername(event);

  console.log("🟡 Processing LOW priority event:", {
    source: event.source,
    username,
    content: content.substring(0, 50) + "...",
    timestamp: new Date(event.timestamp).toISOString(),
  });

  // Simpan event ke API
  await saveEventToAPI(event);

  setTimeout(done, 500);
}

// Mulai Kafka consumer
export async function startConsumers() {
  console.log("🚀 Starting Kafka consumers...");

  await highConsumer.connect();
  await lowConsumer.connect();
  await highConsumer.subscribe({
    topic: "webhook.events.high_priority",
    fromBeginning: true,
  });
  await lowConsumer.subscribe({
    topic: "webhook.events.low_priority",
    fromBeginning: true,
  });
  highConsumer.run({
    eachMessage: async ({ message }) => {
      const event: Event = JSON.parse(message.value!.toString());
      event.messageKey = message.key?.toString() || "default";
      await processHighPriorityEvent(event, () => {});
    },
  });
  lowConsumer.run({
    eachMessage: async ({ message }) => {
      const event: Event = JSON.parse(message.value!.toString());
      event.messageKey = message.key?.toString() || "default";
      await processLowPriorityEvent(event, () => {});
    },
  });

  console.log("✅ Kafka consumers started successfully!");
}

// Fungsi untuk mengirim perintah ke Express.js (command invoker)
export async function sendCommandToExpress(userId: string, message: string) {
  const command: SendMessageCommand = {
    id: `cmd_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId,
    source: "api",
    type: "send_message",
    status: "pending",
    data: {
      message,
      userId,
    },
  };

  const res = await axios.post(
    "http://localhost:3001/command/send-message",
    command
  );
  return res.data;
}
