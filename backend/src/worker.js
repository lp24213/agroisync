// Cloudflare Worker para AgroSync Backend
import { Router } from 'itty-router';
import { corsHeaders } from './utils/cors.js';
import { authenticateToken } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import paymentRoutes from './routes/payments.js';
import planRoutes from './routes/plans.js';
import freightRoutes from './routes/freight.js';
import marketplaceRoutes from './routes/marketplace.js';

const router = Router();

// Middleware global
router.all('*', corsHeaders);
router.all('/api/*', rateLimiter);

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Rotas de autenticação
router.all('/api/auth/*', authRoutes.handle);

// Rotas protegidas
router.all('/api/users/*', authenticateToken, userRoutes.handle);
router.all('/api/products/*', authenticateToken, productRoutes.handle);
router.all('/api/payments/*', paymentRoutes.handle); // Webhooks não precisam de auth
router.all('/api/plans/*', planRoutes.handle);
router.all('/api/freight/*', authenticateToken, freightRoutes.handle);
router.all('/api/marketplace/*', authenticateToken, marketplaceRoutes.handle);

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'Endpoint não encontrado'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

// Handler principal do Worker
export default {
  async fetch(request, env, ctx) {
    try {
      // Adicionar env ao contexto para uso nas rotas
      request.env = env;
      
      return await router.handle(request);
    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Erro interno do servidor'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
