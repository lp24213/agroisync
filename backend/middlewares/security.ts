import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from '../utils/logger';

// AI-powered threat detection
interface ThreatPattern {
  pattern: string;
  score: number;
  type: 'sql_injection' | 'xss' | 'ddos' | 'malware' | 'suspicious';
}

class AISecurityEngine {
  private threatPatterns: ThreatPattern[] = [
    // SQL Injection patterns
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, score: 0.8, type: 'sql_injection' },
    { pattern: /(\b(exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi, score: 0.7, type: 'xss' },
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, score: 0.8, type: 'sql_injection' },
    { pattern: /(\b(exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi, score: 0.7, type: 'xss' },
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, score: 0.8, type: 'sql_injection' },
    { pattern: /(\b(exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi, score: 0.7, type: 'xss' },
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, score: 0.8, type: 'sql_injection' },
    { pattern: /(\b(exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi, score: 0.7, type: 'xss' },
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, score: 0.8, type: 'sql_injection' },
    { pattern: /(\b(exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi, score: 0.7, type: 'xss' },
    // XSS patterns
    { pattern: /<script[^>]*>.*?<\/script>/gi, score: 0.9, type: 'xss' },
    { pattern: /javascript:/gi, score: 0.8, type: 'xss' },
    { pattern: /on\w+\s*=/gi, score: 0.7, type: 'xss' },
    // DDoS patterns
    { pattern: /(\b(bot|crawler|spider|scraper)\b)/gi, score: 0.6, type: 'ddos' },
    // Malware patterns
    { pattern: /(\b(php|asp|jsp|cfm)\b)/gi, score: 0.5, type: 'malware' },
    // Suspicious patterns
    { pattern: /(\b(admin|root|test|debug)\b)/gi, score: 0.4, type: 'suspicious' },
  ];

  private userBehavior: Map<string, { requests: number; lastRequest: number; threatScore: number }> = new Map();

  analyzeRequest(req: Request): { threatScore: number; threats: string[]; blocked: boolean } {
    const threats: string[] = [];
    let totalScore = 0;
    const userIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Analyze URL
    const url = req.url.toLowerCase();
    this.threatPatterns.forEach(pattern => {
      if (pattern.pattern.test(url)) {
        threats.push(`${pattern.type}: ${pattern.pattern.source}`);
        totalScore += pattern.score;
      }
    });

    // Analyze headers
    const userAgent = req.headers['user-agent'] || '';
    this.threatPatterns.forEach(pattern => {
      if (pattern.pattern.test(userAgent)) {
        threats.push(`${pattern.type} in user-agent`);
        totalScore += pattern.score;
      }
    });

    // Analyze body
    if (req.body) {
      const bodyStr = JSON.stringify(req.body).toLowerCase();
      this.threatPatterns.forEach(pattern => {
        if (pattern.pattern.test(bodyStr)) {
          threats.push(`${pattern.type} in request body`);
          totalScore += pattern.score;
        }
      });
    }

    // Behavioral analysis
    const userBehavior = this.userBehavior.get(userIP) || { requests: 0, lastRequest: 0, threatScore: 0 };
    const now = Date.now();
    const timeDiff = now - userBehavior.lastRequest;

    // Rate limiting check
    if (timeDiff < 1000 && userBehavior.requests > 10) {
      threats.push('rate_limit_exceeded');
      totalScore += 0.8;
    }

    // Update user behavior
    userBehavior.requests++;
    userBehavior.lastRequest = now;
    userBehavior.threatScore = Math.max(userBehavior.threatScore, totalScore);
    this.userBehavior.set(userIP, userBehavior);

    const blocked = totalScore > 0.7 || userBehavior.threatScore > 0.8;

    if (threats.length > 0) {
      logger.warn(`Security threat detected from ${userIP}:`, {
        threats,
        score: totalScore,
        blocked,
        url: req.url,
        userAgent: req.headers['user-agent'],
      });
    }

    return { threatScore: totalScore, threats, blocked };
  }

  getThreatLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'medium';
    if (score < 0.8) return 'high';
    return 'critical';
  }
}

const aiSecurity = new AISecurityEngine();

// Advanced rate limiting with AI
export const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const analysis = aiSecurity.analyzeRequest(req);
    if (analysis.threatScore > 0.8) return 5; // Very strict for high threats
    if (analysis.threatScore > 0.5) return 20; // Strict for medium threats
    return 100; // Normal limit
  },
  message: {
    error: 'Too many requests, please try again later.',
    threatLevel: 'rate_limited',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const analysis = aiSecurity.analyzeRequest(req);
    logger.warn(`Rate limit exceeded for ${req.ip}`, {
      threatScore: analysis.threatScore,
      threats: analysis.threats,
    });
    res.status(429).json({
      error: 'Rate limit exceeded',
      threatLevel: aiSecurity.getThreatLevel(analysis.threatScore),
      retryAfter: Math.ceil(15 * 60 / 1000), // 15 minutes in seconds
    });
  },
});

// AI-powered security middleware
export const aiSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const analysis = aiSecurity.analyzeRequest(req);

  // Add security headers
  res.setHeader('X-Threat-Score', analysis.threatScore.toString());
  res.setHeader('X-Threat-Level', aiSecurity.getThreatLevel(analysis.threatScore));
  res.setHeader('X-Security-Engine', 'AI-Powered');

  // Block high-threat requests
  if (analysis.blocked) {
    logger.error(`Request blocked from ${req.ip}`, {
      url: req.url,
      threats: analysis.threats,
      score: analysis.threatScore,
    });

    return res.status(403).json({
      error: 'Access denied',
      reason: 'Security threat detected',
      threatLevel: aiSecurity.getThreatLevel(analysis.threatScore),
      timestamp: new Date().toISOString(),
    });
  }

  // Log suspicious activity
  if (analysis.threatScore > 0.3) {
    logger.warn(`Suspicious activity from ${req.ip}`, {
      url: req.url,
      threats: analysis.threats,
      score: analysis.threatScore,
    });
  }

  next();
};

// Advanced CORS configuration
export const advancedCors = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://agroisync.com',
      'https://www.agroisync.com',
      'https://app.agroisync.com',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Threat-Score',
    'X-API-Key',
  ],
  exposedHeaders: ['X-Threat-Score', 'X-Threat-Level'],
  maxAge: 86400, // 24 hours
});

// Advanced Helmet configuration
export const advancedHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.mainnet-beta.solana.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
});

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'];
  
  // Validate content type for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && contentType !== 'application/json') {
    return res.status(400).json({
      error: 'Invalid content type',
      expected: 'application/json',
      received: contentType,
    });
  }

  // Validate request size
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({
      error: 'Request too large',
      maxSize: '10MB',
      received: `${(contentLength / 1024 / 1024).toFixed(2)}MB`,
    });
  }

  next();
};

// IP whitelist/blacklist middleware
const blacklistedIPs = new Set([
  // Add known malicious IPs here
]);

const whitelistedIPs = new Set([
  // Add trusted IPs here
]);

export const ipFilter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

  if (blacklistedIPs.has(clientIP)) {
    logger.error(`Blocked blacklisted IP: ${clientIP}`);
    return res.status(403).json({
      error: 'Access denied',
      reason: 'IP address blacklisted',
    });
  }

  if (whitelistedIPs.size > 0 && !whitelistedIPs.has(clientIP)) {
    logger.warn(`Non-whitelisted IP access: ${clientIP}`);
  }

  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const analysis = aiSecurity.analyzeRequest(req);

    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      threatScore: analysis.threatScore,
      threatLevel: aiSecurity.getThreatLevel(analysis.threatScore),
    });
  });

  next();
};

// Export all security middlewares
export const securityMiddlewares = [
  advancedHelmet,
  advancedCors,
  aiRateLimit,
  ipFilter,
  validateRequest,
  aiSecurityMiddleware,
  requestLogger,
]; 