import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
// const _JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware para autenticação JWT
export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('JWT ausente ou malformado', { ip: req.ip });
    return res.status(401).json({ error: 'Token ausente' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    logger.warn('JWT inválido', { ip: req.ip, err });
    return res.status(403).json({ error: 'Token inválido' });
  }
}

// Middleware de RBAC (Role-Based Access Control)
export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      logger.warn('Acesso negado por RBAC', { user, roles });
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}

// Proteção contra brute force (exemplo simples, use Redis/DB em produção)
const loginAttempts: Record<string, { count: number; last: number }> = {};
export function bruteForceProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip;
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
    logger.warn('Proteção brute force ativada', { ip });
    return res
      .status(429)
      .json({ error: 'Muitas tentativas, tente novamente mais tarde.' });
  }
  next();
}
