/**
 * CSRF Protection Middleware
 * Protege contra ataques Cross-Site Request Forgery
 */

import crypto from 'crypto';

// Store de tokens CSRF em memÃ³ria (em produÃ§Ã£o, usar Redis ou similar)
const csrfTokens = new Map();

// Limpar tokens expirados a cada hora
setInterval(
  () => {
    const now = Date.now();
    for (const [token, data] of csrfTokens.entries()) {
      if (now > data.expires) {
        csrfTokens.delete(token);
      }
    }
  },
  60 * 60 * 1000
);

/**
 * Gerar token CSRF
 */
export const generateCSRFToken = req => {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.session?.id || req.ip;

  // Armazenar token com expiraÃ§Ã£o de 1 hora
  csrfTokens.set(token, {
    sessionId,
    expires: Date.now() + 60 * 60 * 1000
  });

  return token;
};

/**
 * Validar token CSRF
 */
export const validateCSRFToken = (req, token) => {
  if (!token) {
    return false;
  }

  const data = csrfTokens.get(token);

  if (!data) {
    return false;
  }

  // Verificar se expirou
  if (Date.now() > data.expires) {
    csrfTokens.delete(token);
    return false;
  }

  // Verificar se o token pertence Ã  mesma sessÃ£o/IP
  const sessionId = req.session?.id || req.ip;
  if (data.sessionId !== sessionId) {
    return false;
  }

  return true;
};

/**
 * Middleware para fornecer token CSRF
 */
export const csrfToken = (req, res, next) => {
  // Gerar novo token
  const token = generateCSRFToken(req);

  // Adicionar token ao response
  res.locals.csrfToken = token;

  // Adicionar header
  res.set('X-CSRF-Token', token);

  next();
};

/**
 * Middleware para validar token CSRF em requisiÃ§Ãµes mutantes
 */
export const csrfProtection = (req, res, next) => {
  // MÃ©todos seguros nÃ£o precisam de proteÃ§Ã£o
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Obter token do header ou body
  const token = req.headers['x-csrf-token'] || req.body?._csrf || req.query?._csrf;

  if (!token) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token ausente',
      code: 'CSRF_TOKEN_MISSING'
    });
  }

  // Validar token
  if (!validateCSRFToken(req, token)) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token invÃ¡lido ou expirado',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

/**
 * Middleware CSRF condicional (apenas em produÃ§Ã£o)
 */
export const csrfProtectionConditional = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return csrfProtection(req, res, next);
  }
  next();
};

export default {
  generateCSRFToken,
  validateCSRFToken,
  csrfToken,
  csrfProtection,
  csrfProtectionConditional
};
