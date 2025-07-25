const client = require('prom-client');
const express = require('express');
const router = express.Router();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const usersCreated = new client.Counter({
  name: 'users_created_total',
  help: 'Total de usuários criados',
});
router.post('/users', (req, res, next) => {
  usersCreated.inc();
  next();
});

const responseTime = new client.Histogram({
  name: 'http_response_time_seconds',
  help: 'Tempo de resposta das rotas',
  labelNames: ['method', 'route', 'status_code'],
});
router.use((req, res, next) => {
  const end = responseTime.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end({ status_code: res.statusCode });
  });
  next();
});

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;
