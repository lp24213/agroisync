import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (_req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    service: 'AGROISYNC Backend',
    version: '2.3.1',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  });
});

// Detailed health check
router.get('/detailed', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AGROISYNC Backend',
    version: '2.3.1',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  });
});

export default router;
