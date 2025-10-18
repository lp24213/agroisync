// UtilitÃ¡rios para Cloudflare Worker
// NOTA: ConfiguraÃ§Ã£o CORS principal estÃ¡ em backend/src/handler.js
// Esta Ã© apenas para workers especÃ­ficos do Cloudflare

// Headers CORS para Cloudflare Workers
// IMPORTANTE: NÃ£o usar '*' em produÃ§Ã£o - configurar origem especÃ­fica
export const corsHeaders = {
  // Prefer explicit FRONTEND_URL from the worker environment; if missing, use the
  // production site origin. Do not fall back to localhost in production code.
  'Access-Control-Allow-Origin': typeof env !== 'undefined' && env.FRONTEND_URL ? env.FRONTEND_URL : 'https://agroisync.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// Handler para OPTIONS (preflight)
export const handleOptions = () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
};

// Middleware de CORS
export const corsMiddleware = request => {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }
  return null;
};

// UtilitÃ¡rio para resposta JSON
export const jsonResponse = (data, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers
    }
  });
};

// UtilitÃ¡rio para erro
export const errorResponse = (message, status = 400) => {
  return jsonResponse(
    {
      error: true,
      message
    },
    status
  );
};

// UtilitÃ¡rio para sucesso
export const successResponse = (data, message = 'Success') => {
  return jsonResponse({
    success: true,
    message,
    data
  });
};

// ValidaÃ§Ã£o de mÃ©todo HTTP
export const validateMethod = allowedMethods => {
  return request => {
    if (!allowedMethods.includes(request.method)) {
      return errorResponse(`MÃ©todo ${request.method} nÃ£o permitido`, 405);
    }
    return null;
  };
};

// Rate limiting simples
export const rateLimit = new Map();

export const checkRateLimit = (ip, limit = 100, window = 60000) => {
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / window)}`;

  if (!rateLimit.has(key)) {
    rateLimit.set(key, 0);
  }

  const count = rateLimit.get(key);
  if (count >= limit) {
    return false;
  }

  rateLimit.set(key, count + 1);
  return true;
};
