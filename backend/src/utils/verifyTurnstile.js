import fetch from 'node-fetch';
import logger from './logger.js';

export async function verifyTurnstile(token, remoteip = null) {
  try {
    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!secret || secret === 'your-turnstile-secret-key') {
      if (process.env.NODE_ENV !== 'production') {
        logger.warn('CLOUDFLARE_TURNSTILE_SECRET_KEY nÃ£o configurado, pulando verificaÃ§Ã£o');
      }
      return { success: true }; // Em desenvolvimento, sempre retorna true
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        response: token,
        ...(remoteip && { remoteip })
      })
    });

    const result = await response.json();

    if (process.env.NODE_ENV !== 'production') {
      logger.info('Turnstile verification result:', result);
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na verificaÃ§Ã£o Turnstile:', error);
    }
    return { success: false, 'error-codes': ['internal-error'] };
  }
}
