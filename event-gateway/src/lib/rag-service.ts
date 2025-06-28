import axios, { AxiosResponse, AxiosInstance } from "axios";
import {
  RAGRequest,
  RAGResponse,
  RAGServiceConfig,
  RAGServiceInfo,
} from "./types/rag";

// Default RAG service configuration
const defaultConfig: RAGServiceConfig = {
  endpoint: process.env.RAG_ENDPOINT || "http://localhost:8000/rag",
  apiKey: process.env.RAG_API_KEY,
  timeout: 30000, // 30 seconds
};

export class RAGService {
  private config: RAGServiceConfig;
  private axiosInstance: AxiosInstance;

  constructor(config?: Partial<RAGServiceConfig>) {
    this.config = { ...defaultConfig, ...config };

    // Setup axios instance untuk RAG service
    this.axiosInstance = axios.create({
      baseURL: this.config.endpoint,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey && {
          Authorization: `Bearer ${this.config.apiKey}`,
        }),
      },
    });
  }

  async query(request: RAGRequest): Promise<RAGResponse> {
    const startTime = Date.now();

    try {
      // Jika endpoint tidak dikonfigurasi, gunakan simulasi
      if (
        !this.config.endpoint ||
        this.config.endpoint === "http://localhost:8000/rag"
      ) {
        return this.simulateRAGResponse(request);
      }

      // Real RAG API call menggunakan axios
      console.log("🤖 Calling RAG service:", this.config.endpoint);
      const response: AxiosResponse<RAGResponse> =
        await this.axiosInstance.post("/query", request);

      const processingTime = Date.now() - startTime;

      return {
        ...response.data,
        metadata: {
          ...response.data.metadata,
          processingTime,
        },
      };
    } catch (error) {
      console.error("❌ RAG service error:", error);

      // Fallback ke simulasi jika RAG service gagal
      return this.simulateRAGResponse(request);
    }
  }

  private simulateRAGResponse(request: RAGRequest): RAGResponse {
    const processingTime = Math.random() * 1000 + 500; // 500-1500ms

    return {
      answer: `Simulated RAG response untuk: "${request.query}" dari user ${request.context.userId}. 
               Context message: "${request.context.message}"`,
      sources: [
        "simulated_source_1.pdf",
        "simulated_source_2.txt",
        "simulated_knowledge_base.json",
      ],
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      metadata: {
        processingTime,
        model: "simulated-rag-model",
        tokens: Math.floor(Math.random() * 1000) + 500,
      },
    };
  }

  // Method untuk testing
  async healthCheck(): Promise<boolean> {
    try {
      if (
        !this.config.endpoint ||
        this.config.endpoint === "http://localhost:8000/rag"
      ) {
        return true; // Simulasi selalu sehat
      }

      const response = await this.axiosInstance.get("/health");
      return response.status === 200;
    } catch (error) {
      console.error("❌ RAG health check failed:", error);
      return false;
    }
  }

  // Method untuk mendapatkan info RAG service
  async getServiceInfo(): Promise<RAGServiceInfo> {
    try {
      if (
        !this.config.endpoint ||
        this.config.endpoint === "http://localhost:8000/rag"
      ) {
        return {
          service: "simulated",
          status: "healthy",
          endpoint: "simulated",
        };
      }

      const response = await this.axiosInstance.get("/info");
      return response.data;
    } catch (error) {
      console.error("❌ Failed to get RAG service info:", error);
      return {
        service: "unknown",
        status: "error",
        error: String(error),
      };
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();
