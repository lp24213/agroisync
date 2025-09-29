import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar se o usuário é admin
export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Buscar o usuário no banco
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se é admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar esta área.'
      });
    }

    // Adicionar informações do admin ao req
    req.admin = {
      id: user._id,
      email: user.email,
      name: user.name,
      permissions: user.adminPermissions || []
    };

    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar permissões específicas de admin
export const requireAdminPermission = permission => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado como admin'
        });
      }

      // Verificar se tem a permissão específica
      if (!req.admin.permissions.includes(permission) && !req.admin.permissions.includes('*')) {
        return res.status(403).json({
          success: false,
          message: `Permissão '${permission}' necessária para esta ação`
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de permissão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para log de auditoria automático
export const auditLog = (action, resource) => {
  return async (req, res, next) => {
    try {
      // Interceptar a resposta para logar após sucesso
      const originalSend = res.send;

      res.send = function (data) {
        // Só logar se a resposta foi bem-sucedida
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Log assíncrono sem bloquear a resposta
          setImmediate(async () => {
            try {
              const AuditLog = (await import('../models/AuditLog.js')).default;
              await AuditLog.logAction({
                userId: req.user?.userId,
                userEmail: req.user?.email,
                action,
                resource,
                resourceId: req.params?.id,
                details: `Admin action: ${action} on ${resource}`,
                ip: req.ip,
                userAgent: req.get('User-Agent')
              });
            } catch (logError) {
              console.error('Erro ao registrar log de auditoria:', logError);
            }
          });
        }

        // Chamar o método original
        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria:', error);
      next(error);
    }
  };
};
