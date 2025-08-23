declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      MONGODB_URI?: string;
      MONGODB_URL?: string;
      MONGODB_DB?: string;
      POSTGRES_HOST?: string;
      POSTGRES_PORT?: string;
      POSTGRES_DB?: string;
      POSTGRES_USER?: string;
      POSTGRES_PASSWORD?: string;
      REDIS_URL?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_PASSWORD?: string;
      
      // Firebase
      FIREBASE_ADMIN_TYPE?: string;
      FIREBASE_ADMIN_PROJECT_ID?: string;
      FIREBASE_ADMIN_PRIVATE_KEY_ID?: string;
      FIREBASE_ADMIN_PRIVATE_KEY?: string;
      FIREBASE_ADMIN_CLIENT_EMAIL?: string;
      FIREBASE_ADMIN_CLIENT_ID?: string;
      FIREBASE_ADMIN_AUTH_URI?: string;
      FIREBASE_ADMIN_TOKEN_URI?: string;
      FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL?: string;
      FIREBASE_ADMIN_CLIENT_X509_CERT_URL?: string;
      FIREBASE_DATABASE_URL?: string;
      FIREBASE_STORAGE_BUCKET?: string;
      
      // Security
      JWT_SECRET?: string;
      ALLOWED_ORIGINS?: string;
      UPSTASH_REDIS_URL?: string;
      UPSTASH_REDIS_TOKEN?: string;
      SECURITY_WEBHOOK_URL?: string;
      SECURITY_LOG_ENDPOINT?: string;
      
      // Web3
      SOLANA_MAINNET_RPC?: string;
      SOLANA_NETWORK?: string;
      AGROTM_TOKEN_ADDRESS?: string;
      AGRO_TOKEN_ADDRESS?: string;
      REWARDS_TOKEN_ADDRESS?: string;
      TREASURY_ADDRESS?: string;
      COMMISSION_RATE?: string;
      COMMISSION_RECEIVER?: string;
      
      // Network
      NETWORK?: string;
      RPC_URL?: string;
      PRIVATE_KEY?: string;
      GAS_LIMIT?: string;
      GAS_PRICE?: string;
      
      // App
      PORT?: string;
      NODE_ENV?: string;
      LOG_LEVEL?: string;
      MONGODB_SITE_VERIFICATION?: string;
    }
  }
}

export {};
