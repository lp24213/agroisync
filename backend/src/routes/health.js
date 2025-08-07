const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Health check endpoint
router.get('/', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };

  logger.info('Health check requested', healthData);
  
  res.status(200).json(healthData);
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external
    },
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
    title: process.title
  };

  logger.info('Detailed health check requested', detailedHealth);
  
  res.status(200).json(detailedHealth);
});

// Readiness check
router.get('/ready', (req, res) => {
  // Add any readiness checks here (database, external services, etc.)
  const readiness = {
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'OK',
      redis: 'OK',
      externalServices: 'OK'
    }
  };

  res.status(200).json(readiness);
});

// Liveness check
router.get('/live', (req, res) => {
  const liveness = {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  res.status(200).json(liveness);
});

module.exports = router;
