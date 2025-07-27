import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Telefone obrigatório' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { db } = await connectToDatabase();
  await db.collection('sms_codes').insertOne({ phone, code, expires: Date.now() + 10 * 60 * 1000 });
  // Aqui simular envio de SMS (em produção, integrar com serviço real)
  console.log(`SMS enviado para ${phone}: código ${code}`);
  return res.status(200).json({ success: true });
}
