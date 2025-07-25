const express = require('express');
require('./otel');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
const { sendToSIEM } = require('./siem');

app.get('/health', (req, res) => res.send('OK'));
app.get('/alerts', (req, res) => {
  // lógica de listagem de alertas
  res.json([{ id: 1, type: 'ddos', status: 'active' }]);
});
app.post('/block-ip', async (req, res) => {
  // lógica de bloqueio de IP
  await sendToSIEM({ type: 'block-ip', ip: req.body.ip, timestamp: new Date().toISOString() });
  res.json({ status: 'blocked', ip: req.body.ip });
});

app.listen(4006, () => logger.info('Security service running on port 4006')); 