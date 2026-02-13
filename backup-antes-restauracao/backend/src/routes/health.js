// MÃ³dulo de health check para Cloudflare Workers

export const handleHealthCheck = async (request, env) => {
  try {
    // Testar conexÃ£o com banco D1
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      // [AGROISYNC_FIX] Verificar binding padronizado AGROISYNC_DB com fallback para 'DB'.
      const db = env.AGROISYNC_DB || env.DB;
      if (db) {
        // Teste simples de conexÃ£o com D1
        await db.prepare('SELECT 1').first();
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

// Compatibilidade com Express local: exportar um router que responde em / com JSON
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Reaproveitar lógica de health check (adaptada para Express)
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
      const db = process.env.AGROISYNC_DB || process.env.DB;
      if (db) {
        // não executamos D1 aqui; marcar como connected para dev
        dbStatus = 'connected';
      }
    } catch (err) {
      dbError = err.message;
      dbStatus = 'error';
    }

    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'AgroSync API - Express compatibility',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: { status: dbStatus, error: dbError }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
