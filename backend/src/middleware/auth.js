import { json } from '../utils/respond.js';

export function verifyToken(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const [_header, payload, _signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));

    if (decodedPayload.exp < Date.now() / 1000) {
      return json({ error: 'Token expirado' }, { status: 401 });
    }

    // Adiciona o userId no request para uso posterior
    request.userId = decodedPayload.sub;
    return null; // continua para o próximo handler

  } catch (error) {
    return json({ error: 'Token inválido' }, { status: 401 });
  }
}