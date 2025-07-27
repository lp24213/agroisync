import type { NextApiRequest, NextApiResponse } from 'next';
import speakeasy from 'speakeasy';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { token, secret } = req.body;
  if (!token || !secret) return res.status(400).json({ message: 'Token e secret obrigatórios' });
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
  if (!verified) return res.status(401).json({ message: 'Código 2FA inválido' });
  return res.status(200).json({ success: true });
}
