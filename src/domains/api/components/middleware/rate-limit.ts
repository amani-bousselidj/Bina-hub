import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

export const rateLimitConfigs = {
  default: { windowMs: 15 * 60 * 1000, max: 100 }, // 15 minutes, 100 requests
  strict: { windowMs: 15 * 60 * 1000, max: 20 },   // 15 minutes, 20 requests
  loose: { windowMs: 15 * 60 * 1000, max: 500 },   // 15 minutes, 500 requests
};

export function createRateLimitMiddleware(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      // Get client identifier (IP address)
      const clientId = getClientId(request);
      const now = Date.now();
      const key = `${clientId}:${request.url}`;

      // Clean up expired records
      cleanupExpiredRecords(now);

      // Get or create rate limit record
      let record = rateLimitStore.get(key);
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + windowMs,
        };
      }

      // Check if limit exceeded
      if (record.count >= maxRequests) {
        return NextResponse.json(
          {
            error: message,
            retryAfter: Math.ceil((record.resetTime - now) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
              'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
            },
          }
        );
      }

      // Increment counter
      record.count++;
      rateLimitStore.set(key, record);

      // Continue to next middleware/handler
      return null;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // Don't block requests on rate limit errors
      return null;
    }
  };
}

export const rateLimitMiddleware = (config: RateLimitConfig) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    const middleware = createRateLimitMiddleware({
      windowMs: config.windowMs,
      maxRequests: config.max,
      message: config.message,
    });
    
    const result = await middleware(req);
    return result || NextResponse.next();
  };
};

function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for proxied requests)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to connection info or unknown
  return 'unknown';
}

function cleanupExpiredRecords(now: number) {
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export default createRateLimitMiddleware;



