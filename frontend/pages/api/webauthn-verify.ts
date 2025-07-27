import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { attestation, expected } = req.body;
  if (!attestation || !expected) return res.status(400).json({ message: 'Dados obrigatórios' });
  try {
    const verification = await verifyRegistrationResponse({
      response: attestation,
      expectedChallenge: expected.challenge,
      expectedOrigin: expected.origin,
      expectedRPID: expected.rpID,
    });
    if (!verification.verified) return res.status(401).json({ message: 'Biometria inválida' });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao verificar biometria' });
  }
}
