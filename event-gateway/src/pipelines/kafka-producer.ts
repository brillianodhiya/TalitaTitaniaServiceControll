import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export async function sendEventToKafka(
  topic: string,
  messageKey: string,
  payload: object,
  priority: "high" | "low"
) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      {
        key: messageKey,
        value: JSON.stringify({ ...payload, priority }),
        headers: { priority: Buffer.from(priority) },
      },
    ],
  });
}
