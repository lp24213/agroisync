// Security configuration for the application

export interface SecurityConfig {
  // Authentication settings
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    requireMFA: boolean;
  };
  
  // CORS settings
  cors: {
    origin: string | string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  
  // Rate limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
  
  // Content Security Policy
  csp: {
    directives: Record<string, string[]>;
    reportOnly: boolean;
  };
  
  // Helmet settings
  helmet: {
    contentSecurityPolicy: boolean;
    crossOriginEmbedderPolicy: boolean;
    crossOriginOpenerPolicy: boolean;
    crossOriginResourcePolicy: boolean;
    dnsPrefetchControl: boolean;
    frameguard: boolean;
    hidePoweredBy: boolean;
    hsts: boolean;
    ieNoOpen: boolean;
    noSniff: boolean;
    permittedCrossDomainPolicies: boolean;
    referrerPolicy: boolean;
    xssFilter: boolean;
  };
  
  // Session settings
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      secure: boolean;
      httpOnly: boolean;
      maxAge: number;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  
  // API security
  api: {
    requireApiKey: boolean;
    apiKeyHeader: string;
    rateLimitByIp: boolean;
    rateLimitByUser: boolean;
  };
  
  // File upload security
  upload: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    scanForViruses: boolean;
    validateFileContent: boolean;
  };
  
  // Database security
  database: {
    useSSL: boolean;
    sslRejectUnauthorized: boolean;
    connectionTimeout: number;
    queryTimeout: number;
  };
  
  // Logging and monitoring
  monitoring: {
    logSecurityEvents: boolean;
    alertOnSuspiciousActivity: boolean;
    trackFailedLogins: boolean;
    trackApiUsage: boolean;
  };
}

// Environment-specific configurations
const getEnvironmentConfig = (env: string): Partial<SecurityConfig> => {
  if (env === 'development') {
    return {
      auth: {
        jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
        jwtExpiresIn: '1h',
        refreshTokenExpiresIn: '7d',
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        passwordMinLength: 6,
        requireMFA: false,
      },
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },
      helmet: {
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        dnsPrefetchControl: true,
        frameguard: true,
        hidePoweredBy: true,
        hsts: false,
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true,
      },
      session: {
        secret: process.env.SESSION_SECRET || 'dev-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'lax',
        },
      },
      api: {
        requireApiKey: false,
        apiKeyHeader: 'X-API-Key',
        rateLimitByIp: true,
        rateLimitByUser: false,
      },
      upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        scanForViruses: false,
        validateFileContent: false,
      },
      database: {
        useSSL: false,
        sslRejectUnauthorized: false,
        connectionTimeout: 5000,
        queryTimeout: 10000,
      },
      monitoring: {
        logSecurityEvents: true,
        alertOnSuspiciousActivity: false,
        trackFailedLogins: true,
        trackApiUsage: false,
      },
    };
  } else if (env === 'staging') {
    return {
      auth: {
        jwtSecret: process.env.JWT_SECRET || 'staging-secret-key',
        jwtExpiresIn: '30m',
        refreshTokenExpiresIn: '7d',
        maxLoginAttempts: 3,
        lockoutDuration: 30 * 60 * 1000, // 30 minutes
        passwordMinLength: 8,
        requireMFA: true,
      },
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://staging.agrotm.com'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 50,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },
      helmet: {
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        frameguard: true,
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true,
      },
      session: {
        secret: process.env.SESSION_SECRET || 'staging-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'strict',
        },
      },
      api: {
        requireApiKey: true,
        apiKeyHeader: 'X-API-Key',
        rateLimitByIp: true,
        rateLimitByUser: true,
      },
      upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        scanForViruses: true,
        validateFileContent: true,
      },
      database: {
        useSSL: true,
        sslRejectUnauthorized: true,
        connectionTimeout: 10000,
        queryTimeout: 30000,
      },
      monitoring: {
        logSecurityEvents: true,
        alertOnSuspiciousActivity: true,
        trackFailedLogins: true,
        trackApiUsage: true,
      },
    };
  } else if (env === 'production') {
    return {
      auth: {
        jwtSecret: process.env.JWT_SECRET || 'production-secret-key',
        jwtExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
        maxLoginAttempts: 3,
        lockoutDuration: 60 * 60 * 1000, // 1 hour
        passwordMinLength: 12,
        requireMFA: true,
      },
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://agrotm.com'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 30,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },
      helmet: {
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        frameguard: true,
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true,
      },
      session: {
        secret: process.env.SESSION_SECRET || 'production-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'strict',
        },
      },
      api: {
        requireApiKey: true,
        apiKeyHeader: 'X-API-Key',
        rateLimitByIp: true,
        rateLimitByUser: true,
      },
      upload: {
        maxFileSize: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        scanForViruses: true,
        validateFileContent: true,
      },
      database: {
        useSSL: true,
        sslRejectUnauthorized: true,
        connectionTimeout: 15000,
        queryTimeout: 60000,
      },
      monitoring: {
        logSecurityEvents: true,
        alertOnSuspiciousActivity: true,
        trackFailedLogins: true,
        trackApiUsage: true,
      },
    };
  }
  
  // Default configuration
  return {};
};

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    jwtExpiresIn: '1h',
    refreshTokenExpiresIn: '7d',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
    passwordMinLength: 8,
    requireMFA: false,
  },
  cors: {
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
    reportOnly: false,
  },
  helmet: {
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  },
  api: {
    requireApiKey: false,
    apiKeyHeader: 'X-API-Key',
    rateLimitByIp: true,
    rateLimitByUser: false,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    scanForViruses: false,
    validateFileContent: false,
  },
  database: {
    useSSL: false,
    sslRejectUnauthorized: false,
    connectionTimeout: 5000,
    queryTimeout: 10000,
  },
  monitoring: {
    logSecurityEvents: true,
    alertOnSuspiciousActivity: false,
    trackFailedLogins: true,
    trackApiUsage: false,
  },
};

// Get security configuration for current environment
export const getSecurityConfig = (): SecurityConfig => {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = getEnvironmentConfig(env);
  
  return {
    ...defaultSecurityConfig,
    ...envConfig,
  };
};

// Export the current security configuration
export const securityConfig = getSecurityConfig();
