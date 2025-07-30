/**
 * Honeypot System
 * Cria armadilhas para detectar e rastrear bots e crawlers maliciosos
 * Implementa páginas falsas, links invisíveis e formulários armadilha
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

// Configuração do Redis para armazenamento de dados
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Prefixo para chaves Redis
const REDIS_PREFIX = 'agrotm:honeypot:';

// Lista de caminhos honeypot (URLs falsas que parecem interessantes para bots)
const HONEYPOT_PATHS = [
  '/admin',
  '/login',
  '/wp-login.php',
  '/wp-admin',
  '/administrator',
  '/phpmyadmin',
  '/config',
  '/backup',
  '/private',
  '/.env',
  '/api/debug',
  '/api/test',
  '/api/keys',
];

// Parâmetros de formulário que são invisíveis para usuários reais
const TRAP_FIELD_NAMES = [
  'email_confirm', // Campo oculto via CSS
  'website',       // Campo oculto via CSS
  'phone_home',    // Campo oculto via CSS
  'agreement',     // Campo oculto via CSS
];

/**
 * Middleware para detectar acessos a URLs honeypot
 */
export function honeypotMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Verificar se o caminho é um honeypot
  if (HONEYPOT_PATHS.includes(path)) {
    // Gerar ID único para este bot
    const botId = req.cookies.get('visitor_id')?.value || uuidv4();
    
    // Registrar a tentativa de acesso
    trackHoneypotAccess(botId, path, req);
    
    // Retornar uma resposta falsa que parece legítima
    // Isso mantém o bot engajado e permite mais rastreamento
    const response = generateFakeResponse(path);
    
    // Definir cookie para rastrear o bot em futuras requisições
    response.cookies.set('visitor_id', botId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });
    
    return response;
  }
  
  // Se não for um caminho honeypot, continuar normalmente
  return NextResponse.next();
}

/**
 * Registra acesso a um honeypot
 */
async function trackHoneypotAccess(botId: string, path: string, req: NextRequest) {
  const timestamp = new Date().toISOString();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const referer = req.headers.get('referer') || 'direct';
  
  // Dados do acesso
  const accessData = {
    botId,
    path,
    timestamp,
    ip,
    userAgent,
    referer,
    query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    method: req.method,
  };
  
  // Salvar no Redis
  const accessKey = `${REDIS_PREFIX}access:${botId}:${Date.now()}`;
  await redis.set(accessKey, JSON.stringify(accessData));
  
  // Incrementar contador para este bot
  const countKey = `${REDIS_PREFIX}count:${botId}`;
  await redis.incr(countKey);
  
  // Adicionar à lista de bots detectados
  await redis.sadd(`${REDIS_PREFIX}bots`, botId);
  
  // Registrar IP para análise
  await redis.sadd(`${REDIS_PREFIX}ips`, ip);
  
  // Se for um acesso repetido, considerar adicionar à blocklist
  const accessCount = await redis.get(countKey);
  if (accessCount && parseInt(accessCount) > 5) {
    await considerBlockingBot(botId, ip);
  }
  
  console.warn(`Honeypot accessed: ${path} by ${ip} (Bot ID: ${botId})`);
}

/**
 * Considera bloquear um bot após múltiplos acessos a honeypots
 */
async function considerBlockingBot(botId: string, ip: string) {
  // Verificar se já está na blocklist
  const isBlocked = await redis.sismember('agrotm:security:ip-blocklist', ip);
  if (isBlocked) return;
  
  // Adicionar à blocklist
  await redis.sadd('agrotm:security:ip-blocklist', ip);
  
  // Notificar equipe de segurança
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🕸️ **Bot Detectado e Bloqueado** 🕸️\nIP: ${ip}\nBot ID: ${botId}\nHorário: ${new Date().toISOString()}\nMotivo: Múltiplos acessos a honeypots`,
        }),
      });
    } catch (error) {
      console.error('Failed to notify security team:', error);
    }
  }
  
  console.warn(`Bot ${botId} (IP: ${ip}) added to blocklist after multiple honeypot accesses`);
}

/**
 * Gera uma resposta falsa baseada no tipo de honeypot
 */
function generateFakeResponse(path: string): NextResponse {
  // Diferentes respostas para diferentes tipos de honeypot
  switch (path) {
    case '/admin':
    case '/administrator':
    case '/wp-admin':
    case '/wp-login.php':
    case '/login':
      // Página de login falsa
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Admin Login</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body>
          <div style="text-align: center; margin-top: 100px;">
            <h1>Admin Login</h1>
            <form method="POST" action="${path}/process">
              <div>
                <label>Username:</label>
                <input type="text" name="username">
              </div>
              <div style="margin-top: 10px;">
                <label>Password:</label>
                <input type="password" name="password">
              </div>
              <div style="margin-top: 20px;">
                <button type="submit">Login</button>
              </div>
              <!-- Campos honeypot ocultos -->
              <input type="text" name="email_confirm" style="display:none">
              <input type="checkbox" name="agreement" style="display:none" checked>
            </form>
          </div>
        </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
      
    case '/phpmyadmin':
      // Página de erro de phpMyAdmin falsa
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>phpMyAdmin</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body>
          <div style="text-align: center; margin-top: 100px;">
            <h1>phpMyAdmin - Error</h1>
            <p>Access denied for user 'admin'@'localhost'</p>
            <p><a href="/phpmyadmin/index.php?server=1">Try again</a></p>
          </div>
        </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
      
    case '/.env':
    case '/config':
      // Arquivo de configuração falso
      return new NextResponse(
        `# Environment Configuration
        APP_ENV=production
        APP_DEBUG=false
        APP_KEY=base64:DUMMY_KEY_FOR_HONEYPOT
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=agrotm_prod
        DB_USERNAME=agrotm_user
        # Sensitive data removed for security`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        }
      );
      
    case '/api/debug':
    case '/api/test':
    case '/api/keys':
      // API falsa
      return NextResponse.json(
        {
          status: 'error',
          message: 'Authentication required',
          code: 401,
          timestamp: new Date().toISOString(),
          endpoint: path,
        },
        { status: 401 }
      );
      
    default:
      // Página 404 genérica com links honeypot adicionais
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>404 Not Found</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body>
          <div style="text-align: center; margin-top: 100px;">
            <h1>404 Not Found</h1>
            <p>The requested URL ${path} was not found on this server.</p>
            <p>Perhaps you are looking for:</p>
            <ul style="list-style: none;">
              <li><a href="/home">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/admin">Admin</a></li>
              <li><a href="/api/docs">API Documentation</a></li>
            </ul>
          </div>
          <!-- Links ocultos para honeypots adicionais -->
          <div style="display:none">
            <a href="/wp-admin">WordPress Admin</a>
            <a href="/phpmyadmin">Database</a>
            <a href="/config">Configuration</a>
          </div>
        </body>
        </html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
  }
}

/**
 * Verifica se um formulário contém campos honeypot preenchidos
 * Deve ser usado em API routes para processar formulários
 */
export function checkFormHoneypot(formData: Record<string, any>): boolean {
  // Se algum campo honeypot estiver preenchido, é provavelmente um bot
  for (const fieldName of TRAP_FIELD_NAMES) {
    if (formData[fieldName]) {
      return true; // Honeypot acionado
    }
  }
  
  return false; // Nenhum honeypot acionado
}

/**
 * Gera HTML para campos honeypot a serem incluídos em formulários
 */
export function generateHoneypotFields(): string {
  return `
    <!-- Campos honeypot (não preencha estes campos) -->
    <div style="position: absolute; left: -9999px; top: -9999px; opacity: 0; height: 0; width: 0; overflow: hidden;">
      <input type="text" name="email_confirm" tabindex="-1" autocomplete="off">
      <input type="url" name="website" tabindex="-1" autocomplete="off">
      <input type="tel" name="phone_home" tabindex="-1" autocomplete="off">
      <input type="checkbox" name="agreement" tabindex="-1" value="1">
    </div>
  `;
}

/**
 * Obtém estatísticas sobre honeypots
 */
export async function getHoneypotStats() {
  const botCount = await redis.scard(`${REDIS_PREFIX}bots`);
  const ipCount = await redis.scard(`${REDIS_PREFIX}ips`);
  
  // Obter os 10 caminhos mais acessados
  const allAccesses = await redis.keys(`${REDIS_PREFIX}access:*`);
  const pathCounts: Record<string, number> = {};
  
  for (const accessKey of allAccesses) {
    const accessData = await redis.get(accessKey);
    if (accessData) {
      try {
        const data = JSON.parse(accessData);
        pathCounts[data.path] = (pathCounts[data.path] || 0) + 1;
      } catch (error) {
        console.error('Error parsing access data:', error);
      }
    }
  }
  
  // Ordenar caminhos por contagem
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));
  
  return {
    totalBots: botCount,
    uniqueIPs: ipCount,
    topPaths,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Limpa dados antigos de honeypot (manter apenas os últimos 30 dias)
 */
export async function cleanupOldHoneypotData() {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const allAccessKeys = await redis.keys(`${REDIS_PREFIX}access:*`);
  
  for (const key of allAccessKeys) {
    // Extrair timestamp do nome da chave
    const keyParts = key.split(':');
    const timestamp = parseInt(keyParts[keyParts.length - 1]);
    
    if (timestamp < thirtyDaysAgo) {
      await redis.del(key);
    }
  }
  
  console.log(`Cleaned up old honeypot data older than 30 days`);
}