// Frontend Security Configuration
module.exports = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.agrotm.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // XSS Protection
  xss: {
    enabled: true,
    mode: 'sanitize',
    whiteList: {
      // Allow specific HTML tags and attributes
      a: ['href', 'title', 'target'],
      b: [],
      i: [],
      strong: [],
      em: [],
      code: [],
      pre: [],
      br: [],
      p: [],
      div: [],
      span: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
    },
  },

  // Input Validation
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    maxObjectDepth: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // API Security
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 10000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  },

  // Authentication
  auth: {
    tokenKey: 'agrotm_token',
    refreshTokenKey: 'agrotm_refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Error Handling
  errorHandling: {
    showStackTraces: process.env.NODE_ENV === 'development',
    logErrors: true,
    reportErrors: process.env.NODE_ENV === 'production',
  },

  // Performance
  performance: {
    enableCompression: true,
    enableCaching: true,
    cacheTTL: 3600,
    enableLazyLoading: true,
    enableCodeSplitting: true,
  },
};
