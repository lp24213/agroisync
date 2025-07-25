const express = require('express');
const tracer = require('./jaeger');
const logger = require('../../src/logger');
const metrics = require('./metrics');
const app = express();
app.use(express.json());
app.use(metrics);

app.get('/health', (req, res) => res.send('OK'));
app.get('/reports', (req, res) => {
  const span = tracer.startSpan('get_reports');
  // lógica de listagem
  span.finish();
  res.json([{ id: 1, type: 'summary' }]);
});
app.post('/reports', (req, res) => {
  const span = tracer.startSpan('create_report');
  // lógica de geração
  span.finish();
  res.status(201).json({ id: 2, ...req.body });
});

app.listen(4003, () => logger.info('Report service running on port 4003')); 