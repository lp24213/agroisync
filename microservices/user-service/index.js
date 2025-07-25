const express = require('express');
const logger = require('../../src/logger');
const app = express();
app.use(express.json());
const metrics = require('./metrics');
app.use(metrics);
const { getSecret } = require('./secrets');

app.get('/health', (req, res) => res.send('OK'));
app.get('/users', (req, res) => res.json([{ id: 1, name: 'Alice' }]))
app.post('/users', (req, res) => {
  // lógica de criação
  res.status(201).json({ id: 2, ...req.body });
});

// Exemplo de uso (async function):
(async () => {
  if (process.env.SECRETS_PROVIDER) {
    const secret = await getSecret('my-secret-key');
    logger.info({ secretLoaded: !!secret });
  }
})();

app.listen(4000, () => logger.info('User service running on port 4000')); 