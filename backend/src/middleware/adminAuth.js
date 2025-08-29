const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');

const JWT_SECRET = process.env.JWT_SECRET;

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      await AuditLog.logAction({
        userId: req.user?.id || 'unknown',
        userEmail: req.user?.email || 'unknown',
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        resource: req.originalUrl,
        details: 'No admin token provided',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        isSuspicious: true,
        riskLevel: 'HIGH'
      });
      
      return res.status(401).json({ 
        error: 'Acesso negado. Token de administrador necessário.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      await AuditLog.logAction({
        userId: req.user?.id || 'unknown',
        userEmail: req.user?.email || 'unknown',
        action: 'INSUFFICIENT_PRIVILEGES',
        resource: req.originalUrl,
        details: `User role: ${decoded.role}, required: admin`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        isSuspicious: true,
        riskLevel: 'MEDIUM'
      });
      
      return res.status(403).json({ 
        error: 'Acesso negado. Privilégios de administrador necessários.' 
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    await AuditLog.logAction({
      userId: req.user?.id || 'unknown',
      userEmail: req.user?.email || 'unknown',
        action: 'INVALID_ADMIN_TOKEN',
        resource: req.originalUrl,
        details: `Token validation error: ${error.message}`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        isSuspicious: true,
        riskLevel: 'HIGH'
    });
    
    return res.status(401).json({ 
      error: 'Token de administrador inválido.' 
    });
  }
};

const validateAdminAction = async (req, res, next) => {
  try {
    const { action, reason } = req.body;
    
    if (!action || !reason) {
      return res.status(400).json({
        error: 'Ação e motivo são obrigatórios para operações administrativas.'
      });
    }
    
    if (reason.length < 10) {
      return res.status(400).json({
        error: 'O motivo deve ter pelo menos 10 caracteres.'
      });
    }
    
    const validActions = ['ban', 'activate', 'update', 'delete', 'export'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        error: 'Ação administrativa inválida.'
      });
    }
    
    req.adminAction = { action, reason };
    next();
  } catch (error) {
    console.error('Erro na validação da ação administrativa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  requireAdmin,
  validateAdminAction
};
