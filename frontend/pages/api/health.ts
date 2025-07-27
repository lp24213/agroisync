import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const checks = [];
  // Checagem MongoDB
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    checks.push({ service: 'MongoDB', status: 'ok' });
  } catch (e) {
    checks.push({ service: 'MongoDB', status: 'fail', error: (e as Error).message });
  }
  // Checagem variáveis de ambiente
  const requiredEnv = ['MONGODB_URI', 'MONGODB_DB', 'NEXT_PUBLIC_SENTRY_DSN'];
  const envStatus = requiredEnv.map(key => ({ key, status: process.env[key] ? 'ok' : 'missing' }));
  // Latência (simples)
  const start = Date.now();
  await new Promise(r => setTimeout(r, 10));
  const latency = Date.now() - start;
  res.status(200).json({
    status: checks.every(c => c.status === 'ok') ? 'ok' : 'degraded',
    services: checks,
    env: envStatus,
    latency_ms: latency,
    timestamp: new Date().toISOString()
  });
}
