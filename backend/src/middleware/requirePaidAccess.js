const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { createSecurityLog } = require('../utils/securityLogger');

// Middleware para verificar se o usuário tem acesso pago ao serviço
const requirePaidAccess = (serviceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        await createSecurityLog('unauthorized_access', 'high', 'Paid access attempted without authentication', req);
        
        return res.status(401).json({
          ok: false,
          error: 'unauthorized',
          message: 'Autenticação necessária para acessar este recurso'
        });
      }

      const userId = req.user.userId;
      const userEmail = req.user.email;

      // Admin tem acesso total
      if (userEmail === 'luispaulodeoliveira@agrotm.com.br' || req.user.userType === 'admin') {
        // Log de acesso admin
        await AuditLog.log({
          userId: userId,
          userEmail: userEmail,
          action: 'admin_access',
          resource: 'messaging',
          resourceType: 'Conversation',
          details: `Admin access to ${serviceType} messaging`,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { serviceType, bypassReason: 'admin' }
        });

        return next();
      }

      // Buscar usuário com planos ativos
      const user = await User.findById(userId).select('subscriptions payments');
      
      if (!user) {
        await createSecurityLog('unauthorized_access', 'high', 'User not found for paid access check', req, userId);
        
        return res.status(404).json({
          ok: false,
          error: 'user_not_found',
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se tem plano ativo
      let hasActivePlan = false;
      let planDetails = null;

      if (user.subscriptions) {
        // Verificar planos de assinatura
        if (serviceType === 'product') {
          const storePlan = user.subscriptions.store;
          if (storePlan && storePlan.status === 'active') {
            const now = new Date();
            const planExpiry = new Date(storePlan.expiresAt);
            
            if (planExpiry > now) {
              hasActivePlan = true;
              planDetails = {
                type: 'store',
                plan: storePlan.planType,
                expiresAt: storePlan.expiresAt,
                features: storePlan.features
              };
            }
          }
        } else if (serviceType === 'freight') {
          const agroconectaPlan = user.subscriptions.agroconecta;
          if (agroconectaPlan && agroconectaPlan.status === 'active') {
            const now = new Date();
            const planExpiry = new Date(agroconectaPlan.expiresAt);
            
            if (planExpiry > now) {
              hasActivePlan = true;
              planDetails = {
                type: 'agroconecta',
                plan: agroconectaPlan.planType,
                expiresAt: agroconectaPlan.expiresAt,
                features: agroconectaPlan.features
              };
            }
          }
        }
      }

      // Se não tem plano ativo, verificar pagamentos pontuais
      if (!hasActivePlan && user.payments) {
        const recentPayments = user.payments.filter(payment => {
          const paymentDate = new Date(payment.createdAt);
          const now = new Date();
          const daysDiff = (now - paymentDate) / (1000 * 60 * 60 * 24);
          
          // Pagamentos válidos nos últimos 30 dias
          return payment.status === 'completed' && 
                 payment.serviceType === serviceType && 
                 daysDiff <= 30;
        });

        if (recentPayments.length > 0) {
          hasActivePlan = true;
          planDetails = {
            type: 'one_time_payment',
            payments: recentPayments.map(p => ({
              id: p._id,
              amount: p.amount,
              createdAt: p.createdAt,
              provider: p.provider
            }))
          };
        }
      }

      if (!hasActivePlan) {
        // Log de tentativa de acesso sem plano
        await AuditLog.log({
          userId: userId,
          userEmail: userEmail,
          action: 'paid_access_denied',
          resource: 'messaging',
          resourceType: 'Conversation',
          details: `Access denied to ${serviceType} messaging - no active plan`,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { serviceType, reason: 'no_active_plan' },
          status: 'failed'
        });

        await createSecurityLog('unauthorized_access', 'medium', `User without active plan attempted ${serviceType} messaging access`, req, userId);

        return res.status(403).json({
          ok: false,
          error: 'locked',
          message: '🔒 Para acessar esta mensageria, finalize o pagamento de sua assinatura.',
          requiredPlan: serviceType === 'product' ? 'store' : 'agroconecta',
          availablePlans: {
            store: {
              name: 'Loja',
              price: 'R$25/mês',
              features: ['Até 3 anúncios', 'Mensageria de produtos', 'Suporte']
            },
            agroconecta: {
              name: 'AgroConecta',
              price: 'R$50/mês',
              features: ['Mensageria de fretes', 'Gestão de transportes', 'Suporte premium']
            }
          },
          cta: {
            primary: '/planos',
            secondary: serviceType === 'product' ? '/loja' : '/agroconecta'
          }
        });
      }

      // Log de acesso bem-sucedido
      await AuditLog.log({
        userId: userId,
        userEmail: userEmail,
        action: 'paid_access_granted',
        resource: 'messaging',
        resourceType: 'Conversation',
        details: `Access granted to ${serviceType} messaging`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: { serviceType, planDetails }
      });

      // Adicionar informações do plano à requisição
      req.userPlan = planDetails;
      req.hasPaidAccess = true;

      next();
    } catch (error) {
      console.error('Error in requirePaidAccess middleware:', error);
      
      await createSecurityLog('system_error', 'high', `Paid access check error: ${error.message}`, req, req.user?.userId);
      
      return res.status(500).json({
        ok: false,
        error: 'internal_error',
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware específico para mensageria de produtos
const requireProductMessagingAccess = requirePaidAccess('product');

// Middleware específico para mensageria de fretes
const requireFreightMessagingAccess = requirePaidAccess('freight');

// Middleware para verificar acesso a serviço específico
const requireServiceAccess = (serviceType, serviceId) => {
  return async (req, res, next) => {
    try {
      // Primeiro verificar acesso pago
      await requirePaidAccess(serviceType)(req, res, async () => {
        // Se chegou aqui, tem acesso pago
        // Agora verificar se tem acesso ao serviço específico
        
        // Implementar lógica específica se necessário
        // Por exemplo, verificar se o usuário é o dono do produto/frete
        // ou se tem permissão para acessar
        
        next();
      });
    } catch (error) {
      console.error('Error in requireServiceAccess middleware:', error);
      return res.status(500).json({
        ok: false,
        error: 'internal_error',
        message: 'Erro interno do servidor'
      });
    }
  };
};

module.exports = {
  requirePaidAccess,
  requireProductMessagingAccess,
  requireFreightMessagingAccess,
  requireServiceAccess
};
