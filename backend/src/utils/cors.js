// Utilitários para Cloudflare Worker

// Headers CORS
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
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
export const corsMiddleware = (request) => {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }
  return null;
};

// Utilitário para resposta JSON
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

// Utilitário para erro
export const errorResponse = (message, status = 400) => {
  return jsonResponse({
    error: true,
    message
  }, status);
};

// Utilitário para sucesso
export const successResponse = (data, message = 'Success') => {
  return jsonResponse({
    success: true,
    message,
    data
  });
};

// Validação de método HTTP
export const validateMethod = (allowedMethods) => {
  return (request) => {
    if (!allowedMethods.includes(request.method)) {
      return errorResponse(`Método ${request.method} não permitido`, 405);
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
