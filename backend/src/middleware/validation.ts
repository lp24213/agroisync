import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove MongoDB operators from query strings
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.body);
  
  // Remove HTTP Parameter Pollution
  hpp()(req, res, next);
};

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
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Validation middleware error',
        code: 'VALIDATION_MIDDLEWARE_ERROR',
      });
    }
  };
}; 