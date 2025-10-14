declare module '@cloudflare/d1' {
  export interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = any>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec<T = any>(query: string): Promise<D1Result<T>>;
  }

  export interface D1PreparedStatement {
    first<T = any>(): Promise<T | null>;
    run<T = any>(): Promise<D1Result<T>>;
    all<T = any>(): Promise<T[]>;
    bind(...values: any[]): D1PreparedStatement;
  }

  export interface D1Result<T = any> {
    results?: T[];
    success: boolean;
    error?: string;
    meta?: any;
  }
}

declare module 'itty-router' {
  export function Router(): any;
}

declare module 'itty-router-extras' {
  export function json(body: any, init?: ResponseInit): Response;
  export function error(status: number, message: string): Response;
  export function status(code: number, message?: string): Response;
}

declare global {
  interface Env {
    DB: D1Database;
    CACHE: KVNamespace;
    SESSIONS: KVNamespace;
    RESEND_API_KEY: string;
    CF_TURNSTILE_SECRET_KEY: string;
  }
}