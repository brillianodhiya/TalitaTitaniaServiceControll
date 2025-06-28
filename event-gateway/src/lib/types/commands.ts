// Base command interface
export interface BaseCommand {
  id: string;
  timestamp: string;
  userId: string;
  source: CommandSource;
  type: CommandType;
  status: CommandStatus;
}

// Command sources
export type CommandSource = "discord" | "webhook" | "api" | "frontend";

// Command types
export type CommandType =
  | "send_message"
  | "get_user_info"
  | "ban_user"
  | "kick_user"
  | "create_channel"
  | "delete_message"
  | "add_role"
  | "remove_role"
  | "custom_action";

// Command status
export type CommandStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

// Send message command
export interface SendMessageCommand extends BaseCommand {
  type: "send_message";
  data: {
    message: string;
    channelId?: string;
    userId?: string;
    replyTo?: string;
    attachments?: CommandAttachment[];
    embed?: CommandEmbed;
  };
}

// Get user info command
export interface GetUserInfoCommand extends BaseCommand {
  type: "get_user_info";
  data: {
    userId: string;
    includeRoles?: boolean;
    includePermissions?: boolean;
  };
}

// Ban user command
export interface BanUserCommand extends BaseCommand {
  type: "ban_user";
  data: {
    userId: string;
    reason?: string;
    deleteMessageDays?: number;
  };
}

// Kick user command
export interface KickUserCommand extends BaseCommand {
  type: "kick_user";
  data: {
    userId: string;
    reason?: string;
  };
}

// Create channel command
export interface CreateChannelCommand extends BaseCommand {
  type: "create_channel";
  data: {
    name: string;
    type: "text" | "voice" | "category";
    parentId?: string;
    permissions?: ChannelPermission[];
  };
}

// Delete message command
export interface DeleteMessageCommand extends BaseCommand {
  type: "delete_message";
  data: {
    messageId: string;
    channelId: string;
  };
}

// Add role command
export interface AddRoleCommand extends BaseCommand {
  type: "add_role";
  data: {
    userId: string;
    roleId: string;
    reason?: string;
  };
}

// Remove role command
export interface RemoveRoleCommand extends BaseCommand {
  type: "remove_role";
  data: {
    userId: string;
    roleId: string;
    reason?: string;
  };
}

// Custom action command
export interface CustomActionCommand extends BaseCommand {
  type: "custom_action";
  data: {
    action: string;
    parameters: Record<string, unknown>;
  };
}

// Union type for all commands
export type Command =
  | SendMessageCommand
  | GetUserInfoCommand
  | BanUserCommand
  | KickUserCommand
  | CreateChannelCommand
  | DeleteMessageCommand
  | AddRoleCommand
  | RemoveRoleCommand
  | CustomActionCommand;

// Command attachments
export interface CommandAttachment {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

// Command embed
export interface CommandEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  thumbnail?: string;
  image?: string;
  footer?: string;
  timestamp?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

// Channel permissions
export interface ChannelPermission {
  id: string;
  type: "role" | "user";
  allow: string[];
  deny: string[];
}

// Command response
export interface CommandResponse {
  success: boolean;
  commandId: string;
  data?: unknown;
  error?: string;
  timestamp: string;
  processingTime?: number;
}

// Command execution result
export interface CommandResult {
  success: boolean;
  command: Command;
  response: CommandResponse;
  metadata?: {
    executionTime: number;
    retries: number;
    source: string;
  };
}

// Command queue item
export interface CommandQueueItem {
  command: Command;
  priority: number;
  queuedAt: string;
  retryCount: number;
  maxRetries: number;
}

// Autonomous VTuber Actions
export interface VTuberDiscordAction {
  id: string;
  type: "discord_action";
  action:
    | "send_dm"
    | "send_message"
    | "moderate_message"
    | "welcome_member"
    | "farewell_member"
    | "react_to_message"
    | "ban_user"
    | "kick_user"
    | "timeout_user"
    | "pin_message"
    | "delete_message";
  target: {
    userId?: string;
    channelId?: string;
    guildId?: string;
    messageId?: string;
  };
  data: {
    message?: string;
    reason?: string;
    duration?: number; // for timeout in minutes
    emoji?: string; // for reactions
  };
  priority: "high" | "low" | "critical" | "normal";
  timestamp: string;
}

export interface VTuberYouTubeAction {
  id: string;
  type: "youtube_action";
  action:
    | "moderate_chat"
    | "reply_comment"
    | "pin_comment"
    | "delete_comment"
    | "ban_user"
    | "timeout_user"
    | "send_chat_message"
    | "manage_stream"
    | "update_description"
    | "create_poll";
  target: {
    videoId?: string;
    commentId?: string;
    userId?: string;
    chatId?: string;
  };
  data: {
    message?: string;
    reason?: string;
    duration?: number;
    pollOptions?: string[];
    pollQuestion?: string;
  };
  priority: "high" | "low" | "critical" | "normal";
  timestamp: string;
}

export interface VTuberTwitchAction {
  id: string;
  type: "twitch_action";
  action:
    | "moderate_chat"
    | "ban_user"
    | "timeout_user"
    | "send_chat_message"
    | "manage_stream"
    | "create_poll"
    | "manage_raids"
    | "manage_rewards";
  target: {
    channelId?: string;
    userId?: string;
    messageId?: string;
  };
  data: {
    message?: string;
    reason?: string;
    duration?: number;
    pollOptions?: string[];
    pollQuestion?: string;
  };
  priority: "high" | "low" | "critical" | "normal";
  timestamp: string;
}

export type VTuberAction =
  | VTuberDiscordAction
  | VTuberYouTubeAction
  | VTuberTwitchAction;

// Autonomous VTuber Decision
export interface VTuberAutonomousDecision {
  id: string;
  type: "autonomous_decision";
  source: "discord" | "youtube" | "twitch" | "webhook";
  eventId: string;
  decision: "respond" | "moderate" | "ignore" | "escalate";
  actions: VTuberAction[];
  reasoning: string;
  confidence: number;
  personality: string;
  timestamp: string;
}
