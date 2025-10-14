// @ts-check

/**
 * Middleware padrão para CORS
 * @param {Request} request - Requisição original
 * @returns {Response|null} Resposta de preflight ou null para continuar
 */
export async function handleCORS(request) {
  // Permitir apenas origens específicas em produção
  const origin = request.headers.get('Origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, CF-Turnstile-Token',
    'Access-Control-Max-Age': '86400',
  };

  // Responder a requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    });
  }

  return null;
}

/**
 * Helper para respostas JSON com CORS
 * @param {any} data - Dados a serem enviados como JSON
 * @param {number} [status=200] - Status HTTP
 * @returns {Response} Resposta formatada
 */
export function jsonResponse(data, status = 200) {
  const origin = '*'; // Em produção, usar origem específica
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, CF-Turnstile-Token',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

/**
 * Middleware de autenticação JWT
 * @param {Request} request - Requisição HTTP
 * @param {string} jwtSecret - Chave secreta JWT
 * @returns {Promise<object|null>} Payload decodificado ou null
 */
export async function verifyJWT(request, jwtSecret) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = new Uint8Array(
      parts[2].replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(parts[2].length / 4) * 4, '=')
        .match(/.{2}/g)
        .map(byte => parseInt(byte, 16))
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      data
    );

    return valid ? payload : null;
  } catch (error) {
    return null;
  }
}

/**
 * Verifica token do Turnstile
 * @param {string} token - Token do Turnstile
 * @param {string} secretKey - Chave secreta do Turnstile
 * @returns {Promise<boolean>} Resultado da validação
 */
export async function verifyTurnstileToken(token, secretKey) {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    return false;
  }
}