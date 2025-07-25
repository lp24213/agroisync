const express = require('express');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
require('./otel');

app.get('/health', (req, res) => res.send('OK'));
app.post('/billing', (req, res) => {
  // lógica de cobrança
  res.status(201).json({ status: 'billed', ...req.body });
});

app.listen(4005, () => logger.info('Billing service running on port 4005')); 