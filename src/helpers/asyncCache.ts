import { AsyncLocalStorage } from "async_hooks";

interface CacheStore {
  data: unknown;
  expiry: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  ttl: number;
}

class PerformantCache {
  public cache: Map<string, CacheStore>;
  public storage: AsyncLocalStorage<Map<string, CacheStore>>;
  private timeouts: Map<string, NodeJS.Timeout>;
  private config: CacheConfig;

  constructor(config: CacheConfig = { maxSize: 100, ttl: 5000 }) {
    this.storage = new AsyncLocalStorage();
    this.cache = new Map();
    this.timeouts = new Map();
    this.config = config;
  }

  private evictLRU() {
    if (this.cache.size >= this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      const oldest = entries.reduce((a, b) =>
        a[1].lastAccessed < b[1].lastAccessed ? a : b
      );
      this.delete(oldest[0]);
    }
  }

  private delete(key: string) {
    const timeout = this.timeouts.get(key);
    if (timeout) clearTimeout(timeout);
    this.timeouts.delete(key);
    this.cache.delete(key);
  }

  async withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
    try {
      const store = this.storage.getStore() || this.cache;
      const now = Date.now();
      const cached = store.get(key);

      if (cached && cached.expiry > now) {
        console.log(`Cache hit for key ${key}`);
        store.set(key, { ...cached, lastAccessed: now });
        return cached.data as T;
      }

      this.evictLRU();
      const data = await fn();

      console.log(`Cache miss for key ${key}`);

      const timeout = setTimeout(() => this.delete(key), this.config.ttl);
      this.timeouts.set(key, timeout);

      store.set(key, {
        data,
        expiry: now + this.config.ttl,
        lastAccessed: now,
      });

      return data;
    } catch (error) {
      console.error(`Cache error for key ${key}:`, error);
      throw error;
    }
  }

  clear() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts.clear();
    this.cache.clear();
  }
}

export const performantCache = new PerformantCache();
