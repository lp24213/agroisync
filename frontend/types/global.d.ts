// Global type declarations to resolve TypeScript errors
declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
}

declare module 'body-parser' {
  import { RequestHandler } from 'express';
  export function json(options?: any): RequestHandler;
  export function urlencoded(options?: any): RequestHandler;
}

declare module 'caseless' {
  interface Caseless {
    set(name: string, value: any, clobber?: boolean): Caseless;
    has(name: string): boolean;
    get(name: string): any;
    remove(name: string): Caseless;
  }
  function caseless(): Caseless;
  export = caseless;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  interface CorsOptions {
    origin?: boolean | string | string[] | RegExp | RegExp[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}

// Global type augmentations
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    recaptchaVerifier?: any;
  }
}

export {};
