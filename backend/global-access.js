// AGROTM Global Access Configuration - No Region Restrictions
module.exports = {
  // Global CORS Configuration
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
      'X-Client-Version',
      'Origin',
      'Accept'
    ],
    maxAge: 86400
  },

  // Global Security Configuration
  security: {
    // No IP blocking or geofencing
    ipRestrictions: false,
    geoRestrictions: false,
    regionRestrictions: false,
    
    // Allow all countries
    allowedCountries: ['*'],
    blockedCountries: [],
    
    // Allow all IP ranges
    allowedIPs: ['*'],
    blockedIPs: []
  },

  // Global API Configuration
  api: {
    // No region-specific endpoints
    globalEndpoints: true,
    regionFallback: true,
    
    // Support all regions
    supportedRegions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
      'eu-west-1', 'eu-central-1', 'eu-north-1',
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
      'sa-east-1', 'af-south-1'
    ]
  },

  // Web3 Integration - Global Access
  web3: {
    // Support all blockchain networks globally
    networks: ['ethereum', 'polygon', 'bsc', 'solana', 'avalanche'],
    globalAccess: true,
    
    // No region restrictions for blockchain interactions
    regionRestrictions: false
  }
};
