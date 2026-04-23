/**
 * Simple in-memory cache for API responses
 * Helps avoid redundant API calls and improves perceived performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Get cached value if it hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache with expiration
   */
  set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs,
    });
  }

  /**
   * Clear cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear cache entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const apiCache = new ResponseCache();

/**
 * Request deduplication to avoid simultaneous identical requests
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Execute request with deduplication
   * If the same request is in flight, return the existing promise
   */
  async execute<T>(
    key: string,
    executor: () => Promise<T>
  ): Promise<T> {
    // Check if request is already in flight
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Start new request
    const promise = executor()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Generate cache key from parameters
 */
export function getCacheKey(
  endpoint: string,
  params: Record<string, any> = {}
): string {
  const paramStr = Object.keys(params)
    .sort()
    .map((k) => `${k}=${JSON.stringify(params[k])}`)
    .join("&");

  return `${endpoint}${paramStr ? `?${paramStr}` : ""}`;
}
