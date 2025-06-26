import { NextRequest, NextResponse } from "next/server";
import {
  Event,
  EventStats,
  EventSource,
  EventPriority,
} from "../../lib/types/events";

// In-memory storage untuk events (dalam production gunakan database)
let events: Event[] = [];

// GET: Mendapatkan events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") as EventSource;
    const priority = searchParams.get("priority") as EventPriority;
    const limit = parseInt(searchParams.get("limit") || "50");

    let filteredEvents = events;

    // Filter berdasarkan source
    if (source) {
      filteredEvents = filteredEvents.filter(
        (event) => event.source === source
      );
    }

    // Filter berdasarkan priority
    if (priority) {
      filteredEvents = filteredEvents.filter(
        (event) => event.priority === priority
      );
    }

    // Limit results
    filteredEvents = filteredEvents.slice(-limit);

    return NextResponse.json({
      events: filteredEvents,
      total: events.length,
      filtered: filteredEvents.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST: Mendapatkan statistik events
export async function POST() {
  try {
    const stats: EventStats = {
      total: events.length,
      bySource: {
        discord: 0,
        youtube: 0,
        whatsapp: 0,
        webhook: 0,
        telegram: 0,
        slack: 0,
      },
      byPriority: {
        high: 0,
        low: 0,
        critical: 0,
        normal: 0,
      },
      byDate: {},
      recent: events.slice(-10),
    };

    // Hitung statistik
    events.forEach((event) => {
      // By source
      if (stats.bySource[event.source] !== undefined) {
        stats.bySource[event.source]++;
      }

      // By priority
      if (stats.byPriority[event.priority] !== undefined) {
        stats.byPriority[event.priority]++;
      }

      // By date
      const date = new Date(event.timestamp).toDateString();
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error generating stats:", error);
    return NextResponse.json(
      { error: "Failed to generate stats" },
      { status: 500 }
    );
  }
}

// PUT: Menambah event baru (untuk testing)
export async function PUT(request: NextRequest) {
  try {
    const event: Event = await request.json();

    // Validasi event
    if (!event.id || !event.source || !event.priority) {
      return NextResponse.json(
        { error: "Invalid event data" },
        { status: 400 }
      );
    }

    // Tambahkan timestamp jika tidak ada
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    events.push(event);

    // Batasi jumlah events di memory (max 1000)
    if (events.length > 1000) {
      events = events.slice(-1000);
    }

    return NextResponse.json({
      success: true,
      eventId: event.id,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
