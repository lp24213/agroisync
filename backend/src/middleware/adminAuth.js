import { json } from 'itty-router-extras';
import auditService from '../services/auditService.js';
import logger from '../utils/logger.js';

// Middleware para verificar se o usuário é admin
export async function requireAdmin(request, env) {
  try {
    // Verificar se o token foi fornecido
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({
        success: false,
        message: 'Token de acesso não fornecido'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const [_header, payload, _signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));

    // Verificar se o usuário existe e é admin
    if (!decodedPayload.email || !decodedPayload.role || decodedPayload.role !== 'admin') {
      return json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      }, { status: 403 });
    }

    // Adicionar informações do usuário ao request
    request.user = {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      role: decodedPayload.role
    };

    // Log da ação
    await auditService.logAdminAccess({
      userId: request.user.id,
      resource: new URL(request.url).pathname,
      resourceId: null,
      sessionInfo: {
        ip: request.headers.get('CF-Connecting-IP'),
        userAgent: request.headers.get('User-Agent'),
        country: request.headers.get('CF-IPCountry') || 'unknown',
        city: request.headers.get('CF-IPCity') || 'unknown',
        isp: request.headers.get('CF-IPISP') || 'unknown'
      },
      metadata: {
        endpoint: new URL(request.url).pathname,
        method: request.method,
        statusCode: 200,
        responseTime: 0
      }
    });

    return null; // continua para o próximo handler
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na verificação de admin:', error);
    }
    if (error.name === 'JsonWebTokenError') {
      return json({
        success: false,
        message: 'Token inválido'
      }, { status: 401 });
    }

    if (error.name === 'TokenExpiredError') {
      return json({
        success: false,
        message: 'Token expirado'
      }, { status: 401 });
    }

    return json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
};

// Middleware para validar ações administrativas
export async function validateAdminAction(request, env) {
  try {
    const { action, resourceId, details } = await request.json();

    if (!action || !resourceId) {
      return json({
        success: false,
        message: 'Ação e ID do recurso são obrigatórios'
      }, { status: 400 });
    }

    // Log da ação administrativa
    await auditService.logAction({
      userId: request.user.id,
      action: `admin_${action.toLowerCase()}`,
      resource: new URL(request.url).pathname,
      resourceId,
      afterData: { details: details || `Admin action: ${action}` },
      sessionInfo: {
        ip: request.headers.get('CF-Connecting-IP'),
        userAgent: request.headers.get('User-Agent'),
        country: request.headers.get('CF-IPCountry') || 'unknown',
        city: request.headers.get('CF-IPCity') || 'unknown',
        isp: request.headers.get('CF-IPISP') || 'unknown'
      },
      metadata: {
        endpoint: new URL(request.url).pathname,
        method: request.method,
        statusCode: 200,
        responseTime: 0
      },
      sensitivityLevel: 'high',
      containsPII: false
    });

    return null; // continua para o próximo handler
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validação da ação administrativa:', error);
    }
    return json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
