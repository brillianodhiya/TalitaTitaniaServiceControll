import { Client, GatewayIntentBits, Partials, Message } from "discord.js";
import fetch from "node-fetch";
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
  if (message.channel.type === 1 && !message.author.bot) {
    // Kirim DM ke Next.js REST API
    console.log(message);
    try {
      await fetch("http://localhost:3000/api/receive-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: message.author.username,
          name: message.author.displayName,
          avatar_url: message.author.avatarURL,
          content: message.content,
          attachment: message.attachments,
          timestamp: message.createdTimestamp,
        }),
      });
    } catch (err) {
      console.error("Gagal mengirim ke API:", err);
    }
    await message.reply("Pesanmu sudah diterima!");
  }
});
