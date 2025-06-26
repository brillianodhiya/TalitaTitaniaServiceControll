"use client";

import { useState, useEffect } from "react";
import { Event, EventStats } from "./lib/types/events";
import { RAGResponse } from "./lib/types/rag";

interface CommandResponse {
  success: boolean;
  expressResponse: unknown;
  ragResponse: RAGResponse;
  timestamp: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Command form state
  const [commandForm, setCommandForm] = useState({
    userId: "",
    message: "",
    query: "",
  });
  const [commandResponse, setCommandResponse] =
    useState<CommandResponse | null>(null);
  const [sendingCommand, setSendingCommand] = useState(false);

  // Fetch events dari API
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Fetch stats dari API
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/events", { method: "POST" });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Send command ke Express dan RAG
  const sendCommand = async () => {
    if (!commandForm.userId || !commandForm.message || !commandForm.query) {
      alert("Please fill all fields");
      return;
    }

    setSendingCommand(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commandForm),
      });

      const data = await response.json();
      setCommandResponse(data);

      if (data.success) {
        // Reset form on success
        setCommandForm({ userId: "", message: "", query: "" });
      }
    } catch (error) {
      console.error("Failed to send command:", error);
      setCommandResponse({
        success: false,
        expressResponse: null,
        ragResponse: { answer: "", sources: [], confidence: 0 },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setSendingCommand(false);
    }
  };

  // Helper function untuk mendapatkan event content
  const getEventContent = (event: Event): string => {
    switch (event.source) {
      case "discord":
        return event.discord?.content || "No content";
      case "youtube":
        return (
          event.youtube?.commentText ||
          event.youtube?.videoTitle ||
          "No content"
        );
      case "whatsapp":
        return event.whatsapp?.content || "No content";
      case "webhook":
        return JSON.stringify(event.webhook?.body) || "No content";
      default:
        return "Unknown content";
    }
  };

  // Helper function untuk mendapatkan username
  const getEventUsername = (event: Event): string => {
    switch (event.source) {
      case "discord":
        return event.discord?.username || "Unknown user";
      case "youtube":
        return (
          event.youtube?.commentAuthor ||
          event.youtube?.channelName ||
          "Unknown user"
        );
      case "whatsapp":
        return (
          event.whatsapp?.contactName ||
          event.whatsapp?.phoneNumber ||
          "Unknown user"
        );
      case "webhook":
        return event.webhook?.sourceSystem || "Unknown system";
      default:
        return "Unknown user";
    }
  };

  // Auto-refresh setiap 5 detik
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchEvents(), fetchStats()]);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Event Gateway Dashboard</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Event Gateway Dashboard</h1>

        {/* Command Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Send Command</h2>
            <p className="text-gray-600 mt-1">
              Send command to Express and get RAG response
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={commandForm.userId}
                  onChange={(e) =>
                    setCommandForm({ ...commandForm, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <input
                  type="text"
                  value={commandForm.message}
                  onChange={(e) =>
                    setCommandForm({ ...commandForm, message: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RAG Query
                </label>
                <input
                  type="text"
                  value={commandForm.query}
                  onChange={(e) =>
                    setCommandForm({ ...commandForm, query: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter RAG query"
                />
              </div>
            </div>

            <button
              onClick={sendCommand}
              disabled={sendingCommand}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingCommand ? "Sending..." : "Send Command"}
            </button>

            {/* Command Response */}
            {commandResponse && (
              <div className="mt-6 p-4 border rounded-md">
                <h3 className="font-semibold mb-2">Response:</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        commandResponse.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {commandResponse.success ? "Success" : "Failed"}
                    </span>
                  </div>

                  {commandResponse.success && (
                    <>
                      <div>
                        <span className="font-medium">Express Response:</span>
                        <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">
                          {JSON.stringify(
                            commandResponse.expressResponse,
                            null,
                            2
                          )}
                        </pre>
                      </div>

                      <div>
                        <span className="font-medium">RAG Response:</span>
                        <div className="mt-1 text-sm bg-gray-100 p-2 rounded">
                          <p>
                            <strong>Answer:</strong>{" "}
                            {commandResponse.ragResponse.answer}
                          </p>
                          <p>
                            <strong>Sources:</strong>{" "}
                            {commandResponse.ragResponse.sources.join(", ")}
                          </p>
                          <p>
                            <strong>Confidence:</strong>{" "}
                            {(
                              commandResponse.ragResponse.confidence * 100
                            ).toFixed(1)}
                            %
                          </p>
                          {commandResponse.ragResponse.metadata && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <p>
                                <strong>Model:</strong>{" "}
                                {commandResponse.ragResponse.metadata.model}
                              </p>
                              <p>
                                <strong>Processing Time:</strong>{" "}
                                {
                                  commandResponse.ragResponse.metadata
                                    .processingTime
                                }
                                ms
                              </p>
                              <p>
                                <strong>Tokens:</strong>{" "}
                                {commandResponse.ragResponse.metadata.tokens}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-xs text-gray-500">
                    {new Date(commandResponse.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">By Source</h3>
              {Object.entries(stats.bySource).map(([source, count]) => (
                <div key={source} className="flex justify-between">
                  <span className="capitalize">{source}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">By Priority</h3>
              {Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex justify-between">
                  <span className="capitalize">{priority}:</span>
                  <span
                    className={`font-semibold ${
                      priority === "high" ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Events</h2>
          </div>

          <div className="divide-y">
            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No events yet. Send a message to your Discord bot!
              </div>
            ) : (
              events.map((event, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            event.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {event.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {event.source}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="mb-1">
                        <span className="font-medium text-gray-900">
                          {getEventUsername(event)}
                        </span>
                      </div>

                      <p className="text-gray-700">{getEventContent(event)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
