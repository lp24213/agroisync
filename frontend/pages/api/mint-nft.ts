import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { to } = JSON.parse(req.body || '{}');
  if (!to) {
    return res.status(400).json({ error: 'Wallet address required' });
  }
  // Simula hash de transação
  const tx = '0x' + Math.random().toString(16).slice(2, 66);
  res.status(200).json({ tx });
}
