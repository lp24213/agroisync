import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { logger } from '../../utils/logger';
import { failedAuthLog, securityEventLog } from '../middleware/audit';
import { Request } from 'express';

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: Partial<IUser>;
  error?: string;
  code?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  walletAddress: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Register new user
  public async register(data: RegisterData, req: Request): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: data.email.toLowerCase() },
          { walletAddress: data.walletAddress }
        ]
      });

      if (existingUser) {
        const error = existingUser.email === data.email.toLowerCase() 
          ? 'Email already registered' 
          : 'Wallet address already registered';
        
        failedAuthLog(req, `Registration failed: ${error}`);
        
        return {
          success: false,
          error,
          code: 'USER_EXISTS'
        };
      }

      // Create new user
      const user = new User({
        email: data.email.toLowerCase(),
        password: data.password,
        username: data.username,
        walletAddress: data.walletAddress,
        role: 'user',
        isActive: true,
        isVerified: false
      });

      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      logger.info('User registered successfully', {
        userId: user._id,
        email: user.email,
        walletAddress: user.walletAddress
      });

      return {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      };
    } catch (error) {
      logger.error('Registration error:', error);
      failedAuthLog(req, 'Registration failed: Database error');
      
      return {
        success: false,
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      };
    }
  }

  // Login user
  public async login(data: LoginData, req: Request): Promise<AuthResult> {
    try {
      // Find user by email
      const user = await User.findOne({ email: data.email.toLowerCase() });

      if (!user) {
        failedAuthLog(req, 'Login failed: User not found');
        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Check if account is locked
      if (user.isLocked) {
        failedAuthLog(req, 'Login failed: Account locked');
        return {
          success: false,
          error: 'Account is temporarily locked due to multiple failed login attempts',
          code: 'ACCOUNT_LOCKED'
        };
      }

      // Check if account is active
      if (!user.isActive) {
        failedAuthLog(req, 'Login failed: Account inactive');
        return {
          success: false,
          error: 'Account is deactivated',
          code: 'ACCOUNT_INACTIVE'
        };
      }

      // Verify password
      const isValidPassword = await user.comparePassword(data.password);

      if (!isValidPassword) {
        // Increment failed login attempts
        await user.incrementLoginAttempts();
        
        failedAuthLog(req, 'Login failed: Invalid password');
        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Generate JWT token
      const token = this.generateToken(user);

      logger.info('User logged in successfully', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });

      return {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin
        }
      };
    } catch (error) {
      logger.error('Login error:', error);
      failedAuthLog(req, 'Login failed: Server error');
      
      return {
        success: false,
        error: 'Login failed',
        code: 'LOGIN_ERROR'
      };
    }
  }

  // Verify token
  public async verifyToken(token: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Find user
      const user = await User.findById(decoded.userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated',
          code: 'ACCOUNT_INACTIVE'
        };
      }

      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      };
    } catch (error) {
      logger.error('Token verification error:', error);
      return {
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      };
    }
  }

  // Change password
  public async changePassword(userId: string, currentPassword: string, newPassword: string, req: Request): Promise<AuthResult> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);

      if (!isValidPassword) {
        failedAuthLog(req, 'Password change failed: Invalid current password');
        return {
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_PASSWORD'
        };
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Generate new token
      const token = this.generateToken(user);

      logger.info('Password changed successfully', {
        userId: user._id,
        email: user.email
      });

      securityEventLog('PASSWORD_CHANGED', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });

      return {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      };
    } catch (error) {
      logger.error('Password change error:', error);
      return {
        success: false,
        error: 'Password change failed',
        code: 'PASSWORD_CHANGE_ERROR'
      };
    }
  }

  // Generate JWT token
  private generateToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'agrotm-backend',
      audience: 'agrotm-frontend'
    });
  }

  // Refresh token
  public async refreshToken(userId: string): Promise<AuthResult> {
    try {
      const user = await User.findById(userId);

      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        };
      }

      const token = this.generateToken(user);

      return {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed',
        code: 'REFRESH_ERROR'
      };
    }
  }
}

export const authService = AuthService.getInstance(); 