import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

// Sanitize input middleware (básico)
export const sanitizeInput = (req, res, next) => {
  // Apenas um middleware leve que remove campos proibidos
  const forbidden = ['isAdmin', 'adminRole', 'adminPermissions'];
  forbidden.forEach(f => delete req.body[f]);
  next();
};

// Validações reutilizáveis (usando express-validator schema helpers)
export const validateEmail = body('email').optional().isEmail().withMessage('E-mail inválido');

export const validatePassword = body('password')
  .optional()
  .isLength({ min: 8 })
  .withMessage('Senha deve ter ao menos 8 caracteres');

export const validatePhone = body('phone')
  .optional()
  .matches(/^\+?[\d\s\-()]+$/)
  .withMessage('Telefone inválido');

export const validateDocument = body('document')
  .optional()
  .isLength({ min: 8 })
  .withMessage('Documento inválido');

// Password attempt limiter factory
export const passwordAttemptLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    max: maxAttempts,
    message: 'Muitas tentativas. Tente novamente mais tarde.'
  });

export default {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validatePhone,
  validateDocument,
  passwordAttemptLimiter
};
