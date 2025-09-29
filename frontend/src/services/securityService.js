// Serviço de Segurança Avançada - AGROSYNC
// Proteção contra DDoS, bots maliciosos e ataques cibernéticos

class SecurityService {
  constructor() {
    this.requestLog = new Map();
    this.suspiciousIPs = new Set();
    this.blockedIPs = new Set();
    this.rateLimits = {
      api: { max: 100, window: 60000 }, // 100 requests por minuto
      auth: { max: 5, window: 300000 }, // 5 tentativas por 5 minutos
      general: { max: 1000, window: 60000 } // 1000 requests por minuto
    };

    this.initSecurity();
  }

  // Inicializar sistema de segurança
  initSecurity() {
    this.setupEventListeners();
    this.startSecurityMonitoring();
    this.validateEnvironment();
  }

  // Configurar listeners de segurança
  setupEventListeners() {
    // Proteção contra XSS
    document.addEventListener('DOMContentLoaded', () => {
      this.sanitizeDOM();
    });

    // Proteção contra ataques de timing
    this.setupTimingProtection();

    // Proteção contra clickjacking
    this.preventClickjacking();

    // Monitor de atividade suspeita
    this.monitorSuspiciousActivity();
  }

  // Sanitizar DOM contra XSS
  sanitizeDOM() {
    const dangerousElements = document.querySelectorAll('script, iframe, object, embed');
    dangerousElements.forEach(el => {
      if (el.src && !this.isAllowedDomain(el.src)) {
        el.remove();
        console.warn('Removido elemento perigoso:', el);
      }
    });
  }

  // Verificar domínios permitidos
  isAllowedDomain(url) {
    const allowedDomains = [
      'agroisync.com',
      'cloudflare.com',
      'googleapis.com',
      'gstatic.com',
      'ipapi.co',
      'nominatim.openstreetmap.org',
      'servicodados.ibge.gov.br'
    ];

    try {
      const domain = new URL(url).hostname;
      return allowedDomains.some(allowed => domain.includes(allowed));
    } catch {
      return false;
    }
  }

  // Proteção contra ataques de timing
  setupTimingProtection() {
    let lastAction = Date.now();
    const minInterval = 100; // 100ms mínimo entre ações

    document.addEventListener('click', e => {
      const now = Date.now();
      if (now - lastAction < minInterval) {
        e.preventDefault();
        this.logSuspiciousActivity('Timing attack detected');
        return false;
      }
      lastAction = now;
    });
  }

  // Prevenir clickjacking
  preventClickjacking() {
    if (window.self !== window.top) {
      window.top.location = window.self.location;
      throw new Error('Clickjacking attempt detected');
    }
  }

  // Monitor de atividade suspeita
  monitorSuspiciousActivity() {
    let activityCount = 0;
    const maxActivity = 1000;
    const resetInterval = 60000; // 1 minuto

    const activityEvents = ['click', 'keypress', 'mousemove', 'scroll'];

    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        activityCount++;

        if (activityCount > maxActivity) {
          this.logSuspiciousActivity(`Excessive ${eventType} activity detected`);
          this.triggerSecurityAlert('Suspicious activity detected');
        }
      });
    });

    // Reset contador a cada minuto
    setInterval(() => {
      activityCount = 0;
    }, resetInterval);
  }

  // Rate Limiting por IP
  checkRateLimit(ip, endpoint = 'general') {
    const now = Date.now();
    const limit = this.rateLimits[endpoint];

    if (!this.requestLog.has(ip)) {
      this.requestLog.set(ip, []);
    }

    const requests = this.requestLog.get(ip);
    const validRequests = requests.filter(time => now - time < limit.window);

    if (validRequests.length >= limit.max) {
      this.blockIP(ip, `Rate limit exceeded for ${endpoint}`);
      return false;
    }

    validRequests.push(now);
    this.requestLog.set(ip, validRequests);
    return true;
  }

  // Bloquear IP malicioso
  blockIP(ip, reason) {
    this.blockedIPs.add(ip);
    this.logSecurityEvent('IP_BLOCKED', { ip, reason, timestamp: new Date().toISOString() });

    // Notificar Cloudflare (se disponível)
    if (window.Cloudflare) {
      window.Cloudflare.blockIP(ip);
    }
  }

  // Detectar bots maliciosos
  detectMaliciousBot() {
    const userAgent = navigator.userAgent;
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /phantomjs/i,
      /headless/i,
      /selenium/i
    ];

    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    if (isBot) {
      this.logSecurityEvent('BOT_DETECTED', { userAgent, timestamp: new Date().toISOString() });
      return true;
    }

    return false;
  }

  // Validação de ambiente
  validateEnvironment() {
    // Verificar se estamos em iframe
    if (window.self !== window.top) {
      throw new Error('Security: Application cannot run in iframe');
    }

    // Verificar console aberto (técnica anti-debug)
    const devtools = { open: false, orientation: null };

    setInterval(() => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.logSecurityEvent('DEVTOOLS_OPENED', { timestamp: new Date().toISOString() });
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  // Monitoramento de segurança contínuo
  startSecurityMonitoring() {
    setInterval(() => {
      this.cleanupOldLogs();
      this.analyzeThreats();
      this.updateSecurityMetrics();
    }, 30000); // A cada 30 segundos
  }

  // Limpar logs antigos
  cleanupOldLogs() {
    const now = Date.now();
    const maxAge = 300000; // 5 minutos

    for (const [ip, requests] of this.requestLog.entries()) {
      const validRequests = requests.filter(time => now - time < maxAge);
      if (validRequests.length === 0) {
        this.requestLog.delete(ip);
      } else {
        this.requestLog.set(ip, validRequests);
      }
    }
  }

  // Análise de ameaças
  analyzeThreats() {
    const threats = [];

    // Verificar IPs com muitas requisições
    for (const [ip, requests] of this.requestLog.entries()) {
      if (requests.length > 500) {
        threats.push({ type: 'HIGH_TRAFFIC', ip, count: requests.length });
      }
    }

    // Verificar IPs bloqueados
    if (this.blockedIPs.size > 100) {
      threats.push({ type: 'MASS_BLOCKING', count: this.blockedIPs.size });
    }

    if (threats.length > 0) {
      this.triggerSecurityAlert('Multiple threats detected', threats);
    }
  }

  // Atualizar métricas de segurança
  updateSecurityMetrics() {
    const metrics = {
      totalRequests: Array.from(this.requestLog.values()).reduce((sum, requests) => sum + requests.length, 0),
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      timestamp: new Date().toISOString()
    };

    // Enviar métricas para sistema de monitoramento (se disponível)
    this.sendSecurityMetrics(metrics);
  }

  // Enviar métricas de segurança
  sendSecurityMetrics(metrics) {
    // Integração com Cloudflare Analytics
    if (window.Cloudflare && window.Cloudflare.analytics) {
      window.Cloudflare.analytics.track('security_metrics', metrics);
    }

    // Log local para auditoria
    console.log('Security Metrics:', metrics);
  }

  // Log de eventos de segurança
  logSecurityEvent(type, data) {
    const event = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Enviar para sistema de auditoria
    this.sendAuditLog(event);

    // Log local
    console.warn('Security Event:', event);
  }

  // Log de atividade suspeita
  logSuspiciousActivity(description) {
    this.logSecurityEvent('SUSPICIOUS_ACTIVITY', { description });
  }

  // Enviar log de auditoria
  sendAuditLog(event) {
    // Integração com sistema de auditoria
    if (window.auditLogger) {
      window.auditLogger.log(event);
    }

    // Backup local
    this.storeLocalAuditLog(event);
  }

  // Armazenar log localmente
  storeLocalAuditLog(event) {
    try {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.push(event);

      // Manter apenas os últimos 1000 logs
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }

      localStorage.setItem('security_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error storing audit log:', error);
    }
  }

  // Disparar alerta de segurança
  triggerSecurityAlert(message, data = {}) {
    const alert = {
      message,
      data,
      timestamp: new Date().toISOString(),
      severity: 'HIGH'
    };

    // Notificar administradores
    this.notifyAdmins(alert);

    // Log do alerta
    this.logSecurityEvent('SECURITY_ALERT', alert);

    // Ações automáticas de proteção
    this.activateEmergencyProtection();
  }

  // Notificar administradores
  notifyAdmins(alert) {
    // Integração com sistema de notificação
    if (window.notificationService) {
      window.notificationService.sendAlert(alert);
    }

    // Email de emergência (se configurado)
    this.sendEmergencyEmail(alert);
  }

  // Enviar email de emergência
  sendEmergencyEmail(alert) {
    // Implementar integração com serviço de email
    console.warn('Emergency email should be sent:', alert);
  }

  // Ativar proteção de emergência
  activateEmergencyProtection() {
    // Bloquear todas as novas conexões
    this.emergencyMode = true;

    // Redirecionar para página de manutenção se necessário
    if (this.shouldRedirectToMaintenance()) {
      window.location.href = '/maintenance';
    }

    // Notificar Cloudflare
    if (window.Cloudflare) {
      window.Cloudflare.activateEmergencyMode();
    }
  }

  // Verificar se deve redirecionar para manutenção
  shouldRedirectToMaintenance() {
    return this.blockedIPs.size > 1000 || this.suspiciousIPs.size > 500;
  }

  // Relatório de segurança
  getSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      metrics: {
        totalRequests: Array.from(this.requestLog.values()).reduce((sum, requests) => sum + requests.length, 0),
        blockedIPs: this.blockedIPs.size,
        suspiciousIPs: this.suspiciousIPs.size,
        emergencyMode: this.emergencyMode || false
      },
      recentEvents: this.getRecentSecurityEvents(),
      recommendations: this.getSecurityRecommendations()
    };
  }

  // Obter eventos recentes de segurança
  getRecentSecurityEvents() {
    try {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      return logs.slice(-10); // Últimos 10 eventos
    } catch {
      return [];
    }
  }

  // Obter recomendações de segurança
  getSecurityRecommendations() {
    const recommendations = [];

    if (this.blockedIPs.size > 100) {
      recommendations.push('Considerar aumentar proteção DDoS');
    }

    if (this.suspiciousIPs.size > 50) {
      recommendations.push('Revisar regras de firewall');
    }

    return recommendations;
  }
}

// Instância global do serviço de segurança
const securityService = new SecurityService();

// Exportar para uso em outros módulos
export default securityService;

// Funções de utilidade de segurança
export const securityUtils = {
  // Validar entrada de usuário
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remover < e >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim();
  },

  // Validar URL
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Gerar token de segurança
  generateSecurityToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  // Verificar integridade de dados
  verifyDataIntegrity(data, hash) {
    // Implementar verificação de hash
    return true; // Placeholder
  }
};
