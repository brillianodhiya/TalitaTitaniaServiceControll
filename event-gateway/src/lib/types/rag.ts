// RAG Request interface
export interface RAGRequest {
  query: string;
  context: {
    userId: string;
    message: string;
    expressResponse: unknown;
    timestamp: string;
  };
}

// RAG Response interface
export interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
  metadata?: {
    processingTime?: number;
    model?: string;
    tokens?: number;
  };
}

// RAG Service configuration
export interface RAGServiceConfig {
  endpoint: string;
  apiKey?: string;
  timeout?: number;
}

// RAG Service information
export interface RAGServiceInfo {
  service: string;
  status: string;
  endpoint?: string;
  error?: string;
}

// RAG Query types
export type RAGQueryType =
  | "general"
  | "technical"
  | "support"
  | "analysis"
  | "summary";

// RAG Context with more details
export interface RAGContext {
  userId: string;
  message: string;
  expressResponse: unknown;
  timestamp: string;
  source?: string;
  queryType?: RAGQueryType;
  userContext?: {
    previousQueries?: string[];
    preferences?: Record<string, unknown>;
    sessionId?: string;
  };
}

// Enhanced RAG Request
export interface EnhancedRAGRequest {
  query: string;
  context: RAGContext;
  options?: {
    maxTokens?: number;
    temperature?: number;
    includeSources?: boolean;
    language?: string;
  };
}

// Enhanced RAG Response
export interface EnhancedRAGResponse {
  answer: string;
  queryId?: string;
  processingTime: number;
  model: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  sources: RAGSource[];
  confidence: number;
  alternatives?: string[];
  metadata: {
    model: string;
    processingTime: number;
    tokens: number;
    version?: string;
    timestamp: string;
  };
}

// RAG Source with more details
export interface RAGSource {
  id: string;
  title: string;
  url?: string;
  content: string;
  relevance: number;
  type: "document" | "webpage" | "database" | "api";
  metadata?: Record<string, unknown>;
}
