import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers = [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ];
  const security = headers.map(h => ({ header: h, active: !!req.headers[h.toLowerCase()] }));
  res.status(200).json({
    status: 'ok',
    security,
    timestamp: new Date().toISOString()
  });
}
