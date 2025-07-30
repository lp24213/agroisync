import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    walletAddress: string;
    iat: number;
    exp: number;
  };
}

// JWT Token verification middleware
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      
      res.status(401).json({
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Validate token structure
    if (!decoded.userId || !decoded.email || !decoded.role) {
      logger.warn('Invalid token structure', {
        ip: req.ip,
        path: req.path
      });
      
      res.status(401).json({
        error: 'Invalid token structure',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logger.warn('Token expired', {
        ip: req.ip,
        userId: decoded.userId,
        path: req.path
      });
      
      res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    req.user = decoded;
    
    logger.info('Token verified successfully', {
      userId: decoded.userId,
      email: decoded.email,
      path: req.path,
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    
    res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
        ip: req.ip
      });
      
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['admin', 'super_admin']);

// User or admin middleware
export const requireUserOrAdmin = requireRole(['user', 'admin', 'super_admin']);

// Wallet address verification middleware
export const verifyWalletOwnership = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const { walletAddress } = req.params;
  
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  // Allow admins to access any wallet
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    next();
    return;
  }

  // Verify wallet ownership for regular users
  if (req.user.walletAddress !== walletAddress) {
    logger.warn('Wallet ownership verification failed', {
      userId: req.user.userId,
      userWallet: req.user.walletAddress,
      requestedWallet: walletAddress,
      path: req.path,
      ip: req.ip
    });
    
    res.status(403).json({
      error: 'Access denied to this wallet',
      code: 'WALLET_ACCESS_DENIED'
    });
    return;
  }

  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const endpoint = req.path;
  
  // Log authentication attempts for security monitoring
  logger.info(`Authentication attempt from ${clientIP} to ${endpoint}`, {
    ip: clientIP,
    endpoint,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  next();
};

// Session validation middleware
export const validateSession = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Session expired or invalid',
      code: 'SESSION_INVALID'
    });
    return;
  }

  // Check if user session is still valid (you can add Redis session validation here)
  // For now, we'll just validate the JWT token structure
  
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenAge = currentTime - req.user.iat;
  const maxTokenAge = 24 * 60 * 60; // 24 hours in seconds

  if (tokenAge > maxTokenAge) {
    logger.warn('Token too old, requiring re-authentication', {
      userId: req.user.userId,
      tokenAge: tokenAge,
      maxAge: maxTokenAge
    });
    
    res.status(401).json({
      error: 'Session expired, please re-authenticate',
      code: 'SESSION_EXPIRED'
    });
    return;
  }

  next();
}; 