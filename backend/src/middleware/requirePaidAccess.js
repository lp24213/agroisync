import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { createSecurityLog } from '../utils/securityLogger.js';

import logger from '../utils/logger.js';
// Middleware para verificar se o usuÃ¡rio tem acesso pago
const requirePaidAccess = serviceType => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Verificar se o usuÃ¡rio existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'UsuÃ¡rio nÃ£o encontrado'
        });
      }

      // Verificar se tem plano ativo
      const hasActivePlan =
        user.subscriptions &&
        ((user.subscriptions.store && user.subscriptions.store.status === 'active') ||
          (user.subscriptions.agroconecta && user.subscriptions.agroconecta.status === 'active'));

      // Verificar se tem pagamento recente (Ãºltimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentPayment =
        user.payments &&
        user.payments.some(
          payment => payment.status === 'completed' && new Date(payment.createdAt) >= thirtyDaysAgo
        );

      if (!hasActivePlan && !recentPayment) {
        // Log da tentativa de acesso sem pagamento
        await AuditLog.logAction({
          userId,
          userEmail: user.email,
          action: 'PAID_ACCESS_DENIED',
          resource: req.originalUrl,
          details: `Attempted to access ${serviceType} without paid access`,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          isSuspicious: false,
          riskLevel: 'LOW'
        });

        return res.status(403).json({
          success: false,
          message: 'ðŸ”’ Para acessar este serviÃ§o, finalize o pagamento de sua assinatura.',
          requiresPayment: true,
          plans: {
            store: 'R$25/mÃªs - Mensageria de Produtos',
            agroconecta: 'R$50/mÃªs - Mensageria de Fretes'
          }
        });
      }

      // Log do acesso bem-sucedido
      await AuditLog.logAction({
        userId,
        userEmail: user.email,
        action: 'PAID_ACCESS_GRANTED',
        resource: req.originalUrl,
        details: `Accessed ${serviceType} with paid access`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      req.userHasPaidAccess = true;
      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao verificar acesso pago:', error);
      }
      // Log do erro
      await AuditLog.logAction({
        userId: req.user?.id || 'unknown',
        userEmail: req.user?.email || 'unknown',
        action: 'PAID_ACCESS_ERROR',
        resource: req.originalUrl,
        details: `Error checking paid access: ${error.message}`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        isSuspicious: false,
        riskLevel: 'LOW'
      });

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware especÃ­fico para mensageria de produtos
const requireProductMessagingAccess = requirePaidAccess('product_messaging');

// Middleware especÃ­fico para mensageria de fretes
const requireFreightMessagingAccess = requirePaidAccess('freight_messaging');

// Middleware para serviÃ§os premium
const requireServiceAccess = requirePaidAccess('premium_service');

export {
  requirePaidAccess,
  requireProductMessagingAccess,
  requireFreightMessagingAccess,
  requireServiceAccess
};
