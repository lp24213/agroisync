import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

import { logger } from '../utils/logger';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (_error) {
      logger.warn('Payload inválido', { error: _error });
      return res
        .status(400)
        .json({ error: 'Payload inválido', details: _error.errors });
    }
  };
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Exemplo premium: remove scripts e tags perigosas de todos os campos string
  const sanitize = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<script.*?>.*?<\/script>/gi, '')
          .replace(/<.*?>/g, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  sanitize(req.body);
  next();
}

// Validation middleware for common patterns
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWalletAddress = (address: string): boolean => {
  // Solana address validation (base58, 32-44 characters)
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
};

export const validateAmount = (amount: string | number): boolean => {
  const num = parseFloat(amount.toString());
  return !isNaN(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER;
};

// Request validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map((detail: any) => detail.message),
          code: 'VALIDATION_ERROR',
        });
      }
      next();
    } catch {
      return res.status(500).json({
        success: false,
        error: 'Validation middleware error',
        code: 'VALIDATION_MIDDLEWARE_ERROR',
      });
    }
  };
};
