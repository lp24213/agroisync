// @ts-check
import { createServer } from 'node:http';
import { createApp } from './src/router.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
/** @type {any | undefined} */
let sqlite3;
/** @type {((opts: any) => Promise<any>) | undefined} */
let open;
try {
  // tentar carregar sqlite localmente (apenas para desenvolvimento)
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  // @ts-ignore - require opcional em ambiente dev
  sqlite3 = require('sqlite3');
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  // @ts-ignore - require opcional em ambiente dev
  open = require('sqlite').open;
} catch (err) {
  // Se não estiver disponível, usamos fallback in-memory acima
  // eslint-disable-next-line no-console
  console.warn('sqlite3/sqlite não encontrado localmente. Usando fallback de memória para desenvolvimento. Instale sqlite3 se precisar persistência.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8787;

// Configurar banco de dados SQLite
/**
 * Configura DB em memória para desenvolvimento.
 * Retorna um objeto compatível com a API mínima usada pela aplicação.
 * @returns {Promise<any>}
 */
async function setupDatabase() {
  if (!open || !sqlite3) {
    // fallback simples: retornar um objeto com métodos mínimos usados pelos testes/handlers
    console.warn('Usando DB fake em memória (fallback)');
    return {
        prepare: async (/** @type {string} */ sql) => ({
          bind: () => ({ first: async () => ({ test: 1 }) })
        }),
      exec: async () => {}
    };
  }

  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });

  // Executar schema
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      businessType TEXT DEFAULT 'user',
      role TEXT DEFAULT 'user',
      verificationCode TEXT,
      codeExpires INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      images TEXT,
      city TEXT,
      state TEXT,
      slug TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS freights (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      originCity TEXT NOT NULL,
      originState TEXT NOT NULL,
      destinationCity TEXT NOT NULL,
      destinationState TEXT NOT NULL,
      cargoType TEXT NOT NULL,
      price REAL NOT NULL,
      availableDate INTEGER,
      capacity TEXT,
      status TEXT DEFAULT 'active',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      receiverId TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      messageType TEXT DEFAULT 'general',
      relatedItemId TEXT,
      relatedItemType TEXT,
      status TEXT DEFAULT 'unread',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (senderId) REFERENCES users(id),
      FOREIGN KEY (receiverId) REFERENCES users(id)
    );
  `;

  await db.exec(schema);
  return db;
}

// Criar app com todas as rotas
const app = createApp();

// Configurar ambiente de desenvolvimento
async function setupEnvironment() {
  return {
    DB: await setupDatabase(),
    SESSIONS: new Map(),
    NODE_ENV: 'development',
    API_VERSION: 'v1',
    FRONTEND_URL: 'http://localhost:3000',
    API_URL: `http://localhost:${PORT}`,
    LOG_LEVEL: 'debug',
    CF_TURNSTILE_ENABLED: 'false',
    JWT_SECRET: 'desenvolvimento_local_nao_usar_em_producao',
    JWT_EXPIRES_IN: '7d',
    JWT_REFRESH_SECRET: 'refresh_desenvolvimento_local_nao_usar_em_producao',
    JWT_REFRESH_EXPIRES_IN: '30d',
    ENABLE_CSRF: 'false',
    SECURE_HEADERS: 'true',
    XSS_PROTECTION: 'true',
    PASSWORD_HASH_ROUNDS: '10'
  };
}

// Converter headers do Node para formato do Workers
/**
 * @param {import('http').IncomingHttpHeaders} nodeHeaders
 * @returns {Headers}
 */
function headersFromNode(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders || {})) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, String(v)));
      } else {
        headers.set(key, String(value));
      }
    }
  }
  return headers;
}

// Iniciar servidor
async function startServer() {
  const env = await setupEnvironment();

  const server = createServer(async (req, res) => {
    try {
      // Coletar corpo da requisição para métodos POST/PUT/PATCH
      let body = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        body = await new Promise((resolve, reject) => {
          /** @type {Buffer[]} */
          const chunks = [];
          req.on('data', /** @param {Uint8Array | Buffer | string} chunk */ (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', () => resolve(Buffer.concat(chunks)));
          req.on('error', reject);
        });
      }

      // Criar Request compatível com Workers
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const request = new Request(url.toString(), {
        method: req.method,
        headers: headersFromNode(req.headers),
        body: body
      });

      // Executar o app
      const response = await app.fetch(request, env);

      // Enviar resposta
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      
      if (response.body) {
        const reader = response.body.getReader();
        
        // Stream o corpo da resposta
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      
      res.end();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('Erro no servidor:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: errMsg,
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      }));
    }
  });

  server.listen(PORT, () => {
    console.log(`
🚀 Servidor de desenvolvimento rodando em http://localhost:${PORT}
   Modo: ${env.NODE_ENV}
   API Version: ${env.API_VERSION}
   Frontend URL: ${env.FRONTEND_URL}
   Turnstile: ${env.CF_TURNSTILE_ENABLED === 'true' ? 'Ativado' : 'Desativado'}
    `);
  });
}

startServer().catch(console.error);