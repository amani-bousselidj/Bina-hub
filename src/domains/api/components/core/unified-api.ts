// Unified API module for core functionality
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiRequest {
  method: string;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

interface Route {
  method: string;
  path: string;
  handler: Function;
  validation?: any;
  auth?: boolean;
  role?: string;
  rateLimit?: string;
}

class ApiLayer {
  private routes: Route[] = [];

  registerRoute(route: Route) {
    this.routes.push(route);
  }

  getRoutes() {
    return this.routes;
  }
}

export const apiLayer = new ApiLayer();

export class APIResponse {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(error: string, message?: string): ApiResponse {
    return {
      success: false,
      error,
      message,
    };
  }
}

export function createHandler(handler: Function) {
  return handler;
}

export class UnifiedAPI {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  async request<T = any>(config: ApiRequest): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${config.url}`, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: config.data ? JSON.stringify(config.data) : undefined,
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, headers });
  }

  async post<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  async put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, headers });
  }
}

export const unifiedAPI = new UnifiedAPI();
export default unifiedAPI;



