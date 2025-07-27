import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Email e senha do admin (senha nunca exposta no frontend)
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';
// Hash SHA-256 da senha: Th@ys15221008
const ADMIN_PASSWORD_HASH = '6e6f7d5b8a7e6a3b6e6c6e6c6e6c6e6c6e6c6e6c6e6c6e6c6e6c6e6c6e6c6e6c'; // SUBSTITUIR PELO HASH REAL

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email, password } = req.body;
  if (
    email === ADMIN_EMAIL &&
    hashPassword(password) === ADMIN_PASSWORD_HASH
  ) {
    // Gerar token simples de sessão (ideal: JWT + HttpOnly cookie)
    res.setHeader('Set-Cookie', `admin_token=valid; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=86400`);
    return res.status(200).json({ success: true });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
}
