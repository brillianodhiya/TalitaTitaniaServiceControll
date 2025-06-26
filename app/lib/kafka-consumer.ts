import { Kafka } from "kafkajs";
import Redis from "ioredis";
import axios from "axios";

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
const buffer: Record<string, object[]> = {}; // messageKey -> queue of low-prio events

// Update state event penting di Redis
async function setHighPriorityActive(active: boolean) {
  if (active) {
    await redis.set("system:high_priority_active", "1", "EX", 10);
  } else {
    await redis.del("system:high_priority_active");
  }
}

// Tipe event payload
interface EventPayload {
  messageKey: string;
  [key: string]: unknown;
}

// Proses event high priority
async function processHighPriorityEvent(event: EventPayload, done: () => void) {
  const { messageKey } = event;
  processingState[messageKey] = true;
  await setHighPriorityActive(true);
  // Simulasi proses event penting
  setTimeout(async () => {
    processingState[messageKey] = false;
    await setHighPriorityActive(false);
    // Jika ada low-prio buffered, proses sekarang
    if (buffer[messageKey] && buffer[messageKey].length > 0) {
      const nextLow = buffer[messageKey].shift() as EventPayload;
      await processLowPriorityEvent(nextLow, () => {});
    }
    done();
  }, 1000);
}

// Proses event low priority
async function processLowPriorityEvent(event: EventPayload, done: () => void) {
  const { messageKey } = event;
  if (processingState[messageKey]) {
    buffer[messageKey] = buffer[messageKey] || [];
    buffer[messageKey].push(event);
    return done();
  }
  setTimeout(done, 500);
}

// Mulai Kafka consumer
export async function startConsumers() {
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
      const event: EventPayload = JSON.parse(message.value!.toString());
      event.messageKey = message.key?.toString() || "default";
      await processHighPriorityEvent(event, () => {});
    },
  });
  lowConsumer.run({
    eachMessage: async ({ message }) => {
      const event: EventPayload = JSON.parse(message.value!.toString());
      event.messageKey = message.key?.toString() || "default";
      await processLowPriorityEvent(event, () => {});
    },
  });
}

// Fungsi untuk mengirim perintah ke Express.js (command invoker)
export async function sendCommandToExpress(userId: string, message: string) {
  const res = await axios.post("http://localhost:3001/command/send-message", {
    userId,
    message,
  });
  return res.data;
}
