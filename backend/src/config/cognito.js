import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { config } from './config.js';

// ===== CONFIGURAÇÃO AWS COGNITO =====

// Verificador JWT do Cognito
const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
});

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Verificar token JWT do Cognito
export const verifyCognitoToken = async (token) => {
  try {
    const payload = await cognitoJwtVerifier.verify(token);
    return {
      valid: true,
      payload,
      userId: payload.sub,
      email: payload.email,
      userType: payload['custom:userType'] || 'buyer',
      groups: payload['cognito:groups'] || []
    };
  } catch (error) {
    console.error('Error verifying Cognito token:', error);
    return {
      valid: false,
      error: error.message
    };
  }
};

// Verificar se usuário é admin
export const isAdmin = (groups) => {
  return groups && groups.includes('admin');
};

// Verificar se usuário tem plano ativo
export const hasActivePlan = (user, module) => {
  if (!user || !user.subscriptions) return false;
  
  const subscription = user.subscriptions[module];
  if (!subscription) return false;

  return subscription.status === 'active' && 
         subscription.endDate && 
         new Date(subscription.endDate) > new Date();
};

// Verificar permissões para mensagens privadas
export const canAccessPrivateMessages = (user) => {
  // Usuários com plano ativo podem acessar mensagens privadas
  return hasActivePlan(user, 'store') || hasActivePlan(user, 'freight');
};

// Verificar permissões para criar anúncios
export const canCreateAds = (user) => {
  return hasActivePlan(user, 'store') && 
         user.subscriptions.store.currentAds < user.subscriptions.store.maxAds;
};

// Verificar permissões para criar fretes
export const canCreateFreights = (user) => {
  return hasActivePlan(user, 'freight') && 
         user.subscriptions.freight.currentFreights < user.subscriptions.freight.maxFreights;
};

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====

export const authenticateCognitoToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.substring(7);
    const verification = await verifyCognitoToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = verification;
    req.userId = verification.userId;
    
    next();
  } catch (error) {
    console.error('Error in Cognito authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de autenticação'
    });
  }
};

// Middleware para verificar se usuário é admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!isAdmin(req.user.groups)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: apenas administradores'
      });
    }

    next();
  } catch (error) {
    console.error('Error in admin verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de verificação'
    });
  }
};

// Middleware para verificar plano ativo
export const requireActivePlan = (module) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação necessária'
        });
      }

      if (!hasActivePlan(req.user, module)) {
        return res.status(403).json({
          success: false,
          message: `Plano ${module} ativo necessário para esta funcionalidade`
        });
      }

      next();
    } catch (error) {
      console.error('Error in plan verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno de verificação'
      });
    }
  };
};

// Middleware para verificar acesso a mensagens privadas
export const requireMessageAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!canAccessPrivateMessages(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    next();
  } catch (error) {
    console.error('Error in message access verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno de verificação'
    });
  }
};

export default {
  verifyCognitoToken,
  isAdmin,
  hasActivePlan,
  canAccessPrivateMessages,
  canCreateAds,
  canCreateFreights,
  authenticateCognitoToken,
  requireAdmin,
  requireActivePlan,
  requireMessageAccess
};
