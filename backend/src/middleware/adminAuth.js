import jwt from 'jsonwebtoken';
import AuditLog from '../models/AuditLog.js';

// Middleware para verificar se o usuário é admin
const requireAdmin = async (req, res, next) => {
  try {
    // Verificar se o token foi fornecido
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o usuário existe e é admin
    if (!decoded.email || !decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    // Log da ação
    await AuditLog.logAction({
      userId: decoded.id,
      userEmail: decoded.email,
      action: 'ADMIN_ACCESS',
      resource: req.originalUrl,
      details: 'Admin accessed protected route',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    
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

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para validar ações administrativas
const validateAdminAction = async (req, res, next) => {
  try {
    const { action, resourceId, details } = req.body;
    
    if (!action || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Ação e ID do recurso são obrigatórios'
      });
    }

    // Log da ação administrativa
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: `ADMIN_${action.toUpperCase()}`,
      resource: req.originalUrl,
      resourceId: resourceId,
      details: details || `Admin action: ${action}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    console.error('Erro na validação da ação administrativa:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export { requireAdmin, validateAdminAction };
