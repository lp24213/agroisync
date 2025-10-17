// @ts-check
import { Router } from 'itty-router';
import { json } from './utils/respond.js';
// @ts-ignore - handlers are local JS modules without types
import { createUser, loginUser, recoverPassword, resetPassword } from './handlers/auth.js';
import { verifyToken } from './middleware/auth.js';
import { validateRequest } from './middleware/validation.js';
import { errorHandler } from './middleware/error.js';

const router = Router();

// Rotas públicas
router.post('/api/auth/register', validateRequest, createUser);
router.post('/api/auth/login', validateRequest, loginUser);
router.post('/api/auth/recover', validateRequest, recoverPassword);
router.post('/api/auth/reset', validateRequest, resetPassword);

// Rotas protegidas
router.get('/api/profile', verifyToken, async (req, env) => {
  try {
    const userId = req.userId;
    const db = env.DB;

    const user = await db.prepare(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
      return json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return json(user);
  } catch (error) {
    console.error('Profile error:', error);
    return json({ error: 'Erro ao buscar perfil' }, { status: 500 });
  }
});

// Rota de healthcheck
router.get('/api/health', async (req, env) => {
  try {
    // Testar conexão com D1
    const dbResult = await env.DB.prepare('SELECT 1 as test').first();
    if (!dbResult || dbResult.test !== 1) {
      throw new Error('Database connection failed');
    }

    // Testar KV Cache
    const cacheTest = await env.CACHE.put('health-check', 'ok', { expirationTtl: 60 });
    if (!cacheTest) {
      throw new Error('Cache connection failed');
    }

    // Testar KV Sessions
    const sessionTest = await env.SESSIONS.put('health-check', 'ok', { expirationTtl: 60 });
    if (!sessionTest) {
      throw new Error('Sessions connection failed');
    }

    return json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        cache: 'connected',
        sessions: 'connected'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});

// Handler 404 para rotas não encontradas
router.all('*', () => json({ error: 'Rota não encontrada' }, { status: 404 }));

// Wrapper para tratamento de erros
export function createApp() {
  return {
    fetch: (...args) => router.handle(...args).catch(errorHandler)
  };
}