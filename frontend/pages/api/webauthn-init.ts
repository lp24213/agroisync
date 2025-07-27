import type { NextApiRequest, NextApiResponse } from 'next';
import { generateRegistrationOptions } from '@simplewebauthn/server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email obrigatório' });
  const options = generateRegistrationOptions({
    rpName: 'AGROTM',
    userID: email,
    userName: email,
    attestationType: 'direct',
  });
  return res.status(200).json(options);
}
