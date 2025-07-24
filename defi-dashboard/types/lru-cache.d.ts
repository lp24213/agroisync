declare module 'lru-cache' {
  interface LRUOptions {
    max?: number;
    ttl?: number;
    maxAge?: number;
    updateAgeOnGet?: boolean;
    updateAgeOnHas?: boolean;
    dispose?: (key: any, value: any) => void;
    noDisposeOnSet?: boolean;
    stale?: boolean;
  }

  class LRU<K = any, V = any> {
    constructor(options?: LRUOptions | number);
    set(key: K, value: V, maxAge?: number): boolean;
    get(key: K): V | undefined;
    peek(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackFn: (value: V, key: K, cache: LRU<K, V>) => void, thisArg?: any): void;
    size: number;
    max: number;
    ttl: number;
    maxAge: number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
  }

  export = LRU;
}