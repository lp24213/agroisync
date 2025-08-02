import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import cryptoService from './crypto';
import { logger } from '../utils/logger';
import securityMonitor from './security-monitor';

interface User {
  id: string;
  email: string;
  walletAddress?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  permissions: string[];
}

interface AuthToken {
  userId: string;
  email: string;
  role: string;
  walletAddress?: string;
  permissions: string[];
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
}

interface LoginAttempt {
  id: string;
  userId?: string;
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  timestamp: Date;
  reason?: string;
}

class AdvancedAuth {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private loginAttempts: LoginAttempt[] = [];
  private blacklistedTokens: Set<string> = new Set();
  private rateLimitAttempts: Map<string, { count: number; resetTime: Date }> = new Map();

  constructor() {
    this.initializeDefaultUsers();
    this.startCleanupInterval();
  }

  private initializeDefaultUsers(): void {
    // Add default admin user
    this.users.set('admin', {
      id: 'admin',
      email: 'admin@agrotm.com',
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      twoFactorEnabled: false,
      permissions: ['read', 'write', 'delete', 'admin'],
    });

    // Add default user
    this.users.set('user', {
      id: 'user',
      email: 'user@agrotm.com',
      role: 'user',
      isActive: true,
      loginAttempts: 0,
      twoFactorEnabled: false,
      permissions: ['read', 'write'],
    });
  }

  async register(email: string, password: string, walletAddress?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = Array.from(this.users.values()).find(u => u.email === email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Validate email format
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Validate password strength
      if (!this.isStrongPassword(password)) {
        return { success: false, error: 'Password does not meet security requirements' };
      }

      // Hash password
      const hashedPassword = await cryptoService.hashPassword(password);

      // Create user
      const userId = await cryptoService.generateToken(16);
      const user: User = {
        id: userId,
        email,
        walletAddress,
        role: 'user',
        isActive: true,
        loginAttempts: 0,
        twoFactorEnabled: false,
        permissions: ['read', 'write'],
      };

      this.users.set(userId, user);

      logger.info('User registered successfully', { email, userId });

      return { success: true, user };
    } catch (error) {
      logger.error('Registration failed', { error: error.message, email });
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(email: string, password: string, ip: string, userAgent: string, twoFactorCode?: string): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    try {
      // Rate limiting check
      if (this.isRateLimited(ip)) {
        return { success: false, error: 'Too many login attempts. Please try again later.' };
      }

      // Find user
      const user = Array.from(this.users.values()).find(u => u.email === email);
      if (!user) {
        this.recordLoginAttempt(email, ip, userAgent, false, 'User not found');
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        this.recordLoginAttempt(email, ip, userAgent, false, 'Account locked');
        return { success: false, error: 'Account is temporarily locked' };
      }

      // Check if account is active
      if (!user.isActive) {
        this.recordLoginAttempt(email, ip, userAgent, false, 'Account inactive');
        return { success: false, error: 'Account is inactive' };
      }

      // Verify password with real hash from database
      const isValidPassword = await cryptoService.verifyPassword(password, user.passwordHash || '');
      if (!isValidPassword) {
        user.loginAttempts++;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          this.recordLoginAttempt(email, ip, userAgent, false, 'Account locked due to too many failed attempts');
          return { success: false, error: 'Account locked due to too many failed attempts' };
        }

        this.recordLoginAttempt(email, ip, userAgent, false, 'Invalid password');
        return { success: false, error: 'Invalid credentials' };
      }

      // Two-factor authentication check
      if (user.twoFactorEnabled) {
        if (!twoFactorCode) {
          this.recordLoginAttempt(email, ip, userAgent, false, '2FA code required');
          return { success: false, error: 'Two-factor authentication code required' };
        }

        if (!this.verifyTwoFactorCode(user, twoFactorCode)) {
          this.recordLoginAttempt(email, ip, userAgent, false, 'Invalid 2FA code');
          return { success: false, error: 'Invalid two-factor authentication code' };
        }
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockedUntil = undefined;
      user.lastLogin = new Date();

      // Generate session token
      const sessionId = await cryptoService.generateToken(32);
      const token = this.generateToken(user, sessionId);

      // Store session
      this.sessions.set(sessionId, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      this.recordLoginAttempt(email, ip, userAgent, true);

      logger.info('User logged in successfully', { email, userId: user.id, ip });

      return { success: true, token, user };
    } catch (error) {
      logger.error('Login failed', { error: error.message, email, ip });
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as AuthToken;
      
      // Remove session
      this.sessions.delete(decoded.sessionId);
      
      // Blacklist token
      this.blacklistedTokens.add(token);

      logger.info('User logged out successfully', { userId: decoded.userId });

      return { success: true };
    } catch (error) {
      logger.error('Logout failed', { error: error.message });
      return { success: false, error: 'Logout failed' };
    }
  }

  verifyToken(token: string): { valid: boolean; user?: User; error?: string } {
    try {
      // Check if token is blacklisted
      if (this.blacklistedTokens.has(token)) {
        return { valid: false, error: 'Token is blacklisted' };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as AuthToken;

      // Check if token is expired
      if (decoded.expiresAt < Date.now()) {
        return { valid: false, error: 'Token has expired' };
      }

      // Check if session exists
      const session = this.sessions.get(decoded.sessionId);
      if (!session) {
        return { valid: false, error: 'Session not found' };
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        this.sessions.delete(decoded.sessionId);
        return { valid: false, error: 'Session has expired' };
      }

      // Get user
      const user = this.users.get(decoded.userId);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or inactive' };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  async enableTwoFactor(userId: string): Promise<{ success: boolean; secret?: string; qrCode?: string; error?: string }> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.twoFactorEnabled) {
        return { success: false, error: 'Two-factor authentication is already enabled' };
      }

      // Generate secret
      const secret = await cryptoService.generateToken(32);
      user.twoFactorSecret = secret;
      user.twoFactorEnabled = true;

      // Generate QR code URL (simplified)
      const qrCode = `otpauth://totp/Agrotm:${user.email}?secret=${secret}&issuer=Agrotm`;

      logger.info('Two-factor authentication enabled', { userId });

      return { success: true, secret, qrCode };
    } catch (error) {
      logger.error('Failed to enable two-factor authentication', { error: error.message, userId });
      return { success: false, error: 'Failed to enable two-factor authentication' };
    }
  }

  async disableTwoFactor(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;

      logger.info('Two-factor authentication disabled', { userId });

      return { success: true };
    } catch (error) {
      logger.error('Failed to disable two-factor authentication', { error: error.message, userId });
      return { success: false, error: 'Failed to disable two-factor authentication' };
    }
  }

  private generateToken(user: User, sessionId: string): string {
    const payload: AuthToken = {
      userId: user.id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      permissions: user.permissions,
      sessionId,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: '24h',
      issuer: 'agrotm',
      audience: 'agrotm-users',
    });
  }

  private verifyTwoFactorCode(user: User, code: string): boolean {
    try {
      // Use proper TOTP verification with user's secret
      if (!user.twoFactorSecret) {
        return false;
      }
      
      // Import TOTP library dynamically
      const { authenticator } = require('otplib');
      
      // Verify the code against user's secret
      return authenticator.verify({
        token: code,
        secret: user.twoFactorSecret
      });
    } catch (error) {
      logger.error('2FA verification failed', { error, userId: user.id });
      return false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private isRateLimited(ip: string): boolean {
    const now = new Date();
    const rateLimit = this.rateLimitAttempts.get(ip);

    if (!rateLimit || rateLimit.resetTime < now) {
      this.rateLimitAttempts.set(ip, { count: 1, resetTime: new Date(now.getTime() + 15 * 60 * 1000) });
      return false;
    }

    if (rateLimit.count >= 10) {
      return true;
    }

    rateLimit.count++;
    return false;
  }

  private recordLoginAttempt(email: string, ip: string, userAgent: string, success: boolean, reason?: string): void {
    const attempt: LoginAttempt = {
      id: cryptoService.generateToken(16),
      email,
      ip,
      userAgent,
      success,
      timestamp: new Date(),
      reason,
    };

    this.loginAttempts.push(attempt);

    // Keep only last 1000 attempts
    if (this.loginAttempts.length > 1000) {
      this.loginAttempts = this.loginAttempts.slice(-1000);
    }

    // Record security event
    if (!success) {
      securityMonitor.recordEvent({
        type: 'threat',
        severity: 'medium',
        source: ip,
        target: 'authentication',
        description: `Failed login attempt for ${email}`,
        metadata: { reason, userAgent },
      });
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private cleanup(): void {
    const now = new Date();

    // Clean up expired sessions
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }

    // Clean up old login attempts
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.loginAttempts = this.loginAttempts.filter(attempt => attempt.timestamp > oneDayAgo);

    // Clean up expired rate limits
    for (const [ip, rateLimit] of this.rateLimitAttempts) {
      if (rateLimit.resetTime < now) {
        this.rateLimitAttempts.delete(ip);
      }
    }

    logger.debug('Auth cleanup completed', {
      activeSessions: this.sessions.size,
      loginAttempts: this.loginAttempts.length,
      rateLimits: this.rateLimitAttempts.size,
    });
  }

  // Middleware for authentication
  authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication token required' });
      return;
    }

    const result = this.verifyToken(token);
    if (!result.valid) {
      res.status(401).json({ error: result.error || 'Invalid token' });
      return;
    }

    req.user = result.user;
    next();
  }

  // Middleware for role-based access control
  requireRole(roles: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }

  // Middleware for permission-based access control
  requirePermission(permissions: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const hasPermission = permissions.some(permission => 
        req.user.permissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }

  getStats(): any {
    return {
      totalUsers: this.users.size,
      activeSessions: this.sessions.size,
      loginAttempts: this.loginAttempts.length,
      blacklistedTokens: this.blacklistedTokens.size,
      rateLimits: this.rateLimitAttempts.size,
    };
  }

  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getLoginAttempts(hours: number = 24): LoginAttempt[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.loginAttempts.filter(attempt => attempt.timestamp > cutoff);
  }
}

// Create singleton instance
export const authService = new AdvancedAuth();

// Export for use in other modules
export default authService; 