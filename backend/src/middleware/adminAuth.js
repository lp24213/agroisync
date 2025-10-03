import jwt from 'jsonwebtoken';
import auditService from '../services/auditService.js';

import logger from '../utils/logger.js';
// Middleware para verificar se o usuÃ¡rio Ã© admin
const requireAdmin = async (req, res, next) => {
  try {
    // Verificar se o token foi fornecido
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso nÃ£o fornecido'
      });
    }

    // Verificar se o token Ã© vÃ¡lido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuÃ¡rio existe e Ã© admin
    if (!decoded.email || !decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }

    // Adicionar informaÃ§Ãµes do usuÃ¡rio ao request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    // Log da aÃ§Ã£o
    await auditService.logAdminAccess({
      userId: decoded.id,
      resource: req.originalUrl,
      resourceId: null,
      sessionInfo: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        country: req.get('CF-IPCountry') || 'unknown',
        city: req.get('CF-IPCity') || 'unknown',
        isp: req.get('CF-IPISP') || 'unknown'
      },
      metadata: {
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: 200,
        responseTime: 0
      }
    });

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na verificaÃ§Ã£o de admin:', error);
    }
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

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para validar aÃ§Ãµes administrativas
const validateAdminAction = async (req, res, next) => {
  try {
    const { action, resourceId, details } = req.body;

    if (!action || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'AÃ§Ã£o e ID do recurso sÃ£o obrigatÃ³rios'
      });
    }

    // Log da aÃ§Ã£o administrativa
    await auditService.logAction({
      userId: req.user.id,
      action: `admin_${action.toLowerCase()}`,
      resource: req.originalUrl,
      resourceId,
      afterData: { details: details || `Admin action: ${action}` },
      sessionInfo: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        country: req.get('CF-IPCountry') || 'unknown',
        city: req.get('CF-IPCity') || 'unknown',
        isp: req.get('CF-IPISP') || 'unknown'
      },
      metadata: {
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: 200,
        responseTime: 0
      },
      sensitivityLevel: 'high',
      containsPII: false
    });

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o da aÃ§Ã£o administrativa:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export { requireAdmin, validateAdminAction };
