import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

// Single topic for all events
const EVENT_TOPIC = "webhooks_events_talita_tatania";

interface EventPayload {
  source?: string;
  type?: string;
  [key: string]: unknown;
}

export async function sendEventToKafka(
  messageKey: string,
  payload: EventPayload,
  priority: "high" | "low" | "critical" | "normal"
) {
  await producer.connect();
  await producer.send({
    topic: EVENT_TOPIC,
    messages: [
      {
        key: messageKey,
        value: JSON.stringify({
          ...payload,
          priority,
          timestamp: new Date().toISOString(),
          topic: EVENT_TOPIC,
        }),
        headers: {
          priority: Buffer.from(priority),
          source: Buffer.from(payload.source || "unknown"),
          type: Buffer.from(payload.type || "unknown"),
        },
      },
    ],
  });

  console.log(`📤 Event sent to Kafka: ${EVENT_TOPIC}`, {
    key: messageKey,
    source: payload.source,
    type: payload.type,
    priority,
  });
}
