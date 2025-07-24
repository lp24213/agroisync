import { NextApiRequest, NextApiResponse } from 'next';
import LRU from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
  maxRequests?: number;
};

/**
 * Rate limiting middleware to prevent API abuse
 * 
 * @param options Configuration options for rate limiting
 * @returns Middleware function
 */
export function rateLimit(options: Options = {}) {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return async function rateLimitMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    const token = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'anonymous';
    const maxRequests = options.maxRequests || 20;
    
    const tokenCount = (tokenCache.get(token) as number[]) || [0];
    
    if (tokenCount[0] === 0) {
      tokenCache.set(token, tokenCount);
    }
    
    tokenCount[0] += 1;
    
    const currentUsage = tokenCount[0];
    const isRateLimited = (currentUsage ?? 0) >= maxRequests;
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : maxRequests - (currentUsage ?? 0));
    
    if (isRateLimited) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      return;
    }
    
    if (next) {
      next();
    }
  };
}

/**
 * Helper function to apply rate limiting to a Next.js API route
 * 
 * @param handler API route handler
 * @param options Rate limiting options
 * @returns Rate-limited API route handler
 */
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: Options = {}
) {
  const limiter = rateLimit(options);
  
  return async function rateLimit(req: NextApiRequest, res: NextApiResponse) {
    return new Promise<void>((resolve) => {
      limiter(req, res, () => {
        return resolve(handler(req, res));
      });
    });
  };
}