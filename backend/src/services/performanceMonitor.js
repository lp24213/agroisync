// Sistema de Monitoramento de Performance - AGROISYNC
// Monitoramento em tempo real de performance, recursos e métricas

import { performance } from 'perf_hooks';
import { SecurityLog } from '../models/SecurityLog.js';
import { AuditLog } from '../models/AuditLog.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: new Map(),
      responses: new Map(),
      errors: new Map(),
      resources: new Map()
    };

    this.thresholds = {
      responseTime: 2000, // 2 segundos
      memoryUsage: 0.8, // 80%
      cpuUsage: 0.8, // 80%
      errorRate: 0.05, // 5%
      throughput: 1000 // requests per minute
    };

    this.alerts = [];
    this.isMonitoring = false;

    this.startMonitoring();
  }

  // Iniciar monitoramento
  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;

    // Monitorar recursos do sistema
    setInterval(() => {
      this.monitorSystemResources();
    }, 30000); // A cada 30 segundos

    // Monitorar performance da aplicação
    setInterval(() => {
      this.monitorApplicationPerformance();
    }, 60000); // A cada minuto

    // Limpar métricas antigas
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000); // A cada 5 minutos

    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Sistema de monitoramento de performance iniciado');
    }
  }

  // Monitorar recursos do sistema
  monitorSystemResources() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics = {
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        usage: memUsage.heapUsed / memUsage.heapTotal
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      timestamp: new Date()
    };

    // Verificar limites
    if (metrics.memory.usage > this.thresholds.memoryUsage) {
      this.createAlert('HIGH_MEMORY_USAGE', 'warning', {
        usage: metrics.memory.usage,
        threshold: this.thresholds.memoryUsage,
        details: metrics
      });
    }

    // Armazenar métricas
    this.metrics.resources.set(Date.now(), metrics);

    // Log de performance
    this.logPerformanceMetric('SYSTEM_RESOURCES', metrics);
  }

  // Monitorar performance da aplicação
  monitorApplicationPerformance() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Calcular métricas de requisições
    const recentRequests = Array.from(this.metrics.requests.values()).filter(
      req => req.timestamp > oneMinuteAgo
    );

    const recentResponses = Array.from(this.metrics.responses.values()).filter(
      res => res.timestamp > oneMinuteAgo
    );

    const recentErrors = Array.from(this.metrics.errors.values()).filter(
      err => err.timestamp > oneMinuteAgo
    );

    const metrics = {
      requestsPerMinute: recentRequests.length,
      averageResponseTime: this.calculateAverageResponseTime(recentResponses),
      errorRate: recentErrors.length / Math.max(recentRequests.length, 1),
      throughput: recentRequests.length,
      timestamp: new Date()
    };

    // Verificar limites
    if (metrics.averageResponseTime > this.thresholds.responseTime) {
      this.createAlert('SLOW_RESPONSE_TIME', 'warning', {
        responseTime: metrics.averageResponseTime,
        threshold: this.thresholds.responseTime,
        details: metrics
      });
    }

    if (metrics.errorRate > this.thresholds.errorRate) {
      this.createAlert('HIGH_ERROR_RATE', 'critical', {
        errorRate: metrics.errorRate,
        threshold: this.thresholds.errorRate,
        details: metrics
      });
    }

    if (metrics.throughput > this.thresholds.throughput) {
      this.createAlert('HIGH_THROUGHPUT', 'info', {
        throughput: metrics.throughput,
        threshold: this.thresholds.throughput,
        details: metrics
      });
    }

    // Armazenar métricas
    this.metrics.responses.set(now, metrics);

    // Log de performance
    this.logPerformanceMetric('APPLICATION_PERFORMANCE', metrics);
  }

  // Registrar requisição
  recordRequest(req, res, next) {
    const startTime = performance.now();
    const requestId = Math.random().toString(36).substr(2, 9);

    // Adicionar request ID ao request
    req.requestId = requestId;
    req.startTime = startTime;

    // Registrar requisição
    this.metrics.requests.set(requestId, {
      id: requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: Date.now(),
      userId: req.user?.id
    });

    // Interceptar resposta
    const originalSend = res.send;
    res.send = function (data) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Registrar resposta
      this.metrics.responses.set(requestId, {
        id: requestId,
        statusCode: res.statusCode,
        duration,
        responseSize: data ? data.length : 0,
        timestamp: Date.now()
      });

      // Verificar se é erro
      if (res.statusCode >= 400) {
        this.metrics.errors.set(requestId, {
          id: requestId,
          statusCode: res.statusCode,
          error: data,
          duration,
          timestamp: Date.now()
        });
      }

      return originalSend.call(this, data);
    }.bind(this);

    next();
  }

  // Calcular tempo médio de resposta
  calculateAverageResponseTime(responses) {
    if (responses.length === 0) {
      return 0;
    }

    const totalTime = responses.reduce((sum, res) => sum + res.duration, 0);
    return totalTime / responses.length;
  }

  // Criar alerta
  createAlert(type, severity, details) {
    const alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      message: this.getAlertMessage(type, details),
      details,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.push(alert);

    // Log de segurança
    this.logSecurityEvent('PERFORMANCE_ALERT', severity, {
      alertType: type,
      details
    });

    // Log no console
    if (process.env.NODE_ENV !== 'production') {
      // Console log removido}]: ${alert.message}`);
    }
    return alert;
  }

  // Obter mensagem do alerta
  getAlertMessage(type, details) {
    const messages = {
      HIGH_MEMORY_USAGE: `Uso de memória alto: ${(details.usage * 100).toFixed(1)}%`,
      SLOW_RESPONSE_TIME: `Tempo de resposta lento: ${details.responseTime.toFixed(2)}ms`,
      HIGH_ERROR_RATE: `Taxa de erro alta: ${(details.errorRate * 100).toFixed(2)}%`,
      HIGH_THROUGHPUT: `Throughput alto: ${details.throughput} req/min`,
      LOW_THROUGHPUT: `Throughput baixo: ${details.throughput} req/min`,
      HIGH_CPU_USAGE: `Uso de CPU alto: ${(details.cpuUsage * 100).toFixed(1)}%`
    };

    return messages[type] || 'Alerta de performance desconhecido';
  }

  // Log de métrica de performance
  async logPerformanceMetric(type, metrics) {
    try {
      await AuditLog.create({
        userId: 'system',
        userEmail: 'system@agroisync.com',
        action: 'PERFORMANCE_METRIC',
        resource: 'performance_monitor',
        resourceId: type,
        details: JSON.stringify(metrics),
        ip: '127.0.0.1',
        userAgent: 'PerformanceMonitor',
        timestamp: new Date()
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao registrar métrica de performance:', error);
      }
    }
  }

  // Log de evento de segurança
  async logSecurityEvent(eventType, severity, details) {
    try {
      await SecurityLog.create({
        eventType,
        severity,
        description: `Performance alert: ${eventType}`,
        details: JSON.stringify(details),
        timestamp: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'PerformanceMonitor'
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao registrar evento de segurança:', error);
      }
    }
  }

  // Limpar métricas antigas
  cleanupOldMetrics() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    // Limpar requisições antigas
    for (const [key, data] of this.metrics.requests.entries()) {
      if (data.timestamp < oneHourAgo) {
        this.metrics.requests.delete(key);
      }
    }

    // Limpar respostas antigas
    for (const [key, data] of this.metrics.responses.entries()) {
      if (data.timestamp < oneHourAgo) {
        this.metrics.responses.delete(key);
      }
    }

    // Limpar erros antigos
    for (const [key, data] of this.metrics.errors.entries()) {
      if (data.timestamp < oneHourAgo) {
        this.metrics.errors.delete(key);
      }
    }

    // Limpar recursos antigos
    for (const [key, data] of this.metrics.resources.entries()) {
      if (data.timestamp < oneHourAgo) {
        this.metrics.resources.delete(key);
      }
    }

    // Limpar alertas antigos
    this.alerts = this.alerts.filter(alert => alert.timestamp.getTime() > oneHourAgo);
  }

  // Obter estatísticas
  getStats() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    const recentRequests = Array.from(this.metrics.requests.values()).filter(
      req => req.timestamp > oneMinuteAgo
    );

    const recentResponses = Array.from(this.metrics.responses.values()).filter(
      res => res.timestamp > oneMinuteAgo
    );

    const recentErrors = Array.from(this.metrics.errors.values()).filter(
      err => err.timestamp > oneMinuteAgo
    );

    const recentResources = Array.from(this.metrics.resources.values()).filter(
      res => res.timestamp > oneMinuteAgo
    );

    return {
      requests: {
        total: this.metrics.requests.size,
        recent: recentRequests.length,
        perMinute: recentRequests.length
      },
      responses: {
        total: this.metrics.responses.size,
        recent: recentResponses.length,
        averageTime: this.calculateAverageResponseTime(recentResponses)
      },
      errors: {
        total: this.metrics.errors.size,
        recent: recentErrors.length,
        rate: recentErrors.length / Math.max(recentRequests.length, 1)
      },
      resources: {
        total: this.metrics.resources.size,
        recent: recentResources.length,
        averageMemoryUsage:
          recentResources.length > 0
            ? recentResources.reduce((sum, res) => sum + res.memory.usage, 0) /
              recentResources.length
            : 0
      },
      alerts: {
        total: this.alerts.length,
        unacknowledged: this.alerts.filter(alert => !alert.acknowledged).length
      },
      thresholds: this.thresholds
    };
  }

  // Obter métricas detalhadas
  getDetailedMetrics() {
    return {
      requests: Object.fromEntries(this.metrics.requests),
      responses: Object.fromEntries(this.metrics.responses),
      errors: Object.fromEntries(this.metrics.errors),
      resources: Object.fromEntries(this.metrics.resources),
      alerts: this.alerts
    };
  }

  // Configurar limites
  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Limites de performance atualizados:', this.thresholds);
    }
  }

  // Parar monitoramento
  stopMonitoring() {
    this.isMonitoring = false;
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Sistema de monitoramento de performance parado');
    }
  }
}

// Instância única
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
