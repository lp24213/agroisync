/**
 * Web Application Firewall (WAF) Middleware
 * Protege a aplicação contra ataques comuns como:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - CSRF (Cross-Site Request Forgery)
 * - SSRF (Server-Side Request Forgery)
 * - Command Injection
 * - Path Traversal
 */

import { NextRequest, NextResponse } from 'next/server';
import xss from 'xss';
import { v4 as uuidv4 } from 'uuid';

// Padrões de ataque conhecidos (expressões regulares)
const ATTACK_PATTERNS = {
  sqlInjection: /('|\")(\s)*(OR|AND)(\s)*('|\"|[0-9])|UNION(\s)+SELECT|INSERT(\s)+INTO|SELECT(\s)+FROM|DELETE(\s)+FROM|DROP(\s)+TABLE|EXEC(\s)+\(|EXEC(\s)+SP_/i,
  xss: /<script[^>]*>[\s\S]*?<\/script>|<[^>]*on\w+=[^>]*>|javascript:|\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\[0-7]{3}/i,
  pathTraversal: /\.\.(\/|\\)|\.\.%2f|\.\.%5c/i,
  commandInjection: /;\s*\w+\s*(\/|\||&|\$|\()|`.*`|\$\(.*\)/i,
  ssrf: /^(file|gopher|phar|php|glob|zip|data|expect):/i,
};

// Lista de cabeçalhos HTTP que devem ser verificados
const HEADERS_TO_CHECK = [
  'user-agent',
  'referer',
  'x-forwarded-for',
  'x-real-ip',
  'cookie',
];

/**
 * Middleware WAF principal
 */
export function wafMiddleware(req: NextRequest) {
  // Gerar ID de rastreamento para esta requisição
  const requestId = uuidv4();
  
  try {
    // Verificar cabeçalhos
    const headersResult = checkHeaders(req, requestId);
    if (headersResult) return headersResult;
    
    // Verificar parâmetros da URL
    const urlResult = checkUrl(req, requestId);
    if (urlResult) return urlResult;
    
    // Verificar corpo da requisição para métodos POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      // Nota: A verificação do corpo é assíncrona e será feita na API route
      // Aqui apenas adicionamos um cabeçalho para sinalizar que a verificação é necessária
      const response = NextResponse.next();
      response.headers.set('X-WAF-Check-Body', 'true');
      response.headers.set('X-Request-ID', requestId);
      return response;
    }
    
    // Continuar com a requisição
    const response = NextResponse.next();
    response.headers.set('X-Request-ID', requestId);
    return response;
  } catch (error) {
    logger.error(`[WAF] Error processing request ${requestId}:`, error);
    return blockRequest(requestId, 'Internal security error');
  }
}

/**
 * Verifica cabeçalhos HTTP em busca de padrões de ataque
 */
function checkHeaders(req: NextRequest, requestId: string) {
  for (const header of HEADERS_TO_CHECK) {
    const value = req.headers.get(header);
    if (!value) continue;
    
    // Verificar cada padrão de ataque
    for (const [attackType, pattern] of Object.entries(ATTACK_PATTERNS)) {
      if (pattern.test(value)) {
        logAttack(requestId, 'header', header, attackType, value);
        return blockRequest(requestId, 'Malicious header detected');
      }
    }
  }
  
  return null;
}

/**
 * Verifica a URL e parâmetros de query em busca de padrões de ataque
 */
function checkUrl(req: NextRequest, requestId: string) {
  // Verificar caminho da URL
  const path = req.nextUrl.pathname;
  
  for (const [attackType, pattern] of Object.entries(ATTACK_PATTERNS)) {
    if (pattern.test(path)) {
      logAttack(requestId, 'url_path', 'path', attackType, path);
      return blockRequest(requestId, 'Malicious URL path detected');
    }
  }
  
  // Verificar parâmetros de query
  const params = req.nextUrl.searchParams;
  
  for (const [key, value] of params.entries()) {
    for (const [attackType, pattern] of Object.entries(ATTACK_PATTERNS)) {
      if (pattern.test(value)) {
        logAttack(requestId, 'query_param', key, attackType, value);
        return blockRequest(requestId, 'Malicious query parameter detected');
      }
    }
  }
  
  return null;
}

/**
 * Verifica o corpo da requisição em busca de padrões de ataque
 * Esta função deve ser chamada nas API routes para requisições POST/PUT/PATCH
 */
export async function checkRequestBody(body: any, requestId: string) {
  if (!body) return { isValid: true };
  
  // Converter para string se for um objeto
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  
  // Verificar cada padrão de ataque
  for (const [attackType, pattern] of Object.entries(ATTACK_PATTERNS)) {
    if (pattern.test(bodyStr)) {
      logAttack(requestId, 'request_body', 'body', attackType, bodyStr.substring(0, 100) + '...');
      return { 
        isValid: false, 
        reason: `Malicious content detected in request body: ${attackType}` 
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Sanitiza dados de entrada para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return xss(input, {
    whiteList: {}, // Não permitir nenhuma tag HTML
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  });
}

/**
 * Sanitiza um objeto inteiro recursivamente
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeObject(value);
  }
  
  return result;
}

/**
 * Bloqueia a requisição e retorna uma resposta de erro
 */
function blockRequest(requestId: string, reason: string) {
      logger.warn(`[WAF] Blocked request ${requestId}: ${reason}`);
  
  return NextResponse.json(
    { error: 'Security violation detected', requestId },
    { 
      status: 403,
      headers: {
        'X-Request-ID': requestId,
      },
    }
  );
}

/**
 * Registra tentativas de ataque para análise posterior
 */
function logAttack(requestId: string, source: string, field: string, attackType: string, value: string) {
  // Aqui você pode implementar o registro em um sistema de logs como Sentry, Datadog, etc.
      logger.error(`[WAF] Attack detected! RequestID: ${requestId}, Source: ${source}, Field: ${field}, Type: ${attackType}`);
  
  // Exemplo de envio para um serviço de monitoramento (implementação simplificada)
  try {
    const securityLogEndpoint = process.env.SECURITY_LOG_ENDPOINT;
    if (securityLogEndpoint) {
      fetch(securityLogEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          timestamp: new Date().toISOString(),
          source,
          field,
          attackType,
          value: value.substring(0, 200), // Limitar tamanho do valor para o log
        }),
      }).catch(err => logger.error('Failed to send security log:', err));
    }
  } catch (error) {
    logger.error('Error logging attack:', error);
  }
}

/**
 * Gera um token CSRF para proteção de formulários
 */
export function generateCsrfToken(): string {
  return uuidv4();
}

/**
 * Valida um token CSRF
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}