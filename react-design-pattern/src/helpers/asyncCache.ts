/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncLocalStorage } from "async_hooks";

type Callback = (...args: any[]) => Promise<any>;

interface CacheStore {
  data: unknown;
  expiry: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  // In seconds
  revalidate: number;
}

type StringKeyValueMap = Map<string, string>;

const createAsyncLocalStorage = <T>(): AsyncLocalStorage<T> => {
  return new AsyncLocalStorage();
};

export const staticGenerationAsyncStorage =
  createAsyncLocalStorage<StringKeyValueMap>();

const cache = new Map<string, string>();

// In seconds
const MINITE_REVALIDATE = 60;

const unstable_cache = <T extends Callback>(
  key: string,
  callback: T,
  config: CacheConfig = { maxSize: 100, revalidate: MINITE_REVALIDATE }
) => {
  const cachedCallback = async (...args: any[]) => {
    try {
      const store = staticGenerationAsyncStorage.getStore() || cache;
      const nowSecond = Date.now() / 1000;
      // cleanupMemory(() => store.delete(key));
      const cached = store.get(key);
      const parsedCache: CacheStore = cached ? JSON.parse(cached) : null;

      if (cached && parsedCache.expiry > nowSecond) {
        return parsedCache.data as T;
      }

      const data = await staticGenerationAsyncStorage.run(
        cache,
        callback,
        ...args
      );
      const cachedItem = {
        data,
        expiry: nowSecond + config.revalidate,
        lastAccessed: nowSecond,
      };

      store.set(key, JSON.stringify(cachedItem));

      return data;
    } catch (error) {
      console.error(`Cache error for key ${key}:`, error);
      throw error;
    }
  };

  return cachedCallback as unknown as T;
};

export { unstable_cache };
