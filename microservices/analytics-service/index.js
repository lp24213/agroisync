const express = require('express');
const { tracer, zipkinMiddleware } = require('./zipkin');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
app.use(zipkinMiddleware({ tracer }));
require('./otel');

app.get('/health', (req, res) => res.send('OK'));
app.get('/analytics', (req, res) => {
  // lógica de analytics
  res.json({ metric: 'visits', value: 123 });
});

app.listen(4004, () => logger.info('Analytics service running on port 4004'));
