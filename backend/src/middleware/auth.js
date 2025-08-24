import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Middleware para verificar autenticação
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agroisync-secret-key');
    
    // Buscar usuário
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado ou inativo'
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Middleware para verificar se usuário tem plano ativo em um módulo específico
export const requireActivePlan = (module) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const plan = user.plans[module];
      if (!plan || plan.status !== 'active') {
        return res.status(403).json({
          success: false,
          error: `Plano ativo necessário para o módulo ${module}`,
          requiredModule: module
        });
      }

      next();
    } catch (error) {
      console.error('Plan verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao verificar plano'
      });
    }
  };
};

// Middleware para verificar se usuário tem módulo habilitado
export const requireModule = (module) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      if (!user.modules[module]) {
        return res.status(403).json({
          success: false,
          error: `Módulo ${module} não habilitado para este usuário`,
          requiredModule: module
        });
      }

      next();
    } catch (error) {
      console.error('Module verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao verificar módulo'
      });
    }
  };
};

// Middleware para verificar role específica
export const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Role insuficiente.',
          requiredRoles: allowedRoles,
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      console.error('Role verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao verificar role'
      });
    }
  };
};
