// ===== MELHORIAS DE SEGURANÇA ADICIONAIS =====

import { createSecurityLog } from '../utils/securityLogger.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { getClientIP } from '../utils/ipUtils.js';

// ===== CONFIGURAÇÕES DE SEGURANÇA AVANÇADA =====

const securityEnhancements = {
  // Rate limiting mais restritivo para endpoints sensíveis
  sensitiveEndpoints: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/contact',
    '/api/upload'
  ],

  // Headers de segurança adicionais
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Padrões de ataque adicionais
  attackPatterns: [
    // SQL Injection avançado
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b.*\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,

    // XSS avançado
    /<script[^>]*>.*?<\/script>|<iframe[^>]*>.*?<\/iframe>|<object[^>]*>.*?<\/object>/gi,

    // Command injection
    /(\b(cmd|command|exec|system|eval|setTimeout|setInterval|Function|new\s+Function)\b)/i,

    // Path traversal avançado
    /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c|\.\.%252f|\.\.%255c/i,

    // LDAP injection
    /(\b(\(|\)|\*|\||&|!|~)\b)/i,

    // NoSQL injection avançado
    /(\$where|\$ne|\$gt|\$lt|\$regex|\$exists|\$in|\$nin|\$all|\$elemMatch)/i,

    // Template injection
    /(\{\{.*\}\}|\{%.*%\}|<%.*%>)/i,

    // Code injection
    /(\beval\s*\(|\bFunction\s*\(|\bnew\s+Function|\bsetTimeout\s*\(|\bsetInterval\s*\()/i,

    // SSRF
    /(file:\/\/|ftp:\/\/|gopher:\/\/|ldap:\/\/|dict:\/\/)/i,

    // XXE
    /<!DOCTYPE\s+[^>]*SYSTEM\s+[^>]*>/i
  ],

  // IPs suspeitos conhecidos
  suspiciousIPs: new Set([
    // Adicionar IPs suspeitos aqui
  ]),

  // User agents suspeitos
  suspiciousUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i
  ]
};

// ===== MIDDLEWARE DE DETECÇÃO AVANÇADA DE ATAQUES =====

export const advancedAttackDetection = async (req, res, next) => {
  try {
    const clientIP = getClientIP(req);
    const userAgent = req.get('User-Agent') || '';
    const requestData = JSON.stringify({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    // Verificar IP suspeito
    if (securityEnhancements.suspiciousIPs.has(clientIP)) {
      await createSecurityLog({
        eventType: 'suspicious_ip_blocked',
        severity: 'high',
        ipAddress: clientIP,
        userAgent,
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        description: 'IP suspeito bloqueado'
      });

      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Verificar User Agent suspeito
    const isSuspiciousUA = securityEnhancements.suspiciousUserAgents.some(pattern =>
      pattern.test(userAgent)
    );

    if (isSuspiciousUA && !userAgent.includes('Mozilla')) {
      await createSecurityLog({
        eventType: 'suspicious_user_agent',
        severity: 'medium',
        ipAddress: clientIP,
        userAgent,
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        description: 'User Agent suspeito detectado'
      });
    }

    // Verificar padrões de ataque
    let attackDetected = false;
    let attackType = '';

    securityEnhancements.attackPatterns.forEach((pattern, index) => {
      if (pattern.test(requestData)) {
        attackDetected = true;
        const attackTypes = [
          'SQL_INJECTION_ADVANCED',
          'XSS_ADVANCED',
          'COMMAND_INJECTION',
          'PATH_TRAVERSAL_ADVANCED',
          'LDAP_INJECTION',
          'NOSQL_INJECTION_ADVANCED',
          'TEMPLATE_INJECTION',
          'CODE_INJECTION',
          'SSRF',
          'XXE'
        ];
        attackType = attackTypes[index] || 'UNKNOWN_ADVANCED_ATTACK';
      }
    });

    if (attackDetected) {
      await createSecurityLog({
        eventType: 'advanced_attack_detected',
        severity: 'critical',
        ipAddress: clientIP,
        userAgent,
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        requestHeaders: req.headers,
        requestBody: requestData.substring(0, 1000),
        description: `Ataque avançado detectado: ${attackType}`,
        details: {
          attackType,
          requestData: requestData.substring(0, 500)
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Acesso negado: atividade suspeita detectada'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na detecção avançada de ataques:', error);
    next();
  }
};

// ===== RATE LIMITING PARA ENDPOINTS SENSÍVEIS =====

export const sensitiveEndpointRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    const clientIP = getClientIP(req);

    await createSecurityLog({
      eventType: 'rate_limit_exceeded_sensitive',
      severity: 'high',
      ipAddress: clientIP,
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      description: 'Rate limit excedido em endpoint sensível'
    });

    res.status(429).json({
      success: false,
      message: 'Muitas tentativas. Tente novamente em 15 minutos.',
      retryAfter: '15 minutos'
    });
  }
});

// ===== MIDDLEWARE DE HEADERS DE SEGURANÇA =====

export const securityHeadersMiddleware = (req, res, next) => {
  // Aplicar headers de segurança
  Object.entries(securityEnhancements.securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Header personalizado para identificação
  res.setHeader('X-Security-Enhanced', 'true');
  res.setHeader('X-Security-Version', '1.0.0');

  next();
};

// ===== MIDDLEWARE DE VALIDAÇÃO DE ORIGEM =====

export const originValidationMiddleware = (req, res, next) => {
  const origin = req.get('Origin');
  const referer = req.get('Referer');

  // Lista de origens permitidas
  const allowedOrigins = [
    'https://agroisync.com',
    'https://www.agroisync.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  // Verificar origem para requisições POST, PUT, DELETE
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      createSecurityLog({
        eventType: 'invalid_origin',
        severity: 'medium',
        ipAddress: getClientIP(req),
        userAgent: req.get('User-Agent'),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        description: `Origem inválida: ${origin}`,
        details: { origin, referer }
      });

      return res.status(403).json({
        success: false,
        message: 'Origem não autorizada'
      });
    }
  }

  next();
};

// ===== MIDDLEWARE DE MONITORAMENTO DE SEGURANÇA =====

export const securityMonitoringMiddleware = async (req, res, next) => {
  const startTime = Date.now();
  const clientIP = getClientIP(req);

  // Interceptar resposta
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    // Log de requisições suspeitas
    if (res.statusCode >= 400 || duration > 5000) {
      createSecurityLog({
        eventType: 'suspicious_request',
        severity: res.statusCode >= 500 ? 'high' : 'medium',
        ipAddress: clientIP,
        userAgent: req.get('User-Agent'),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        responseStatus: res.statusCode,
        responseTime: duration,
        description: `Requisição suspeita: ${res.statusCode} em ${duration}ms`
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

// ===== MIDDLEWARE PRINCIPAL DE SEGURANÇA =====

export const securityEnhancementsMiddleware = [
  securityHeadersMiddleware,
  originValidationMiddleware,
  advancedAttackDetection,
  securityMonitoringMiddleware
];

// ===== FUNÇÕES DE UTILIDADE =====

export const addSuspiciousIP = ip => {
  securityEnhancements.suspiciousIPs.add(ip);
};

export const removeSuspiciousIP = ip => {
  securityEnhancements.suspiciousIPs.delete(ip);
};

export const getSecurityStats = () => {
  return {
    suspiciousIPsCount: securityEnhancements.suspiciousIPs.size,
    attackPatternsCount: securityEnhancements.attackPatterns.length,
    sensitiveEndpointsCount: securityEnhancements.sensitiveEndpoints.length
  };
};

export default securityEnhancementsMiddleware;
