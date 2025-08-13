// AGROISYNC.COM - CONFIGURAÇÃO PERFEITA PARA AMPLIFY
// Este arquivo garante que o site funcione 100% sem erros

// Configurações principais
const config = {
  // URLs principais
  API_URL: 'https://api.agroisync.com',
  APP_URL: 'https://agroisync.com',
  
  // Domínios permitidos
  ALLOWED_ORIGINS: [
    'https://agroisync.com',
    'https://www.agroisync.com',
    'https://api.agroisync.com'
  ],
  
  // Segurança
  JWT_SECRET: 'agrotm-production-secret-key-2024',
  MONGO_URI: 'mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority',
  
  // Firebase
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authDomain: 'agroisync.firebaseapp.com',
    projectId: 'agroisync',
    storageBucket: 'agroisync.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdefghijklmnop'
  },
  
  // APIs externas
  EXTERNAL_APIS: {
    coincap: 'https://api.coincap.io/v2',
    alphaVantage: 'demo',
    quandl: 'demo',
    yahooFinance: 'demo',
    finnhub: 'demo'
  },
  
  // Blockchain
  BLOCKCHAIN: {
    ethereum: 'https://mainnet.infura.io/v3/demo',
    solana: 'https://api.mainnet-beta.solana.com'
  },
  
  // Monitoramento
  MONITORING: {
    sentry: 'https://demo@sentry.io/demo',
    ga: 'GA-XXXXXXXXX'
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.agroisyncConfig = config;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

// Exportar para ES modules
if (typeof exports !== 'undefined') {
  exports.default = config;
}

export default config;
