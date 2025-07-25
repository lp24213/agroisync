const express = require('express');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
const metrics = require('./metrics');
app.use(metrics);
require('./otel');

app.get('/health', (req, res) => res.send('OK'));
app.post('/notify', (req, res) => {
  // lógica de notificação
  res.status(201).json({ status: 'sent', ...req.body });
});

app.listen(4002, () => logger.info('Notification service running on port 4002')); 