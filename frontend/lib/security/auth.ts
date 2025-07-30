import { PublicKey, Transaction } from '@solana/web3.js';
import crypto from 'crypto';
import { ethers } from 'ethers';

// Security configuration
const AUTH_CONFIG = {
  // JWT settings
  JWT: {
    SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
    EXPIRES_IN: '24h',
    REFRESH_EXPIRES_IN: '7d',
    ALGORITHM: 'HS512',
  },

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true,
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },

  // Session management
  SESSION: {
    MAX_SESSIONS: 5,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },

  // Rate limiting for auth endpoints
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 3,
    LOGIN_WINDOW: 5 * 60 * 1000, // 5 minutes
    REGISTRATION_ATTEMPTS: 2,
    REGISTRATION_WINDOW: 10 * 60 * 1000, // 10 minutes
  },
};

// In-memory stores (use Redis in production)
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const activeSessions = new Map<string, { userId: string; lastActivity: number }>();
const lockedAccounts = new Map<string, number>();

// Utility functions
const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
};

const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < AUTH_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${AUTH_CONFIG.PASSWORD.MIN_LENGTH} characters long`);
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (
    AUTH_CONFIG.PASSWORD.REQUIRE_SPECIAL &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const isAccountLocked = (identifier: string): boolean => {
  const lockedUntil = lockedAccounts.get(identifier);
  if (lockedUntil && Date.now() < lockedUntil) {
    return true;
  }
  if (lockedUntil && Date.now() >= lockedUntil) {
    lockedAccounts.delete(identifier);
  }
  return false;
};

const checkRateLimit = (identifier: string, type: 'login' | 'registration'): boolean => {
  const config =
    type === 'login'
      ? {
          attempts: AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS,
          window: AUTH_CONFIG.RATE_LIMIT.LOGIN_WINDOW,
        }
      : {
          attempts: AUTH_CONFIG.RATE_LIMIT.REGISTRATION_ATTEMPTS,
          window: AUTH_CONFIG.RATE_LIMIT.REGISTRATION_WINDOW,
        };

  const now = Date.now();
  const windowStart = now - config.window;

  const attempts = failedLoginAttempts.get(identifier);

  if (!attempts || attempts.lastAttempt < windowStart) {
    failedLoginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= config.attempts) {
    return false;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};

const lockAccount = (identifier: string): void => {
  lockedAccounts.set(identifier, Date.now() + AUTH_CONFIG.PASSWORD.LOCKOUT_DURATION);
};

// Wallet authentication
export class WalletAuth {
  static async verifyEthereumSignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('[SECURITY] Ethereum signature verification failed:', error);
      return false;
    }
  }

  static async verifySolanaSignature(
    message: string,
    signature: string,
    publicKey: string,
  ): Promise<boolean> {
    try {
      const pubKey = new PublicKey(publicKey);
      const transaction = Transaction.from(Buffer.from(signature, 'base64'));

      // Verify the transaction signature
      return transaction.verify(pubKey);
    } catch (error) {
      console.error('[SECURITY] Solana signature verification failed:', error);
      return false;
    }
  }

  static generateNonce(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static createSignMessage(nonce: string): string {
    return `Sign this message to authenticate with AGROTM DeFi Platform.\n\nNonce: ${nonce}\n\nTimestamp: ${Date.now()}`;
  }
}

// Session management
export class SessionManager {
  static createSession(userId: string): string {
    const sessionId = generateSecureToken();
    const now = Date.now();

    // Check if user has too many active sessions
    const userSessions = Array.from(activeSessions.entries()).filter(
      ([_, session]) => session.userId === userId,
    );

    if (userSessions.length >= AUTH_CONFIG.SESSION.MAX_SESSIONS) {
      // Remove oldest session
      const oldestSession = userSessions.reduce((oldest, current) =>
        current[1].lastActivity < oldest[1].lastActivity ? current : oldest,
      );
      activeSessions.delete(oldestSession[0]);
    }

    activeSessions.set(sessionId, { userId, lastActivity: now });
    return sessionId;
  }

  static validateSession(sessionId: string): boolean {
    const session = activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    const now = Date.now();
    if (now - session.lastActivity > AUTH_CONFIG.SESSION.SESSION_TIMEOUT) {
      activeSessions.delete(sessionId);
      return false;
    }

    // Update last activity
    session.lastActivity = now;
    return true;
  }

  static getUserId(sessionId: string): string | null {
    const session = activeSessions.get(sessionId);
    return session ? session.userId : null;
  }

  static removeSession(sessionId: string): void {
    activeSessions.delete(sessionId);
  }

  static removeUserSessions(userId: string): void {
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.userId === userId) {
        activeSessions.delete(sessionId);
      }
    }
  }
}

// Authentication service
export class AuthService {
  static async authenticateWithWallet(
    walletType: 'ethereum' | 'solana',
    address: string,
    signature: string,
    message: string,
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Rate limiting
      if (!checkRateLimit(address, 'login')) {
        lockAccount(address);
        return {
          success: false,
          error: 'Too many authentication attempts. Account temporarily locked.',
        };
      }

      // Check if account is locked
      if (isAccountLocked(address)) {
        return {
          success: false,
          error: 'Account is temporarily locked due to too many failed attempts.',
        };
      }

      // Verify signature
      let isValid = false;
      if (walletType === 'ethereum') {
        isValid = await WalletAuth.verifyEthereumSignature(message, signature, address);
      } else if (walletType === 'solana') {
        isValid = await WalletAuth.verifySolanaSignature(message, signature, address);
      }

      if (!isValid) {
        // Increment failed attempts
        const attempts = failedLoginAttempts.get(address) || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        failedLoginAttempts.set(address, attempts);

        if (attempts.count >= AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS) {
          lockAccount(address);
        }

        return { success: false, error: 'Invalid signature' };
      }

      // Clear failed attempts on successful login
      failedLoginAttempts.delete(address);

      // Create session
      const sessionId = SessionManager.createSession(address);

      console.log(`[SECURITY] Successful wallet authentication: ${address} (${walletType})`);

      return { success: true, sessionId };
    } catch (error) {
      console.error('[SECURITY] Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async validateSession(
    sessionId: string,
  ): Promise<{ valid: boolean; userId?: string; error?: string }> {
    try {
      if (!SessionManager.validateSession(sessionId)) {
        return { valid: false, error: 'Invalid or expired session' };
      }

      const userId = SessionManager.getUserId(sessionId);
      return { valid: true, userId };
    } catch (error) {
      console.error('[SECURITY] Session validation error:', error);
      return { valid: false, error: 'Session validation failed' };
    }
  }

  static async logout(sessionId: string): Promise<void> {
    SessionManager.removeSession(sessionId);
    console.log(`[SECURITY] User logged out: ${sessionId}`);
  }

  static async logoutAll(userId: string): Promise<void> {
    SessionManager.removeUserSessions(userId);
    console.log(`[SECURITY] All sessions terminated for user: ${userId}`);
  }
}

// Cleanup function for expired sessions and rate limits
setInterval(() => {
  const now = Date.now();

  // Clean up expired sessions
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > AUTH_CONFIG.SESSION.SESSION_TIMEOUT) {
      activeSessions.delete(sessionId);
    }
  }

  // Clean up expired rate limits
  for (const [identifier, attempts] of failedLoginAttempts.entries()) {
    if (now - attempts.lastAttempt > AUTH_CONFIG.RATE_LIMIT.LOGIN_WINDOW) {
      failedLoginAttempts.delete(identifier);
    }
  }

  // Clean up expired locks
  for (const [identifier, lockedUntil] of lockedAccounts.entries()) {
    if (now >= lockedUntil) {
      lockedAccounts.delete(identifier);
    }
  }
}, AUTH_CONFIG.SESSION.CLEANUP_INTERVAL);

// Export utilities
export const SecurityUtils = {
  generateSecureToken,
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateNonce: WalletAuth.generateNonce,
  createSignMessage: WalletAuth.createSignMessage,
};
