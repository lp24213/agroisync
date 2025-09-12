import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

// ===== CONFIGURAÇÃO JWT =====

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Gerar token JWT
export const generateToken = payload => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Gerar refresh token
export const generateRefreshToken = payload => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

// Verificar token JWT
export const verifyToken = async token => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      payload,
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType || 'buyer',
      groups: payload.groups || []
    };
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return {
      valid: false,
      error: error.message
    };
  }
};

// Hash de senha
export const hashPassword = async password => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verificar senha
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Verificar se usuário é admin
export const isAdmin = groups => {
  return groups && groups.includes('admin');
};

// Verificar se usuário tem plano ativo
export const hasActivePlan = (user, module) => {
  if (!user || !user.subscriptions) {
    return false;
  }

  const subscription = user.subscriptions[module];
  if (!subscription) {
    return false;
  }

  return (
    subscription.status === 'active' &&
    subscription.endDate &&
    new Date(subscription.endDate) > new Date()
  );
};

// Verificar permissões para mensagens privadas
export const canAccessPrivateMessages = user => {
  // Usuários com plano ativo podem acessar mensagens privadas
  return hasActivePlan(user, 'store') || hasActivePlan(user, 'freight');
};

// Verificar permissões para criar anúncios
export const canCreateAds = user => {
  return (
    hasActivePlan(user, 'store') &&
    user.subscriptions.store.currentAds < user.subscriptions.store.maxAds
  );
};

// Verificar permissões para criar fretes
export const canCreateFreights = user => {
  return (
    hasActivePlan(user, 'freight') &&
    user.subscriptions.freight.currentFreights < user.subscriptions.freight.maxFreights
  );
};

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.substring(7);
    const verification = await verifyToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = verification;
    req.userId = verification.userId;

    next();
  } catch (error) {
    console.error('Error in token authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de autenticação'
    });
  }
};

// Middleware para verificar se usuário é admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!isAdmin(req.user.groups)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: apenas administradores'
      });
    }

    next();
  } catch (error) {
    console.error('Error in admin verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de verificação'
    });
  }
};

// Middleware para verificar plano ativo
export const requireActivePlan = module => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação necessária'
        });
      }

      if (!hasActivePlan(req.user, module)) {
        return res.status(403).json({
          success: false,
          message: `Plano ${module} ativo necessário para esta funcionalidade`
        });
      }

      next();
    } catch (error) {
      console.error('Error in plan verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno de verificação'
      });
    }
  };
};

// Middleware para verificar acesso a mensagens privadas
export const requireMessageAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!canAccessPrivateMessages(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    next();
  } catch (error) {
    console.error('Error in message access verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de verificação'
    });
  }
};

// ===== FUNÇÕES DE UTILIDADE =====

// Gerar código de verificação
export const generateVerificationCode = (length = 6) => {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
};

// Gerar token de reset de senha
export const generatePasswordResetToken = userId => {
  const payload = {
    userId,
    type: 'password_reset',
    timestamp: Date.now()
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

// Verificar token de reset de senha
export const verifyPasswordResetToken = token => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'password_reset') {
      throw new Error('Invalid token type');
    }
    return {
      valid: true,
      userId: payload.userId,
      timestamp: payload.timestamp
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

// Gerar token de verificação de email
export const generateEmailVerificationToken = (userId, email) => {
  const payload = {
    userId,
    email,
    type: 'email_verification',
    timestamp: Date.now()
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Verificar token de verificação de email
export const verifyEmailVerificationToken = token => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'email_verification') {
      throw new Error('Invalid token type');
    }
    return {
      valid: true,
      userId: payload.userId,
      email: payload.email,
      timestamp: payload.timestamp
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  isAdmin,
  hasActivePlan,
  canAccessPrivateMessages,
  canCreateAds,
  canCreateFreights,
  authenticateToken,
  requireAdmin,
  requireActivePlan,
  requireMessageAccess,
  generateVerificationCode,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken
};
