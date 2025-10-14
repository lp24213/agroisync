import User from '../models/User.js';
import logger from '../utils/logger.js';
// Middleware para verificar se o usuÃ¡rio Ã© admin
export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Buscar o usuÃ¡rio no banco
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    // Verificar se Ã© admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar esta Ã¡rea.'
      });
    }

    // Adicionar informaÃ§Ãµes do admin ao req
    req.admin = {
      id: user._id,
      email: user.email,
      name: user.name,
      permissions: user.adminPermissions || []
    };

    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na verificaÃ§Ã£o de admin:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar permissÃµes especÃ­ficas de admin
export const requireAdminPermission = permission => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'UsuÃ¡rio nÃ£o autenticado como admin'
        });
      }

      // Verificar se tem a permissÃ£o especÃ­fica
      if (!req.admin.permissions.includes(permission) && !req.admin.permissions.includes('*')) {
        return res.status(403).json({
          success: false,
          message: `PermissÃ£o '${permission}' necessÃ¡ria para esta aÃ§Ã£o`
        });
      }

      return next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro na verificaÃ§Ã£o de permissÃ£o:', error);
      }
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para log de auditoria automÃ¡tico
export const auditLog = (action, resource) => {
  return async (req, res, next) => {
    try {
      // Interceptar a resposta para logar apÃ³s sucesso
      const originalSend = res.send;

      res.send = function (data) {
        // SÃ³ logar se a resposta foi bem-sucedida
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Log assÃ­ncrono sem bloquear a resposta
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
              if (process.env.NODE_ENV !== 'production') {
                logger.error('Erro ao registrar log de auditoria:', logError);
              }
            }
          });
        }

        // Chamar o mÃ©todo original
        originalSend.call(this, data);
      };

      return next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro no middleware de auditoria:', error);
      }
      return next(error);
    }
  };
};
