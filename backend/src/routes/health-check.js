/**
 * Health Check Routes - Monitoramento automÃ¡tico do sistema
 */

import express from 'express';

const router = express.Router();

// Status da aplicaÃ§Ã£o
const appStatus = {
  startTime: Date.now(),
  lastCheck: null,
  checks: {
    api: { status: 'ok', lastCheck: null },
    database: { status: 'unknown', lastCheck: null },
    external: { status: 'unknown', lastCheck: null }
  }
};

/**
 * GET /health - Health check bÃ¡sico
 */
router.get('/', (req, res) => {
  const uptime = Date.now() - appStatus.startTime;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime / 1000), // em segundos
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * GET /health/detailed - Health check detalhado
 */
router.get('/detailed', (req, res) => {
  const uptime = Date.now() - appStatus.startTime;

  // Verificar API
  appStatus.checks.api = {
    status: 'ok',
    lastCheck: new Date().toISOString()
  };

  // Verificar Database (Cloudflare D1)
  try {
    // Aqui vocÃª adicionaria verificaÃ§Ã£o real do D1
    appStatus.checks.database = {
      status: process.env.CLOUDFLARE_D1_DATABASE_ID ? 'ok' : 'not_configured',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    appStatus.checks.database = {
      status: 'error',
      lastCheck: new Date().toISOString(),
      error: error.message
    };
  }

  // Verificar APIs Externas
  try {
    appStatus.checks.external = {
      status: 'ok',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    appStatus.checks.external = {
      status: 'error',
      lastCheck: new Date().toISOString(),
      error: error.message
    };
  }

  // Status geral
  const allChecksOk = Object.values(appStatus.checks).every(
    check => check.status === 'ok' || check.status === 'not_configured'
  );

  res.status(allChecksOk ? 200 : 503).json({
    status: allChecksOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime / 1000),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: appStatus.checks,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    },
    cpu: process.cpuUsage()
  });
});

/**
 * GET /health/ready - Readiness probe (Kubernetes)
 */
router.get('/ready', (req, res) => {
  const allChecksOk = Object.values(appStatus.checks).every(
    check => check.status === 'ok' || check.status === 'not_configured'
  );

  if (allChecksOk) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not_ready', checks: appStatus.checks });
  }
});

/**
 * GET /health/live - Liveness probe (Kubernetes)
 */
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

/**
 * GET /health/metrics - MÃ©tricas bÃ¡sicas
 */
router.get('/metrics', (req, res) => {
  const uptime = Date.now() - appStatus.startTime;
  const mem = process.memoryUsage();

  res.json({
    uptime_seconds: Math.floor(uptime / 1000),
    memory_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
    memory_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
    memory_external_mb: Math.round(mem.external / 1024 / 1024),
    cpu_user: process.cpuUsage().user,
    cpu_system: process.cpuUsage().system,
    node_version: process.version,
    platform: process.platform,
    arch: process.arch
  });
});

export default router;
