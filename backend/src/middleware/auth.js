import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { createSecurityLog } from '../utils/securityLogger.js';

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====

// Verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      await createSecurityLog('unauthorized_access', 'medium', 'No token provided', req);
      
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      await createSecurityLog('unauthorized_access', 'high', 'Invalid token - user not found', req, decoded.userId);
      
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      await createSecurityLog('unauthorized_access', 'high', 'Inactive user attempted access', req, user._id);
      
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      userType: user.userType,
      name: user.name,
      company: user.company,
      subscriptions: user.subscriptions
    };

    // Log de acesso bem-sucedido
    await createSecurityLog('data_access', 'low', 'User authenticated successfully', req, user._id);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      await createSecurityLog('unauthorized_access', 'medium', 'Invalid JWT token', req);
      
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      await createSecurityLog('unauthorized_access', 'medium', 'Expired JWT token', req);
      
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Error in authenticateToken:', error);
    
    await createSecurityLog('system_error', 'high', `Authentication error: ${error.message}`, req);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar se é admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    // Verificar se é admin pelo email específico (luispaulodeoliveira@agrotm.com.br)
    if (req.user.email === 'luispaulodeoliveira@agrotm.com.br') {
      // Log de acesso admin
      await createSecurityLog('admin_access', 'low', 'Admin access granted via specific email', req, req.user.userId);
      return next();
    }

    // Verificar se tem role de admin
    if (req.user.userType === 'admin') {
      // Log de acesso admin
      await createSecurityLog('admin_access', 'low', 'Admin access granted via userType', req, req.user.userId);
      return next();
    }

    // Acesso negado
    await createSecurityLog('unauthorized_access', 'high', 'Non-admin user attempted admin access', req, req.user.userId);
    
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  } catch (error) {
    console.error('Error in requireAdmin:', error);
    
    await createSecurityLog('system_error', 'high', `Admin check error: ${error.message}`, req, req.user?.userId);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware específico para admin com email e senha específicos
export const requireSpecificAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    // Verificar se é o admin específico pelo email
    if (req.user.email === 'luispaulodeoliveira@agrotm.com.br') {
      // Log de acesso admin específico
      await createSecurityLog('admin_access', 'low', 'Specific admin access granted', req, req.user.userId);
      return next();
    }

    // Acesso negado para todos os outros usuários
    await createSecurityLog('unauthorized_access', 'high', 'Non-specific admin attempted specific admin access', req, req.user.userId);
    
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas o administrador principal pode acessar este recurso.'
    });
  } catch (error) {
    console.error('Error in requireSpecificAdmin:', error);
    
    await createSecurityLog('system_error', 'high', `Specific admin check error: ${error.message}`, req, req.user?.userId);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar se tem plano ativo
export const requireActivePlan = (module) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação necessária'
        });
      }

      // Verificar se é admin (admin tem acesso a tudo)
      if (req.user.email === 'luispaulodeoliveira@agrotm.com.br' || req.user.userType === 'admin') {
        return next();
      }

      // Verificar se tem plano ativo para o módulo
      const subscription = req.user.subscriptions?.[module];
      if (!subscription || subscription.status !== 'active') {
        await createSecurityLog('unauthorized_access', 'medium', `User without active ${module} plan attempted access`, req, req.user.userId);
        
        return res.status(403).json({
          success: false,
          message: `Plano ativo de ${module} é necessário para acessar este recurso`,
          requiredPlan: module
        });
      }

      // Verificar se o plano não expirou
      if (subscription.endDate && new Date() > new Date(subscription.endDate)) {
        await createSecurityLog('unauthorized_access', 'medium', `User with expired ${module} plan attempted access`, req, req.user.userId);
        
        return res.status(403).json({
          success: false,
          message: `Seu plano de ${module} expirou. Renove para continuar acessando.`,
          requiredPlan: module
        });
      }

      next();
    } catch (error) {
      console.error('Error in requireActivePlan:', error);
      
      await createSecurityLog('system_error', 'high', `Plan check error: ${error.message}`, req, req.user?.userId);
      
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Verificar se é o próprio usuário ou admin
export const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    const resourceUserId = req.params.userId || req.params.id;

    // Admin tem acesso a tudo
    if (req.user.email === 'luispaulodeoliveira@agrotm.com.br' || req.user.userType === 'admin') {
      return next();
    }

    // Verificar se é o próprio usuário
    if (req.user.userId === resourceUserId) {
      return next();
    }

    // Acesso negado
    await createSecurityLog('unauthorized_access', 'high', 'User attempted to access resource they don\'t own', req, req.user.userId, { resourceUserId });
    
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você só pode acessar seus próprios recursos.'
    });
  } catch (error) {
    console.error('Error in requireOwnershipOrAdmin:', error);
    
    await createSecurityLog('system_error', 'high', `Ownership check error: ${error.message}`, req, req.user?.userId);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware específico para mensageria - REQUER PLANO ATIVO
export const requireMessagingAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      await createSecurityLog('unauthorized_access', 'high', 'Messaging access attempted without authentication', req);
      
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária para acessar a mensageria'
      });
    }

    // Admin tem acesso total
    if (req.user.email === 'luispaulodeoliveira@agrotm.com.br' || req.user.userType === 'admin') {
      return next();
    }

    // Verificar se tem plano ativo (Loja ou AgroConecta)
    const storeSubscription = req.user.subscriptions?.store;
    const agroconectaSubscription = req.user.subscriptions?.agroconecta;
    
    const hasActivePlan = (storeSubscription && storeSubscription.status === 'active') ||
                         (agroconectaSubscription && agroconectaSubscription.status === 'active');

    if (!hasActivePlan) {
      await createSecurityLog('unauthorized_access', 'medium', 'User without active plan attempted messaging access', req, req.user.userId);
      
      return res.status(403).json({
        success: false,
        message: 'Acesso à mensageria requer plano ativo (Loja ou AgroConecta)',
        requiredPlan: 'store_or_agroconecta',
        availablePlans: {
          store: 'R$25/mês - até 3 anúncios + mensageria',
          agroconecta_basic: 'R$50/mês + mensageria',
          agroconecta_pro: 'R$149/mês - até 30 fretes + mensageria'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error in requireMessagingAccess:', error);
    
    await createSecurityLog('system_error', 'high', `Messaging access check error: ${error.message}`, req, req.user?.userId);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar se tem permissão para módulo específico
export const requireModulePermission = (module, action = 'read') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação necessária'
        });
      }

      // Admin tem acesso a tudo
      if (req.user.email === 'luispaulodeoliveira@agrotm.com.br' || req.user.userType === 'admin') {
        return next();
      }

      // Verificar se tem plano ativo para o módulo
      const subscription = req.user.subscriptions?.[module];
      if (!subscription || subscription.status !== 'active') {
        await createSecurityLog('unauthorized_access', 'medium', `User without ${module} plan attempted ${action}`, req, req.user.userId);
        
        return res.status(403).json({
          success: false,
          message: `Plano ativo de ${module} é necessário para ${action} este recurso`,
          requiredPlan: module,
          requiredAction: action
        });
      }

      // Verificar limites específicos do plano
      if (action === 'create') {
        if (module === 'store' && subscription.currentAds >= subscription.maxAds) {
          return res.status(403).json({
            success: false,
            message: 'Limite de anúncios atingido para seu plano atual',
            current: subscription.currentAds,
            limit: subscription.maxAds
          });
        }

        if (module === 'freight' && subscription.currentFreights >= subscription.maxFreights) {
          return res.status(403).json({
            success: false,
            message: 'Limite de fretes atingido para seu plano atual',
            current: subscription.currentFreights,
            limit: subscription.maxFreights
          });
        }
      }

      next();
    } catch (error) {
      console.error('Error in requireModulePermission:', error);
      
      await createSecurityLog('system_error', 'high', `Permission check error: ${error.message}`, req, req.user?.userId);
      
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para verificar se o usuário está logado (sem verificar plano)
export const requireAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    next();
  } catch (error) {
    console.error('Error in requireAuth:', error);
    
    await createSecurityLog('system_error', 'high', `Auth check error: ${error.message}`, req);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário não está logado (para rotas públicas)
export const requireGuest = async (req, res, next) => {
  try {
    if (req.user) {
      return res.status(400).json({
        success: false,
        message: 'Você já está logado'
      });
    }

    next();
  } catch (error) {
    console.error('Error in requireGuest:', error);
    
    await createSecurityLog('system_error', 'high', `Guest check error: ${error.message}`, req);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
