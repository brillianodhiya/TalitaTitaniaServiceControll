// VTuber Command Types
export interface VTuberCommand {
  id: string;
  timestamp: string;
  commandType: VTuberCommandType;
  priority: VTuberCommandPriority;
  data: VTuberCommandData;
  metadata?: VTuberCommandMetadata;
}

// VTuber Command Types
export type VTuberCommandType =
  // Basic Actions
  | "sleep"
  | "wake_up"
  | "sit"
  | "stand"
  | "walk"
  | "run"
  | "jump"
  | "dance"
  | "wave"
  | "nod"
  | "shake_head"
  | "clap"
  | "point"
  | "bow"
  | "salute"

  // Expressions & Emotions
  | "smile"
  | "frown"
  | "laugh"
  | "cry"
  | "wink"
  | "blush"
  | "surprised"
  | "angry"
  | "confused"
  | "excited"
  | "sad"
  | "nervous"
  | "calm"
  | "playful"
  | "serious"

  // Communication
  | "speak"
  | "sing"
  | "whisper"
  | "shout"
  | "greet"
  | "farewell"
  | "thank"
  | "apologize"
  | "congratulate"
  | "comfort"
  | "joke"
  | "story"

  // Interactive
  | "react_to_chat"
  | "read_message"
  | "respond_to_user"
  | "mention_user"
  | "thank_donor"
  | "welcome_new_follower"
  | "celebrate_subscription"
  | "acknowledge_raid"

  // Stream Management
  | "start_stream"
  | "end_stream"
  | "pause_stream"
  | "resume_stream"
  | "change_scene"
  | "play_music"
  | "stop_music"
  | "adjust_volume"
  | "show_alert"
  | "hide_alert"

  // Gaming
  | "start_game"
  | "end_game"
  | "game_reaction"
  | "victory_celebration"
  | "defeat_reaction"
  | "game_commentary"

  // Custom Actions
  | "custom_gesture"
  | "custom_expression"
  | "custom_animation"
  | "custom_speech"
  | "trigger_effect"
  | "change_outfit"
  | "change_background"

  // System Commands
  | "emergency_stop"
  | "reset_position"
  | "calibrate"
  | "health_check"
  | "update_personality"
  | "load_scenario"
  | "save_state";

// Command Priority
export type VTuberCommandPriority =
  | "low"
  | "normal"
  | "high"
  | "critical"
  | "emergency";

// Command Data based on type
export interface VTuberCommandData {
  // For speak/sing commands
  text?: string;
  language?: string;
  tone?:
    | "normal"
    | "whisper"
    | "shout"
    | "singing"
    | "whispering"
    | "excited"
    | "sad"
    | "angry";
  duration?: number; // in seconds

  // For gesture/expression commands
  intensity?: number; // 0-10 scale
  gestureDuration?: number; // in seconds

  // For interactive commands
  userId?: string;
  username?: string;
  message?: string;
  amount?: number; // for donations

  // For custom commands
  customData?: Record<string, unknown>;

  // For stream management
  sceneName?: string;
  musicUrl?: string;
  volume?: number; // 0-100
  alertType?: string;

  // For gaming
  gameName?: string;
  gameResult?: "win" | "lose" | "draw";

  // For system commands
  scenarioName?: string;
  personalityType?: string;
}

// Command Metadata
export interface VTuberCommandMetadata {
  source: "dashboard" | "api" | "scheduled" | "ai_triggered" | "emergency";
  userId?: string; // who sent the command
  reason?: string; // why this command was sent
  context?: string; // additional context
  expiresAt?: string; // when this command expires
  retryCount?: number;
  maxRetries?: number;
}

// VTuber State
export interface VTuberState {
  isAwake: boolean;
  isStreaming: boolean;
  currentActivity: string;
  currentMood: string;
  currentPosition: VTuberPosition;
  currentExpression: string;
  isSpeaking: boolean;
  isMoving: boolean;
  lastCommand?: VTuberCommand;
  streamDuration: number; // in minutes
  viewerCount: number;
  chatActivity: "low" | "medium" | "high";
}

// VTuber Position
export interface VTuberPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
  scale: number;
}

// VTuber Response
export interface VTuberResponse {
  success: boolean;
  commandId: string;
  executedAt: string;
  duration: number; // how long it took to execute
  result: "completed" | "failed" | "cancelled" | "queued";
  error?: string;
  data?: unknown;
}

// VTuber Personality
export interface VTuberPersonality {
  name: string;
  age: number;
  personality: string[];
  likes: string[];
  dislikes: string[];
  catchphrases: string[];
  voiceType: string;
  language: string;
  culturalBackground: string;
  interests: string[];
  moodTendencies: Record<string, number>; // emotion -> tendency (0-1)
  responsePatterns: Record<string, string[]>; // event type -> response patterns
}

// VTuber Scenario
export interface VTuberScenario {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: VTuberCommand[];
  conditions?: Record<string, unknown>;
  priority: VTuberCommandPriority;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
