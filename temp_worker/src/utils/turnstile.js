// @ts-check

/**
 * URL para verificação do token Turnstile
 */
export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Configuração do Turnstile
 * @typedef {Object} TurnstileConfig
 * @property {string} siteKey - Chave pública do site
 * @property {string} secretKey - Chave secreta
 */

/**
 * Verifica um token do Turnstile
 * @param {string} token - Token do Turnstile
 * @param {TurnstileConfig} config - Configuração do Turnstile
 * @returns {Promise<boolean>} Resultado da validação
 */
export async function verifyTurnstileToken(token, config) {
  if (!token || !config.secretKey) {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response: token,
        secret: config.secretKey
      })
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Obtém configuração do Turnstile do ambiente
 * @param {object} env - Variáveis de ambiente do Worker
 * @returns {TurnstileConfig} Configuração do Turnstile
 */
export function getTurnstileConfig(env) {
  return {
    siteKey: env.CF_TURNSTILE_SITE_KEY || '',
    secretKey: env.CF_TURNSTILE_SECRET_KEY || ''
  };
}

/**
 * Middleware de validação do Turnstile
 * @param {Request} request - Requisição HTTP
 * @param {object} env - Variáveis de ambiente
 * @returns {Promise<Response|null>} Resposta de erro ou null para continuar
 */
export async function validateTurnstile(request, env) {
  const config = getTurnstileConfig(env);
  
  // Se não estiver configurado, permitir a requisição
  if (!config.secretKey) {
    console.warn('Turnstile not configured');
    return null;
  }

  // Obter token do header
  const token = request.headers.get('CF-Turnstile-Token');
  if (!token) {
    return new Response(JSON.stringify({
      error: 'Missing Turnstile token'
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verificar token
  const valid = await verifyTurnstileToken(token, config);
  if (!valid) {
    return new Response(JSON.stringify({
      error: 'Invalid Turnstile token'
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return null;
}