import jwt from 'jsonwebtoken';
import auditService from '../services/auditService.js';

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
      console.error('Erro na verificação de admin:', error);
    }
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
      console.error('Erro na validação da ação administrativa:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export { requireAdmin, validateAdminAction };
