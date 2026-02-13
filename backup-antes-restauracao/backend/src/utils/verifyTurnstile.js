import fetch from 'node-fetch';
import logger from './logger.js';

export async function verifyTurnstile(token, remoteip = null) {
  try {
    // Recebe env como argumento extra
    const env = arguments[2] || {};
    const secret = env.CF_TURNSTILE_SECRET_KEY;
    if (!secret) {
      if (env.NODE_ENV !== 'production') {
        logger.warn('CF_TURNSTILE_SECRET_KEY não configurado, pulando verificação');
      }
      return { success: true }; // Em desenvolvimento, sempre retorna true
    }

    // Cloudflare expects application/x-www-form-urlencoded body
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);
    if (remoteip) params.append('remoteip', remoteip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const result = await response.json();

    if (env.NODE_ENV !== 'production') {
      logger.info('Turnstile verification result:', result);
    }

    return result;
  } catch (error) {
    const env = arguments[2] || {};
    if (env.NODE_ENV !== 'production') {
      logger.error('Erro na verificação Turnstile:', error);
    }
    return { success: false, 'error-codes': ['internal-error'] };
  }
}
