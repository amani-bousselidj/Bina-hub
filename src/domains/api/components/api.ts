export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Create a constructor-like function for APIResponse
export const APIResponse = {
  success<T>(data: T, message?: string): APIResponse<T> {
    return {
      success: true,
      data,
      message
    };
  },
  
  error(error: string): APIResponse {
    return {
      success: false,
      error
    };
  }
};

export function createHandler<T>(
  handler: (req: any) => Promise<APIResponse<T>>
) {
  return async (req: any) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Handler Error:', error);
      return APIResponse.error(error instanceof Error ? error.message : 'Unknown error');
    }
  };
}

export const apiLayer = {
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return APIResponse.success(data);
    } catch (error) {
      return APIResponse.error(error instanceof Error ? error.message : 'Request failed');
    }
  },
  
  async post<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return APIResponse.success(data);
    } catch (error) {
      return APIResponse.error(error instanceof Error ? error.message : 'Request failed');
    }
  },
  
  registerRoute(config: any) {
    // Mock implementation - in real app this would register routes
    console.log('Registering route:', config.method, config.path);
  }
};



