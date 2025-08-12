/**
 * CORS Strict Middleware
 * Implementa políticas rigorosas de Cross-Origin Resource Sharing
 * para proteger contra ataques de cross-site
 */

import { NextRequest, NextResponse } from 'next/server';

// Origens permitidas (domínios confiáveis)
const ALLOWED_ORIGINS = [
  'https://agroisync.com',
  'https://app.agroisync.com',
  'https://api.agroisync.com',
  'https://dashboard.agroisync.com',
];

// Adicionar localhost para ambientes de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:3001');
  ALLOWED_ORIGINS.push('http://127.0.0.1:3000');
}

// Métodos HTTP permitidos
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

// Cabeçalhos permitidos
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'X-CSRF-Token',
  'X-Request-ID',
  'Accept',
];

// Cabeçalhos expostos para o cliente
const EXPOSED_HEADERS = [
  'X-Request-ID',
  'X-RateLimit-Limit',
  'X-RateLimit-Remaining',
  'X-RateLimit-Reset',
];

/**
 * Middleware para configuração estrita de CORS
 */
export function corsStrictMiddleware(req: NextRequest) {
  // Obter a origem da requisição
  const origin = req.headers.get('origin') || '';
  
  // Verificar se a origem está na lista de permitidas
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
  
  // Para requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 }); // No content
    
    // Configurar cabeçalhos CORS para preflight
    setCorsHeaders(response, isAllowedOrigin ? origin : '');
    
    return response;
  }
  
  // Para outras requisições, continuar o processamento
  const response = NextResponse.next();
  
  // Configurar cabeçalhos CORS
  setCorsHeaders(response, isAllowedOrigin ? origin : '');
  
  return response;
}

/**
 * Configura os cabeçalhos CORS na resposta
 */
function setCorsHeaders(response: NextResponse, origin: string) {
  // Se a origem for permitida, configurar Access-Control-Allow-Origin
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Se não for uma origem permitida, usar uma origem restritiva
    // Isso efetivamente bloqueia requisições cross-origin não autorizadas
    response.headers.set('Access-Control-Allow-Origin', 'null');
  }
  
  // Configurar outros cabeçalhos CORS
  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  response.headers.set('Access-Control-Expose-Headers', EXPOSED_HEADERS.join(', '));
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 horas
  
  // Adicionar cabeçalhos de segurança adicionais
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Política de referenciador
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP) - Exemplo básico
  // Em produção, você deve personalizar isso de acordo com suas necessidades
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' https://cdn.agroisync.com; style-src 'self' https://cdn.agroisync.com; img-src 'self' data: https://cdn.agroisync.com; connect-src 'self' https://api.agroisync.com; font-src 'self' https://cdn.agroisync.com; object-src 'none'; media-src 'self' https://cdn.agroisync.com; frame-src 'self';"
    );
  }
  
  return response;
}

/**
 * Verifica se uma origem é permitida
 */
export function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Adiciona uma nova origem à lista de permitidas (útil para testes ou ambientes dinâmicos)
 */
export function addAllowedOrigin(origin: string): void {
  if (!ALLOWED_ORIGINS.includes(origin)) {
    ALLOWED_ORIGINS.push(origin);
    logger.info(`Added ${origin} to allowed CORS origins`);
  }
}

/**
 * Remove uma origem da lista de permitidas
 */
export function removeAllowedOrigin(origin: string): void {
  const index = ALLOWED_ORIGINS.indexOf(origin);
  if (index !== -1) {
    ALLOWED_ORIGINS.splice(index, 1);
    logger.info(`Removed ${origin} from allowed CORS origins`);
  }
}

/**
 * Obtém a lista completa de origens permitidas
 */
export function getAllowedOrigins(): string[] {
  return [...ALLOWED_ORIGINS];
}