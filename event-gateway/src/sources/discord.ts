import {
  Client,
  GatewayIntentBits,
  Partials,
  Message,
  TextChannel,
} from "discord.js";
import { sendEventToKafka } from "../pipelines/kafka-producer";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

// VTuber Personality & Autonomous Behavior
const VTUBER_CONFIG = {
  name: "Talita Titania",
  personality: "friendly, energetic, caring",
  autoReply: true,
  autoModeration: true,
  allowedServers: process.env.ALLOWED_SERVERS?.split(",") || [],
};

client.once("ready", () => {
  console.log(`🤖 ${VTUBER_CONFIG.name} is online as ${client.user?.tag}`);
  console.log(`🎭 VTuber Mode: Autonomous AI with full Discord control`);
});

// Autonomous VTuber: Menerima semua pesan dan bertindak sendiri
client.on("messageCreate", async (message: Message) => {
  // Skip bot messages (except own)
  if (message.author.bot && message.author.id !== client.user?.id) return;

  // Determine event type and priority based on content and context
  let priority: "high" | "low" | "critical" | "normal" = "normal";
  let eventType = "chat_message";

  // Priority detection for autonomous response
  if (
    message.content.includes("urgent") ||
    message.content.includes("emergency")
  ) {
    priority = "critical";
  } else if (
    message.content.includes("help") ||
    message.content.includes("support")
  ) {
    priority = "high";
  } else if (
    message.content.includes("donation") ||
    message.content.includes("donate")
  ) {
    eventType = "donation";
    priority = "high";
  } else if (
    message.content.includes("follow") ||
    message.content.includes("follower")
  ) {
    eventType = "follow";
  } else if (
    message.content.includes("subscribe") ||
    message.content.includes("subscription")
  ) {
    eventType = "subscription";
    priority = "high";
  } else if (
    message.content.includes("raid") ||
    message.content.includes("raider")
  ) {
    eventType = "raid";
    priority = "high";
  } else if (
    message.content.includes("like") ||
    message.content.includes("heart")
  ) {
    eventType = "like";
  }

  // Check for moderation triggers
  if (
    message.content.includes("spam") ||
    message.content.includes("inappropriate")
  ) {
    eventType = "moderation_needed";
    priority = "high";
  }

  const messageKey = message.author.id;

  // Send event to Kafka for AI processing
  await sendEventToKafka(
    messageKey,
    {
      id: `discord_${message.id}`,
      username: message.author.username,
      content: message.content,
      timestamp: message.createdTimestamp,
      source: "discord",
      type: eventType,
      priority,
      discord: {
        username: message.author.username,
        content: message.content,
        channelId: message.channel.id,
        messageId: message.id,
        isBot: message.author.bot,
        isDM: message.channel.type === 1,
        isGuild: message.channel.type === 0,
        guildId: message.guild?.id,
        channelName:
          message.channel instanceof TextChannel ? message.channel.name : "DM",
        attachments: message.attachments.map((att) => att.url),
        mentions: message.mentions.users.map((u) => u.id),
        roleMentions: message.mentions.roles.map((r) => r.id),
      },
      vtuber: {
        shouldRespond: VTUBER_CONFIG.autoReply,
        shouldModerate: VTUBER_CONFIG.autoModeration,
        personality: VTUBER_CONFIG.personality,
      },
    },
    priority
  );

  // Autonomous VTuber: Auto-reply to DMs (optional)
  if (
    VTUBER_CONFIG.autoReply &&
    message.channel.type === 1 &&
    !message.author.bot
  ) {
    // Let AI decide if and how to respond
    console.log(
      `💬 ${VTUBER_CONFIG.name} received DM from ${message.author.username}: ${message.content}`
    );
  }
});

// Autonomous VTuber: Handle member joins
client.on("guildMemberAdd", async (member) => {
  await sendEventToKafka(
    member.id,
    {
      id: `discord_member_join_${Date.now()}`,
      source: "discord",
      type: "member_join",
      priority: "normal",
      timestamp: new Date().toISOString(),
      discord: {
        username: member.user.username,
        guildId: member.guild.id,
        guildName: member.guild.name,
        memberId: member.id,
      },
      vtuber: {
        shouldWelcome: true,
        personality: VTUBER_CONFIG.personality,
      },
    },
    "normal"
  );
});

// Autonomous VTuber: Handle member leaves
client.on("guildMemberRemove", async (member) => {
  await sendEventToKafka(
    member.id,
    {
      id: `discord_member_leave_${Date.now()}`,
      source: "discord",
      type: "member_leave",
      priority: "normal",
      timestamp: new Date().toISOString(),
      discord: {
        username: member.user.username,
        guildId: member.guild.id,
        guildName: member.guild.name,
        memberId: member.id,
      },
      vtuber: {
        shouldFarewell: true,
        personality: VTUBER_CONFIG.personality,
      },
    },
    "normal"
  );
});

// Autonomous VTuber: Handle message reactions
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  await sendEventToKafka(
    user.id,
    {
      id: `discord_reaction_${Date.now()}`,
      source: "discord",
      type: "reaction",
      priority: "normal",
      timestamp: new Date().toISOString(),
      discord: {
        username: user.username,
        emoji: reaction.emoji.name,
        messageId: reaction.message.id,
        channelId: reaction.message.channel.id,
        guildId: reaction.message.guild?.id,
      },
      vtuber: {
        shouldReact: true,
        personality: VTUBER_CONFIG.personality,
      },
    },
    "normal"
  );
});

// Login bot Discord
client.login(process.env.DISCORD_TOKEN);
