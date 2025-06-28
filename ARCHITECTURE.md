# 🏗️ **Talita Titania VTuber Control System - Architecture**

## 📋 **Overview**

Sistem kontrol VTuber AI **autonomous** yang terdiri dari 3 komponen utama:

1. **Event Gateway** (Express.js) - Mengumpulkan raw events dari berbagai sumber
2. **RAG Service** (AI Brain) - Memproses semua events dan membuat keputusan AI
3. **Next.js Dashboard** - Interface kontrol dan monitoring

## 🤖 **Autonomous VTuber Concept**

### **AI VTuber dengan Kontrol Penuh**

Talita Titania adalah **AI VTuber autonomous** yang memiliki kontrol penuh atas akun sosial medianya sendiri, seperti VTuber sungguhan:

#### **Discord Control** 🎮

- **Menerima DM** - Bisa membaca dan merespons DM secara autonomous
- **Mengirim DM** - Bisa mengirim pesan ke user tertentu
- **Moderasi Server** - Ban, kick, timeout, delete message
- **Welcome/Farewell** - Otomatis menyapa member baru/keluar
- **Reactions** - Memberikan emoji reactions
- **Pin Messages** - Pin pesan penting

#### **YouTube Control** 📺

- **Moderasi Chat** - Ban, timeout, delete chat messages
- **Reply Comments** - Merespons komentar video
- **Pin Comments** - Pin komentar penting
- **Manage Stream** - Kontrol stream settings
- **Create Polls** - Membuat polling untuk viewers

#### **Twitch Control** 🎮

- **Moderasi Chat** - Ban, timeout, delete messages
- **Send Chat Messages** - Kirim pesan ke chat
- **Manage Stream** - Kontrol stream settings
- **Manage Raids** - Handle incoming raids
- **Manage Rewards** - Kontrol channel points rewards

## 🎯 **Single Topic Architecture**

### **Kafka Topic: `webhooks_events_talita_tatania`**

Semua events dari berbagai sumber dikirim ke **satu topic saja**. RAG service akan handle semua logic pemisahan berdasarkan:

- **Source**: discord, youtube, twitch, express, etc.
- **Type**: chat_message, donation, follow, subscription, raid, like, moderation_needed, etc.
- **Priority**: critical, high, normal, low

### **Event Structure**

```typescript
{
  id: string,
  source: string,        // "discord", "youtube", "twitch", "express"
  type: string,          // "chat_message", "donation", "moderation_needed", etc.
  priority: string,      // "critical", "high", "normal", "low"
  timestamp: string,
  vtuber: {
    shouldRespond: boolean,
    shouldModerate: boolean,
    personality: string,
  },
  // ... source-specific data
}
```

## 🔄 **Data Flow**

### **1. Event Collection (Event Gateway)**

```
Discord Events → Event Gateway → Kafka Topic
YouTube Events → Event Gateway → Kafka Topic
Twitch Events → Event Gateway → Kafka Topic
```

### **2. AI Processing (RAG Service)**

```
Kafka Topic → RAG Service → AI Decisions → VTuber Actions
```

### **3. Autonomous Actions (VTuber Action Executor)**

```
AI Decisions → VTuber Actions → Discord/YouTube/Twitch APIs
```

### **4. Control & Monitoring (Next.js)**

```
Next.js Dashboard → Control Commands → RAG Service
RAG Service → Monitoring Data → Next.js Dashboard
```

## 🏛️ **Component Details**

### **Event Gateway (Express.js)**

- **Port**: 3001
- **Role**: Event collector dan autonomous VTuber controller
- **Features**:
  - Discord bot dengan kontrol penuh
  - YouTube webhook handler
  - Twitch webhook handler
  - Kafka producer untuk single topic
  - REST API untuk commands dari Next.js
  - VTuber Action Executor untuk autonomous actions

### **RAG Service (AI Brain)**

- **Port**: 3000
- **Role**: AI processing dan autonomous decision making
- **Features**:
  - Kafka consumer untuk semua events
  - AI personality building
  - Autonomous decision making
  - Memory storage (Redis)
  - REST API untuk queries dan commands
  - VTuber action generation

### **Next.js Dashboard**

- **Port**: 3002
- **Role**: Control interface dan monitoring
- **Features**:
  - Service control (start/stop)
  - Forced message sending
  - Action stopping
  - STT/TTS toggle
  - Real-time monitoring
  - API proxy ke backend services

## 🔧 **API Endpoints**

### **Event Gateway (Port 3001)**

```
POST /commands/send-message    # Kirim pesan ke user
POST /commands/rag-query       # Query RAG service
POST /vtuber/actions           # Execute VTuber actions
GET  /health                   # Health check
```

### **RAG Service (Port 3000)**

```
POST /api/rag/query           # Query AI
POST /api/control/start       # Start service
POST /api/control/stop        # Stop service
POST /api/control/forced-message  # Send forced message
POST /api/control/stop-action     # Stop current action
GET  /api/rag/health          # Health check
GET  /api/rag/info            # Service info
```

### **Next.js Dashboard (Port 3002)**

```
GET  /api/rag/health          # Proxy to RAG health
GET  /api/rag/info            # Proxy to RAG info
POST /api/rag/query           # Proxy to RAG query
POST /api/vtuber/command      # Proxy to RAG control
POST /api/receive-dm          # Proxy to Event Gateway
```

## 🚀 **Development Setup**

### **1. Start Infrastructure**

```bash
cd kafka-setup
docker-compose up -d
```

### **2. Start Event Gateway**

```bash
cd event-gateway
bun install
bun run dev:bun
```

### **3. Start RAG Service**

```bash
# Start your RAG service on port 3000
```

### **4. Start Next.js Dashboard**

```bash
npm install
npm run dev
```

## 📊 **Event Types & Priorities**

### **Event Types**

- `chat_message` - Pesan chat biasa
- `donation` - Donasi dari viewer
- `follow` - Follow baru
- `subscription` - Subscribe baru
- `raid` - Raid dari streamer lain
- `like` - Like/reaction
- `moderation_needed` - Perlu moderasi
- `member_join` - Member baru join
- `member_leave` - Member keluar
- `reaction` - Emoji reaction

### **Priority Levels**

- `critical` - Emergency, urgent matters
- `high` - Important events (donations, subscriptions, moderation)
- `normal` - Regular chat messages
- `low` - Background events

## 🎭 **VTuber Personality & Behavior**

### **Autonomous Behavior**

- **Auto Reply** - Otomatis merespons DM dan chat
- **Auto Moderation** - Otomatis moderasi konten tidak pantas
- **Auto Welcome** - Otomatis menyapa member baru
- **Auto Farewell** - Otomatis mengucapkan selamat tinggal
- **Auto Reactions** - Otomatis memberikan reactions

### **Personality Traits**

- **Friendly** - Ramah dan welcoming
- **Energetic** - Semangat dan aktif
- **Caring** - Peduli dengan viewers
- **Professional** - Tetap profesional dalam moderasi

## 🔍 **Monitoring & Debugging**

### **Kafka Topics**

```bash
# List topics
kafka-topics.sh --bootstrap-server localhost:9092 --list

# Monitor single topic
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic webhooks_events_talita_tatania --from-beginning
```

### **Redis**

```bash
# Connect to Redis
redis-cli

# Monitor keys
KEYS *
GET talita_titania:memory:*
```

## 🎯 **Benefits of Autonomous VTuber**

1. **Full Control** - AI VTuber memiliki kontrol penuh seperti VTuber sungguhan
2. **Autonomous Behavior** - Bisa bertindak sendiri tanpa perintah manusia
3. **Multi-Platform** - Kontrol Discord, YouTube, Twitch sekaligus
4. **Intelligent Moderation** - AI-powered moderation yang smart
5. **Personality Consistency** - Konsisten dalam personality di semua platform

## 🔮 **Future Enhancements**

1. **More Platforms** - TikTok, Instagram, Twitter
2. **Advanced AI** - Multi-modal processing (image, video, audio)
3. **Real-time Streaming** - WebSocket untuk real-time updates
4. **Analytics Dashboard** - Detailed metrics dan insights
5. **Multi-VTuber Support** - Multiple AI personalities
6. **Voice Integration** - TTS/STT untuk voice interactions
