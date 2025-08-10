// @ts-nocheck
// Enhanced API Endpoints for Binna Platform
// RESTful API design with unified architecture

import { apiLayer } from './unified-api';

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  role?: string;
  rateLimit?: 'api' | 'auth' | 'public' | 'upload';
}

export const publicAPIEndpoints: APIEndpoint[] = [
  // Products API
  { method: 'GET', path: '/api/v1/products', description: 'List all products', auth: false, rateLimit: 'public' },
  { method: 'GET', path: '/api/v1/products/:id', description: 'Get product details', auth: false, rateLimit: 'public' },
  { method: 'POST', path: '/api/v1/products', description: 'Create new product', auth: true, role: 'store_owner', rateLimit: 'api' },
  { method: 'PUT', path: '/api/v1/products/:id', description: 'Update product', auth: true, role: 'store_owner', rateLimit: 'api' },
  { method: 'DELETE', path: '/api/v1/products/:id', description: 'Delete product', auth: true, role: 'store_owner', rateLimit: 'api' },
  
  // Orders API
  { method: 'GET', path: '/api/v1/orders', description: 'List orders', auth: true, rateLimit: 'api' },
  { method: 'GET', path: '/api/v1/orders/:id', description: 'Get order details', auth: true, rateLimit: 'api' },
  { method: 'POST', path: '/api/v1/orders', description: 'Create new order', auth: true, rateLimit: 'api' },
  { method: 'PUT', path: '/api/v1/orders/:id/status', description: 'Update order status', auth: true, rateLimit: 'api' },
  
  // Stores API
  { method: 'GET', path: '/api/v1/stores', description: 'List stores', auth: false, rateLimit: 'public' },
  { method: 'GET', path: '/api/v1/stores/:id', description: 'Get store details', auth: false, rateLimit: 'public' },
  { method: 'POST', path: '/api/v1/stores', description: 'Create new store', auth: true, role: 'store_owner', rateLimit: 'api' },
  { method: 'PUT', path: '/api/v1/stores/:id', description: 'Update store', auth: true, role: 'store_owner', rateLimit: 'api' },
  
  // Analytics API
  { method: 'GET', path: '/api/v1/analytics/sales', description: 'Get sales analytics', auth: true, role: 'store_owner', rateLimit: 'api' },
  { method: 'GET', path: '/api/v1/analytics/inventory', description: 'Get inventory metrics', auth: true, role: 'store_owner', rateLimit: 'api' },
  { method: 'GET', path: '/api/v1/analytics/customers', description: 'Get customer analytics', auth: true, role: 'store_owner', rateLimit: 'api' },
  
  // Authentication API
  { method: 'POST', path: '/api/v1/auth/login', description: 'User login', auth: false, rateLimit: 'auth' },
  { method: 'POST', path: '/api/v1/auth/register', description: 'User registration', auth: false, rateLimit: 'auth' },
  { method: 'POST', path: '/api/v1/auth/logout', description: 'User logout', auth: true, rateLimit: 'auth' },
  { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh token', auth: true, rateLimit: 'auth' },
  
  // Construction API
  { method: 'GET', path: '/api/v1/construction/projects', description: 'List construction projects', auth: true, rateLimit: 'api' },
  { method: 'POST', path: '/api/v1/construction/projects', description: 'Create new project', auth: true, rateLimit: 'api' },
  { method: 'GET', path: '/api/v1/construction/materials', description: 'List construction materials', auth: false, rateLimit: 'public' },
  { method: 'GET', path: '/api/v1/construction/experts', description: 'List construction experts', auth: false, rateLimit: 'public' },
  
  // AI Recommendations API
  { method: 'GET', path: '/api/v1/recommendations/:userId', description: 'Get personalized recommendations', auth: true, rateLimit: 'api' },
  { method: 'POST', path: '/api/v1/recommendations/feedback', description: 'Submit recommendation feedback', auth: true, rateLimit: 'api' },
  
  // Webhook API
  { method: 'POST', path: '/api/v1/webhooks/register', description: 'Register webhook endpoint', auth: true, role: 'admin', rateLimit: 'api' },
  { method: 'DELETE', path: '/api/v1/webhooks/:id', description: 'Delete webhook', auth: true, role: 'admin', rateLimit: 'api' },
  
  // File Upload API
  { method: 'POST', path: '/api/v1/upload/image', description: 'Upload image file', auth: true, rateLimit: 'upload' },
  { method: 'POST', path: '/api/v1/upload/document', description: 'Upload document file', auth: true, rateLimit: 'upload' },
];

export class APIManager {
  static validateRequest(endpoint: string, method: string, hasAuth: boolean, userRole?: string): boolean {
    const api = publicAPIEndpoints.find(e => e.path === endpoint && e.method === method);
    if (!api) return false;
    
    // Check authentication requirement
    if (api.auth && !hasAuth) return false;
    
    // Check role requirement
    if (api.role && userRole !== api.role && userRole !== 'admin') return false;
    
    return true;
  }

  static generateAPIKey(): string {
    return 'binna_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static getEndpointsByRole(role: string): APIEndpoint[] {
    return publicAPIEndpoints.filter(endpoint => {
      if (!endpoint.auth) return true; // Public endpoints
      if (!endpoint.role) return true; // Any authenticated user
      return endpoint.role === role || role === 'admin';
    });
  }

  static getEndpointDocumentation(): any {
    return {
      title: 'Binna Platform API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for the Binna marketplace and ERP platform',
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.binna.sa',
      endpoints: publicAPIEndpoints.map(endpoint => ({
        ...endpoint,
        fullPath: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.binna.sa'}${endpoint.path}`,
      })),
      authentication: {
        type: 'Bearer Token',
        description: 'Include JWT token in Authorization header',
        example: 'Authorization: Bearer your-jwt-token-here',
      },
      rateLimits: {
        api: '100 requests per minute',
        auth: '5 requests per 15 minutes',
        public: '200 requests per minute',
        upload: '10 requests per minute',
      },
    };
  }
}





