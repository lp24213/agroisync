// Military-grade security configuration for AGROTM DeFi Platform
export const SECURITY_CONFIG = {
  // Application Security
  APP: {
    NAME: 'AGROTM DeFi Platform',
    VERSION: '2.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    DEBUG_MODE: false,
    MAINTENANCE_MODE: false,
  },

  // Authentication & Authorization
  AUTH: {
    // JWT Configuration
    JWT: {
      SECRET: process.env.JWT_SECRET || 'military-grade-jwt-secret-key-256-bit-encryption',
      ALGORITHM: 'HS512',
      EXPIRES_IN: '24h',
      REFRESH_EXPIRES_IN: '7d',
      ISSUER: 'agrotm-security',
      AUDIENCE: 'agrotm-users',
    },

    // Password Requirements
    PASSWORD: {
      MIN_LENGTH: 16,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_SPECIAL: true,
      MAX_ATTEMPTS: 3,
      LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
      HISTORY_COUNT: 5, // Remember last 5 passwords
    },

    // Session Management
    SESSION: {
      MAX_SESSIONS: 3,
      SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
      CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
      SECURE_COOKIES: true,
      HTTP_ONLY: true,
      SAME_SITE: 'strict',
    },

    // Multi-Factor Authentication
    MFA: {
      REQUIRED: true,
      METHODS: ['TOTP', 'SMS', 'EMAIL'],
      BACKUP_CODES: 10,
      TOTP_ISSUER: 'AGROTM',
      TOTP_PERIOD: 30,
    },
  },

  // Network Security
  NETWORK: {
    // Rate Limiting
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100,
      BURST_LIMIT: 20,
      SKIP_SUCCESSFUL_REQUESTS: false,
      SKIP_FAILED_REQUESTS: false,
    },

    // DDoS Protection
    DDOS_PROTECTION: {
      ENABLED: true,
      CONCURRENT_REQUESTS: 50,
      REQUEST_TIMEOUT: 30000, // 30 seconds
      BLOCK_DURATION: 60 * 60 * 1000, // 1 hour
      WHITELIST_IPS: [
        // Add trusted IPs here
      ],
      BLACKLIST_IPS: [
        // Add known malicious IPs here
      ],
    },

    // CORS Configuration
    CORS: {
      ALLOWED_ORIGINS: [
        'https://agrotm.com',
        'https://www.agrotm.com',
        'https://app.agrotm.com',
        'https://api.agrotm.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      EXPOSED_HEADERS: ['X-Total-Count'],
      ALLOW_CREDENTIALS: true,
      MAX_AGE: 86400, // 24 hours
    },

    // Security Headers
    SECURITY_HEADERS: {
      'Content-Security-Policy': {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://cdn.jsdelivr.net',
          'https://unpkg.com',
          'https://api.coingecko.com',
          'https://api.mainnet-beta.solana.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'https:', 'blob:'],
        'connect-src': [
          "'self'",
          'https://api.coingecko.com',
          'https://api.mainnet-beta.solana.com',
          'https://solana-api.projectserum.com',
          'wss://api.mainnet-beta.solana.com',
          'wss://solana-api.projectserum.com',
        ],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': [],
      },
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    },
  },

  // Data Security
  DATA: {
    // Encryption
    ENCRYPTION: {
      ALGORITHM: 'AES-256-GCM',
      KEY_LENGTH: 32,
      IV_LENGTH: 16,
      SALT_LENGTH: 32,
      ITERATIONS: 100000,
    },

    // Database Security
    DATABASE: {
      CONNECTION_LIMIT: 10,
      ACQUIRE_TIMEOUT: 60000,
      TIMEOUT: 60000,
      SSL: true,
      SSL_VERIFY: true,
    },

    // File Upload Security
    FILE_UPLOAD: {
      MAX_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
      ],
      SCAN_VIRUS: true,
      VALIDATE_CONTENT: true,
    },
  },

  // Monitoring & Logging
  MONITORING: {
    // Threat Detection
    THREAT_DETECTION: {
      ENABLED: true,
      THRESHOLDS: {
        LOW: 1,
        MEDIUM: 5,
        HIGH: 10,
        CRITICAL: 20,
      },
      AUTO_BLOCK: true,
      ALERT_LEVELS: ['HIGH', 'CRITICAL'],
    },

    // Logging
    LOGGING: {
      LEVEL: 'info',
      RETENTION_DAYS: 90,
      MAX_LOG_SIZE: 100 * 1024 * 1024, // 100MB
      COMPRESSION_ENABLED: true,
      SENSITIVE_FIELDS: ['password', 'token', 'secret', 'key', 'private', 'credit_card', 'ssn'],
    },

    // Alerts
    ALERTS: {
      ENABLED: true,
      WEBHOOK_URL: process.env.SECURITY_WEBHOOK_URL,
      EMAIL_ENABLED: true,
      EMAIL_RECIPIENTS: process.env.SECURITY_EMAIL_RECIPIENTS?.split(',') || [],
      SLACK_WEBHOOK: process.env.SLACK_WEBHOOK_URL,
      DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL,
    },
  },

  // Blockchain Security
  BLOCKCHAIN: {
    // Solana Configuration
    SOLANA: {
      NETWORK: 'mainnet-beta',
      COMMITMENT: 'confirmed',
      CONFIRMATION_TIMEOUT: 30000,
      MAX_RETRIES: 3,
      RPC_ENDPOINTS: [
        'https://api.mainnet-beta.solana.com',
        'https://solana-api.projectserum.com',
        'https://rpc.ankr.com/solana',
      ],
    },

    // Ethereum Configuration
    ETHEREUM: {
      NETWORK: 'mainnet',
      CONFIRMATION_BLOCKS: 12,
      GAS_LIMIT: 300000,
      MAX_PRIORITY_FEE: 50,
    },

    // Transaction Security
    TRANSACTION: {
      MAX_AMOUNT: 1000000, // $1M limit
      REQUIRES_APPROVAL: true,
      APPROVAL_THRESHOLD: 50000, // $50K requires approval
      COOLDOWN_PERIOD: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // API Security
  API: {
    // Rate Limiting per endpoint
    ENDPOINT_LIMITS: {
      '/api/auth/login': { window: 5 * 60 * 1000, max: 5 },
      '/api/auth/register': { window: 10 * 60 * 1000, max: 3 },
      '/api/wallet/connect': { window: 60 * 1000, max: 10 },
      '/api/transactions': { window: 60 * 1000, max: 20 },
      '/api/farming': { window: 60 * 1000, max: 15 },
      '/api/staking': { window: 60 * 1000, max: 15 },
      '/api/swap': { window: 60 * 1000, max: 25 },
      '/api/analytics': { window: 60 * 1000, max: 30 },
    },

    // Input Validation
    VALIDATION: {
      MAX_STRING_LENGTH: 1000,
      MAX_ARRAY_LENGTH: 100,
      MAX_OBJECT_DEPTH: 10,
      ALLOW_HTML: false,
      SANITIZE_INPUT: true,
    },

    // Response Security
    RESPONSE: {
      REMOVE_SENSITIVE_DATA: true,
      CACHE_CONTROL: 'no-store, no-cache, must-revalidate, private',
      X_CONTENT_TYPE_OPTIONS: 'nosniff',
      X_FRAME_OPTIONS: 'DENY',
    },
  },

  // Web3 Security
  WEB3: {
    // Wallet Security
    WALLET: {
      REQUIRED_CONFIRMATION: true,
      SIGNATURE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
      MAX_CONNECTIONS: 3,
      AUTO_DISCONNECT: 30 * 60 * 1000, // 30 minutes
    },

    // Smart Contract Security
    SMART_CONTRACTS: {
      AUDITED_ONLY: true,
      VERIFIED_ONLY: true,
      MAX_GAS_LIMIT: 500000,
      REQUIRES_APPROVAL: true,
    },

    // Transaction Security
    TRANSACTIONS: {
      MAX_SLIPPAGE: 5, // 5%
      MIN_CONFIRMATIONS: 1,
      TIMEOUT: 5 * 60 * 1000, // 5 minutes
      RETRY_ATTEMPTS: 3,
    },
  },

  // Development Security
  DEVELOPMENT: {
    // Code Security
    CODE: {
      LINT_STRICT: true,
      TYPE_CHECK: true,
      SECURITY_SCAN: true,
      DEPENDENCY_SCAN: true,
      VULNERABILITY_CHECK: true,
    },

    // Testing
    TESTING: {
      SECURITY_TESTS: true,
      PENETRATION_TESTING: true,
      LOAD_TESTING: true,
      INTEGRATION_TESTS: true,
    },

    // Deployment
    DEPLOYMENT: {
      REQUIRE_APPROVAL: true,
      AUTOMATED_SCANNING: true,
      ROLLBACK_ENABLED: true,
      HEALTH_CHECKS: true,
    },
  },

  // Compliance
  COMPLIANCE: {
    // GDPR
    GDPR: {
      ENABLED: true,
      DATA_RETENTION_DAYS: 2555, // 7 years
      RIGHT_TO_DELETE: true,
      RIGHT_TO_EXPORT: true,
      CONSENT_MANAGEMENT: true,
    },

    // KYC/AML
    KYC_AML: {
      ENABLED: true,
      REQUIRED_FOR_LARGE_TRANSACTIONS: true,
      THRESHOLD_AMOUNT: 10000, // $10K
      VERIFICATION_PROVIDER: 'jumio',
    },

    // Financial Regulations
    FINANCIAL: {
      REPORTING_ENABLED: true,
      SUSPICIOUS_ACTIVITY_REPORTING: true,
      TRANSACTION_MONITORING: true,
      COMPLIANCE_OFFICER: process.env.COMPLIANCE_OFFICER_EMAIL,
    },
  },

  // Emergency Procedures
  EMERGENCY: {
    // Incident Response
    INCIDENT_RESPONSE: {
      CONTACT_EMAIL: process.env.EMERGENCY_EMAIL,
      CONTACT_PHONE: process.env.EMERGENCY_PHONE,
      ESCALATION_TIME: 15 * 60 * 1000, // 15 minutes
      AUTO_LOCKDOWN: true,
    },

    // Backup & Recovery
    BACKUP: {
      FREQUENCY: '1h',
      RETENTION_DAYS: 30,
      ENCRYPTED: true,
      GEOGRAPHIC_REDUNDANCY: true,
    },

    // Disaster Recovery
    DISASTER_RECOVERY: {
      RTO: 4 * 60 * 60 * 1000, // 4 hours
      RPO: 60 * 60 * 1000, // 1 hour
      FAILOVER_ENABLED: true,
      MULTI_REGION: true,
    },
  },
};

// Security utility functions
export const SecurityUtils = {
  // Validate configuration
  validateConfig: () => {
    const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'REDIS_URL'];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return true;
  },

  // Get environment-specific config
  getConfig: (key: string) => {
    const keys = key.split('.');
    let value: any = SECURITY_CONFIG;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        throw new Error(`Configuration key not found: ${key}`);
      }
    }

    return value;
  },

  // Check if feature is enabled
  isFeatureEnabled: (feature: string): boolean => {
    try {
      return SecurityUtils.getConfig(feature) === true;
    } catch {
      return false;
    }
  },

  // Get security level
  getSecurityLevel: (): 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM' => {
    const env = process.env.NODE_ENV;
    const debug = process.env.DEBUG === 'true';

    if (env === 'production' && !debug) {
      return 'MAXIMUM';
    } else if (env === 'staging') {
      return 'HIGH';
    } else if (env === 'development') {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  },
};

// Export default configuration
export default SECURITY_CONFIG;
