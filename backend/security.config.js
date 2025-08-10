// Premium Security Configuration for AGROTM Backend
module.exports = {
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Speed Limiting Configuration
  speedLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 50
  },

  // CORS Configuration (GLOBAL ACCESS - NO REGION RESTRICTIONS)
  cors: {
    origin: '*', // Allow ALL origins globally
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
    maxAge: 86400, // 24 hours
  },

  // Helmet Configuration
  helmet: {
    contentSecurityPolicy: {
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
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  },

  // JWT Configuration
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      'your-super-secret-jwt-key-change-in-production',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
    issuer: 'agrotm-backend',
    audience: 'agrotm-frontend',
  },

  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12,
  },

  // API Key Configuration
  apiKey: {
    headerName: 'X-API-Key',
    required: false, // Set to true for protected routes
    validKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    file: {
      error: 'logs/error.log',
      combined: 'logs/combined.log',
      access: 'logs/access.log',
    },
  },

  // Validation Configuration
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    maxObjectDepth: 10,
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // Monitoring Configuration
  monitoring: {
    healthCheck: {
      interval: 30000, // 30 seconds
      timeout: 3000, // 3 seconds
      startPeriod: 5000, // 5 seconds
      retries: 3,
    },
    metrics: {
      enabled: true,
      endpoint: '/metrics',
    },
  },
};
