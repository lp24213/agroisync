// ===== CONFIGURAÇÃO DE SEGURANÇA =====

export const securityConfig = {
  // Configurações de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: process.env.JWT_ISSUER || 'agroisync',
    audience: process.env.JWT_AUDIENCE || 'agroisync-users'
  },

  // Configurações de senha
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // dias
    historyCount: 5 // manter histórico de últimas 5 senhas
  },

  // Configurações de 2FA
  twoFactor: {
    enabled: true,
    algorithm: 'sha1',
    digits: 6,
    period: 30, // segundos
    window: 1, // tolerância de 1 período
    maxAttempts: 3,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos
  },

  // Configurações de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: {
      public: 100, // usuários não autenticados
      authenticated: 500, // usuários autenticados
      admin: 1000, // administradores
      critical: 10 // endpoints críticos
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Configurações de sessão
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

  // Configurações de CORS
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

  // Configurações de Helmet
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

  // Configurações de validação de entrada
  inputValidation: {
    maxFieldLength: 10000, // 10KB por campo
    maxTotalLength: 100000, // 100KB total
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    sanitizeHtml: true
  },

  // Configurações de auditoria
  audit: {
    enabled: true,
    logLevel: process.env.AUDIT_LOG_LEVEL || 'info',
    retentionDays: 90,
    sensitiveFields: ['password', 'token', 'secret', 'key', 'creditCard', 'ssn', 'cpf', 'cnpj']
  },

  // Configurações de LGPD
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

  // Configurações de monitoramento de segurança
  securityMonitoring: {
    enabled: true,
    alertThresholds: {
      failedLogins: 5, // alertar após 5 tentativas falhadas
      suspiciousActivity: 3, // alertar após 3 atividades suspeitas
      rateLimitExceeded: 10 // alertar após 10 violações de rate limit
    },
    notificationChannels: ['email', 'slack', 'webhook'],
    realTimeAlerts: true
  },

  // Configurações de backup e recuperação
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // dias
    encryption: true,
    compression: true,
    location: process.env.BACKUP_LOCATION || 'local'
  },

  // Configurações de criptografia
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    saltRounds: 12, // para bcrypt
    pepper: process.env.ENCRYPTION_PEPPER || 'your-encryption-pepper'
  },

  // Configurações de headers de segurança
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

  // Configurações de ambiente
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

// ===== FUNÇÕES DE VALIDAÇÃO DE SEGURANÇA =====

/**
 * Validar configuração de segurança
 */
export const validateSecurityConfig = () => {
  const errors = [];

  // Validar JWT secret
  if (securityConfig.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
    errors.push('JWT_SECRET deve ser alterado em produção');
  }

  // Validar session secret
  if (securityConfig.session.secret === 'your-super-secret-session-key') {
    errors.push('SESSION_SECRET deve ser alterado em produção');
  }

  // Validar encryption pepper
  if (securityConfig.encryption.pepper === 'your-encryption-pepper') {
    errors.push('ENCRYPTION_PEPPER deve ser alterado em produção');
  }

  // Validar ambiente
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      errors.push('JWT_SECRET é obrigatório em produção');
    }
    if (!process.env.SESSION_SECRET) {
      errors.push('SESSION_SECRET é obrigatório em produção');
    }
    if (!process.env.ENCRYPTION_PEPPER) {
      errors.push('ENCRYPTION_PEPPER é obrigatório em produção');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obter configuração baseada no ambiente
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return {
    ...securityConfig,
    ...securityConfig.environment[env]
  };
};

/**
 * Gerar configuração de segurança para produção
 */
export const generateProductionConfig = () => {
  return {
    ...securityConfig,
    jwt: {
      ...securityConfig.jwt,
      secret: process.env.JWT_SECRET,
      expiresIn: '1d', // Reduzir tempo de expiração em produção
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
