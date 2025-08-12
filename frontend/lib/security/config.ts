// Security configuration for AGROTM
export type Environment = 'development' | 'production' | 'test' | 'staging';

export interface SecurityConfig {
  environment: Environment;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
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
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  bcrypt: {
    rounds: number;
  };
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      secure: boolean;
      httpOnly: boolean;
      maxAge: number;
    };
  };
}

// Environment-specific configurations
const getEnvironmentConfig = (env: Environment): Partial<SecurityConfig> => {
  switch (env) {
    case 'development':
      return {
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3001'],
          credentials: true,
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
          message: 'Too many requests from this IP, please try again later.',
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
          secret: 'dev-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
          },
        },
      };

    case 'staging':
      return {
        cors: {
          origin: process.env.CORS_ORIGIN?.split(',') || ['https://staging.agroisync.com'],
          credentials: true,
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000,
          max: 200,
          message: 'Too many requests from this IP, please try again later.',
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
          secret: process.env.SESSION_SECRET || 'staging-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          },
        },
      };

    case 'production':
      return {
        cors: {
          origin: process.env.CORS_ORIGIN?.split(',') || ['https://agroisync.com'],
          credentials: true,
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000,
          max: 100,
          message: 'Too many requests from this IP, please try again later.',
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
          secret: process.env.SESSION_SECRET || 'production-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          },
        },
      };

    case 'test':
      return {
        cors: {
          origin: ['http://localhost:3000'],
          credentials: true,
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000,
          max: 1000,
          message: 'Too many requests from this IP, please try again later.',
        },
        helmet: {
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginOpenerPolicy: false,
          crossOriginResourcePolicy: false,
          dnsPrefetchControl: false,
          frameguard: false,
          hidePoweredBy: false,
          hsts: false,
          ieNoOpen: false,
          noSniff: false,
          permittedCrossDomainPolicies: false,
          referrerPolicy: false,
          xssFilter: false,
        },
        session: {
          secret: 'test-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
          },
        },
      };

    default:
      return {};
  }
};

// Default configuration
export const defaultSecurityConfig: SecurityConfig = {
  environment: (process.env.NODE_ENV as Environment) || 'development',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
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
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret',
    expiresIn: '1h',
    refreshExpiresIn: '7d',
  },
  bcrypt: {
    rounds: 12,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
};

// Get configuration for current environment
export const getSecurityConfig = (): SecurityConfig => {
  const env = (process.env.NODE_ENV as Environment) || 'development';
  const envConfig = getEnvironmentConfig(env);
  
  return {
    ...defaultSecurityConfig,
    ...envConfig,
    environment: env,
  };
};

// Export the configuration
export const securityConfig = getSecurityConfig();
