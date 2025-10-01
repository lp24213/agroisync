// Middleware básico para capturar informações de sessão
// Compatível com Cloudflare Workers

export const captureSessionInfo = req => {
  // Capturar informações básicas da sessão
  const sessionInfo = {
    ip: req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For') || 'unknown',
    userAgent: req.headers.get('User-Agent') || 'unknown',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  };

  // Adicionar informações à request para uso posterior
  req.sessionInfo = sessionInfo;

  return sessionInfo;
};

export const captureRequestMetadata = req => {
  return {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  };
};

export default {
  captureSessionInfo,
  captureRequestMetadata
};
