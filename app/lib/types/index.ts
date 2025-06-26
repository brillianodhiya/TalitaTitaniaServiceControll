// Export all types from their respective modules
export * from "./events";
export * from "./rag";
export * from "./commands";

// Common types used across the application
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  metadata?: {
    processingTime?: number;
    version?: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface HealthCheck {
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

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  activeConnections: number;
  timestamp: string;
}

export interface UserSession {
  id: string;
  userId: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  source: string;
  timestamp: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
