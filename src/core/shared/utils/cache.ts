import React from 'react';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, value: T, ttl: number = 300000): void { // 5 minutes default
    // Clean expired entries if cache is getting large
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    this.cleanup(); // Clean before getting stats
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    };
  }
}

// Global cache instance
export const globalCache = new CacheManager(500);

// React hook for caching
export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300000
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [data, setData] = React.useState<T | null>(globalCache.get(key));
  const [loading, setLoading] = React.useState(!globalCache.has(key));
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      globalCache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl]);

  React.useEffect(() => {
    if (!globalCache.has(key)) {
      fetchData();
    }
  }, [key, fetchData]);

  const refresh = React.useCallback(async () => {
    globalCache.delete(key);
    await fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refresh };
}

export default CacheManager;


