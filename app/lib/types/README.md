# Types Documentation

Struktur types yang terorganisir untuk sistem event-driven dengan support berbagai event sources.

## 📁 Struktur Types

```
app/lib/types/
├── index.ts          # Export semua types
├── events.ts         # Event types untuk berbagai sources
├── rag.ts           # RAG service types
├── commands.ts      # Command types
└── README.md        # Dokumentasi ini
```

## 🎯 Event Types (`events.ts`)

### Base Event Interface

```typescript
interface BaseEvent {
  id: string;
  timestamp: number;
  source: EventSource;
  priority: EventPriority;
  messageKey: string;
  processedAt?: string;
}
```

### Supported Event Sources

- **Discord** - Discord bot events
- **YouTube** - YouTube comments, likes, subscriptions
- **WhatsApp** - WhatsApp messages
- **Webhook** - Generic webhook events
- **Telegram** - Telegram bot events
- **Slack** - Slack workspace events

### Event Priorities

- **high** - Events yang perlu diproses segera
- **low** - Events yang bisa di-buffer
- **critical** - Events yang sangat penting
- **normal** - Events standar

### Source-Specific Event Types

#### Discord Events

```typescript
interface DiscordEvent extends BaseEvent {
  source: "discord";
  discord: {
    userId: string;
    username: string;
    channelId: string;
    content: string;
    isDM: boolean;
    isBot: boolean;
    // ... more fields
  };
}
```

#### YouTube Events

```typescript
interface YouTubeEvent extends BaseEvent {
  source: "youtube";
  youtube: {
    videoId: string;
    channelId: string;
    videoTitle: string;
    eventType:
      | "comment"
      | "like"
      | "subscribe"
      | "video_upload"
      | "live_stream";
    // ... more fields
  };
}
```

#### WhatsApp Events

```typescript
interface WhatsAppEvent extends BaseEvent {
  source: "whatsapp";
  whatsapp: {
    phoneNumber: string;
    content: string;
    messageType: "text" | "image" | "video" | "audio" | "document" | "location";
    isGroup: boolean;
    // ... more fields
  };
}
```

## 🤖 RAG Types (`rag.ts`)

### Request/Response Interfaces

```typescript
interface RAGRequest {
  query: string;
  context: {
    userId: string;
    message: string;
    expressResponse: unknown;
    timestamp: string;
  };
}

interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
  metadata?: {
    processingTime?: number;
    model?: string;
    tokens?: number;
  };
}
```

### Enhanced RAG Types

- **EnhancedRAGRequest** - Request dengan options tambahan
- **EnhancedRAGResponse** - Response dengan metadata lengkap
- **RAGSource** - Detail source dengan relevance score

## ⚡ Command Types (`commands.ts`)

### Base Command Interface

```typescript
interface BaseCommand {
  id: string;
  timestamp: string;
  userId: string;
  source: CommandSource;
  type: CommandType;
  status: CommandStatus;
}
```

### Supported Command Types

- **send_message** - Kirim pesan ke user/channel
- **get_user_info** - Dapatkan info user
- **ban_user** - Ban user dari server
- **kick_user** - Kick user dari server
- **create_channel** - Buat channel baru
- **delete_message** - Hapus pesan
- **add_role** - Tambah role ke user
- **remove_role** - Hapus role dari user
- **custom_action** - Custom action

### Command Sources

- **discord** - Dari Discord bot
- **webhook** - Dari webhook
- **api** - Dari API call
- **frontend** - Dari frontend dashboard

## 🔧 Common Types (`index.ts`)

### API Response

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  metadata?: {
    processingTime?: number;
    version?: string;
  };
}
```

### Pagination

```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Health Check

```typescript
interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database?: boolean;
    redis?: boolean;
    kafka?: boolean;
    rag?: boolean;
  };
}
```

## 🚀 Usage Examples

### Creating a Discord Event

```typescript
import { DiscordEvent } from "./lib/types/events";

const discordEvent: DiscordEvent = {
  id: "evt_123",
  timestamp: Date.now(),
  source: "discord",
  priority: "high",
  messageKey: "user_123",
  discord: {
    userId: "user_123",
    username: "john_doe",
    channelId: "channel_456",
    content: "Hello bot!",
    isDM: false,
    isBot: false,
  },
};
```

### Creating a Command

```typescript
import { SendMessageCommand } from "./lib/types/commands";

const command: SendMessageCommand = {
  id: "cmd_123",
  timestamp: new Date().toISOString(),
  userId: "user_123",
  source: "api",
  type: "send_message",
  status: "pending",
  data: {
    message: "Hello from API!",
    userId: "user_123",
  },
};
```

### RAG Query

```typescript
import { RAGRequest } from "./lib/types/rag";

const ragRequest: RAGRequest = {
  query: "What is the weather today?",
  context: {
    userId: "user_123",
    message: "Hello bot!",
    expressResponse: { success: true },
    timestamp: new Date().toISOString(),
  },
};
```

## 🔄 Type Safety Benefits

1. **Compile-time validation** - TypeScript akan error jika types tidak sesuai
2. **IntelliSense support** - Auto-completion dan documentation
3. **Refactoring safety** - Mudah refactor tanpa breaking changes
4. **Documentation** - Types sebagai dokumentasi hidup
5. **Scalability** - Mudah tambah event sources baru

## 📝 Adding New Event Sources

1. **Define new event type** di `events.ts`
2. **Update Event union type**
3. **Add helper functions** di `kafka-consumer.ts`
4. **Update frontend** untuk handle source baru
5. **Test** dengan sample data

## 🧪 Testing Types

```typescript
// Type assertion test
const testEvent: Event = {
  id: "test",
  timestamp: Date.now(),
  source: "discord",
  priority: "high",
  messageKey: "test",
  discord: {
    userId: "test",
    username: "test",
    channelId: "test",
    content: "test",
    isDM: false,
    isBot: false,
  },
};

// Should compile without errors
console.log(testEvent.discord.content);
```
