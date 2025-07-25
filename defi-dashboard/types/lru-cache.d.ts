declare module 'lru-cache' {
  export default class LRU<K, V> {
    constructor(options?: {
      max?: number;
      maxAge?: number;
      length?: (value: V, key: K) => number;
      dispose?: (key: K, value: V) => void;
      stale?: boolean;
      noDisposeOnSet?: boolean;
      updateAgeOnGet?: boolean;
      ttl?: number;
    });

    set(key: K, value: V, maxAge?: number): boolean;
    get(key: K): V | undefined;
    peek(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    keys(): K[];
    values(): V[];
    length: number;
    itemCount: number;
    forEach(callbackFn: (value: V, key: K, cache: this) => void, thisArg?: any): void;
    rforEach(callbackFn: (value: V, key: K, cache: this) => void, thisArg?: any): void;
    dump(): Array<{ k: K; v: V; e?: number }>;
    load(cacheEntries: Array<{ k: K; v: V; e?: number }>): void;
    prune(): void;
    reset(): void;
  }
}
