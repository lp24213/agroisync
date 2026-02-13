// @ts-check
import { Router } from 'itty-router';
import { json } from './utils/respond.js';
// handlers are local JS modules without TypeScript definitions
import { createUser, loginUser, recoverPassword, resetPassword } from './handlers/auth.js';
import { 
  getDashboard, 
  getUsers, 
  getProducts, 
  getPayments, 
  getRegistrations, 
  getActivity,
  updateUserStatus,
  deleteProduct
} from './handlers/admin.js';
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
      // Sempre retorna objeto válido
      return json({ success: false, user: null, error: 'Usuário não encontrado' }, { status: 200 });
    }
    return json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    return json({ success: false, user: null, error: 'Erro ao buscar perfil' }, { status: 200 });
  }
});

// Rotas Admin (protegidas)
router.get('/api/admin/dashboard', verifyToken, getDashboard);
router.get('/api/admin/users', verifyToken, getUsers);
router.get('/api/admin/products', verifyToken, getProducts);
router.get('/api/admin/payments', verifyToken, getPayments);
router.get('/api/admin/registrations', verifyToken, getRegistrations);
router.get('/api/admin/activity', verifyToken, getActivity);
router.put('/api/admin/users/:id/status', verifyToken, updateUserStatus);
router.delete('/api/admin/products/:id', verifyToken, deleteProduct);

// Rotas de produtos do usuário
router.get('/api/products/my', verifyToken, async (req, env) => {
  try {
    const userId = req.userId;
    const sql = `SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC LIMIT 100`;
    const result = await env.DB.prepare(sql).bind(userId).all();
    return json({
      success: true,
      products: result?.results || [],
      count: (result?.results || []).length
    });
  } catch (error) {
    console.error('Error fetching user products:', error);
    return json({ success: false, products: [], count: 0, error: error.message }, { status: 200 });
  }
});

// Rotas de fretes do usuário
router.get('/api/freights/my', verifyToken, async (req, env) => {
  try {
    const userId = req.userId;
    const sql = `SELECT * FROM freights WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`;
    const result = await env.DB.prepare(sql).bind(userId).all();
    return json({
      success: true,
      data: result?.results || [],
      count: (result?.results || []).length
    });
  } catch (error) {
    console.error('Error fetching user freights:', error);
    return json({ success: false, data: [], count: 0, error: error.message }, { status: 200 });
  }
});

// Rota de healthcheck
router.get('/api/health', async (req, env) => {
  try {
    // Testar conexão com D1
    const dbResult = await env.DB.prepare('SELECT 1 as test').first();
    // Não lança erro, sempre retorna status
    const dbOk = !!(dbResult && dbResult.test === 1);
    // Testar KV Cache
    let cacheOk = false;
    try {
      await env.CACHE.put('health-check', 'ok', { expirationTtl: 60 });
      cacheOk = true;
    } catch {}
    // Testar KV Sessions
    let sessionsOk = false;
    try {
      await env.SESSIONS.put('health-check', 'ok', { expirationTtl: 60 });
      sessionsOk = true;
    } catch {}
    return json({
      status: dbOk && cacheOk && sessionsOk ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbOk ? 'connected' : 'error',
        cache: cacheOk ? 'connected' : 'error',
        sessions: sessionsOk ? 'connected' : 'error'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
});

// Handler 404 para rotas não encontradas
router.all('*', () => json({ success: false, error: 'Rota não encontrada' }, { status: 200 }));

// Wrapper para tratamento de erros
export function createApp() {
  return {
    fetch: (...args) => router.handle(...args).catch(errorHandler)
  };
}