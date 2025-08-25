import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Redis client for rate limiting (optional, falls back to memory if not available)
let redisClient = null;
try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
} catch (error) {
  console.warn('Redis not available, using memory store for rate limiting');
}

// Base rate limiter configuration
const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    // Use Cloudflare IP if available, otherwise fallback to regular IP
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
  skipSuccessfulRequests: false, // Count all requests, including successful ones
  skipFailedRequests: false // Count all requests, including failed ones
});

// Registration rate limiter
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: 'Muitas tentativas de registro. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de registro. Tente novamente em 1 hora.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Muitas tentativas de redefinição de senha. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de redefinição de senha. Tente novamente em 1 hora.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// API rate limiter for general endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Muitas requisições à API. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas requisições à API. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false // Count failed requests
});

// Admin rate limiter (more permissive)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Muitas requisições ao painel admin. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas requisições ao painel admin. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 file uploads per windowMs
  message: {
    success: false,
    message: 'Muitas tentativas de upload. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de upload. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Payment rate limiter
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment attempts per windowMs
  message: {
    success: false,
    message: 'Muitas tentativas de pagamento. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined,
  keyGenerator: req => {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de pagamento. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Default rate limiter for all routes
export const rateLimiter = baseLimiter;

// Export Redis client for other uses
export { redisClient };

// Cleanup function for graceful shutdown
export const cleanupRateLimiters = () => {
  if (redisClient) {
    redisClient.disconnect();
  }
};
