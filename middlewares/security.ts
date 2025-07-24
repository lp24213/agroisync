/**
 * Security Middleware for AGROTM
 * Professional security implementation with rate limiting, CORS, and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from '@/src/utils/logger';
import { validateEnvironment } from '@/src/utils/validation';

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: any, res: any) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });
    
    res.status(429).json(rateLimitConfig.message);
  },
};

// CORS configuration
const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'https://agrotm.vercel.app',
      'https://agrotm-solana.vercel.app',
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS violation', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Wallet-Address',
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
};

// Helmet security configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://vercel.live',
        'https://cdn.jsdelivr.net',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https:',
        'blob:',
      ],
      connectSrc: [
        "'self'",
        'https://api.coingecko.com',
        'https://api.chainlink.org',
        'https://mainnet-beta.solana.com',
        'https://api.mainnet-beta.solana.com',
        'wss://api.mainnet-beta.solana.com',
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
};

// IP whitelist for admin endpoints
const adminWhitelist = [
  '127.0.0.1',
  '::1',
  // Add production admin IPs here
];

// Request validation middleware
export function validateRequest(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  
  // Validate content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn('Invalid content type', {
        method: req.method,
        contentType,
        path: pathname,
      });
      
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }
  }

  // Validate API key for protected endpoints
  if (pathname.startsWith('/api/protected/')) {
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey !== validApiKey) {
      logger.warn('Invalid API key', {
        path: pathname,
        providedKey: apiKey ? 'present' : 'missing',
      });
      
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }
  }

  // Admin endpoint protection
  if (pathname.startsWith('/api/admin/')) {
    const clientIP = getClientIP(req);
    
    if (!adminWhitelist.includes(clientIP)) {
      logger.warn('Unauthorized admin access attempt', {
        ip: clientIP,
        path: pathname,
      });
      
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
  }

  return null;
}

// Get client IP address
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return req.ip || 'unknown';
}

// Sanitize input data
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
}

// Request logging middleware
export function logRequest(req: NextRequest): void {
  const startTime = Date.now();
  const { method, url } = req;
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const clientIP = getClientIP(req);
  
  logger.info('Request received', {
    method,
    url,
    userAgent,
    clientIP,
    timestamp: new Date().toISOString(),
  });

  // Log response time (this would be called in the response)
  const logResponse = (status: number) => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method,
      url,
      status,
      duration: `${duration}ms`,
      clientIP,
    });
  };

  // Attach logger to request for use in handlers
  (req as any).logResponse = logResponse;
}

// Error handling middleware
export function handleSecurityError(error: Error, req: NextRequest): NextResponse {
  logger.error('Security middleware error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: getClientIP(req),
  });

  return NextResponse.json(
    { 
      error: 'Internal security error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    },
    { status: 500 }
  );
}

// Main security middleware function
export function securityMiddleware(req: NextRequest): NextResponse | null {
  try {
    // Log the request
    logRequest(req);

    // Validate environment on first request
    if (!process.env.SECURITY_INITIALIZED) {
      validateEnvironment();
      process.env.SECURITY_INITIALIZED = 'true';
    }

    // Validate the request
    const validationError = validateRequest(req);
    if (validationError) {
      return validationError;
    }

    // Add security headers
    const response = NextResponse.next();
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // HSTS header for HTTPS
    if (req.nextUrl.protocol === 'https:') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    return response;
  } catch (error) {
    return handleSecurityError(error as Error, req);
  }
}

// Rate limiting for API routes
export const apiRateLimit = rateLimit({
  ...rateLimitConfig,
  max: 50, // More restrictive for API
  windowMs: 10 * 60 * 1000, // 10 minutes
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  ...rateLimitConfig,
  max: 5, // Very restrictive for auth
  windowMs: 15 * 60 * 1000, // 15 minutes
  skipSuccessfulRequests: true,
});

export { corsConfig, helmetConfig };
