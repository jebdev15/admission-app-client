/**
 * Cache Service
 * Provides in-memory caching with TTL (Time To Live) support
 * Useful for reducing API calls and improving app performance
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class CacheService {
    private cache: Map<string, CacheEntry<unknown>>;

    constructor() {
        this.cache = new Map();
    }

    /**
     * Store data in cache with a specific TTL
     * @param key - Cache key
     * @param data - Data to cache
     * @param ttl - Time to live in milliseconds (default: 5 minutes)
     */
    set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl,
        };
        this.cache.set(key, entry);
    }

    /**
     * Retrieve data from cache
     * @param key - Cache key
     * @returns Cached data or null if not found or expired
     */
    get<T>(key: string): { data: T; fromCache: boolean } | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        const now = Date.now();
        const isExpired = now - entry.timestamp > entry.ttl;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return {
            data: entry.data,
            fromCache: true,
        };
    }

    /**
     * Check if a key exists in cache and is not expired
     * @param key - Cache key
     * @returns boolean
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Remove a specific item from cache
     * @param key - Cache key
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clear all cache entries that match a pattern
     * @param pattern - Pattern to match (uses includes)
     */
    clearPattern(pattern: string): void {
        const keysToDelete: string[] = [];
        this.cache.forEach((_, key) => {
            if (key.includes(pattern)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
