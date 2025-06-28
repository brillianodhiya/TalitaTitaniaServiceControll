import { client } from "../sources/discord";
import {
  VTuberAction,
  VTuberDiscordAction,
  VTuberYouTubeAction,
  VTuberTwitchAction,
} from "./types/commands";

// Autonomous VTuber Action Executor
export class VTuberActionExecutor {
  // Execute any VTuber action
  static async executeAction(action: VTuberAction): Promise<boolean> {
    try {
      switch (action.type) {
        case "discord_action":
          return await this.executeDiscordAction(action);
        case "youtube_action":
          return await this.executeYouTubeAction(action);
        case "twitch_action":
          return await this.executeTwitchAction(action);
        default:
          console.error(
            `❌ Unknown action type: ${
              (action as unknown as { type: string }).type
            }`
          );
          return false;
      }
    } catch (error) {
      console.error(`❌ Error executing VTuber action:`, error);
      return false;
    }
  }

  // Execute Discord actions
  private static async executeDiscordAction(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    try {
      switch (action.action) {
        case "send_dm":
          return await this.sendDiscordDM(action);
        case "send_message":
          return await this.sendDiscordMessage(action);
        case "moderate_message":
          return await this.moderateDiscordMessage(action);
        case "welcome_member":
          return await this.welcomeDiscordMember(action);
        case "farewell_member":
          return await this.farewellDiscordMember(action);
        case "react_to_message":
          return await this.reactToDiscordMessage(action);
        case "ban_user":
          return await this.banDiscordUser(action);
        case "kick_user":
          return await this.kickDiscordUser(action);
        case "timeout_user":
          return await this.timeoutDiscordUser(action);
        case "pin_message":
          return await this.pinDiscordMessage(action);
        case "delete_message":
          return await this.deleteDiscordMessage(action);
        default:
          console.error(`❌ Unknown Discord action: ${action.action}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ Error executing Discord action:`, error);
      return false;
    }
  }

  // Discord Action Implementations
  private static async sendDiscordDM(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.userId || !action.data.message) return false;

    try {
      const user = await client.users.fetch(action.target.userId);
      await user.send(action.data.message);
      console.log(
        `💬 VTuber sent DM to ${user.username}: ${action.data.message}`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to send Discord DM:`, error);
      return false;
    }
  }

  private static async sendDiscordMessage(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.channelId || !action.data.message) return false;

    try {
      const channel = await client.channels.fetch(action.target.channelId);
      if (channel?.isTextBased() && "send" in channel) {
        await channel.send(action.data.message);
        console.log(
          `💬 VTuber sent message to channel: ${action.data.message}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to send Discord message:`, error);
      return false;
    }
  }

  private static async moderateDiscordMessage(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.messageId || !action.target.channelId) return false;

    try {
      const channel = await client.channels.fetch(action.target.channelId);
      if (channel?.isTextBased()) {
        const message = await channel.messages.fetch(action.target.messageId);
        await message.delete();
        console.log(
          `🛡️ VTuber moderated message: ${
            action.data.reason || "Inappropriate content"
          }`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to moderate Discord message:`, error);
      return false;
    }
  }

  private static async welcomeDiscordMember(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.guildId || !action.target.userId) return false;

    try {
      const guild = await client.guilds.fetch(action.target.guildId);
      const member = await guild.members.fetch(action.target.userId);
      const welcomeChannel = guild.systemChannel;

      if (welcomeChannel?.isTextBased()) {
        const welcomeMessage =
          action.data.message ||
          `Welcome to the server, ${member.user.username}! 🎉`;
        await welcomeChannel.send(welcomeMessage);
        console.log(`👋 VTuber welcomed ${member.user.username}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to welcome Discord member:`, error);
      return false;
    }
  }

  private static async farewellDiscordMember(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.guildId || !action.target.userId) return false;

    try {
      const guild = await client.guilds.fetch(action.target.guildId);
      const farewellChannel = guild.systemChannel;

      if (farewellChannel?.isTextBased()) {
        const farewellMessage =
          action.data.message || `Goodbye! We'll miss you! 👋`;
        await farewellChannel.send(farewellMessage);
        console.log(`👋 VTuber said farewell`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to farewell Discord member:`, error);
      return false;
    }
  }

  private static async reactToDiscordMessage(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (
      !action.target.messageId ||
      !action.target.channelId ||
      !action.data.emoji
    )
      return false;

    try {
      const channel = await client.channels.fetch(action.target.channelId);
      if (channel?.isTextBased()) {
        const message = await channel.messages.fetch(action.target.messageId);
        await message.react(action.data.emoji);
        console.log(`😊 VTuber reacted with ${action.data.emoji}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to react to Discord message:`, error);
      return false;
    }
  }

  private static async banDiscordUser(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.guildId || !action.target.userId) return false;

    try {
      const guild = await client.guilds.fetch(action.target.guildId);
      const member = await guild.members.fetch(action.target.userId);
      await member.ban({
        reason: action.data.reason || "VTuber autonomous moderation",
      });
      console.log(
        `🔨 VTuber banned ${member.user.username}: ${action.data.reason}`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to ban Discord user:`, error);
      return false;
    }
  }

  private static async kickDiscordUser(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.guildId || !action.target.userId) return false;

    try {
      const guild = await client.guilds.fetch(action.target.guildId);
      const member = await guild.members.fetch(action.target.userId);
      await member.kick(action.data.reason || "VTuber autonomous moderation");
      console.log(
        `👢 VTuber kicked ${member.user.username}: ${action.data.reason}`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to kick Discord user:`, error);
      return false;
    }
  }

  private static async timeoutDiscordUser(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (
      !action.target.guildId ||
      !action.target.userId ||
      !action.data.duration
    )
      return false;

    try {
      const guild = await client.guilds.fetch(action.target.guildId);
      const member = await guild.members.fetch(action.target.userId);
      const durationMs = action.data.duration * 60 * 1000; // Convert minutes to milliseconds
      await member.timeout(
        durationMs,
        action.data.reason || "VTuber autonomous moderation"
      );
      console.log(
        `⏰ VTuber timed out ${member.user.username} for ${action.data.duration} minutes`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to timeout Discord user:`, error);
      return false;
    }
  }

  private static async pinDiscordMessage(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.messageId || !action.target.channelId) return false;

    try {
      const channel = await client.channels.fetch(action.target.channelId);
      if (channel?.isTextBased()) {
        const message = await channel.messages.fetch(action.target.messageId);
        await message.pin();
        console.log(`📌 VTuber pinned message`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to pin Discord message:`, error);
      return false;
    }
  }

  private static async deleteDiscordMessage(
    action: VTuberDiscordAction
  ): Promise<boolean> {
    if (!action.target.messageId || !action.target.channelId) return false;

    try {
      const channel = await client.channels.fetch(action.target.channelId);
      if (channel?.isTextBased()) {
        const message = await channel.messages.fetch(action.target.messageId);
        await message.delete();
        console.log(
          `🗑️ VTuber deleted message: ${
            action.data.reason || "Inappropriate content"
          }`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to delete Discord message:`, error);
      return false;
    }
  }

  // YouTube Action Implementations (Placeholder - needs YouTube API integration)
  private static async executeYouTubeAction(
    action: VTuberYouTubeAction
  ): Promise<boolean> {
    console.log(
      `📺 VTuber YouTube action: ${action.action} (not implemented yet)`
    );
    // TODO: Implement YouTube API integration
    return false;
  }

  // Twitch Action Implementations (Placeholder - needs Twitch API integration)
  private static async executeTwitchAction(
    action: VTuberTwitchAction
  ): Promise<boolean> {
    console.log(
      `🎮 VTuber Twitch action: ${action.action} (not implemented yet)`
    );
    // TODO: Implement Twitch API integration
    return false;
  }
}
