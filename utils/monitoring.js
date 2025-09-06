import { cache } from './cache'

class MonitoringService {
  constructor() {
    this.metrics = new Map()
    this.alerts = []
    this.thresholds = {
      responseTime: 1000, // 1 second
      errorRate: 0.05, // 5%
      memoryUsage: 0.8, // 80%
      cpuUsage: 0.8 // 80%
    }
  }

  // Track request metrics
  trackRequest(method, path, statusCode, responseTime) {
    const key = `${method}:${path}`
    const metric = this.metrics.get(key) || {
      count: 0,
      totalTime: 0,
      errors: 0,
      statusCodes: {}
    }

    metric.count++
    metric.totalTime += responseTime
    metric.statusCodes[statusCode] = (metric.statusCodes[statusCode] || 0) + 1

    if (statusCode >= 400) {
      metric.errors++
    }

    this.metrics.set(key, metric)
    this.checkThresholds(key, metric)
  }

  // Track system metrics
  trackSystemMetrics() {
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()

    const systemMetrics = {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      timestamp: new Date()
    }

    this.checkSystemThresholds(systemMetrics)
    return systemMetrics
  }

  // Check thresholds and create alerts
  checkThresholds(key, metric) {
    const avgResponseTime = metric.totalTime / metric.count
    const errorRate = metric.errors / metric.count

    if (avgResponseTime > this.thresholds.responseTime) {
      this.createAlert('high_response_time', {
        key,
        value: avgResponseTime,
        threshold: this.thresholds.responseTime
      })
    }

    if (errorRate > this.thresholds.errorRate) {
      this.createAlert('high_error_rate', {
        key,
        value: errorRate,
        threshold: this.thresholds.errorRate
      })
    }
  }

  checkSystemThresholds(metrics) {
    const memoryUsage = metrics.memory.used / metrics.memory.total

    if (memoryUsage > this.thresholds.memoryUsage) {
      this.createAlert('high_memory_usage', {
        value: memoryUsage,
        threshold: this.thresholds.memoryUsage
      })
    }
  }

  // Create alert
  createAlert(type, data) {
    const alert = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date(),
      resolved: false
    }

    this.alerts.push(alert)
    this.sendAlert(alert)
  }

  // Send alert (implement based on your needs)
  async sendAlert(alert) {
    // Send to monitoring service, email, Slack, etc.
    console.log('Alert:', alert)
  }

  // Get metrics
  getMetrics() {
    return {
      requests: Object.fromEntries(this.metrics),
      system: this.trackSystemMetrics(),
      alerts: this.alerts.filter(alert => !alert.resolved)
    }
  }

  // Get health status
  getHealthStatus() {
    const metrics = this.getMetrics()
    const hasAlerts = metrics.alerts.length > 0
    const hasErrors = Object.values(metrics.requests).some(metric => metric.errors > 0)

    return {
      status: hasAlerts || hasErrors ? 'degraded' : 'healthy',
      metrics,
      timestamp: new Date()
    }
  }

  // Clear resolved alerts
  clearResolvedAlerts() {
    this.alerts = this.alerts.filter(alert => !alert.resolved)
  }

  // Resolve alert
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
    }
  }
}

export const monitoring = new MonitoringService()
export default monitoring
