// 🔑 ROTAS DE API KEYS - SISTEMA DE VENDA DE API

const APIKeyService = require('../services/apiKeyService');

async function handleCreateAPIKey(request, env) {
  try {
    const apiKeyService = new APIKeyService(env.DB);
    const data = await request.json();
    
    // Validação
    if (!data.plan_type) {
      return jsonResponse({ success: false, error: 'plan_type é obrigatório' }, 400);
    }
    
    // Buscar dados do usuário autenticado
    const userId = request.userId;
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
    
    if (!user) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    const result = await apiKeyService.createAPIKey({
      user_id: userId,
      customer_name: user.name,
      customer_email: user.email,
      plan_type: data.plan_type,
      price: data.price || 0,
      rate_limit_per_minute: data.rate_limit_per_minute,
      rate_limit_per_day: data.rate_limit_per_day,
      allowed_endpoints: data.allowed_endpoints,
      expires_at: data.expires_at
    });
    
    return jsonResponse(result);
  } catch (error) {
    console.error('Error creating API key:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetUserAPIKeys(request, env) {
  try {
    const apiKeyService = new APIKeyService(env.DB);
    const userId = request.userId;
    
    const keys = await apiKeyService.getUserAPIKeys(userId);
    return jsonResponse({ success: true, data: keys, count: keys.length });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetAPIKeyStats(request, env, keyId) {
  try {
    const apiKeyService = new APIKeyService(env.DB);
    const stats = await apiKeyService.getAPIKeyStats(keyId);
    
    return jsonResponse({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching API key stats:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleRevokeAPIKey(request, env, keyId) {
  try {
    const apiKeyService = new APIKeyService(env.DB);
    const { reason } = await request.json();
    
    const result = await apiKeyService.revokeAPIKey(keyId, reason || 'User requested');
    return jsonResponse(result);
  } catch (error) {
    console.error('Error revoking API key:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetAPIDashboard(request, env) {
  try {
    const apiKeyService = new APIKeyService(env.DB);
    const dashboard = await apiKeyService.getAPIDashboard();
    
    return jsonResponse({ success: true, data: dashboard });
  } catch (error) {
    console.error('Error fetching API dashboard:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// Middleware para validar API Key em requisições
async function validateAPIKeyMiddleware(request, env) {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return jsonResponse({ success: false, error: 'API Key obrigatória' }, 401);
  }
  
  const apiKeyService = new APIKeyService(env.DB);
  const validation = await apiKeyService.validateAPIKey(apiKey);
  
  if (!validation.valid) {
    return jsonResponse({ success: false, error: validation.error }, 403);
  }
  
  // Adicionar dados da API Key ao request
  request.apiKeyData = validation;
  return null; // Continuar com a request
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

module.exports = {
  handleCreateAPIKey,
  handleGetUserAPIKeys,
  handleGetAPIKeyStats,
  handleRevokeAPIKey,
  handleGetAPIDashboard,
  validateAPIKeyMiddleware
};

