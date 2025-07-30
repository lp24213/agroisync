import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

// Audit log interface
export interface AuditLog {
  timestamp: string;
  userId?: string;
  email?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  method: string;
  path: string;
  statusCode: number;
  requestBody?: any;
  responseBody?: any;
  duration: number;
  success: boolean;
  error?: string;
}

// Sensitive actions that require detailed logging
const SENSITIVE_ACTIONS = [
  'user.register',
  'user.login',
  'user.logout',
  'user.password_change',
  'user.delete',
  'admin.create',
  'admin.update',
  'admin.delete',
  'staking.stake',
  'staking.unstake',
  'staking.claim_rewards',
  'defi.add_liquidity',
  'defi.remove_liquidity',
  'defi.swap',
  'nft.mint',
  'nft.transfer',
  'wallet.connect',
  'wallet.disconnect',
  'transaction.send',
  'transaction.approve'
];

// Admin actions that require special logging
const ADMIN_ACTIONS = [
  'admin.pause_system',
  'admin.resume_system',
  'admin.update_config',
  'admin.emergency_stop',
  'admin.user_management',
  'admin.fund_management',
  'admin.security_audit'
];

// Audit middleware
export const auditLog = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const originalSend = res.send;
    
    // Capture request details
    const auditData: Partial<AuditLog> = {
      timestamp: new Date().toISOString(),
      action,
      resource,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      path: req.path,
      requestBody: SENSITIVE_ACTIONS.includes(action) ? req.body : undefined
    };

    // Add user info if available
    if ((req as any).user) {
      auditData.userId = (req as any).user.userId;
      auditData.email = (req as any).user.email;
    }

    // Override res.send to capture response
    res.send = function(body: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const success = statusCode >= 200 && statusCode < 300;
      
      const completeAuditLog: AuditLog = {
        ...auditData,
        statusCode,
        responseBody: SENSITIVE_ACTIONS.includes(action) ? body : undefined,
        duration,
        success,
        error: !success ? body : undefined
      } as AuditLog;

      // Log based on action type
      if (ADMIN_ACTIONS.includes(action)) {
        logger.warn('ADMIN ACTION:', completeAuditLog);
      } else if (SENSITIVE_ACTIONS.includes(action)) {
        logger.info('SENSITIVE ACTION:', completeAuditLog);
      } else {
        logger.debug('AUDIT LOG:', completeAuditLog);
      }

      // Call original send
      return originalSend.call(this, body);
    };

    next();
  };
};

// Security event logging
export const securityEventLog = (event: string, details: any) => {
  logger.error('SECURITY EVENT:', {
    event,
    timestamp: new Date().toISOString(),
    details,
    severity: 'HIGH'
  });
};

// Failed authentication logging
export const failedAuthLog = (req: Request, reason: string) => {
  logger.warn('FAILED AUTHENTICATION:', {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    path: req.path,
    method: req.method,
    reason,
    severity: 'MEDIUM'
  });
};

// Suspicious activity logging
export const suspiciousActivityLog = (req: Request, activity: string, details: any) => {
  logger.error('SUSPICIOUS ACTIVITY:', {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    path: req.path,
    method: req.method,
    activity,
    details,
    severity: 'HIGH'
  });
};

// Performance monitoring
export const performanceLog = (req: Request, duration: number, statusCode: number) => {
  if (duration > 5000) { // Log slow requests (>5s)
    logger.warn('SLOW REQUEST:', {
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      path: req.path,
      method: req.method,
      duration,
      statusCode,
      severity: 'MEDIUM'
    });
  }
};

// Database operation logging
export const dbOperationLog = (operation: string, collection: string, duration: number, success: boolean, error?: any) => {
  const logData = {
    timestamp: new Date().toISOString(),
    operation,
    collection,
    duration,
    success,
    error: error?.message || error
  };

  if (!success) {
    logger.error('DATABASE ERROR:', logData);
  } else if (duration > 1000) { // Log slow DB operations (>1s)
    logger.warn('SLOW DB OPERATION:', logData);
  } else {
    logger.debug('DB OPERATION:', logData);
  }
};

// Web3 transaction logging
export const web3TransactionLog = (txHash: string, operation: string, walletAddress: string, success: boolean, error?: any) => {
  const logData = {
    timestamp: new Date().toISOString(),
    txHash,
    operation,
    walletAddress,
    success,
    error: error?.message || error,
    network: process.env.SOLANA_NETWORK || 'devnet'
  };

  if (!success) {
    logger.error('WEB3 TRANSACTION ERROR:', logData);
  } else {
    logger.info('WEB3 TRANSACTION:', logData);
  }
}; 