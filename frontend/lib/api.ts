const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'https://api.agroisync.com';
const METAMASK_ID = process.env.NEXT_PUBLIC_METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private metamaskId: string;

  constructor(baseUrl: string = API_BASE_URL, metamaskId: string = METAMASK_ID) {
    this.baseUrl = baseUrl;
    this.metamaskId = metamaskId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AGROISYNC-Frontend/2.0',
          'x-metamask-id': this.metamaskId, // Enviando ID Metamask no header
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // API status
  async getStatus() {
    return this.request('/api/v1/status');
  }

  // Root endpoint
  async getRoot() {
    return this.request('/');
  }

  // Generic GET request
  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  healthCheck,
  getStatus,
  getRoot,
  get,
  post,
  put,
  delete: deleteRequest,
} = apiClient; 