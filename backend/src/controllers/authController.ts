import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { auditLog } from '../middleware/audit';
import { validate, validationSchemas } from '../middleware/validation';
import { logger } from '../../utils/logger';

export class AuthController {
  // Register new user
  public static async register(req: Request, res: Response): Promise<void> {
    const auditMiddleware = auditLog('user.register', 'auth');
    
    auditMiddleware(req, res, async () => {
      try {
        const { email, password, username, walletAddress } = req.body;

        const result = await authService.register({
          email,
          password,
          username,
          walletAddress
        }, req);

        if (result.success) {
          res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
              token: result.token,
              user: result.user
            }
          });
        } else {
          res.status(400).json({
            success: false,
            error: result.error,
            code: result.code
          });
        }
      } catch (error) {
        logger.error('Registration controller error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        });
      }
    });
  }

  // Login user
  public static async login(req: Request, res: Response): Promise<void> {
    const auditMiddleware = auditLog('user.login', 'auth');
    
    auditMiddleware(req, res, async () => {
      try {
        const { email, password } = req.body;

        const result = await authService.login({
          email,
          password
        }, req);

        if (result.success) {
          res.json({
            success: true,
            message: 'Login successful',
            data: {
              token: result.token,
              user: result.user
            }
          });
        } else {
          const statusCode = result.code === 'ACCOUNT_LOCKED' ? 423 : 401;
          res.status(statusCode).json({
            success: false,
            error: result.error,
            code: result.code
          });
        }
      } catch (error) {
        logger.error('Login controller error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        });
      }
    });
  }

  // Get user profile
  public static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
        return;
      }

      const result = await authService.verifyToken(req.headers.authorization?.split(' ')[1] || '');

      if (result.success && result.user) {
        res.json({
          success: true,
          data: {
            user: result.user
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        });
      }
    } catch (error) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // Change password
  public static async changePassword(req: any, res: Response): Promise<void> {
    const auditMiddleware = auditLog('user.password_change', 'auth');
    
    auditMiddleware(req, res, async () => {
      try {
        const userId = req.user?.userId;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
          res.status(401).json({
            success: false,
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const result = await authService.changePassword(userId, currentPassword, newPassword, req);

        if (result.success) {
          res.json({
            success: true,
            message: 'Password changed successfully',
            data: {
              token: result.token,
              user: result.user
            }
          });
        } else {
          res.status(400).json({
            success: false,
            error: result.error,
            code: result.code
          });
        }
      } catch (error) {
        logger.error('Change password controller error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        });
      }
    });
  }

  // Refresh token
  public static async refreshToken(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
        return;
      }

      const result = await authService.refreshToken(userId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Token refreshed successfully',
          data: {
            token: result.token,
            user: result.user
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: result.error,
          code: result.code
        });
      }
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // Logout (client-side token invalidation)
  public static async logout(req: any, res: Response): Promise<void> {
    const auditMiddleware = auditLog('user.logout', 'auth');
    
    auditMiddleware(req, res, async () => {
      try {
        const userId = req.user?.userId;

        if (userId) {
          logger.info('User logged out', {
            userId,
            ip: req.ip
          });
        }

        res.json({
          success: true,
          message: 'Logout successful'
        });
      } catch (error) {
        logger.error('Logout controller error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        });
      }
    });
  }

  // Verify token endpoint
  public static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Token required',
          code: 'TOKEN_REQUIRED'
        });
        return;
      }

      const result = await authService.verifyToken(token);

      if (result.success) {
        res.json({
          success: true,
          data: {
            user: result.user
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: result.error,
          code: result.code
        });
      }
    } catch (error) {
      logger.error('Verify token controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
} 