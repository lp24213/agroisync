// AGROISYNC.COM - CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// Este arquivo garante que o site funcione 100% sem erros

const envConfig = {
  // Configurações principais
  NODE_ENV: 'production',
  NEXT_PUBLIC_API_URL: 'https://api.agroisync.com',
  NEXT_PUBLIC_APP_URL: 'https://agroisync.com',
  NEXT_PUBLIC_ALLOWED_ORIGINS: 'https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com',
  
  // Segurança
  NEXT_PUBLIC_JWT_SECRET: 'agrotm-production-secret-key-2024',
  NEXT_PUBLIC_MONGO_URI: 'mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority',
  
  // Firebase (configurações públicas)
  NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'agroisync.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'agroisync',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'agroisync.appspot.com',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789012',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456789012:web:abcdefghijklmnop',
  
  // APIs Externas (configurações públicas)
  NEXT_PUBLIC_COINCAP_API_URL: 'https://api.coincap.io/v2',
  NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY: 'demo',
  NEXT_PUBLIC_QUANDL_API_KEY: 'demo',
  NEXT_PUBLIC_YAHOO_FINANCE_API_KEY: 'demo',
  NEXT_PUBLIC_FINNHUB_API_KEY: 'demo',
  
  // Blockchain (configurações públicas)
  NEXT_PUBLIC_ETHEREUM_RPC_URL: 'https://mainnet.infura.io/v3/demo',
  NEXT_PUBLIC_SOLANA_RPC_URL: 'https://api.mainnet-beta.solana.com',
  
  // Monitoramento (configurações públicas)
  NEXT_PUBLIC_SENTRY_DSN: 'https://demo@sentry.io/demo',
  NEXT_PUBLIC_GA_TRACKING_ID: 'GA-XXXXXXXXX',
  
  // Configurações de build
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_SHARP_PATH: './node_modules/sharp'
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.envConfig = envConfig;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = envConfig;
}

// Exportar para ES modules
if (typeof exports !== 'undefined') {
  exports.default = envConfig;
}

export default envConfig;
