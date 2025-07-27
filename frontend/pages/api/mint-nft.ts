import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { to } = JSON.parse(req.body || '{}');
  if (!to) {
    return res.status(400).json({ error: 'Wallet address required' });
  }
  // Gera hash seguro de transação usando Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(`${to}-${Date.now()}-${Math.random()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tx = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  res.status(200).json({ tx });
}
