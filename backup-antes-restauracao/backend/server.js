// @ts-check
import { createApp } from './src/router.js';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;

// Converter headers do Node para Headers (compatível com Workers)
/**
 * Converter headers do Node para Headers (compatível com Workers)
 * @param {import('http').IncomingHttpHeaders} nodeHeaders
 * @returns {Headers}
 */
function headersFromNode(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders || {})) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, String(v));
    } else {
      headers.set(key, String(value));
    }
  }
  return headers;
}

/**
 * Ler corpo da requisição Node (POST/PUT/PATCH)
 * @param {import('http').IncomingMessage} nodeReq
 * @returns {Promise<Buffer|null>}
 */
async function readRequestBody(nodeReq) {
  if (!nodeReq || !['POST', 'PUT', 'PATCH'].includes(nodeReq.method || '')) return null;
  return await new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    nodeReq.on('data', /** @param {Uint8Array | Buffer | string} chunk */ (chunk) => chunks.push(Buffer.from(chunk)));
    nodeReq.on('end', () => resolve(Buffer.concat(chunks)));
    nodeReq.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    const app = createApp();

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}:${port}`);

    const body = await readRequestBody(req);

    const request = new Request(url.toString(), {
      method: req.method || 'GET',
      headers: headersFromNode(req.headers),
      // Converter Buffer para Uint8Array (compatível com BodyInit)
      // @ts-ignore - o tipo Buffer pode não ser reconhecido como BodyInit pelo analisador
      body: body ? new Uint8Array(body) : null
    });

    const env = {
      DB: process.env.DB,
      SESSIONS: process.env.SESSIONS,
      FRONTEND_URL: process.env.FRONTEND_URL || '*',
      CF_TURNSTILE_ENABLED: process.env.CF_TURNSTILE_ENABLED || 'false'
    };

    const response = await app.fetch(request, env);

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    // Streamar resposta quando possível
    if (response.body && response.body.getReader) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end(await response.text());
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', details: message }));
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