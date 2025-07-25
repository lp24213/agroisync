const express = require('express');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
const metrics = require('./metrics');
app.use(metrics);

app.get('/health', (req, res) => res.send('OK'));
app.post('/payments', (req, res) => {
  // lógica de pagamento
  res.status(201).json({ status: 'success', ...req.body });
});

app.listen(4001, () => logger.info('Payment service running on port 4001'));
