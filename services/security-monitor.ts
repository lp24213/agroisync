import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import aiFirewall from './firewall';

interface SecurityEvent {
  id: string;
  type: 'threat' | 'attack' | 'anomaly' | 'block' | 'alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  description: string;
  metadata: any;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  blockedIPs: number;
  threatScore: number;
  lastUpdated: Date;
}

class SecurityMonitor extends EventEmitter {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics = {
    totalEvents: 0,
    eventsByType: {},
    eventsBySeverity: {},
    blockedIPs: 0,
    threatScore: 0,
    lastUpdated: new Date(),
  };

  private alertThresholds = {
    low: 10,
    medium: 5,
    high: 2,
    critical: 1,
  };

  private alertCounts = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  constructor() {
    super();
    this.initializeEventListeners();
    this.startMonitoringInterval();
  }

  private initializeEventListeners(): void {
    // Listen to firewall events
    aiFirewall.on('firewall_event', (event: any) => {
      this.recordEvent({
        type: 'block',
        severity: this.calculateSeverity(event.threatScore || 0),
        source: event.ip,
        target: 'firewall',
        description: event.reason,
        metadata: event,
      });
    });

    // Listen to system events
    process.on('uncaughtException', (error) => {
      this.recordEvent({
        type: 'anomaly',
        severity: 'high',
        source: 'system',
        target: 'application',
        description: 'Uncaught exception detected',
        metadata: { error: error.message, stack: error.stack },
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.recordEvent({
        type: 'anomaly',
        severity: 'medium',
        source: 'system',
        target: 'application',
        description: 'Unhandled promise rejection',
        metadata: { reason, promise },
      });
    });
  }

  recordEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      ...eventData,
      timestamp: new Date(),
      resolved: false,
    };

    this.events.push(event);
    this.updateMetrics(event);
    this.checkAlertThresholds(event);

    logger.warn('Security event recorded', {
      id: event.id,
      type: event.type,
      severity: event.severity,
      source: event.source,
      description: event.description,
    });

    this.emit('security_event', event);
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateSeverity(threatScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (threatScore >= 0.9) return 'critical';
    if (threatScore >= 0.7) return 'high';
    if (threatScore >= 0.5) return 'medium';
    return 'low';
  }

  private updateMetrics(event: SecurityEvent): void {
    this.metrics.totalEvents++;
    this.metrics.eventsByType[event.type] = (this.metrics.eventsByType[event.type] || 0) + 1;
    this.metrics.eventsBySeverity[event.severity] = (this.metrics.eventsBySeverity[event.severity] || 0) + 1;
    this.metrics.lastUpdated = new Date();

    // Update threat score based on recent events
    const recentEvents = this.getRecentEvents(1); // Last hour
    const totalThreatScore = recentEvents.reduce((sum, e) => {
      const score = this.getThreatScoreFromSeverity(e.severity);
      return sum + score;
    }, 0);
    this.metrics.threatScore = totalThreatScore / Math.max(recentEvents.length, 1);
  }

  private getThreatScoreFromSeverity(severity: string): number {
    switch (severity) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.5;
      case 'low': return 0.2;
      default: return 0.1;
    }
  }

  private checkAlertThresholds(event: SecurityEvent): void {
    this.alertCounts[event.severity]++;
    
    const threshold = this.alertThresholds[event.severity];
    const count = this.alertCounts[event.severity];

    if (count >= threshold) {
      this.triggerAlert(event.severity, count);
      this.alertCounts[event.severity] = 0; // Reset counter
    }
  }

  private triggerAlert(severity: string, count: number): void {
    const alert = {
      type: 'alert',
      severity,
      source: 'security_monitor',
      target: 'administrators',
      description: `Security alert: ${count} ${severity} events detected`,
      metadata: {
        count,
        threshold: this.alertThresholds[severity as keyof typeof this.alertThresholds],
        recentEvents: this.getRecentEvents(0.25), // Last 15 minutes
      },
    };

    logger.error('Security alert triggered', alert);
    this.emit('security_alert', alert);

    // Send notifications
    this.sendNotifications(alert);
  }

  private sendNotifications(alert: any): void {
    // Email notification
    if (alert.severity === 'critical' || alert.severity === 'high') {
      this.sendEmailAlert(alert);
    }

    // Slack/Discord notification
    this.sendSlackAlert(alert);

    // SMS notification for critical alerts
    if (alert.severity === 'critical') {
      this.sendSMSAlert(alert);
    }
  }

  private sendEmailAlert(alert: any): void {
    // Implementation would integrate with email service
    logger.info('Email alert sent', { alert });
  }

  private sendSlackAlert(alert: any): void {
    // Implementation would integrate with Slack webhook
    logger.info('Slack alert sent', { alert });
  }

  private sendSMSAlert(alert: any): void {
    // Implementation would integrate with SMS service
    logger.info('SMS alert sent', { alert });
  }

  getRecentEvents(hours: number): SecurityEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => event.timestamp > cutoff);
  }

  getEventsByType(type: string): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsBySeverity(severity: string): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  getEventsBySource(source: string): SecurityEvent[] {
    return this.events.filter(event => event.source === source);
  }

  resolveEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event && !event.resolved) {
      event.resolved = true;
      event.resolvedAt = new Date();
      
      logger.info('Security event resolved', { eventId });
      this.emit('event_resolved', event);
      return true;
    }
    return false;
  }

  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  getDashboardData(): any {
    const recentEvents = this.getRecentEvents(24); // Last 24 hours
    
    return {
      metrics: this.metrics,
      recentEvents: recentEvents.slice(-10), // Last 10 events
      eventsByHour: this.getEventsByHour(recentEvents),
      topSources: this.getTopSources(recentEvents),
      topTypes: this.getTopTypes(recentEvents),
      threatTrend: this.getThreatTrend(),
    };
  }

  private getEventsByHour(events: SecurityEvent[]): any[] {
    const hourlyData = new Array(24).fill(0);
    
    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourlyData[hour]++;
    });

    return hourlyData.map((count, hour) => ({ hour, count }));
  }

  private getTopSources(events: SecurityEvent[]): any[] {
    const sourceCounts: Record<string, number> = {};
    
    events.forEach(event => {
      sourceCounts[event.source] = (sourceCounts[event.source] || 0) + 1;
    });

    return Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getTopTypes(events: SecurityEvent[]): any[] {
    const typeCounts: Record<string, number> = {};
    
    events.forEach(event => {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getThreatTrend(): any[] {
    const hours = 24;
    const trend = [];
    
    for (let i = hours - 1; i >= 0; i--) {
      const cutoff = new Date(Date.now() - i * 60 * 60 * 1000);
      const nextCutoff = new Date(Date.now() - (i - 1) * 60 * 60 * 1000);
      
      const hourEvents = this.events.filter(event => 
        event.timestamp >= cutoff && event.timestamp < nextCutoff
      );
      
      const avgThreatScore = hourEvents.length > 0 
        ? hourEvents.reduce((sum, e) => sum + this.getThreatScoreFromSeverity(e.severity), 0) / hourEvents.length
        : 0;
      
      trend.push({
        hour: i,
        threatScore: avgThreatScore,
        eventCount: hourEvents.length,
      });
    }
    
    return trend;
  }

  private startMonitoringInterval(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private performHealthCheck(): void {
    const stats = aiFirewall.getStats();
    const currentThreatScore = this.metrics.threatScore;

    // Check for unusual activity
    if (currentThreatScore > 0.7) {
      this.recordEvent({
        type: 'anomaly',
        severity: 'high',
        source: 'system',
        target: 'security_monitor',
        description: 'High threat score detected',
        metadata: { threatScore: currentThreatScore, firewallStats: stats },
      });
    }

    // Check for blocked IPs surge
    if (stats.blacklistedIPs > 100) {
      this.recordEvent({
        type: 'attack',
        severity: 'medium',
        source: 'system',
        target: 'firewall',
        description: 'Large number of blocked IPs detected',
        metadata: { blockedIPs: stats.blacklistedIPs },
      });
    }

    logger.debug('Security monitor health check completed', {
      threatScore: currentThreatScore,
      totalEvents: this.metrics.totalEvents,
      firewallStats: stats,
    });
  }

  // Cleanup old events
  cleanup(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
    
    logger.info('Security monitor cleanup completed', {
      remainingEvents: this.events.length,
    });
  }
}

// Create singleton instance
export const securityMonitor = new SecurityMonitor();

// Export for use in other modules
export default securityMonitor; 