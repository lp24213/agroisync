// Sistema de Proteção Contra Ataques Avançados - AGROISYNC
// Proteção contra DDoS, Brute Force, SQL Injection avançada e outros ataques

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { SecurityLog } from '../models/SecurityLog.js';
import { AuditLog } from '../models/AuditLog.js';

class AdvancedSecuritySystem {
  constructor() {
    this.attackPatterns = new Map();
    this.blockedIPs = new Map();
    this.suspiciousUsers = new Map();
    this.failedLogins = new Map();
    this.requestCounts = new Map();
    
    // Configurações de segurança
    this.config = {
      maxFailedLogins: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutos
      maxRequestsPerMinute: 60,
      maxRequestsPerHour: 1000,
      suspiciousThreshold: 10,
      blockDuration: 60 * 60 * 1000, // 1 hora
      cleanupInterval: 5 * 60 * 1000 // 5 minutos
    };
    
    this.startCleanup();
  }

  // Iniciar limpeza automática
  startCleanup() {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, this.config.cleanupInterval);
  }

  // Limpar entradas expiradas
  cleanupExpiredEntries() {
    const now = Date.now();
    
    // Limpar IPs bloqueados expirados
    for (const [ip, data] of this.blockedIPs.entries()) {
      if (now > data.expiresAt) {
        this.blockedIPs.delete(ip);
      }
    }
    
    // Limpar tentativas de login expiradas
    for (const [key, data] of this.failedLogins.entries()) {
      if (now > data.expiresAt) {
        this.failedLogins.delete(key);
      }
    }
    
    // Limpar contadores de requisição expirados
    for (const [key, data] of this.requestCounts.entries()) {
      if (now > data.expiresAt) {
        this.requestCounts.delete(key);
      }
    }
  }

  // Detectar ataques DDoS
  detectDDOS(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const key = `ddos_${ip}`;
    
    // Verificar se IP está bloqueado
    if (this.blockedIPs.has(ip)) {
      const blockData = this.blockedIPs.get(ip);
      if (now < blockData.expiresAt) {
        return res.status(429).json({
          success: false,
          message: 'IP bloqueado por atividade suspeita',
          retryAfter: Math.ceil((blockData.expiresAt - now) / 1000)
        });
      } else {
        this.blockedIPs.delete(ip);
      }
    }
    
    // Contar requisições
    if (!this.requestCounts.has(key)) {
      this.requestCounts.set(key, {
        count: 1,
        firstRequest: now,
        expiresAt: now + (60 * 1000) // 1 minuto
      });
    } else {
      const data = this.requestCounts.get(key);
      data.count++;
      
      // Verificar se excedeu o limite
      if (data.count > this.config.maxRequestsPerMinute) {
        this.blockIP(ip, 'DDoS Attack Detected');
        return res.status(429).json({
          success: false,
          message: 'Muitas requisições detectadas. IP bloqueado temporariamente.'
        });
      }
    }
    
    next();
  }

  // Detectar ataques de força bruta
  detectBruteForce(req, res, next) {
    const ip = req.ip;
    const email = req.body.email;
    const key = `bruteforce_${ip}_${email}`;
    
    if (!this.failedLogins.has(key)) {
      this.failedLogins.set(key, {
        count: 0,
        lastAttempt: Date.now(),
        expiresAt: Date.now() + this.config.lockoutDuration
      });
    }
    
    const data = this.failedLogins.get(key);
    
    // Verificar se excedeu tentativas
    if (data.count >= this.config.maxFailedLogins) {
      const timeLeft = data.expiresAt - Date.now();
      if (timeLeft > 0) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas de login. Tente novamente em ' + Math.ceil(timeLeft / 1000) + ' segundos.'
        });
      } else {
        // Reset contador se expirou
        this.failedLogins.delete(key);
      }
    }
    
    next();
  }

  // Registrar tentativa de login falhada
  recordFailedLogin(ip, email) {
    const key = `bruteforce_${ip}_${email}`;
    
    if (!this.failedLogins.has(key)) {
      this.failedLogins.set(key, {
        count: 0,
        lastAttempt: Date.now(),
        expiresAt: Date.now() + this.config.lockoutDuration
      });
    }
    
    const data = this.failedLogins.get(key);
    data.count++;
    data.lastAttempt = Date.now();
    
    // Log de segurança
    this.logSecurityEvent('BRUTE_FORCE_ATTEMPT', 'medium', {
      ip,
      email,
      attemptCount: data.count,
      maxAttempts: this.config.maxFailedLogins
    });
  }

  // Detectar SQL Injection avançada
  detectAdvancedSQLInjection(req, res, next) {
    const suspiciousPatterns = [
      // Union-based injection
      /union\s+select.*from/i,
      /union\s+all\s+select/i,
      
      // Boolean-based blind injection
      /and\s+1\s*=\s*1/i,
      /and\s+1\s*=\s*2/i,
      /or\s+1\s*=\s*1/i,
      
      // Time-based blind injection
      /sleep\s*\(\s*\d+\s*\)/i,
      /waitfor\s+delay/i,
      /benchmark\s*\(/i,
      
      // Error-based injection
      /extractvalue\s*\(/i,
      /updatexml\s*\(/i,
      /exp\s*\(\s*~\s*\(/i,
      
      // Stacked queries
      /;\s*(insert|update|delete|drop|create|alter)/i,
      
      // Comment-based injection
      /\/\*.*\*\//i,
      /--\s*$/i,
      /#\s*$/i,
      
      // Function-based injection
      /database\s*\(/i,
      /version\s*\(/i,
      /user\s*\(/i,
      /current_user\s*\(/i,
      
      // Information schema
      /information_schema/i,
      /sys\.databases/i,
      /sys\.tables/i
    ];
    
    const requestData = JSON.stringify({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });
    
    let attackDetected = false;
    let attackType = '';
    
    suspiciousPatterns.forEach((pattern, index) => {
      if (pattern.test(requestData)) {
        attackDetected = true;
        const attackTypes = [
          'UNION_INJECTION',
          'BOOLEAN_BLIND_INJECTION',
          'TIME_BLIND_INJECTION',
          'ERROR_BASED_INJECTION',
          'STACKED_QUERIES',
          'COMMENT_INJECTION',
          'FUNCTION_INJECTION',
          'INFORMATION_SCHEMA_ACCESS'
        ];
        attackType = attackTypes[index] || 'ADVANCED_SQL_INJECTION';
      }
    });
    
    if (attackDetected) {
      this.blockIP(req.ip, `Advanced SQL Injection: ${attackType}`);
      
      this.logSecurityEvent('ADVANCED_SQL_INJECTION', 'critical', {
        attackType,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestData: requestData.substring(0, 1000)
      });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: padrão de ataque avançado detectado'
      });
    }
    
    next();
  }

  // Detectar ataques XSS avançados
  detectAdvancedXSS(req, res, next) {
    const xssPatterns = [
      // Script injection
      /<script[^>]*>.*?<\/script>/gi,
      /javascript\s*:/gi,
      /vbscript\s*:/gi,
      /data\s*:\s*text\/html/gi,
      
      // Event handlers
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi,
      
      // CSS injection
      /expression\s*\(/gi,
      /url\s*\(\s*javascript\s*:/gi,
      
      // SVG injection
      /<svg[^>]*>.*?<\/svg>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi,
      
      // Template injection
      /\{\{.*\}\}/gi,
      /\{%.*%\}/gi,
      /\{\{.*\|.*\}\}/gi,
      
      // DOM-based XSS
      /document\.write\s*\(/gi,
      /innerHTML\s*=/gi,
      /outerHTML\s*=/gi,
      /eval\s*\(/gi,
      /Function\s*\(/gi
    ];
    
    const requestData = JSON.stringify({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });
    
    let attackDetected = false;
    let attackType = '';
    
    xssPatterns.forEach((pattern, index) => {
      if (pattern.test(requestData)) {
        attackDetected = true;
        const attackTypes = [
          'SCRIPT_INJECTION',
          'EVENT_HANDLER_INJECTION',
          'CSS_INJECTION',
          'SVG_INJECTION',
          'TEMPLATE_INJECTION',
          'DOM_BASED_XSS'
        ];
        attackType = attackTypes[index] || 'ADVANCED_XSS';
      }
    });
    
    if (attackDetected) {
      this.blockIP(req.ip, `Advanced XSS: ${attackType}`);
      
      this.logSecurityEvent('ADVANCED_XSS', 'critical', {
        attackType,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestData: requestData.substring(0, 1000)
      });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: padrão XSS avançado detectado'
      });
    }
    
    next();
  }

  // Detectar ataques de path traversal
  detectPathTraversal(req, res, next) {
    const traversalPatterns = [
      /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c/gi,
      /\.\.%252f|\.\.%255c/gi,
      /\.\.%c0%af|\.\.%c1%9c/gi,
      /\.\.%2e%2e%2f|\.\.%2e%2e%5c/gi,
      /\.\.%252e%252e%252f/gi,
      /\.\.%252e%252e%255c/gi,
      /\.\.%c0%ae%c0%ae%c0%af/gi,
      /\.\.%c0%ae%c0%ae%c0%5c/gi
    ];
    
    const requestData = JSON.stringify({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });
    
    let attackDetected = false;
    
    traversalPatterns.forEach(pattern => {
      if (pattern.test(requestData)) {
        attackDetected = true;
      }
    });
    
    if (attackDetected) {
      this.blockIP(req.ip, 'Path Traversal Attack');
      
      this.logSecurityEvent('PATH_TRAVERSAL', 'high', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestData: requestData.substring(0, 1000)
      });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: tentativa de path traversal detectada'
      });
    }
    
    next();
  }

  // Bloquear IP
  blockIP(ip, reason) {
    const now = Date.now();
    this.blockedIPs.set(ip, {
      reason,
      blockedAt: now,
      expiresAt: now + this.config.blockDuration
    });
    
    console.log(`🚫 IP bloqueado: ${ip} - Motivo: ${reason}`);
  }

  // Verificar se IP está bloqueado
  isIPBlocked(ip) {
    if (!this.blockedIPs.has(ip)) {
      return false;
    }
    
    const blockData = this.blockedIPs.get(ip);
    const now = Date.now();
    
    if (now > blockData.expiresAt) {
      this.blockedIPs.delete(ip);
      return false;
    }
    
    return true;
  }

  // Log de evento de segurança
  async logSecurityEvent(eventType, severity, details) {
    try {
      await SecurityLog.create({
        eventType,
        severity,
        description: `Security event: ${eventType}`,
        details: JSON.stringify(details),
        timestamp: new Date(),
        ipAddress: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown'
      });
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }

  // Obter estatísticas de segurança
  getSecurityStats() {
    return {
      blockedIPs: this.blockedIPs.size,
      failedLogins: this.failedLogins.size,
      requestCounts: this.requestCounts.size,
      suspiciousUsers: this.suspiciousUsers.size,
      config: this.config
    };
  }

  // Middleware de proteção completa
  getProtectionMiddleware() {
    return [
      this.detectDDOS.bind(this),
      this.detectBruteForce.bind(this),
      this.detectAdvancedSQLInjection.bind(this),
      this.detectAdvancedXSS.bind(this),
      this.detectPathTraversal.bind(this)
    ];
  }
}

// Instância única
const advancedSecuritySystem = new AdvancedSecuritySystem();

export default advancedSecuritySystem;
