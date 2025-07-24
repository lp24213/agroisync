import { NextApiRequest, NextApiResponse } from 'next';

type CorsOptions = {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
};

/**
 * CORS middleware for Next.js API routes
 * 
 * @param options CORS configuration options
 * @returns Middleware function
 */
export function cors(options: CorsOptions = {}) {
  const defaultOptions: CorsOptions = {
    allowedOrigins: ['*'],
    allowedMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    maxAge: 86400, // 24 hours
    credentials: true,
  };

  const corsOptions = { ...defaultOptions, ...options };

  return async function corsMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    next?: () => void
  ) {
    // Handle preflight requests
    const origin = req.headers.origin;
    
    if (origin) {
      // Check if the origin is allowed
      const isAllowedOrigin = 
        corsOptions.allowedOrigins?.includes('*') ||
        corsOptions.allowedOrigins?.includes(origin);
      
      if (isAllowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      if (corsOptions.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      
      if (corsOptions.exposedHeaders?.length) {
        res.setHeader('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(','));
      }
    }
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      if (corsOptions.allowedMethods?.length) {
        res.setHeader('Access-Control-Allow-Methods', corsOptions.allowedMethods.join(','));
      }
      
      if (corsOptions.allowedHeaders?.length) {
        res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
      }
      
      if (corsOptions.maxAge) {
        res.setHeader('Access-Control-Max-Age', corsOptions.maxAge.toString());
      }
      
      res.status(204).end();
      return;
    }
    
    if (next) {
      next();
    }
  };
}

/**
 * Helper function to apply CORS to a Next.js API route
 * 
 * @param handler API route handler
 * @param options CORS options
 * @returns CORS-enabled API route handler
 */
export function withCors(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: CorsOptions = {}
) {
  const corsMiddleware = cors(options);
  
  return async function enableCors(req: NextApiRequest, res: NextApiResponse) {
    return new Promise<void>((resolve) => {
      corsMiddleware(req, res, () => {
        return resolve(handler(req, res));
      });
    });
  };
}