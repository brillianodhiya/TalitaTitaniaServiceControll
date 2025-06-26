import { Client, GatewayIntentBits, Partials, Message } from "discord.js";
import { sendEventToKafka } from "../pipelines/kafka-producer";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`Bot is online as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  // Hanya proses DM dari user (bukan bot)
  if (message.channel.type === 1 && !message.author.bot) {
    // Tentukan prioritas (contoh: jika ada kata 'urgent' maka high)
    const priority: "high" | "low" = message.content.includes("urgent")
      ? "high"
      : "low";
    const messageKey = message.author.id;
    // Kirim event ke Kafka
    await sendEventToKafka(
      priority === "high"
        ? "webhook.events.high_priority"
        : "webhook.events.low_priority",
      messageKey,
      {
        username: message.author.username,
        content: message.content,
        timestamp: message.createdTimestamp,
        source: "discord",
      },
      priority
    );
    await message.reply("Pesanmu sudah diterima!");
  }
});

// Login bot Discord
client.login(process.env.DISCORD_TOKEN);
