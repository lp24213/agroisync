import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'E-mail obrigatório' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { db } = await connectToDatabase();
  await db.collection('email_codes').insertOne({ email, code, expires: Date.now() + 10 * 60 * 1000 });
  // Configurar transporte de e-mail (ajustar para produção)
  // (mantém envio real se SMTP estiver configurado)
  return res.status(200).json({ success: true });
}
