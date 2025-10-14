// @ts-check
import { Resend } from 'resend';
import logger from './utils/logger.js';

async function testD1(env) {
  try {
    const result = await env.DB.prepare('SELECT 1 as test').first();
    if (result && result.test === 1) {
      logger.info('✅ D1 Database: Conectado');
      return true;
    }
    throw new Error('Falha no teste de conexão');
  } catch (error) {
    logger.error('❌ D1 Database:', error.message);
    return false;
  }
}

async function testKVCache(env) {
  try {
    const testKey = 'test-' + Date.now();
    await env.CACHE.put(testKey, 'test');
    const value = await env.CACHE.get(testKey);
    await env.CACHE.delete(testKey);

    if (value === 'test') {
      logger.info('✅ KV Cache: Conectado');
      return true;
    }
    throw new Error('Falha na verificação do valor');
  } catch (error) {
    logger.error('❌ KV Cache:', error.message);
    return false;
  }
}

async function testKVSessions(env) {
  try {
    const testKey = 'session-' + Date.now();
    await env.SESSIONS.put(testKey, 'test');
    const value = await env.SESSIONS.get(testKey);
    await env.SESSIONS.delete(testKey);

    if (value === 'test') {
      logger.info('✅ KV Sessions: Conectado');
      return true;
    }
    throw new Error('Falha na verificação do valor');
  } catch (error) {
    logger.error('❌ KV Sessions:', error.message);
    return false;
  }
}

async function testResend(env) {
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    
    // Apenas verifica a API sem enviar e-mail
    await resend.emails.get('test-id');
    
    console.log('✅ Resend: Conectado');
    return true;
  } catch (error) {
    // 404 é esperado pois o ID não existe
    if (error.statusCode === 404) {
      console.log('✅ Resend: Conectado');
      return true;
    }
    console.error('❌ Resend:', error.message);
    return false;
  }
}

async function testTurnstile(env) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.CF_TURNSTILE_SECRET_KEY,
        response: 'test'
      })
    });

    const result = await response.json();
    
    // success: false é esperado pois enviamos um token inválido
    if (response.status === 200) {
      console.log('✅ Turnstile: Conectado');
      return true;
    }
    throw new Error('Falha na verificação');
  } catch (error) {
    console.error('❌ Turnstile:', error.message);
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    console.log('🔄 Iniciando testes de conexão...\n');

    const results = await Promise.all([
      testD1(env),
      testKVCache(env),
      testKVSessions(env),
      testResend(env),
      testTurnstile(env)
    ]);

    const allConnected = results.every(result => result === true);

    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      status: allConnected ? 'healthy' : 'unhealthy',
      services: {
        database: results[0] ? 'connected' : 'error',
        cache: results[1] ? 'connected' : 'error',
        sessions: results[2] ? 'connected' : 'error',
        email: results[3] ? 'connected' : 'error',
        turnstile: results[4] ? 'connected' : 'error'
      }
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};