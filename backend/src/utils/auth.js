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

/**
 * Gera um token JWT de acesso
 * @param {object} payload - Dados do usuário
 * @returns {Promise<string>} Token JWT
 */
export async function generateToken(payload) {
  return generateJWT({
    ...payload,
    type: 'access'
  }, process.env.JWT_SECRET);
}

/**
 * Gera um token JWT de refresh
 * @param {object} payload - Dados do usuário
 * @returns {Promise<string>} Refresh token
 */
export async function generateRefreshToken(payload) {
  return generateJWT({
    ...payload,
    type: 'refresh'
  }, process.env.JWT_SECRET);
}

/**
 * Verifica um token JWT
 * @param {string} token - Token JWT
 * @returns {Promise<object>} Payload decodificado ou erro
 */
export async function verifyToken(token) {
  try {
    const [_header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));

    // Verificar expiração
    if (decodedPayload.exp < Date.now() / 1000) {
      return {
        valid: false,
        error: 'Token expirado'
      };
    }

    // Verificar assinatura
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(process.env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64ToArrayBuffer(signature),
      encoder.encode(`${_header}.${payload}`)
    );

    if (!isValid) {
      return {
        valid: false,
        error: 'Assinatura inválida'
      };
    }

    return {
      valid: true,
      payload: decodedPayload,
      userId: decodedPayload.sub,
      email: decodedPayload.email,
      userType: decodedPayload.userType || 'buyer',
      groups: decodedPayload.groups || []
    };

  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Verifica se usuário tem plano ativo
 * @param {object} user - Dados do usuário
 * @param {string} module - Módulo a verificar
 * @returns {boolean} Se tem plano ativo
 */
export function hasActivePlan(user, module) {
  if (!user?.subscriptions) {
    return false;
  }

  const subscription = user.subscriptions[module];
  if (!subscription) {
    return false;
  }

  return (
    subscription.status === 'active' &&
    subscription.endDate &&
    new Date(subscription.endDate) > new Date()
  );
}

/**
 * Verifica se usuário é admin
 * @param {string[]} groups - Grupos do usuário
 * @returns {boolean} Se é admin
 */
export function isAdmin(groups) {
  return groups?.includes('admin') || false;
}

/**
 * Verifica permissões para mensagens privadas
 * @param {object} user - Dados do usuário
 * @returns {boolean} Se pode acessar mensagens
 */
export function canAccessPrivateMessages(user) {
  return hasActivePlan(user, 'store') || hasActivePlan(user, 'freight');
}

/**
 * Verifica permissões para criar anúncios
 * @param {object} user - Dados do usuário
 * @returns {boolean} Se pode criar anúncios
 */
export function canCreateAds(user) {
  return hasActivePlan(user, 'store') && 
         user.subscriptions?.store.currentAds < user.subscriptions?.store.maxAds;
}

/**
 * Verifica permissões para criar fretes
 * @param {object} user - Dados do usuário
 * @returns {boolean} Se pode criar fretes
 */
export function canCreateFreights(user) {
  return hasActivePlan(user, 'freight') &&
         user.subscriptions?.freight.currentFreights < user.subscriptions?.freight.maxFreights;
}

/**
 * Converte base64 para ArrayBuffer
 * @private
 */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}