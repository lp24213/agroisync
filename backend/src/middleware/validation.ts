import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Input validation middleware
export function validateInput(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details 
      });
      return;
    }
    
    next();
  };
}

// Input sanitization middleware
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  // Basic sanitization - can be enhanced with more sophisticated logic
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
}

// Rate limiting validation
export function validateRateLimit(maxRequests: number, windowMs: number) {
  const requests: { [key: string]: { count: number; resetTime: number } } = {};
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!requests[ip] || now > requests[ip].resetTime) {
      requests[ip] = { count: 1, resetTime: now + windowMs };
    } else {
      requests[ip].count++;
    }
    
    if (requests[ip].count > maxRequests) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }
    
    next();
  };
}
