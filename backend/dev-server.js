// @ts-check
import { createServer } from 'node:http';
import { createApp } from './src/router.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8787;

// Configurar banco de dados SQLite
async function setupDatabase() {
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
function headersFromNode(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
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
          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
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
      console.error('Erro no servidor:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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