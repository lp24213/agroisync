import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ message: 'Telefone e código obrigatórios' });
  const { db } = await connectToDatabase();
  const record = await db.collection('sms_codes').findOne({ phone, code });
  if (!record) return res.status(400).json({ message: 'Código inválido' });
  if (Date.now() > record.expires) return res.status(400).json({ message: 'Código expirado' });
  await db.collection('sms_codes').deleteOne({ _id: record._id });
  return res.status(200).json({ success: true });
}
