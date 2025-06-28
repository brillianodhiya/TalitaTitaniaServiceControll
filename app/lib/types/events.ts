// Base event interface
export interface BaseEvent {
  id: string;
  timestamp: number;
  source: EventSource;
  priority: EventPriority;
  messageKey: string;
  processedAt?: string;
  // Enhanced for AI VTuber
  eventType: VTuberEventType;
  emotion?: VTuberEmotion;
  intensity?: number; // 0-10 scale
  context?: VTuberContext;
  requiresResponse?: boolean;
  responseType?: VTuberResponseType;
}

// Event sources
export type EventSource =
  | "discord"
  | "youtube"
  | "whatsapp"
  | "webhook"
  | "telegram"
  | "slack"
  | "twitch"
  | "tiktok"
  | "instagram"
  | "twitter";

// Event priorities
export type EventPriority = "high" | "low" | "critical" | "normal";

// VTuber-specific event types
export type VTuberEventType =
  // Chat interactions
  | "chat_message"
  | "chat_reaction"
  | "chat_mention"
  | "chat_command"
  | "chat_question"
  | "chat_compliment"
  | "chat_insult"
  | "chat_question"
  | "chat_greeting"
  | "chat_farewell"

  // Stream events
  | "stream_start"
  | "stream_end"
  | "stream_pause"
  | "stream_resume"
  | "viewer_count_change"
  | "peak_viewers"

  // Engagement events
  | "donation"
  | "subscription"
  | "follow"
  | "like"
  | "share"
  | "comment"
  | "super_chat"
  | "bits"
  | "raid"
  | "host"

  // Content events
  | "video_upload"
  | "video_like"
  | "video_comment"
  | "video_share"
  | "post_creation"
  | "post_interaction"

  // System events
  | "system_notification"
  | "error_occurred"
  | "maintenance"
  | "update_available"

  // Custom events
  | "custom_interaction"
  | "scheduled_event"
  | "reminder"
  | "achievement";

// VTuber emotions for AI processing
export type VTuberEmotion =
  | "happy"
  | "excited"
  | "surprised"
  | "confused"
  | "sad"
  | "angry"
  | "nervous"
  | "calm"
  | "playful"
  | "serious"
  | "embarrassed"
  | "proud"
  | "curious"
  | "worried"
  | "grateful"
  | "neutral";

// VTuber response types
export type VTuberResponseType =
  | "verbal_response"
  | "gesture"
  | "expression_change"
  | "dance"
  | "sing"
  | "laugh"
  | "cry"
  | "wave"
  | "nod"
  | "shake_head"
  | "clap"
  | "jump"
  | "sit"
  | "stand"
  | "sleep"
  | "wake_up"
  | "custom_action"
  | "no_response";

// VTuber context for better AI understanding
export interface VTuberContext {
  currentActivity?: string; // "streaming", "gaming", "singing", "chatting", etc.
  currentMood?: VTuberEmotion;
  streamDuration?: number; // in minutes
  viewerCount?: number;
  chatActivity?: "high" | "medium" | "low";
  recentEvents?: string[]; // last 5-10 events
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  dayOfWeek?: string;
  specialOccasion?: string; // "birthday", "holiday", "anniversary", etc.
  language?: string;
  culturalContext?: string;
  userRelationship?: "new" | "regular" | "moderator" | "friend" | "unknown";
}

// Discord specific events
export interface DiscordEvent extends BaseEvent {
  source: "discord";
  discord: {
    userId: string;
    username: string;
    channelId: string;
    channelName?: string;
    guildId?: string;
    guildName?: string;
    messageId: string;
    content: string;
    attachments?: DiscordAttachment[];
    mentions?: string[];
    isDM: boolean;
    isBot: boolean;
    userRoles?: string[];
  };
}

export interface DiscordAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
}

// YouTube specific events
export interface YouTubeEvent extends BaseEvent {
  source: "youtube";
  youtube: {
    videoId: string;
    channelId: string;
    channelName: string;
    videoTitle: string;
    commentId?: string;
    commentAuthor?: string;
    commentText?: string;
    likeCount?: number;
    viewCount?: number;
    eventType:
      | "comment"
      | "like"
      | "subscribe"
      | "video_upload"
      | "live_stream";
    liveStatus?: "live" | "ended" | "scheduled";
  };
}

// WhatsApp specific events
export interface WhatsAppEvent extends BaseEvent {
  source: "whatsapp";
  whatsapp: {
    phoneNumber: string;
    contactName?: string;
    groupId?: string;
    groupName?: string;
    messageId: string;
    messageType: "text" | "image" | "video" | "audio" | "document" | "location";
    content: string;
    mediaUrl?: string;
    isGroup: boolean;
    isFromMe: boolean;
    quotedMessageId?: string;
    forwardedFrom?: string;
  };
}

// Webhook generic events
export interface WebhookEvent extends BaseEvent {
  source: "webhook";
  webhook: {
    endpoint: string;
    method: string;
    headers: Record<string, string>;
    body: unknown;
    signature?: string;
    eventType: string;
    sourceSystem: string;
  };
}

// Telegram specific events
export interface TelegramEvent extends BaseEvent {
  source: "telegram";
  telegram: {
    chatId: string;
    chatType: "private" | "group" | "supergroup" | "channel";
    chatTitle?: string;
    userId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    messageId: string;
    messageType: "text" | "photo" | "video" | "audio" | "document" | "location";
    content: string;
    mediaUrl?: string;
    isBot: boolean;
    replyToMessageId?: string;
    forwardFrom?: string;
  };
}

// Slack specific events
export interface SlackEvent extends BaseEvent {
  source: "slack";
  slack: {
    teamId: string;
    teamName?: string;
    channelId: string;
    channelName?: string;
    userId: string;
    username: string;
    messageId: string;
    content: string;
    messageType: "message" | "reaction" | "file_share" | "thread_reply";
    threadTs?: string;
    reactions?: SlackReaction[];
    files?: SlackFile[];
    isBot: boolean;
    userRoles?: string[];
  };
}

export interface SlackReaction {
  name: string;
  count: number;
  users: string[];
}

export interface SlackFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

// Union type for all events
export type Event =
  | DiscordEvent
  | YouTubeEvent
  | WhatsAppEvent
  | WebhookEvent
  | TelegramEvent
  | SlackEvent;

// Event filters
export interface EventFilter {
  sources?: EventSource[];
  priorities?: EventPriority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  userId?: string;
  channelId?: string;
  content?: string;
}

// Event statistics
export interface EventStats {
  total: number;
  bySource: Record<EventSource, number>;
  byPriority: Record<EventPriority, number>;
  byDate: Record<string, number>;
  recent: Event[];
}

// Event processing state
export interface EventProcessingState {
  messageKey: string;
  isProcessing: boolean;
  startTime: number;
  attempts: number;
  lastError?: string;
}

// Event buffer for low priority events
export interface EventBuffer {
  messageKey: string;
  events: Event[];
  maxSize: number;
  createdAt: number;
}
