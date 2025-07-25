const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('./rateLimit');
const cors = require('./cors');
const logger = require('../../src/logger');
const auth = require('./auth');
const app = express();

app.get('/health', (req, res) => res.send('OK'));

app.use(rateLimit);
app.use(cors);
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user ? req.user.id : undefined,
  });
  next();
});

app.use(
  '/users',
  auth,
  createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }),
);
app.use(
  '/payments',
  auth,
  createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }),
);
app.use(
  '/notify',
  auth,
  createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true }),
);

app.listen(3005, () => logger.info('API Gateway running on port 3005'));
