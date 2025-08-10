import Redis from 'ioredis';
import { createClient } from 'redis';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis client for session storage
const sessionRedis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
});

// Cache utilities
export class CacheManager {
  private static instance: CacheManager;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cached data
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cached data
  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear all cache
  async clear(): Promise<boolean> {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    try {
      const info = await this.redis.info('memory');
      return {
        memory: info,
        keyspace: await this.redis.info('keyspace'),
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}

// Cache decorators
export function cached(ttl: number = 3600) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cache = CacheManager.getInstance();
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }
      
      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Cache strategies
export const CacheStrategies = {
  // Products cache (1 hour)
  PRODUCTS: 3600,
  
  // User sessions (24 hours)
  USER_SESSION: 86400,
  
  // API responses (5 minutes)
  API_RESPONSE: 300,
  
  // Analytics data (30 minutes)
  ANALYTICS: 1800,
  
  // Static content (1 week)
  STATIC_CONTENT: 604800,
};

// Cache keys
export const CacheKeys = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: (userId: string) => `user:${userId}`,
  MARKETPLACE_DATA: 'marketplace:data',
  ANALYTICS_DASHBOARD: 'analytics:dashboard',
  INVENTORY_LEVELS: 'inventory:levels',
  SALES_REPORTS: 'sales:reports',
  CUSTOMER_DATA: (customerId: string) => `customer:${customerId}`,
};

// Initialize Redis connections
export async function initializeRedis(): Promise<void> {
  try {
    await redis.connect();
    await sessionRedis.connect();
    console.log('Redis connections established');
  } catch (error) {
    console.error('Redis initialization error:', error);
    throw error;
  }
}

// Close Redis connections
export async function closeRedis(): Promise<void> {
  try {
    await redis.disconnect();
    await sessionRedis.disconnect();
    console.log('Redis connections closed');
  } catch (error) {
    console.error('Redis close error:', error);
  }
}

// Export Redis instances
export { redis, sessionRedis };
export default CacheManager;


