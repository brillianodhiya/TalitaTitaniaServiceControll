import { startConsumers } from "./kafka-consumer";

// Worker untuk menjalankan Kafka consumer
async function startWorker() {
  try {
    console.log("🔧 Starting Event Processing Worker...");
    await startConsumers();
    console.log("✅ Worker started successfully!");
  } catch (error) {
    console.error("❌ Worker failed to start:", error);
    process.exit(1);
  }
}

// Jalankan worker
startWorker();
