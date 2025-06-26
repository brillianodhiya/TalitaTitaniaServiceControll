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
