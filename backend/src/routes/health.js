// Módulo de health check para Cloudflare Workers

export const handleHealthCheck = async (request, env) => {
  try {
    // Testar conexão com banco D1
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      if (env.DB) {
        // Teste simples de conexão com D1
        await env.DB.prepare('SELECT 1').first();
        dbStatus = 'connected';
      }
    } catch (error) {
      dbError = error.message;
      dbStatus = 'error';
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'AgroSync API - Cloudflare Workers + D1',
        version: '1.0.0',
        environment: env.NODE_ENV || 'production',
        database: {
          status: dbStatus,
          error: dbError
        },
        uptime: Date.now(),
        memory: {
          used: 'N/A',
          total: 'N/A'
        },
        features: [
          'D1 Database',
          'Authentication',
          'Users Management',
          'Products API',
          'Freight Management',
          'Messaging System',
          'Admin Panel'
        ]
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        service: 'AgroSync API'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
