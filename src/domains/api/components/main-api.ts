// Unified API layer for the Binna platform
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, requireRole, AuthenticatedRequest } from './middleware/auth';
import { APIErrorHandler, withErrorHandler } from './middleware/error-handler';
import { rateLimitMiddleware, rateLimitConfigs } from './middleware/rate-limit';
import { validationMiddleware, ValidationConfig } from './middleware/validation';

export interface APIRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>;
  auth?: boolean;
  role?: string;
  rateLimit?: keyof typeof rateLimitConfigs;
  validation?: ValidationConfig;
}

export class UnifiedAPILayer {
  private routes: APIRoute[] = [];
  
  // Register a new API route
  registerRoute(route: APIRoute) {
    this.routes.push(route);
  }
  
  // Process an API request through all middleware layers
  async processRequest(request: NextRequest): Promise<NextResponse> {
    const { pathname } = new URL(request.url);
    const method = request.method as APIRoute['method'];
    
    // Find matching route
    const route = this.routes.find(r => 
      r.method === method && this.matchPath(r.path, pathname)
    );
    
    if (!route) {
      return NextResponse.json(
        { error: 'API endpoint not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    // Apply middleware chain
    const middlewareChain = this.buildMiddlewareChain(route);
    
    for (const middleware of middlewareChain) {
      const response = await middleware(request);
      if (response) {
        return response; // Middleware blocked the request
      }
    }
    
    // Execute the route handler
    try {
      return await route.handler(request as AuthenticatedRequest);
    } catch (error) {
      return APIErrorHandler.handleError(error);
    }
  }
  
  // Build middleware chain for a route
  private buildMiddlewareChain(route: APIRoute) {
    const middlewares: Array<(request: NextRequest) => Promise<NextResponse | null>> = [];
    
    // Rate limiting
    if (route.rateLimit) {
      middlewares.push(rateLimitMiddleware(rateLimitConfigs[route.rateLimit]));
    }
    
    // Validation
    if (route.validation) {
      middlewares.push(validationMiddleware(route.validation));
    }
    
    // Authentication
    if (route.auth) {
      middlewares.push(authMiddleware);
    }
    
    // Role-based access
    if (route.role) {
      middlewares.push(requireRole(route.role));
    }
    
    return middlewares;
  }
  
  // Match path patterns (simple implementation)
  private matchPath(pattern: string, pathname: string): boolean {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    
    if (patternParts.length !== pathParts.length) {
      return false;
    }
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith(':')) {
        // Parameter - matches any value
        continue;
      }
      
      if (patternPart !== pathPart) {
        return false;
      }
    }
    
    return true;
  }
  
  // Extract path parameters
  extractParams(pattern: string, pathname: string): Record<string, string> {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    const params: Record<string, string> = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith(':')) {
        const paramName = patternPart.substring(1);
        params[paramName] = pathPart;
      }
    }
    
    return params;
  }
}

// Create singleton instance
export const apiLayer = new UnifiedAPILayer();

// Helper function to create API responses
export class APIResponse {
  static success(data: any, message?: string) {
    return NextResponse.json({
      success: true,
      data,
      message,
    });
  }
  
  static error(error: string, code: string, status: number = 400) {
    return NextResponse.json({
      success: false,
      error,
      code,
    }, { status });
  }
  
  static paginated(data: any[], page: number, limit: number, total: number) {
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
}

// Utility to wrap handlers with error handling
export function createHandler(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return withErrorHandler(handler);
}



