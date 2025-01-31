import { AsyncLocalStorage } from "async_hooks";

interface CacheStore {
  data: unknown;
  expiry: number;
}

export const storage = new AsyncLocalStorage<Map<string, CacheStore>>();
export const cache = new Map<string, CacheStore>();
const timeoutMap = new Map<string, NodeJS.Timeout>();
const CACHE_TTL = 5 * 1000; // 1 hour in milliseconds

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> => {
  const store = storage.getStore() || cache;

  const now = Date.now();
  console.log(`store: ${storage.getStore()?.size}`, `cache: ${cache.size}`);
  const cached = store.get(key);

  if (cached && cached.expiry > now) {
    console.log("Cache hit:", key);
    return cached.data as T;
  }

  console.log("Cache miss:", key);

  const existingTimeout = timeoutMap.get(key);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const data = await fn();
  store.set(key, {
    data,
    expiry: now + CACHE_TTL,
  });

  const timeout = setTimeout(() => store.delete(key), CACHE_TTL);

  timeoutMap.set(key, timeout);

  return data;
};
