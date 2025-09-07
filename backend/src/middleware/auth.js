const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Verificar se o token existe
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Extrair token
    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se usuário está ativo
    if (!user.isActive || user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada ou bloqueada'
      });
    }

    // Adicionar usuário ao request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    logger.error('Erro na autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se é admin
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
    logger.error('Erro na autenticação admin:', error);
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
      const user = await User.findById(req.user.id);
      
      if (!user.isPaid) {
        return res.status(403).json({
          success: false,
          message: 'Plano ativo necessário para acessar este recurso'
        });
      }
      
      next();
    });
  } catch (error) {
    logger.error('Erro na verificação de plano:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional (não falha se não tiver token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.isActive && !user.isBlocked) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  planAuth,
  optionalAuth
};