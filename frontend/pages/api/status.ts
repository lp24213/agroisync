import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const health = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/health`).then(r => r.json());
    // Extrai status do MongoDB de forma resiliente
    let db = false;
    if (Array.isArray(health.services)) {
      const mongoService = health.services.find((s: any) => s.service?.toLowerCase() === 'mongodb');
      db = mongoService?.status === 'ok';
    }
    const api = health.status === 'ok';

    res.status(200).json({
      api,
      db,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    // Log detalhado do erro
    if (typeof console !== 'undefined') {
      console.error('Erro no endpoint /api/status:', e);
    }
    res.status(500).json({ api: false, db: false, uptime: process.uptime(), error: String(e) });
  }
}
