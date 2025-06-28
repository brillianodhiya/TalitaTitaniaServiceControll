"use client";

import { useState, useEffect } from "react";

interface SystemStatus {
  ragService: boolean;
  vtuberEngine: boolean;
  eventGateway: boolean;
  sttEnabled: boolean;
  ttsEnabled: boolean;
  totalEvents: number;
  totalDecisions: number;
  totalActions: number;
}

interface Event {
  id: string;
  source: string;
  type: string;
  priority: string;
  timestamp: string;
}

interface AIDecision {
  id: string;
  decisionType: string;
  confidence: number;
  emotion: string;
  reasoning: string;
  timestamp: string;
}

interface VTuberAction {
  id: string;
  actionType: string;
  status: string;
  duration: number;
  timestamp: string;
}

export default function Home() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    ragService: false,
    vtuberEngine: false,
    eventGateway: false,
    sttEnabled: false,
    ttsEnabled: false,
    totalEvents: 0,
    totalDecisions: 0,
    totalActions: 0,
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>([]);
  const [vtuberActions, setVtuberActions] = useState<VTuberAction[]>([]);
  const [forcedMessage, setForcedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const [
        ragStatus,
        vtuberStatus,
        gatewayStatus,
        sttStatus,
        ttsStatus,
        eventsData,
        decisionsData,
        actionsData,
      ] = await Promise.all([
        fetch("/api/control/rag-service").then((r) => r.json()),
        fetch("/api/control/vtuber-engine").then((r) => r.json()),
        fetch("/api/control/event-gateway").then((r) => r.json()),
        fetch("/api/control/stt").then((r) => r.json()),
        fetch("/api/control/tts").then((r) => r.json()),
        fetch("/api/monitor/events?limit=10").then((r) => r.json()),
        fetch("/api/monitor/decisions?limit=10").then((r) => r.json()),
        fetch("/api/monitor/actions?limit=10").then((r) => r.json()),
      ]);

      setSystemStatus({
        ragService: ragStatus.success && ragStatus.status?.running,
        vtuberEngine: vtuberStatus.success && vtuberStatus.status?.running,
        eventGateway: gatewayStatus.success && gatewayStatus.status?.running,
        sttEnabled: sttStatus.success && sttStatus.status?.enabled,
        ttsEnabled: ttsStatus.success && ttsStatus.status?.enabled,
        totalEvents: eventsData.success ? eventsData.total : 0,
        totalDecisions: decisionsData.success ? decisionsData.total : 0,
        totalActions: actionsData.success ? actionsData.total : 0,
      });

      if (eventsData.success) setEvents(eventsData.events);
      if (decisionsData.success) setAiDecisions(decisionsData.decisions);
      if (actionsData.success) setVtuberActions(actionsData.actions);
    } catch (error) {
      console.error("Error fetching system status:", error);
    }
  };

  // Control functions
  const toggleService = async (service: string) => {
    setLoading(true);
    try {
      const currentStatus = systemStatus[service as keyof SystemStatus];
      const response = await fetch(`/api/control/${service}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: currentStatus ? "stop" : "start" }),
      });

      if (response.ok) {
        await fetchSystemStatus(); // Refresh status
      }
    } catch (error) {
      console.error(`Error toggling ${service}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSTT = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/control/stt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !systemStatus.sttEnabled }),
      });

      if (response.ok) {
        await fetchSystemStatus();
      }
    } catch (error) {
      console.error("Error toggling STT:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTTS = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/control/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !systemStatus.ttsEnabled }),
      });

      if (response.ok) {
        await fetchSystemStatus();
      }
    } catch (error) {
      console.error("Error toggling TTS:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendForcedMessage = async () => {
    if (!forcedMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/control/forced-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: forcedMessage, priority: "critical" }),
      });

      if (response.ok) {
        setForcedMessage("");
        await fetchSystemStatus();
      }
    } catch (error) {
      console.error("Error sending forced message:", error);
    } finally {
      setLoading(false);
    }
  };

  const stopCurrentAction = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/control/stop-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "emergency_stop" }),
      });

      if (response.ok) {
        await fetchSystemStatus();
      }
    } catch (error) {
      console.error("Error stopping action:", error);
    } finally {
      setLoading(false);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🎮 AI VTuber Control Center
          </h1>
          <p className="text-gray-400">
            Control Panel for Autonomous AI VTuber System
          </p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg ${
              systemStatus.ragService ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="text-2xl font-bold">
              {systemStatus.ragService ? "🟢" : "🔴"}
            </div>
            <div className="text-sm">RAG Service</div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              systemStatus.vtuberEngine ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="text-2xl font-bold">
              {systemStatus.vtuberEngine ? "🟢" : "🔴"}
            </div>
            <div className="text-sm">VTuber Engine</div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              systemStatus.eventGateway ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="text-2xl font-bold">
              {systemStatus.eventGateway ? "🟢" : "🔴"}
            </div>
            <div className="text-sm">Event Gateway</div>
          </div>
          <div className="bg-blue-600 p-4 rounded-lg">
            <div className="text-2xl font-bold">{systemStatus.totalEvents}</div>
            <div className="text-sm">Total Events</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">⚙️ Service Controls</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>RAG Service (AI Brain)</span>
                <button
                  onClick={() => toggleService("rag-service")}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    systemStatus.ragService
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {systemStatus.ragService ? "Stop" : "Start"}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>VTuber Engine</span>
                <button
                  onClick={() => toggleService("vtuber-engine")}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    systemStatus.vtuberEngine
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {systemStatus.vtuberEngine ? "Stop" : "Start"}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Event Gateway</span>
                <button
                  onClick={() => toggleService("event-gateway")}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    systemStatus.eventGateway
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {systemStatus.eventGateway ? "Stop" : "Start"}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🎤 Audio Controls</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>STT (Speech-to-Text)</span>
                <button
                  onClick={toggleSTT}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    systemStatus.sttEnabled
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {systemStatus.sttEnabled ? "Disable" : "Enable"}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>TTS (Text-to-Speech)</span>
                <button
                  onClick={toggleTTS}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    systemStatus.ttsEnabled
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {systemStatus.ttsEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Forced Message */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">⚡ Forced Message</h2>
            <div className="space-y-4">
              <textarea
                value={forcedMessage}
                onChange={(e) => setForcedMessage(e.target.value)}
                placeholder="Enter message to force AI to say..."
                className="w-full p-3 bg-gray-700 rounded text-white"
                rows={3}
              />
              <button
                onClick={sendForcedMessage}
                disabled={loading || !forcedMessage.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-4 py-2 rounded"
              >
                Send Forced Message
              </button>
            </div>
          </div>

          {/* Emergency Stop */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">⏹️ Emergency Controls</h2>
            <div className="space-y-4">
              <button
                onClick={stopCurrentAction}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded text-lg font-bold"
              >
                🛑 Stop Current Action
              </button>
              <p className="text-sm text-gray-400">
                Immediately stops any current VTuber action
              </p>
            </div>
          </div>
        </div>

        {/* Monitoring Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events Monitor */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              📡 Events Stream
              <span className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded">
                {events.length}
              </span>
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        event.priority === "high"
                          ? "bg-red-500"
                          : event.priority === "critical"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {event.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium">{event.source}</div>
                  <div className="text-xs text-gray-400">{event.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Decisions Monitor */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🧠 AI Decisions
              <span className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded">
                {aiDecisions.length}
              </span>
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {aiDecisions.map((decision) => (
                <div key={decision.id} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded text-xs bg-purple-500">
                      {decision.decisionType}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(decision.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">
                    Emotion: {decision.emotion}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    Confidence: {(decision.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {decision.reasoning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VTuber Actions Monitor */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🎭 VTuber Actions
              <span className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded">
                {vtuberActions.length}
              </span>
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {vtuberActions.map((action) => (
                <div key={action.id} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded text-xs bg-orange-500">
                      {action.actionType}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">
                    Status: {action.status}
                  </div>
                  <div className="text-xs text-gray-400">
                    Duration: {action.duration}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🎮 AI VTuber Control Center - Autonomous System Management</p>
          <p className="mt-1">
            Event Gateway → Kafka → RAG Service → AI Decisions → VTuber Engine
          </p>
        </div>
      </div>
    </div>
  );
}
