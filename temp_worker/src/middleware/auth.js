import jwt from 'jsonwebtoken';
import User from '../models/UserD1.js';
import logger from '../utils/logger.js';

const auth = async (req, res, next) => {
  try {
    // Verificar se o token existe
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso nÃ£o fornecido'
      });
    }

    // Extrair token
    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuÃ¡rio
    const user = await User.findById(req.db, decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    // Verificar se usuÃ¡rio estÃ¡ ativo
    if (!user.isActive || user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada ou bloqueada'
      });
    }

    // Adicionar usuÃ¡rio ao request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invÃ¡lido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    logger.error('Erro na autenticaÃ§Ã£o:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se Ã© admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Apenas administradores.'
        });
      }
      next();
    });
  } catch (error) {
    logger.error('Erro na autenticaÃ§Ã£o admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se tem plano ativo
const planAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      const user = await User.findById(req.db, req.user.id);

      if (!user.isPaid) {
        return res.status(403).json({
          success: false,
          message: 'Plano ativo necessÃ¡rio para acessar este recurso'
        });
      }

      next();
    });
  } catch (error) {
    logger.error('Erro na verificaÃ§Ã£o de plano:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional (nÃ£o falha se nÃ£o tiver token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(req.db, decoded.id);

    if (user && user.isActive && !user.isBlocked) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      };
    } else {
      req.user = null;
    }

    return next();
  } catch {
    req.user = null;
    return next();
  }
};

// Compatibilidade: criar aliases com os nomes esperados pelas rotas
const authenticateToken = auth;
const requireAdmin = adminAuth;
const requireActivePlan = planAuth;

// Middleware gerador para requisitos de role (ex: requireRole('admin'))
const requireRole = role => {
  return async (req, res, next) => {
    try {
      await auth(req, res, () => {
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        }

        if (req.user.role !== role && !req.user.isAdmin) {
          return res.status(403).json({ success: false, message: 'Acesso negado' });
        }

        next();
      });
    } catch (error) {
      logger.error('Erro no requireRole:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  };
};

export { auth, adminAuth, planAuth, optionalAuth, authenticateToken, requireAdmin, requireActivePlan, requireRole };

// Default export para compatibilidade com código antigo que importa o middleware como default
export default auth;
