export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp?: number;
}

export class ApiErrorHandler {
  private static errorCache = new Map<string, { error: ApiError; timestamp: number }>();
  private static readonly CACHE_DURATION = 5000; // 5 seconds

  static handleError(error: any, context?: string): ApiError {
    const cacheKey = context ? `${context}-${JSON.stringify(error)}` : JSON.stringify(error);
    const cached = this.errorCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.error;
    }

    const processedError = this.processError(error);
    
    this.errorCache.set(cacheKey, { 
      error: processedError, 
      timestamp: Date.now() 
    });

    // Clean old cache entries
    this.cleanExpiredCache();
    
    return processedError;
  }

  private static cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.errorCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.errorCache.delete(key);
      }
    }
  }

  private static processError(error: any): ApiError {
    const timestamp = Date.now();

    // Network errors
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        message: 'No internet connection. Please check your network.',
        code: 'NETWORK_ERROR',
        timestamp
      };
    }

    // HTTP errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return {
            message: data?.message || 'Invalid request. Please check your input.',
            status,
            code: 'BAD_REQUEST',
            details: data,
            timestamp
          };
        case 401:
          return {
            message: 'Authentication required. Please log in.',
            status,
            code: 'UNAUTHORIZED',
            timestamp
          };
        case 403:
          return {
            message: 'Access denied. You do not have permission.',
            status,
            code: 'FORBIDDEN',
            timestamp
          };
        case 404:
          return {
            message: 'Resource not found.',
            status,
            code: 'NOT_FOUND',
            timestamp
          };
        case 429:
          return {
            message: 'Too many requests. Please try again later.',
            status,
            code: 'RATE_LIMITED',
            timestamp
          };
        case 500:
          return {
            message: 'Server error. Please try again later.',
            status,
            code: 'SERVER_ERROR',
            timestamp
          };
        default:
          return {
            message: data?.message || 'An unexpected error occurred.',
            status,
            code: 'UNKNOWN_ERROR',
            details: data,
            timestamp
          };
      }
    }

    // JavaScript errors
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'CLIENT_ERROR',
        timestamp
      };
    }

    // Unknown errors
    return {
      message: 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR',
      details: error,
      timestamp
    };
  }

  static isRetryable(error: ApiError): boolean {
    return error.status === 429 || 
           error.status === 500 || 
           error.status === 502 || 
           error.status === 503 || 
           error.status === 504 ||
           error.code === 'NETWORK_ERROR';
  }
}

export default ApiErrorHandler;


