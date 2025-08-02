// types/global.d.ts

// Declarações globais para o projeto AGROTM

declare global {
  // Variáveis de ambiente
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_SOLANA_RPC_URL: string;
      NEXT_PUBLIC_ETHEREUM_RPC_URL: string;
      NEXT_PUBLIC_CHAIN_ID: string;
      NEXT_PUBLIC_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_AGROTM_TOKEN_ADDRESS: string;
      NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
      NEXT_PUBLIC_COINGECKO_API_KEY: string;
      NEXT_PUBLIC_WEATHER_API_KEY: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      NEXT_PUBLIC_GA_ID: string;
      NEXT_PUBLIC_MIXPANEL_TOKEN: string;
      NEXT_PUBLIC_DISCORD_WEBHOOK_URL: string;
      NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: string;
      NEXT_PUBLIC_TELEGRAM_CHAT_ID: string;
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      NEXT_PUBLIC_AGRO_ORACLE_API_URL: string;
      NEXT_PUBLIC_AGRO_ORACLE_API_KEY: string;
    }
  }

  // Extensões de bibliotecas
  interface Window {
    ethereum?: any;
    solana?: any;
    phantom?: any;
    solflare?: any;
    slope?: any;
    coinbaseWalletExtension?: any;
    walletLinkExtension?: any;
    __NEXT_DATA__?: any;
    __NEXT_REDUX_DEVTOOLS_EXTENSION__?: any;
  }

  // Extensões de eventos
  interface CustomEventMap {
    'wallet-connected': CustomEvent<{ wallet: string; address: string }>;
    'wallet-disconnected': CustomEvent<{ wallet: string }>;
    'transaction-sent': CustomEvent<{ signature: string; status: string }>;
    'transaction-confirmed': CustomEvent<{ signature: string; slot: number }>;
    'nft-minted': CustomEvent<{ tokenId: string; metadata: any }>;
    'staking-staked': CustomEvent<{ amount: number; pool: string }>;
    'staking-unstaked': CustomEvent<{ amount: number; pool: string }>;
    'governance-voted': CustomEvent<{ proposalId: string; choice: number }>;
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (ev: CustomEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
  }

  // Extensões de console para desenvolvimento
  interface Console {
    agrotm?: {
      log: (message: string, data?: any) => void;
      error: (message: string, error?: any) => void;
      warn: (message: string, data?: any) => void;
      info: (message: string, data?: any) => void;
    };
  }
}

// Declarações de módulos
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Tipos utilitários globais
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : any;

export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Tipos para API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para eventos
export interface Web3Event {
  type: string;
  data: any;
  timestamp: number;
  transactionHash?: string;
}

// Tipos para configurações
export interface AppConfig {
  name: string;
  version: string;
  environment: string;
  api: {
    baseUrl: string;
    timeout: number;
  };
  blockchain: {
    solana: {
      rpcUrl: string;
      network: string;
    };
    ethereum: {
      rpcUrl: string;
      chainId: number;
    };
  };
  features: {
    nft: boolean;
    staking: boolean;
    governance: boolean;
    oracle: boolean;
  };
}

export {}; 