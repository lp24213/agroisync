// @ts-check
import { createApp } from './src/router.js';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    const app = createApp();
    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method,
      headers: new Headers(req.headers),
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : null
    });

    const env = {
      DB: process.env.DB,
      SESSIONS: process.env.SESSIONS,
      FRONTEND_URL: process.env.FRONTEND_URL || '*',
      CF_TURNSTILE_ENABLED: process.env.CF_TURNSTILE_ENABLED || 'false'
    };

    const response = await app.fetch(request, env);
    
    res.writeHead(response.status, response.headers);
    res.end(await response.text());
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Lidar com erros do servidor
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});