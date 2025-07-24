import { NextApiRequest, NextApiResponse } from 'next';

type HelmetOptions = {
  contentSecurityPolicy?: boolean | {
    directives?: {
      [key: string]: string[] | boolean;
    };
  };
  xssFilter?: boolean;
  frameguard?: boolean | {
    action?: 'deny' | 'sameorigin';
  };
  hsts?: boolean | {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  noSniff?: boolean;
  referrerPolicy?: boolean | {
    policy?: string;
  };
};

/**
 * Helmet middleware for Next.js API routes to set security headers
 * 
 * @param options Helmet configuration options
 * @returns Middleware function
 */
export function helmet(options: HelmetOptions = {}) {
  const defaultOptions: HelmetOptions = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://api.coingecko.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    xssFilter: true,
    frameguard: {
      action: 'deny',
    },
    hsts: {
      maxAge: 15552000, // 180 days
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  };

  const helmetOptions = { ...defaultOptions, ...options };

  return async function helmetMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    next?: () => void
  ) {
    // Set Content-Security-Policy header
    if (helmetOptions.contentSecurityPolicy) {
      const csp = helmetOptions.contentSecurityPolicy;
      if (typeof csp === 'object' && csp.directives) {
        const directives = Object.entries(csp.directives)
          .filter(([_, value]) => value !== false)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key} ${value.join(' ')}`;
            }
            return key;
          })
          .join('; ');
        
        res.setHeader('Content-Security-Policy', directives);
      }
    }
    
    // Set X-XSS-Protection header
    if (helmetOptions.xssFilter) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
    
    // Set X-Frame-Options header
    if (helmetOptions.frameguard) {
      const frameguard = helmetOptions.frameguard;
      if (typeof frameguard === 'object' && frameguard.action) {
        res.setHeader('X-Frame-Options', frameguard.action.toUpperCase());
      } else {
        res.setHeader('X-Frame-Options', 'DENY');
      }
    }
    
    // Set Strict-Transport-Security header
    if (helmetOptions.hsts) {
      const hsts = helmetOptions.hsts;
      let value = '';
      
      if (typeof hsts === 'object') {
        value = `max-age=${hsts.maxAge || 15552000}`;
        
        if (hsts.includeSubDomains) {
          value += '; includeSubDomains';
        }
        
        if (hsts.preload) {
          value += '; preload';
        }
      } else {
        value = 'max-age=15552000; includeSubDomains; preload';
      }
      
      res.setHeader('Strict-Transport-Security', value);
    }
    
    // Set X-Content-Type-Options header
    if (helmetOptions.noSniff) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    
    // Set Referrer-Policy header
    if (helmetOptions.referrerPolicy) {
      const referrerPolicy = helmetOptions.referrerPolicy;
      if (typeof referrerPolicy === 'object' && referrerPolicy.policy) {
        res.setHeader('Referrer-Policy', referrerPolicy.policy);
      } else {
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      }
    }
    
    if (next) {
      next();
    }
  };
}

/**
 * Helper function to apply Helmet middleware to a Next.js API route
 * 
 * @param handler API route handler
 * @param options Helmet options
 * @returns Helmet-enabled API route handler
 */
export function withHelmet(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: HelmetOptions = {}
) {
  const helmetMiddleware = helmet(options);
  
  return async function enableHelmet(req: NextApiRequest, res: NextApiResponse) {
    return new Promise<void>((resolve) => {
      helmetMiddleware(req, res, () => {
        return resolve(handler(req, res));
      });
    });
  };
}