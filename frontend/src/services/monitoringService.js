// Sistema de Monitoramento e Alertas - AGROISYNC
// Monitoramento em tempo real de segurança, performance e disponibilidade

class MonitoringSystem {
  constructor() {
    this.metrics = {
      requests: new Map(),
      errors: new Map(),
      performance: new Map(),
      security: new Map()
    };

    this.alerts = [];
    this.thresholds = {
      errorRate: 0.05, // 5%
      responseTime: 2000, // 2 segundos
      memoryUsage: 0.8, // 80%
      cpuUsage: 0.8, // 80%
      securityEvents: 10 // 10 eventos por minuto
    };

    this.startMonitoring();
  }

  // Iniciar monitoramento
  startMonitoring() {
    // Monitorar requisições
    this.monitorRequests();

    // Monitorar performance
    this.monitorPerformance();

    // Monitorar segurança
    this.monitorSecurity();

    // Monitorar recursos do sistema
    this.monitorSystemResources();

    // Verificar alertas
    setInterval(() => this.checkAlerts(), 60000); // A cada minuto
  }

  // Monitorar requisições
  monitorRequests() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = async function (...args) {
      const startTime = performance.now();
      const url = args[0];

      try {
        const response = await originalFetch.apply(this, args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Registrar métrica
        self.recordRequest({
          url,
          method: args[1]?.method || 'GET',
          status: response.status,
          duration,
          timestamp: new Date().toISOString()
        });

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Registrar erro
        self.recordError({
          url,
          method: args[1]?.method || 'GET',
          error: error.message,
          duration,
          timestamp: new Date().toISOString()
        });

        throw error;
      }
    };
  }

  // Monitorar performance
  monitorPerformance() {
    // Monitorar Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      new PerformanceObserver(list => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('cls', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Monitorar tempo de carregamento da página
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.recordMetric('pageLoad', loadTime);
    });
  }

  // Monitorar segurança
  monitorSecurity() {
    // Monitorar tentativas de XSS
    document.addEventListener('DOMContentLoaded', () => {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src && !this.isAllowedScript(script.src)) {
          this.recordSecurityEvent('suspicious_script', {
            src: script.src,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    // Monitorar mudanças no DOM
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Verificar se é um script suspeito
              if (node.tagName === 'SCRIPT' && node.src && !this.isAllowedScript(node.src)) {
                this.recordSecurityEvent('dom_injection', {
                  src: node.src,
                  timestamp: new Date().toISOString()
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Monitorar eventos de teclado suspeitos
    document.addEventListener('keydown', e => {
      // Detectar tentativas de abrir DevTools
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        this.recordSecurityEvent('devtools_attempt', {
          key: e.key,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Monitorar tentativas de acesso ao console
    const originalConsole = console.log;
    console.log = function (...args) {
      self.recordSecurityEvent('console_access', {
        args: args.join(' '),
        timestamp: new Date().toISOString()
      });
      return originalConsole.apply(console, args);
    };
  }

  // Monitorar recursos do sistema
  monitorSystemResources() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.recordMetric('memory', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000); // A cada 30 segundos
    }

    // Monitorar conexão
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.recordMetric('connection', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
    }
  }

  // Registrar requisição
  recordRequest(data) {
    const key = `${data.method}:${data.url}`;
    const requests = this.metrics.requests.get(key) || [];
    requests.push(data);

    // Manter apenas últimas 100 requisições
    if (requests.length > 100) {
      requests.splice(0, requests.length - 100);
    }

    this.metrics.requests.set(key, requests);
  }

  // Registrar erro
  recordError(data) {
    const key = `${data.method}:${data.url}`;
    const errors = this.metrics.errors.get(key) || [];
    errors.push(data);

    // Manter apenas últimos 50 erros
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }

    this.metrics.errors.set(key, errors);
  }

  // Registrar métrica
  recordMetric(type, value) {
    const metrics = this.metrics.performance.get(type) || [];
    metrics.push({
      value,
      timestamp: new Date().toISOString()
    });

    // Manter apenas últimas 100 métricas
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }

    this.metrics.performance.set(type, metrics);
  }

  // Registrar evento de segurança
  recordSecurityEvent(type, data) {
    const events = this.metrics.security.get(type) || [];
    events.push(data);

    // Manter apenas últimos 50 eventos
    if (events.length > 50) {
      events.splice(0, events.length - 50);
    }

    this.metrics.security.set(type, events);

    // Verificar se precisa de alerta
    this.checkSecurityThresholds(type);
  }

  // Verificar alertas
  checkAlerts() {
    this.checkErrorRate();
    this.checkResponseTime();
    this.checkMemoryUsage();
    this.checkSecurityEvents();
  }

  // Verificar taxa de erro
  checkErrorRate() {
    let totalRequests = 0;
    let totalErrors = 0;

    this.metrics.requests.forEach(requests => {
      totalRequests += requests.length;
    });

    this.metrics.errors.forEach(errors => {
      totalErrors += errors.length;
    });

    if (totalRequests > 0) {
      const errorRate = totalErrors / totalRequests;
      if (errorRate > this.thresholds.errorRate) {
        this.createAlert('high_error_rate', {
          errorRate: errorRate.toFixed(2),
          threshold: this.thresholds.errorRate,
          totalRequests,
          totalErrors
        });
      }
    }
  }

  // Verificar tempo de resposta
  checkResponseTime() {
    this.metrics.requests.forEach((requests, key) => {
      const avgResponseTime = requests.reduce((sum, req) => sum + req.duration, 0) / requests.length;

      if (avgResponseTime > this.thresholds.responseTime) {
        this.createAlert('slow_response', {
          endpoint: key,
          avgResponseTime: avgResponseTime.toFixed(2),
          threshold: this.thresholds.responseTime
        });
      }
    });
  }

  // Verificar uso de memória
  checkMemoryUsage() {
    const memoryMetrics = this.metrics.performance.get('memory');
    if (memoryMetrics && memoryMetrics.length > 0) {
      const latest = memoryMetrics[memoryMetrics.length - 1];
      const memoryUsage = latest.value.used / latest.value.limit;

      if (memoryUsage > this.thresholds.memoryUsage) {
        this.createAlert('high_memory_usage', {
          memoryUsage: memoryUsage.toFixed(2),
          threshold: this.thresholds.memoryUsage,
          used: latest.value.used,
          limit: latest.value.limit
        });
      }
    }
  }

  // Verificar eventos de segurança
  checkSecurityEvents() {
    const now = new Date().getTime();
    const oneMinuteAgo = now - 60000;

    let securityEventCount = 0;
    this.metrics.security.forEach(events => {
      securityEventCount += events.filter(event => new Date(event.timestamp).getTime() > oneMinuteAgo).length;
    });

    if (securityEventCount > this.thresholds.securityEvents) {
      this.createAlert('high_security_events', {
        eventCount: securityEventCount,
        threshold: this.thresholds.securityEvents,
        timeWindow: '1 minuto'
      });
    }
  }

  // Verificar limites de segurança
  checkSecurityThresholds(type) {
    const events = this.metrics.security.get(type) || [];
    const now = new Date().getTime();
    const oneMinuteAgo = now - 60000;

    const recentEvents = events.filter(event => new Date(event.timestamp).getTime() > oneMinuteAgo);

    if (recentEvents.length > 5) {
      this.createAlert('security_threshold_exceeded', {
        eventType: type,
        eventCount: recentEvents.length,
        threshold: 5,
        timeWindow: '1 minuto'
      });
    }
  }

  // Criar alerta
  createAlert(type, data) {
    const alert = {
      id: Date.now(),
      type,
      severity: this.getAlertSeverity(type),
      message: this.getAlertMessage(type, data),
      data,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.push(alert);

    // Enviar alerta para backend
    this.sendAlertToBackend(alert);

    // Mostrar notificação
    this.showNotification(alert);

    if (process.env.NODE_ENV !== 'production') {


      console.warn('🚨 ALERTA:', alert);


    }
  }

  // Obter severidade do alerta
  getAlertSeverity(type) {
    const severityMap = {
      high_error_rate: 'high',
      slow_response: 'medium',
      high_memory_usage: 'high',
      high_security_events: 'critical',
      security_threshold_exceeded: 'high',
      suspicious_script: 'high',
      dom_injection: 'critical',
      devtools_attempt: 'low',
      console_access: 'low'
    };

    return severityMap[type] || 'medium';
  }

  // Obter mensagem do alerta
  getAlertMessage(type, data) {
    const messages = {
      high_error_rate: `Taxa de erro alta: ${data.errorRate}% (limite: ${data.threshold})`,
      slow_response: `Resposta lenta: ${data.avgResponseTime}ms (limite: ${data.threshold}ms)`,
      high_memory_usage: `Uso de memória alto: ${data.memoryUsage}% (limite: ${data.threshold})`,
      high_security_events: `Muitos eventos de segurança: ${data.eventCount} (limite: ${data.threshold})`,
      security_threshold_exceeded: `Limite de segurança excedido: ${data.eventType}`,
      suspicious_script: 'Script suspeito detectado',
      dom_injection: 'Tentativa de injeção DOM detectada',
      devtools_attempt: 'Tentativa de abrir DevTools',
      console_access: 'Acesso ao console detectado'
    };

    return messages[type] || 'Alerta desconhecido';
  }

  // Enviar alerta para backend
  async sendAlertToBackend(alert) {
    try {
      await fetch(getApiUrl('/v1/monitoring/alerts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
    }
  }

  // Mostrar notificação
  showNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 ${alert.type}`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id
      });
    }
  }

  // Verificar se script é permitido
  isAllowedScript(src) {
    const allowedDomains = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', window.location.hostname];

    try {
      const url = new URL(src);
      return allowedDomains.includes(url.hostname);
    } catch {
      return false;
    }
  }

  // Obter métricas
  getMetrics() {
    return {
      requests: Object.fromEntries(this.metrics.requests),
      errors: Object.fromEntries(this.metrics.errors),
      performance: Object.fromEntries(this.metrics.performance),
      security: Object.fromEntries(this.metrics.security),
      alerts: this.alerts
    };
  }

  // Obter estatísticas
  getStats() {
    let totalRequests = 0;
    let totalErrors = 0;
    let totalSecurityEvents = 0;

    this.metrics.requests.forEach(requests => {
      totalRequests += requests.length;
    });

    this.metrics.errors.forEach(errors => {
      totalErrors += errors.length;
    });

    this.metrics.security.forEach(events => {
      totalSecurityEvents += events.length;
    });

    return {
      totalRequests,
      totalErrors,
      totalSecurityEvents,
      errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      activeAlerts: this.alerts.filter(alert => !alert.acknowledged).length,
      uptime: performance.now()
    };
  }

  // Limpar métricas antigas
  cleanup() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    // Limpar requisições antigas
    this.metrics.requests.forEach((requests, key) => {
      const recentRequests = requests.filter(req => new Date(req.timestamp).getTime() > oneHourAgo);
      this.metrics.requests.set(key, recentRequests);
    });

    // Limpar erros antigos
    this.metrics.errors.forEach((errors, key) => {
      const recentErrors = errors.filter(err => new Date(err.timestamp).getTime() > oneHourAgo);
      this.metrics.errors.set(key, recentErrors);
    });

    // Limpar métricas antigas
    this.metrics.performance.forEach((metrics, key) => {
      const recentMetrics = metrics.filter(metric => new Date(metric.timestamp).getTime() > oneHourAgo);
      this.metrics.performance.set(key, recentMetrics);
    });

    // Limpar eventos de segurança antigos
    this.metrics.security.forEach((events, key) => {
      const recentEvents = events.filter(event => new Date(event.timestamp).getTime() > oneHourAgo);
      this.metrics.security.set(key, recentEvents);
    });
  }
}

// Evitar efeitos colaterais no topo do módulo (SSR/builds)
let monitoringSystem = null;
let cleanupInterval = null;
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function getMonitoringSystem() {
  if (!monitoringSystem && isBrowser) {
    monitoringSystem = new MonitoringSystem();
    startCleanupInterval();
  }
  return monitoringSystem;
}

// Limpeza automática a cada hora - com cleanup adequado
const startCleanupInterval = () => {
  if (cleanupInterval) clearInterval(cleanupInterval);
  cleanupInterval = setInterval(() => monitoringSystem && monitoringSystem.cleanup(), 3600000);
};

// Parar limpeza automática
const stopCleanupInterval = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};

// Exportar funções de controle
export { startCleanupInterval, stopCleanupInterval, getMonitoringSystem };
export default monitoringSystem;
