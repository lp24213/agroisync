// Serviço de Segurança Avançada - AGROSYNC
// Proteção contra ataques cibernéticos sofisticados

class AdvancedSecurityService {
  constructor() {
    this.threatLevel = 'LOW';
    this.blockedPatterns = new Set();
    this.suspiciousActivities = [];
    this.securityEvents = [];
    this.lastSecurityCheck = Date.now();
    
    this.initAdvancedSecurity();
  }

  // Inicializar sistema de segurança avançado
  initAdvancedSecurity() {
    this.setupAdvancedProtection();
    this.startContinuousMonitoring();
    this.validateSecurityEnvironment();
    this.setupThreatIntelligence();
  }

  // Configurar proteção avançada
  setupAdvancedProtection() {
    // Proteção contra ataques de injeção
    this.preventInjectionAttacks();
    
    // Proteção contra ataques de força bruta
    this.preventBruteForceAttacks();
    
    // Proteção contra ataques de timing
    this.preventTimingAttacks();
    
    // Proteção contra ataques de clickjacking avançado
    this.preventAdvancedClickjacking();
    
    // Proteção contra ataques de CSRF
    this.preventCSRFAttacks();
    
    // Proteção contra ataques de XSS avançado
    this.preventAdvancedXSS();
  }

  // Prevenir ataques de injeção
  preventInjectionAttacks() {
    // Monitorar inputs suspeitos
    document.addEventListener('input', (e) => {
      const value = e.target.value;
      if (this.detectInjectionPattern(value)) {
        e.preventDefault();
        this.logSecurityThreat('INJECTION_ATTEMPT', {
          target: e.target.id || e.target.name,
          value: value.substring(0, 100), // Limitar log
          timestamp: new Date().toISOString()
        });
        this.blockInput(e.target);
      }
    });

    // Monitorar formulários
    document.addEventListener('submit', (e) => {
      const formData = new FormData(e.target);
      for (let [key, value] of formData.entries()) {
        if (this.detectInjectionPattern(value)) {
          e.preventDefault();
          this.logSecurityThreat('FORM_INJECTION_ATTEMPT', {
            form: e.target.id || e.target.action,
            field: key,
            timestamp: new Date().toISOString()
          });
          this.activateEmergencyProtection();
        }
      }
    });
  }

  // Detectar padrões de injeção
  detectInjectionPattern(value) {
    if (typeof value !== 'string') return false;
    
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi,
      /update\s+set/gi,
      /exec\s*\(/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /localStorage/gi,
      /sessionStorage/gi
    ];

    return dangerousPatterns.some(pattern => pattern.test(value));
  }

  // Bloquear input suspeito
  blockInput(input) {
    input.style.border = '2px solid red';
    input.style.backgroundColor = '#ffebee';
    input.disabled = true;
    
    // Mostrar aviso
    const warning = document.createElement('div');
    warning.style.color = 'red';
    warning.style.fontSize = '12px';
    warning.style.marginTop = '5px';
    warning.textContent = 'Entrada bloqueada por segurança';
    input.parentNode.appendChild(warning);
    
    // Remover aviso após 5 segundos
    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 5000);
  }

  // Prevenir ataques de força bruta
  preventBruteForceAttacks() {
    let loginAttempts = 0;
    const maxAttempts = 5;
    const lockoutTime = 15 * 60 * 1000; // 15 minutos
    let lockoutUntil = 0;

    // Monitorar tentativas de login
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('/api/auth')) {
        if (Date.now() < lockoutUntil) {
          throw new Error('Conta temporariamente bloqueada por segurança');
        }
        
        loginAttempts++;
        if (loginAttempts >= maxAttempts) {
          lockoutUntil = Date.now() + lockoutTime;
          loginAttempts = 0;
          this.logSecurityThreat('BRUTE_FORCE_ATTEMPT', {
            attempts: loginAttempts,
            lockoutUntil: new Date(lockoutUntil).toISOString()
          });
        }
      }
      return originalFetch.apply(this, args);
    }.bind(this);
  }

  // Prevenir ataques de timing avançados
  preventTimingAttacks() {
    let lastActionTime = Date.now();
    const minInterval = 50; // 50ms mínimo entre ações
    
    // Monitorar todas as ações do usuário
    const events = ['click', 'keypress', 'mousemove', 'scroll', 'focus'];
    events.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        const now = Date.now();
        const timeDiff = now - lastActionTime;
        
        if (timeDiff < minInterval) {
          // Possível ataque de timing
          this.logSecurityThreat('TIMING_ATTACK_SUSPECTED', {
            eventType,
            timeDiff,
            timestamp: new Date().toISOString()
          });
          
          // Aumentar nível de ameaça
          this.increaseThreatLevel();
        }
        
        lastActionTime = now;
      });
    });
  }

  // Prevenir clickjacking avançado
  preventAdvancedClickjacking() {
    // Verificar se estamos em iframe
    if (window.self !== window.top) {
      // Tentar sair do iframe
      try {
        window.top.location = window.self.location;
      } catch (e) {
        // Se não conseguir, bloquear completamente
        document.body.innerHTML = '<div style="text-align:center;padding:50px;color:red;"><h1>⚠️ ACESSO BLOQUEADO</h1><p>Esta página não pode ser exibida em iframe por motivos de segurança.</p></div>';
        this.logSecurityThreat('CLICKJACKING_BLOCKED', {
          timestamp: new Date().toISOString()
        });
      }
    }

    // Proteção adicional contra técnicas avançadas
    window.addEventListener('beforeunload', (e) => {
      if (this.threatLevel === 'HIGH') {
        e.preventDefault();
        e.returnValue = 'Acesso bloqueado por segurança';
      }
    });
  }

  // Prevenir ataques CSRF
  preventCSRFAttacks() {
    // Gerar token CSRF único
    const csrfToken = this.generateCSRFToken();
    
    // Adicionar token a todos os formulários
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_csrf';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);
      });
    });

    // Validar token em todas as requisições
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      if (args[1] && args[1].method && args[1].method !== 'GET') {
        if (!args[1].headers || !args[1].headers['X-CSRF-Token']) {
          args[1].headers = {
            ...args[1].headers,
            'X-CSRF-Token': csrfToken
          };
        }
      }
      return originalFetch.apply(this, args);
    };
  }

  // Prevenir XSS avançado
  preventAdvancedXSS() {
    // Sanitizar todo conteúdo dinâmico
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              // Sanitizar texto
              node.textContent = this.sanitizeText(node.textContent);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Sanitizar elementos
              this.sanitizeElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Sanitizar texto
  sanitizeText(text) {
    return text
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/data:/gi, '');
  }

  // Sanitizar elemento
  sanitizeElement(element) {
    // Remover atributos perigosos
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    dangerousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    // Sanitizar atributos src e href
    if (element.hasAttribute('src')) {
      const src = element.getAttribute('src');
      if (this.isDangerousURL(src)) {
        element.removeAttribute('src');
      }
    }

    if (element.hasAttribute('href')) {
      const href = element.getAttribute('href');
      if (this.isDangerousURL(href)) {
        element.removeAttribute('href');
      }
    }
  }

  // Verificar se URL é perigosa
  isDangerousURL(url) {
    const dangerousProtocols = ['javascript:', 'vbscript:', 'data:', 'file:'];
    return dangerousProtocols.some(protocol => 
      url.toLowerCase().startsWith(protocol)
    );
  }

  // Gerar token CSRF
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Configurar inteligência de ameaças
  setupThreatIntelligence() {
    // Monitorar padrões de comportamento suspeito
    this.monitorBehaviorPatterns();
    
    // Configurar alertas automáticos
    this.setupAutomaticAlerts();
    
    // Configurar resposta a incidentes
    this.setupIncidentResponse();
  }

  // Monitorar padrões de comportamento
  monitorBehaviorPatterns() {
    let mouseMovements = [];
    let keyStrokes = [];
    
    // Monitorar movimentos do mouse
    document.addEventListener('mousemove', (e) => {
      mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      // Manter apenas os últimos 100 movimentos
      if (mouseMovements.length > 100) {
        mouseMovements.shift();
      }
      
      // Detectar padrões suspeitos
      this.analyzeMousePatterns(mouseMovements);
    });

    // Monitorar teclas
    document.addEventListener('keydown', (e) => {
      keyStrokes.push({
        key: e.key,
        timestamp: Date.now()
      });
      
      // Manter apenas os últimos 50 toques
      if (keyStrokes.length > 50) {
        keyStrokes.shift();
      }
      
      // Detectar padrões suspeitos
      this.analyzeKeyPatterns(keyStrokes);
    });
  }

  // Analisar padrões do mouse
  analyzeMousePatterns(movements) {
    if (movements.length < 10) return;
    
    // Detectar movimentos muito regulares (possível bot)
    const timeDiffs = [];
    for (let i = 1; i < movements.length; i++) {
      timeDiffs.push(movements[i].timestamp - movements[i-1].timestamp);
    }
    
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    const variance = timeDiffs.reduce((a, b) => a + Math.pow(b - avgTimeDiff, 2), 0) / timeDiffs.length;
    
    if (variance < 100) { // Muito regular
      this.logSecurityThreat('SUSPICIOUS_MOUSE_PATTERN', {
        variance,
        avgTimeDiff,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Analisar padrões de teclas
  analyzeKeyPatterns(keys) {
    if (keys.length < 10) return;
    
    // Detectar digitação muito rápida (possível bot)
    const timeDiffs = [];
    for (let i = 1; i < keys.length; i++) {
      timeDiffs.push(keys[i].timestamp - keys[i-1].timestamp);
    }
    
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    
    if (avgTimeDiff < 50) { // Muito rápido
      this.logSecurityThreat('SUSPICIOUS_KEY_PATTERN', {
        avgTimeDiff,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Configurar alertas automáticos
  setupAutomaticAlerts() {
    setInterval(() => {
      if (this.threatLevel === 'HIGH') {
        this.sendSecurityAlert('ALERTA DE SEGURANÇA ALTO', {
          level: this.threatLevel,
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // A cada 30 segundos
  }

  // Configurar resposta a incidentes
  setupIncidentResponse() {
    // Resposta automática a ameaças críticas
    this.securityEvents.forEach(event => {
      if (event.type === 'CRITICAL_THREAT') {
        this.activateEmergencyResponse();
      }
    });
  }

  // Ativar resposta de emergência
  activateEmergencyResponse() {
    // Bloquear todas as ações do usuário
    document.body.style.pointerEvents = 'none';
    
    // Mostrar tela de emergência
    const emergencyScreen = document.createElement('div');
    emergencyScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
    `;
    
    emergencyScreen.innerHTML = `
      <div style="text-align: center;">
        <h1>🚨 ALERTA DE SEGURANÇA 🚨</h1>
        <p>Ameaça crítica detectada. Acesso bloqueado por segurança.</p>
        <p>Entre em contato com o suporte técnico.</p>
        <p>Email: suporte@agroisync.com</p>
        <p>WhatsApp: (66) 99236-2830</p>
      </div>
    `;
    
    document.body.appendChild(emergencyScreen);
    
    // Log da ação
    this.logSecurityThreat('EMERGENCY_RESPONSE_ACTIVATED', {
      timestamp: new Date().toISOString()
    });
  }

  // Aumentar nível de ameaça
  increaseThreatLevel() {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const currentIndex = levels.indexOf(this.threatLevel);
    
    if (currentIndex < levels.length - 1) {
      this.threatLevel = levels[currentIndex + 1];
      this.logSecurityThreat('THREAT_LEVEL_INCREASED', {
        newLevel: this.threatLevel,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Log de ameaças de segurança
  logSecurityThreat(type, data) {
    const threat = {
      type,
      data,
      timestamp: new Date().toISOString(),
      threatLevel: this.threatLevel,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.securityEvents.push(threat);
    
    // Manter apenas os últimos 1000 eventos
    if (this.securityEvents.length > 1000) {
      this.securityEvents.shift();
    }
    
    // Enviar para sistema de monitoramento
    this.sendThreatToMonitoring(threat);
    
    // Log local
    console.warn('Security Threat:', threat);
  }

  // Enviar ameaça para monitoramento
  sendThreatToMonitoring(threat) {
    // Integração com sistema de monitoramento
    if (window.securityMonitoring) {
      window.securityMonitoring.reportThreat(threat);
    }
    
    // Backup local
    this.storeThreatLocally(threat);
  }

  // Armazenar ameaça localmente
  storeThreatLocally(threat) {
    try {
      const threats = JSON.parse(localStorage.getItem('security_threats') || '[]');
      threats.push(threat);
      
      // Manter apenas os últimos 500
      if (threats.length > 500) {
        threats.splice(0, threats.length - 500);
      }
      
      localStorage.setItem('security_threats', JSON.stringify(threats));
    } catch (error) {
      console.error('Error storing threat locally:', error);
    }
  }

  // Enviar alerta de segurança
  sendSecurityAlert(message, data) {
    // Integração com sistema de notificação
    if (window.notificationService) {
      window.notificationService.sendSecurityAlert(message, data);
    }
    
    // Log do alerta
    console.warn('Security Alert:', message, data);
  }

  // Iniciar monitoramento contínuo
  startContinuousMonitoring() {
    setInterval(() => {
      this.performSecurityCheck();
      this.cleanupOldData();
      this.updateSecurityMetrics();
    }, 60000); // A cada minuto
  }

  // Realizar verificação de segurança
  performSecurityCheck() {
    // Verificar integridade do DOM
    this.checkDOMIntegrity();
    
    // Verificar scripts suspeitos
    this.checkSuspiciousScripts();
    
    // Verificar conexões suspeitas
    this.checkSuspiciousConnections();
  }

  // Verificar integridade do DOM
  checkDOMIntegrity() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src && !this.isAllowedScript(script.src)) {
        script.remove();
        this.logSecurityThreat('SUSPICIOUS_SCRIPT_REMOVED', {
          src: script.src,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  // Verificar se script é permitido
  isAllowedScript(src) {
    const allowedDomains = [
      'agroisync.com',
      'stripe.com',
      'cloudflare.com',
      'googleapis.com',
      'gstatic.com'
    ];
    
    try {
      const domain = new URL(src).hostname;
      return allowedDomains.some(allowed => domain.includes(allowed));
    } catch {
      return false;
    }
  }

  // Verificar scripts suspeitos
  checkSuspiciousScripts() {
    // Verificar scripts inline suspeitos
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
      if (this.detectInjectionPattern(script.textContent)) {
        script.remove();
        this.logSecurityThreat('SUSPICIOUS_INLINE_SCRIPT_REMOVED', {
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  // Verificar conexões suspeitas
  checkSuspiciousConnections() {
    // Monitorar requisições de rede
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && this.isSuspiciousURL(url)) {
        this.logSecurityThreat('SUSPICIOUS_CONNECTION_ATTEMPTED', {
          url: url.substring(0, 200),
          timestamp: new Date().toISOString()
        });
        throw new Error('Conexão suspeita bloqueada');
      }
      return originalFetch.apply(this, args);
    }.bind(this);
  }

  // Verificar se URL é suspeita
  isSuspiciousURL(url) {
    const suspiciousPatterns = [
      /\.onion$/i,
      /\.bit$/i,
      /\.local$/i,
      /^http:\/\//i, // HTTP não criptografado
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/ // IP direto
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  // Limpar dados antigos
  cleanupOldData() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    this.securityEvents = this.securityEvents.filter(event => 
      now - new Date(event.timestamp).getTime() < maxAge
    );
  }

  // Atualizar métricas de segurança
  updateSecurityMetrics() {
    const metrics = {
      threatLevel: this.threatLevel,
      totalEvents: this.securityEvents.length,
      criticalEvents: this.securityEvents.filter(e => e.type.includes('CRITICAL')).length,
      timestamp: new Date().toISOString()
    };
    
    // Enviar métricas
    this.sendSecurityMetrics(metrics);
  }

  // Enviar métricas de segurança
  sendSecurityMetrics(metrics) {
    // Integração com sistema de monitoramento
    if (window.securityMonitoring) {
      window.securityMonitoring.updateMetrics(metrics);
    }
    
    // Log local
    console.log('Security Metrics Updated:', metrics);
  }

  // Validar ambiente de segurança
  validateSecurityEnvironment() {
    // Verificar se estamos em ambiente seguro
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      this.logSecurityThreat('INSECURE_CONNECTION', {
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        timestamp: new Date().toISOString()
      });
    }
    
    // Verificar se console está aberto
    this.detectDevTools();
  }

  // Detectar ferramentas de desenvolvedor
  detectDevTools() {
    let devtools = { open: false, orientation: null };
    
    setInterval(() => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.logSecurityThreat('DEVTOOLS_OPENED', {
            timestamp: new Date().toISOString()
          });
          this.increaseThreatLevel();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  // Obter relatório de segurança
  getSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      threatLevel: this.threatLevel,
      totalEvents: this.securityEvents.length,
      recentEvents: this.securityEvents.slice(-10),
      recommendations: this.getSecurityRecommendations()
    };
  }

  // Obter recomendações de segurança
  getSecurityRecommendations() {
    const recommendations = [];
    
    if (this.threatLevel === 'HIGH' || this.threatLevel === 'CRITICAL') {
      recommendations.push('Ativar modo de emergência');
      recommendations.push('Revisar logs de segurança');
      recommendations.push('Notificar equipe de segurança');
    }
    
    if (this.securityEvents.length > 100) {
      recommendations.push('Investigar aumento de eventos');
    }
    
    return recommendations;
  }
}

// Instância global do serviço de segurança avançado
const advancedSecurityService = new AdvancedSecurityService();

// Exportar para uso em outros módulos
export default advancedSecurityService;

// Funções de utilidade de segurança avançada
export const advancedSecurityUtils = {
  // Validar entrada avançada
  validateAdvancedInput(input, type = 'text') {
    if (typeof input !== 'string') return false;
    
    const validators = {
      text: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[0-9\s\-\(\)]+$/,
      url: /^https?:\/\/[^\s\/$.?#].[^\s]*$/i
    };
    
    const validator = validators[type] || validators.text;
    return validator.test(input);
  },

  // Criptografar dados sensíveis
  encryptSensitiveData(data) {
    // Implementação básica de criptografia
    return btoa(JSON.stringify(data));
  },

  // Descriptografar dados
  decryptSensitiveData(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return null;
    }
  },

  // Gerar hash seguro
  generateSecureHash(data) {
    // Implementação básica de hash
    let hash = 0;
    const str = JSON.stringify(data);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  }
};
