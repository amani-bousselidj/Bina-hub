// Security configuration for all Binna platform products
import { NextRequest, NextResponse } from 'next/server';

export interface SecurityConfig {
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
  };
  contentSecurity: {
    enabled: boolean;
    directives: Record<string, string[]>;
  };
  sessionSecurity: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
}

export const defaultSecurityConfig: SecurityConfig = {
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
  },
  cors: {
    enabled: true,
    allowedOrigins: [
      'https://binna.sa',
      'https://www.binna.sa',
      'https://pos.binna.sa',
      'https://inventory.binna.sa',
      'https://accounting.binna.sa',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  contentSecurity: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:'],
      'connect-src': ["'self'", 'https://api.binna.sa'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
  },
  sessionSecurity: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Rate limiting store (in-memory for now, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(req: NextRequest, config: SecurityConfig['rateLimiting']) {
  if (!config.enabled) return null;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                 req.headers.get('x-real-ip') || 
                 'unknown';
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(ip) || { count: 0, resetTime: now + config.windowMs };

  if (current.count >= config.maxRequests && current.resetTime > now) {
    return NextResponse.json(
      { 
        error: 'Too many requests',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      },
      { status: 429 }
    );
  }

  current.count++;
  rateLimitStore.set(ip, current);

  return null;
}

export function corsMiddleware(req: NextRequest, config: SecurityConfig['cors']) {
  if (!config.enabled) return {};

  const origin = req.headers.get('origin');
  const isAllowedOrigin = !origin || config.allowedOrigins.includes(origin) || config.allowedOrigins.includes('*');

  if (!isAllowedOrigin) {
    return {
      'Access-Control-Allow-Origin': 'null',
    };
  }

  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': config.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

export function securityHeadersMiddleware(config: SecurityConfig['contentSecurity']) {
  if (!config.enabled) return {};

  const cspValue = Object.entries(config.directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  return {
    'Content-Security-Policy': cspValue,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

export function createSecurityMiddleware(customConfig?: Partial<SecurityConfig>) {
  const config = { ...defaultSecurityConfig, ...customConfig };

  return function securityMiddleware(req: NextRequest): NextResponse | null {
    // Apply rate limiting
    const rateLimitResponse = rateLimitMiddleware(req, config.rateLimiting);
    if (rateLimitResponse) return rateLimitResponse;

    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
      const corsHeaders = corsMiddleware(req, config.cors) || {};
      const securityHeaders = securityHeadersMiddleware(config.contentSecurity) || {};
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          ...corsHeaders,
          ...securityHeaders,
        } as HeadersInit,
      });
    }

    return null;
  };
}

export function addSecurityHeaders(response: NextResponse, customConfig?: Partial<SecurityConfig>) {
  const config = { ...defaultSecurityConfig, ...customConfig };

  // Add CORS headers
  // CORS headers would be set here in a real implementation
      const corsHeaders = {};
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, String(value));
  });

  // Add security headers
  const securityHeaders = securityHeadersMiddleware(config.contentSecurity);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export default createSecurityMiddleware;


