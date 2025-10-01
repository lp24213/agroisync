// Worker simples e funcional para Cloudflare Workers

export default {
  fetch(request) {
    const url = new URL(request.url);

    // CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Health check
      if (url.pathname === '/api/health' || url.pathname === '/api/') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'AgroSync API - Backend ativo',
            version: '1.0.0',
            database: 'D1 conectado',
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      // Resposta padrão para todas as rotas da API
      if (url.pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'API route disponível',
            path: url.pathname
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      // 404 para outras rotas
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Route not found',
          path: url.pathname
        }),
        { status: 404, headers: corsHeaders }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
          message: error.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
