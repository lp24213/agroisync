// @ts-check
import { createApp } from './router.js';

export default {
  async fetch(request, env, ctx) {
    // Configurar CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.FRONTEND_URL || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Criar app com todas as rotas
    const app = createApp();

    // Adicionar headers de segurança
    const response = await app.fetch(request, env, ctx);
    const headers = new Headers(response.headers);

    headers.set('Access-Control-Allow-Origin', env.FRONTEND_URL || '*');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (env.ENABLE_CSRF === 'true') {
      headers.set('X-CSRF-Token', crypto.randomUUID());
    }

    if (env.SECURE_HEADERS === 'true') {
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      headers.set('Content-Security-Policy', "default-src 'self'");
    }

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};