import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Configurações
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware para autenticar token JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Verificar se token existe no header Authorization ou no cookie
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1] || req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Adicionar dados do usuário ao request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      isPaid: user.isPaid,
      planActive: user.isPlanActive()
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

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se usuário tem plano ativo
 */
const requireActivePlan = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (!req.user.isPaid || !req.user.planActive) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: usuário não possui plano ativo'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se usuário é admin
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: permissão de administrador necessária'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se usuário tem role específico
 */
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Acesso negado: permissão necessária para ${roles.join(' ou ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de role:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

/**
 * Middleware para verificar se usuário é dono do recurso
 */
const requireOwnership = (modelName, idField = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      const resourceId = req.params[idField] || req.body[idField];
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'ID do recurso não fornecido'
        });
      }

      // Buscar recurso no banco
      const Model = require(`../models/${modelName}`);
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      // Verificar se usuário é dono do recurso
      const ownerField = modelName === 'User' ? '_id' : 
                        modelName === 'Product' ? 'seller' : 
                        modelName === 'Freight' ? 'carrier' : 'userId';

      if (resource[ownerField].toString() !== req.user.userId.toString()) {
        // Se não for dono, verificar se é admin
        if (req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Acesso negado: você não é dono deste recurso'
          });
        }
      }

      // Adicionar recurso ao request para uso posterior
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

/**
 * Middleware para verificar se usuário pode acessar dados privados
 */
const canAccessPrivateData = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Admin pode acessar tudo
    if (req.user.role === 'admin') {
      return next();
    }

    // Usuário comum precisa ter plano ativo
    if (!req.user.isPaid || !req.user.planActive) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: usuário não possui plano ativo'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de acesso a dados privados:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se usuário pode criar recursos
 */
const canCreateResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Admin pode criar qualquer coisa
      if (req.user.role === 'admin') {
        return next();
      }

      // Verificar se usuário tem plano ativo
      if (!req.user.isPaid || !req.user.planActive) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: usuário não possui plano ativo'
        });
      }

      // Verificar se usuário tem permissão para criar o tipo de recurso
      if (resourceType === 'product' && req.user.role !== 'anunciante') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: apenas anunciantes podem criar produtos'
        });
      }

      if (resourceType === 'freight' && req.user.role !== 'freteiro') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: apenas freteiros podem criar fretes'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de criação de recurso:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

export {
  authenticateToken,
  requireActivePlan,
  requireAdmin,
  requireRole,
  requireOwnership,
  canAccessPrivateData,
  canCreateResource
};
