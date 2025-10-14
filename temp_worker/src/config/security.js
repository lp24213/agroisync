// ===== CONFIGURAÃ‡ÃƒO DE SEGURANÃ‡A =====

export const securityConfig = {
  // ConfiguraÃ§Ãµes de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: process.env.JWT_ISSUER || 'agroisync',
    audience: process.env.JWT_AUDIENCE || 'agroisync-users'
  },

  // ConfiguraÃ§Ãµes de senha
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // dias
    historyCount: 5 // manter histÃ³rico de Ãºltimas 5 senhas
  },

  // ConfiguraÃ§Ãµes de 2FA
  twoFactor: {
    enabled: true,
    algorithm: 'sha1',
    digits: 6,
    period: 30, // segundos
    window: 1, // tolerÃ¢ncia de 1 perÃ­odo
    maxAttempts: 3,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos
  },

  // ConfiguraÃ§Ãµes de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: {
      public: 100, // usuÃ¡rios nÃ£o autenticados
      authenticated: 500, // usuÃ¡rios autenticados
      admin: 1000, // administradores
      critical: 10 // endpoints crÃ­ticos
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // ConfiguraÃ§Ãµes de sessÃ£o
  session: {
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: 'strict'
    }
  },

  // ConfiguraÃ§Ãµes de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token'
    ]
  },

  // ConfiguraÃ§Ãµes de Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net'
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://api.github.com', 'wss:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000, // 1 ano
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  },

  // ConfiguraÃ§Ãµes de validaÃ§Ã£o de entrada
  inputValidation: {
    maxFieldLength: 10000, // 10KB por campo
    maxTotalLength: 100000, // 100KB total
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    sanitizeHtml: true
  },

  // ConfiguraÃ§Ãµes de auditoria
  audit: {
    enabled: true,
    logLevel: process.env.AUDIT_LOG_LEVEL || 'info',
    retentionDays: 90,
    sensitiveFields: ['password', 'token', 'secret', 'key', 'creditCard', 'ssn', 'cpf', 'cnpj']
  },

  // ConfiguraÃ§Ãµes de LGPD
  gdpr: {
    enabled: true,
    consentExpiryDays: 365,
    dataRetentionDays: {
      userProfile: 2555, // 7 anos
      transactions: 2555, // 7 anos
      logs: 90, // 90 dias
      analytics: 730 // 2 anos
    },
    rightToErasure: true,
    rightToPortability: true,
    dataProcessingBasis: ['consent', 'contract', 'legal_obligation', 'legitimate_interest']
  },

  // ConfiguraÃ§Ãµes de monitoramento de seguranÃ§a
  securityMonitoring: {
    enabled: true,
    alertThresholds: {
      failedLogins: 5, // alertar apÃ³s 5 tentativas falhadas
      suspiciousActivity: 3, // alertar apÃ³s 3 atividades suspeitas
      rateLimitExceeded: 10 // alertar apÃ³s 10 violaÃ§Ãµes de rate limit
    },
    notificationChannels: ['email', 'slack', 'webhook'],
    realTimeAlerts: true
  },

  // ConfiguraÃ§Ãµes de backup e recuperaÃ§Ã£o
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // dias
    encryption: true,
    compression: true,
    location: process.env.BACKUP_LOCATION || 'local'
  },

  // ConfiguraÃ§Ãµes de criptografia
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    saltRounds: 12, // para bcrypt
    pepper: process.env.ENCRYPTION_PEPPER || 'your-encryption-pepper'
  },

  // ConfiguraÃ§Ãµes de headers de seguranÃ§a
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  },

  // ConfiguraÃ§Ãµes de ambiente
  environment: {
    production: {
      secureCookies: true,
      httpsRedirect: true,
      hsts: true,
      compression: true,
      logging: 'error'
    },
    development: {
      secureCookies: false,
      httpsRedirect: false,
      hsts: false,
      compression: false,
      logging: 'debug'
    }
  }
};

// ===== FUNÃ‡Ã•ES DE VALIDAÃ‡ÃƒO DE SEGURANÃ‡A =====

/**
 * Validar configuraÃ§Ã£o de seguranÃ§a
 */
export const validateSecurityConfig = () => {
  const errors = [];

  // Validar JWT secret
  if (securityConfig.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
    errors.push('JWT_SECRET deve ser alterado em produÃ§Ã£o');
  }

  // Validar session secret
  if (securityConfig.session.secret === 'your-super-secret-session-key') {
    errors.push('SESSION_SECRET deve ser alterado em produÃ§Ã£o');
  }

  // Validar encryption pepper
  if (securityConfig.encryption.pepper === 'your-encryption-pepper') {
    errors.push('ENCRYPTION_PEPPER deve ser alterado em produÃ§Ã£o');
  }

  // Validar ambiente
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      errors.push('JWT_SECRET Ã© obrigatÃ³rio em produÃ§Ã£o');
    }
    if (!process.env.SESSION_SECRET) {
      errors.push('SESSION_SECRET Ã© obrigatÃ³rio em produÃ§Ã£o');
    }
    if (!process.env.ENCRYPTION_PEPPER) {
      errors.push('ENCRYPTION_PEPPER Ã© obrigatÃ³rio em produÃ§Ã£o');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obter configuraÃ§Ã£o baseada no ambiente
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return {
    ...securityConfig,
    ...securityConfig.environment[env]
  };
};

/**
 * Gerar configuraÃ§Ã£o de seguranÃ§a para produÃ§Ã£o
 */
export const generateProductionConfig = () => {
  return {
    ...securityConfig,
    jwt: {
      ...securityConfig.jwt,
      secret: process.env.JWT_SECRET,
      expiresIn: '1d', // Reduzir tempo de expiraÃ§Ã£o em produÃ§Ã£o
      refreshExpiresIn: '7d'
    },
    session: {
      ...securityConfig.session,
      secret: process.env.SESSION_SECRET,
      cookie: {
        ...securityConfig.session.cookie,
        secure: true,
        sameSite: 'strict'
      }
    },
    cors: {
      ...securityConfig.cors,
      origin: process.env.FRONTEND_URL
    }
  };
};

export default securityConfig;
