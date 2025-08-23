import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// JWT Authentication middleware
export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
          res.status(403).json({ error: 'Invalid token' });
          return;
        }

        (req as any).user = user;
        next();
      });
    } else {
      res.status(401).json({ error: 'Access token required' });
    }
  } else {
    res.status(401).json({ error: 'Access token required' });
  }
}

// Role-based authorization middleware
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

// Brute force protection
const loginAttempts: { [key: string]: { count: number; last: number } } = {};

export function bruteForceProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, last: now };
  }

  if (now - loginAttempts[ip].last > 15 * 60 * 1000) {
    loginAttempts[ip] = { count: 0, last: now };
  }

  loginAttempts[ip].count++;
  loginAttempts[ip].last = now;

  if (loginAttempts[ip].count > 10) {
    res.status(429).json({ error: 'Too many login attempts' });
    return;
  }

  next();
}
