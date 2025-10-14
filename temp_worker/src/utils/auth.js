// @ts-check

/**
 * Gera um hash bcrypt de uma senha
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verifica uma senha contra seu hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {Promise<boolean>} Resultado da verificação
 */
export async function verifyPassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

/**
 * Gera um token JWT
 * @param {object} payload - Dados do token
 * @param {string} secret - Chave secreta
 * @returns {Promise<string>} Token JWT
 */
export async function generateJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (24 * 60 * 60); // 24 horas

  const finalPayload = {
    ...payload,
    iat: now,
    exp
  };

  const encoder = new TextEncoder();
  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(finalPayload));

  const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    data
  );

  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

/**
 * Gera um código de recuperação aleatório
 * @returns {string} Código de 6 dígitos
 */
export function generateRecoveryCode() {
  return Math.random()
    .toString()
    .slice(2, 8);
}