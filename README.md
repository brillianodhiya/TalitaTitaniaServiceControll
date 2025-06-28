# 🧠 AI VTuber Control System

**Autonomous AI VTuber dengan Real-time Decision Making**

Sistem kontrol VTuber AI yang benar-benar autonomous - AI sendiri yang memutuskan setiap aksi, emosi, dan gerakan berdasarkan events yang diterima dari berbagai platform.

## 🎯 **Konsep Utama**

### **AI VTuber Autonomous**

- **AI sebagai "Otak"**: RAG Service bertindak sebagai otak yang memproses semua events
- **Keputusan Autonomous**: AI sendiri yang menentukan emosi, aksi, dan respons
- **Personality Building**: AI membangun dan mengembangkan personality secara dinamis
- **Learning & Memory**: AI belajar dari setiap interaksi dan menyimpan memori

### **Flow Arsitektur**

```
Events → Event Gateway → Kafka → RAG Service → AI Decision → VTuber Actions
```

## 🏗️ **Arsitektur Sistem**

### **1. Event Gateway (Express.js + Discord Bot)**

- **Fungsi**: Mengumpulkan events dari berbagai sumber
- **Sources**: Discord, YouTube, Twitch, WhatsApp, Webhook
- **Output**: Mengirim events ke Kafka dengan prioritas

### **2. Kafka Message Broker**

- **Topics**:
  - `webhook.events.high_priority` - Events penting (donation, subscription, raid)
  - `webhook.events.low_priority` - Events biasa (chat, like, comment)
- **Fungsi**: Streaming events ke semua komponen

### **3. RAG Service (AI Brain)**

- **Fungsi Utama**:
  - Memproses semua events untuk AI decision making
  - Membangun personality dan memori AI
  - Menghasilkan keputusan autonomous
- **AI Features**:
  - Personality Context Management
  - Emotional State Tracking
  - Memory Formation & Retrieval
  - Learning & Adaptation
  - Decision Confidence Scoring

### **4. Next.js Dashboard**

- **Fungsi**:
  - Real-time monitoring events dan AI decisions
  - Manual VTuber command control
  - System status monitoring
- **Features**:
  - Live events stream
  - AI decision visualization
  - VTuber command interface
  - Personality context display

### **5. VTuber Engine (Future)**

- **Fungsi**: Eksekusi aksi VTuber berdasarkan AI decisions
- **Components**:
  - Animation Engine
  - TTS (Text-to-Speech)
  - Expression System
  - Gesture Control

## 🧠 **AI Autonomous Decision System**

### **AI Decision Types**

```typescript
type AIDecisionType =
  | "reaction_to_chat" // React to chat message
  | "reaction_to_donation" // React to donation
  | "reaction_to_follow" // React to new follower
  | "reaction_to_subscription" // React to subscription
  | "reaction_to_raid" // React to raid
  | "spontaneous_action" // Spontaneous action (AI initiative)
  | "mood_change" // Change mood based on events
  | "personality_development" // Develop personality
  | "conversation_response" // Respond in conversation
  | "stream_management" // Manage stream flow
  | "audience_interaction" // Interact with audience
  | "content_creation" // Create content ideas
  | "self_reflection" // AI reflecting on itself
  | "learning_adaptation" // Learn and adapt behavior
  | "emergency_response" // Emergency situations
  | "routine_action" // Routine behaviors
  | "social_interaction" // Social behaviors
  | "emotional_expression" // Express emotions
  | "cognitive_processing" // Process information
  | "memory_formation" // Form memories
  | "knowledge_integration" // Integrate new knowledge
  | "behavior_adjustment"; // Adjust behavior patterns
```

### **AI VTuber Actions**

AI dapat memilih dari berbagai aksi:

#### **Physical Actions**

- `move_forward`, `move_backward`, `jump`, `sit`, `stand`, `walk`, `run`, `dance`
- `wave`, `clap`, `point`, `nod`, `shake_head`, `bow`, `salute`, `spin`, `bounce`

#### **Emotional Expressions**

- `smile`, `frown`, `laugh`, `cry`, `wink`, `blush`, `surprised`, `angry`
- `confused`, `excited`, `sad`, `nervous`, `calm`, `playful`, `serious`

#### **Communication**

- `speak`, `sing`, `whisper`, `shout`, `greet`, `farewell`, `thank`, `apologize`
- `congratulate`, `comfort`, `joke`, `story`, `question`, `answer`, `explain`

#### **Interactive**

- `look_at_user`, `point_at_user`, `wave_at_user`, `react_to_message`
- `read_message`, `respond_to_user`, `thank_donor`, `welcome_follower`

#### **Cognitive Actions**

- `think`, `remember`, `learn`, `analyze`, `decide`, `plan`, `reflect`
- `imagine`, `dream`, `wonder`, `realize`, `understand`, `discover`

#### **Autonomous Actions**

- `explore`, `experiment`, `try_new_thing`, `take_break`, `self_care`
- `exercise`, `eat`, `sleep`, `wake_up`, `check_schedule`, `plan_day`

### **AI Personality Context**

```typescript
interface PersonalityContext {
  currentMood: VTuberEmotion;
  energyLevel: number; // 0-10
  socialEnergy: number; // 0-10
  focusLevel: number; // 0-10
  stressLevel: number; // 0-10
  excitementLevel: number; // 0-10
  recentEvents: string[]; // Last 10 events
  currentActivity: string;
  audienceEngagement: "low" | "medium" | "high";
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  dayOfWeek: string;
  streamDuration: number; // in minutes
  viewerCount: number;
  chatActivity: "low" | "medium" | "high";
  personalityTraits: string[];
  currentGoals: string[];
  recentMemories: string[];
  learnedBehaviors: string[];
  emotionalState: {
    happiness: number;
    excitement: number;
    calmness: number;
    anxiety: number;
    confidence: number;
    curiosity: number;
  };
}
```

### **AI Learning & Memory**

- **Short-term Memory**: Events terbaru dan konteks
- **Long-term Memory**: Pengalaman penting dan pembelajaran
- **Emotional Memory**: Memori yang terkait dengan emosi
- **Procedural Memory**: Pola perilaku yang dipelajari

## 🚀 **Setup & Installation**

### **Prerequisites**

- Node.js 18+
- Bun (for event-gateway)
- Docker & Docker Compose
- Kafka & Redis

### **1. Clone Repository**

```bash
git clone <repository-url>
cd talita-titania-controll
```

### **2. Setup Kafka & Redis**

```bash
cd kafka-setup
docker-compose up -d
```

### **3. Install Dependencies**

```bash
# Root project (Next.js)
npm install

# Event Gateway
cd event-gateway
bun install
```

### **4. Environment Variables**

```bash
# .env (root)
KAFKA_BROKER=localhost:9092
REDIS_URL=redis://localhost:6379
RAG_ENDPOINT=http://localhost:8000/rag

# event-gateway/.env
DISCORD_TOKEN=your_discord_token
DISCORD_CLIENT_ID=your_discord_client_id
KAFKA_BROKER=localhost:9092
REDIS_URL=redis://localhost:6379
```

### **5. Start Development**

```bash
# Start all services
npm run dev

# Or start individually
npm run next:dev      # Next.js dashboard
npm run bot:dev       # Event Gateway
npm run dev:worker    # Kafka consumer worker
```

## 📡 **API Endpoints**

### **Events API**

```typescript
// GET /api/events
// Retrieve events with filters
GET /api/events?limit=20&source=discord&priority=high

// POST /api/events
// Store new event
POST /api/events
Body: Event
```

### **AI VTuber Decisions API**

```typescript
// GET /api/ai-vtuber/decision
// Retrieve AI decisions
GET /api/ai-vtuber/decision?limit=20&decisionType=reaction_to_chat

// POST /api/ai-vtuber/decision
// Process AI decision
POST /api/ai-vtuber/decision
Body: AIVTuberDecision
```

### **VTuber Commands API**

```typescript
// GET /api/vtuber/command
// Retrieve VTuber commands
GET /api/vtuber/command?limit=20

// POST /api/vtuber/command
// Send VTuber command
POST /api/vtuber/command
Body: VTuberCommand
```

### **RAG Service API**

```typescript
// GET /api/rag/health
// Health check
GET / api / rag / health;

// GET /api/rag/info
// Service information
GET / api / rag / info;

// POST /api/rag/query
// Query RAG service
POST / api / rag / query;
Body: RAGRequest;
```

## 🎭 **Event Types**

### **Discord Events**

```typescript
interface DiscordEvent extends Event {
  source: "discord";
  discord: {
    username: string;
    content: string;
    channelId: string;
    messageId: string;
    isBot: boolean;
    attachments: string[];
  };
}
```

### **YouTube Events**

```typescript
interface YouTubeEvent extends Event {
  source: "youtube";
  youtube: {
    channelName: string;
    videoTitle?: string;
    commentText?: string;
    commentAuthor?: string;
    likeCount?: number;
    subscriberCount?: number;
  };
}
```

### **WhatsApp Events**

```typescript
interface WhatsAppEvent extends Event {
  source: "whatsapp";
  whatsapp: {
    contactName: string;
    phoneNumber: string;
    content: string;
    messageType: "text" | "image" | "video" | "audio";
    timestamp: string;
  };
}
```

### **Webhook Events**

```typescript
interface WebhookEvent extends Event {
  source: "webhook";
  webhook: {
    sourceSystem: string;
    body: Record<string, unknown>;
    headers: Record<string, string>;
    method: string;
    url: string;
  };
}
```

## 🧠 **AI Decision Process**

### **1. Event Processing**

```typescript
// Event diterima dari Kafka
const event: Event = {
  id: "event_123",
  source: "discord",
  type: "chat_message",
  priority: "normal",
  timestamp: "2024-01-01T12:00:00Z",
  // ... event data
};
```

### **2. AI Decision Generation**

```typescript
// RAG Service memproses event
const aiDecision: AIVTuberDecision = await ragService.processEvent(event);

// AI menghasilkan keputusan
{
  id: "decision_456",
  decisionType: "reaction_to_chat",
  confidence: 0.85,
  reasoning: "User sent a friendly message, AI should respond positively",
  actions: [
    {
      actionType: "speak",
      speech: {
        text: "Thanks for the message! I'm happy to chat with you!",
        emotion: "happy",
        tone: "friendly"
      },
      animation: {
        name: "wave",
        emotion: "happy",
        duration: 2.0
      },
      expression: {
        emotion: "happy",
        intensity: 7
      }
    }
  ],
  emotion: "happy",
  personalityContext: { /* current AI state */ }
}
```

### **3. VTuber Execution**

```typescript
// AI decision dikirim ke VTuber engine
await simulateVTuberExecution(aiDecision);

// VTuber mengeksekusi aksi
🎬 Executing action: speak
🗣️  Speech: "Thanks for the message! I'm happy to chat with you!" (happy)
🎭 Animation: wave (2.0s)
😊 Expression: happy (intensity: 7)
```

## 🔄 **Real-time Flow**

### **High Priority Events**

1. **Event Received** → Discord donation, subscription, raid
2. **Kafka High Priority** → `webhook.events.high_priority`
3. **AI Processing** → RAG service generates decision immediately
4. **VTuber Action** → AI executes actions with high confidence
5. **Memory Storage** → Event and decision stored in AI memory

### **Low Priority Events**

1. **Event Received** → Chat message, like, comment
2. **Kafka Low Priority** → `webhook.events.low_priority`
3. **Buffered Processing** → Processed when no high priority events
4. **AI Decision** → RAG service generates appropriate response
5. **VTuber Action** → AI executes actions based on personality

## 🎯 **Next Steps**

### **Phase 1: Core AI System** ✅

- [x] Event Gateway dengan Discord integration
- [x] Kafka streaming system
- [x] RAG Service dengan AI decision making
- [x] Next.js dashboard dengan real-time monitoring
- [x] AI autonomous decision system
- [x] Personality context management

### **Phase 2: VTuber Engine** 🚧

- [ ] VTuber animation engine
- [ ] TTS (Text-to-Speech) integration
- [ ] Expression system
- [ ] Gesture control
- [ ] Real-time rendering

### **Phase 3: Advanced AI Features** 📋

- [ ] Advanced personality development
- [ ] Long-term memory system
- [ ] Emotional intelligence
- [ ] Context awareness
- [ ] Multi-language support

### **Phase 4: Platform Integration** 📋

- [ ] YouTube Live integration
- [ ] Twitch integration
- [ ] TikTok Live integration
- [ ] Instagram Live integration
- [ ] Custom webhook support

### **Phase 5: Production Features** 📋

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & management
- [ ] Analytics & insights
- [ ] Performance monitoring
- [ ] Scalability improvements

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

MIT License - see LICENSE file for details

---

**🧠 AI VTuber Control System** - Membuat VTuber yang benar-benar autonomous dengan AI decision making yang canggih!
