import type { NextApiRequest, NextApiResponse } from 'next';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email obrigatório' });
  const secret = speakeasy.generateSecret({ name: `AGROTM (${email})` });
  const qr = await qrcode.toDataURL(secret.otpauth_url!);
  // Aqui, salvar secret temporário no backend para confirmação posterior
  return res.status(200).json({ secret: secret.base32, otpauth: secret.otpauth_url, qr });
}
