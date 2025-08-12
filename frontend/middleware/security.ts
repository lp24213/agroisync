import { NextRequest, NextResponse } from 'next/server';

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // Max requests per window
    BURST_LIMIT: 20, // Burst requests allowed
  },

  // DDoS protection
  DDOS_PROTECTION: {
    CONCURRENT_REQUESTS: 50,
    REQUEST_TIMEOUT: 30000, // 30 seconds
    BLOCK_DURATION: 60 * 60 * 1000, // 1 hour
  },

  // Content Security Policy
  CSP: {
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
      'https://api.agroisync.com',
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },

  // Allowed origins for CORS - CORRIGIDO PARA AGROISYNC.COM
  ALLOWED_ORIGINS: [
    'https://agroisync.com',
    'https://www.agroisync.com',
    'https://app.agroisync.com',
    'https://api.agroisync.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ],

  // Blocked IPs (example)
  BLOCKED_IPS: [] as string[],

  // Suspicious patterns
  SUSPICIOUS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /eval\s*\(/gi,
    /document\.cookie/gi,
  ],
};

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Map<string, number>();

// Utility functions
const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
};

const isBlockedIP = (ip: string): boolean => {
  const blockedUntil = blockedIPs.get(ip);
  if (blockedUntil && Date.now() < blockedUntil) {
    return true;
  }
  if (blockedUntil && Date.now() >= blockedUntil) {
    blockedIPs.delete(ip);
  }
  return false;
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const clientData = rateLimitStore.get(ip);

  if (!clientData || clientData.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS });
    return true;
  }

  if (clientData.count >= SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
};

const detectSuspiciousActivity = (request: NextRequest): boolean => {
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';

  // Check for suspicious patterns in URL
  for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // Check for suspicious User-Agent
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
  ];

  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
};

const generateCSPHeader = (): string => {
  return Object.entries(SECURITY_CONFIG.CSP)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

// Main security middleware
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const method = request.method;
  const url = request.url;

  // Log security events
  console.log(
    `[SECURITY] ${new Date().toISOString()} - ${method} ${url} - IP: ${clientIP} - UA: ${userAgent}`,
  );

  // 1. Check if IP is blocked
  if (isBlockedIP(clientIP)) {
    console.log(`[SECURITY] Blocked IP attempt: ${clientIP}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 2. Check if IP is in blocked list
  if (SECURITY_CONFIG.BLOCKED_IPS.includes(clientIP)) {
    console.log(`[SECURITY] Known malicious IP: ${clientIP}`);
    blockedIPs.set(clientIP, Date.now() + SECURITY_CONFIG.DDOS_PROTECTION.BLOCK_DURATION);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 3. Rate limiting
  if (!checkRateLimit(clientIP)) {
    console.log(`[SECURITY] Rate limit exceeded: ${clientIP}`);
    blockedIPs.set(clientIP, Date.now() + SECURITY_CONFIG.DDOS_PROTECTION.BLOCK_DURATION);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // 4. Detect suspicious activity
  if (detectSuspiciousActivity(request)) {
    console.log(`[SECURITY] Suspicious activity detected: ${clientIP}`);
    blockedIPs.set(clientIP, Date.now() + SECURITY_CONFIG.DDOS_PROTECTION.BLOCK_DURATION);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 5. CORS check
  const origin = request.headers.get('origin');
  if (origin && !SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    console.log(`[SECURITY] Unauthorized origin: ${origin}`);
    return new NextResponse('CORS Error', { status: 403 });
  }

  // 6. Method validation
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  if (!allowedMethods.includes(method)) {
    console.log(`[SECURITY] Invalid method: ${method}`);
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  // 7. Request size limit
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB limit
    console.log(`[SECURITY] Request too large: ${contentLength} bytes`);
    return new NextResponse('Request Entity Too Large', { status: 413 });
  }

  return null; // Continue with request
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set('Content-Security-Policy', generateCSPHeader());

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );

  // HSTS (HTTP Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Remove server information
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  return response;
}

// Cleanup function for rate limit store
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }

  for (const [ip, blockedUntil] of blockedIPs.entries()) {
    if (blockedUntil < now) {
      blockedIPs.delete(ip);
    }
  }
}, 60000); // Clean up every minute

export default function middleware(request: NextRequest): NextResponse {
  // Apply security checks
  const securityResponse = securityMiddleware(request);
  if (securityResponse) {
    return addSecurityHeaders(securityResponse);
  }

  // Continue with normal request processing
  const response = NextResponse.next();

  // Add security headers to all responses
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
