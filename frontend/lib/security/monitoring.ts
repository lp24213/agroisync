import crypto from 'crypto';

// Security monitoring configuration
const MONITORING_CONFIG = {
  // Threat detection thresholds
  THREAT_LEVELS: {
    LOW: 1,
    MEDIUM: 5,
    HIGH: 10,
    CRITICAL: 20,
  },

  // Suspicious activity patterns
  SUSPICIOUS_PATTERNS: {
    SQL_INJECTION: [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
      /(\b(exec|execute|script|javascript|vbscript)\b)/gi,
      /(\b(and|or)\s+\d+\s*=\s*\d+)/gi,
      /(\b(and|or)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi,
    ],
    XSS_ATTACKS: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
    ],
    PATH_TRAVERSAL: [/\.\.\//gi, /\.\.\\/gi, /%2e%2e%2f/gi, /%2e%2e%5c/gi],
    COMMAND_INJECTION: [
      /(\b(cat|ls|pwd|whoami|id|uname|ps|netstat)\b)/gi,
      /(\b(rm|del|mkdir|touch|chmod|chown)\b)/gi,
      /(\b(wget|curl|nc|telnet|ssh|ftp)\b)/gi,
    ],
    BRUTE_FORCE: {
      FAILED_ATTEMPTS_THRESHOLD: 10,
      TIME_WINDOW: 5 * 60 * 1000, // 5 minutes
    },
  },

  // Logging configuration
  LOGGING: {
    RETENTION_DAYS: 90,
    MAX_LOG_SIZE: 100 * 1024 * 1024, // 100MB
    COMPRESSION_ENABLED: true,
  },

  // Alert configuration
  ALERTS: {
    ENABLED: true,
    WEBHOOK_URL: process.env.SECURITY_WEBHOOK_URL,
    EMAIL_ENABLED: true,
    EMAIL_RECIPIENTS: process.env.SECURITY_EMAIL_RECIPIENTS?.split(',') || [],
  },
};

// Security event types
export enum SecurityEventType {
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DDoS_ATTACK = 'DDOS_ATTACK',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTACK_ATTEMPT = 'XSS_ATTACK_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  COMMAND_INJECTION_ATTEMPT = 'COMMAND_INJECTION_ATTEMPT',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  SESSION_HIJACKING = 'SESSION_HIJACKING',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  UNUSUAL_ACCESS_PATTERN = 'UNUSUAL_ACCESS_PATTERN',
}

// Security event interface
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: number;
  ip: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  details: Record<string, any>;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  metadata: Record<string, any>;
}

// In-memory event store (use database in production)
const securityEvents: SecurityEvent[] = [];
const threatScores = new Map<string, number>();
const blockedIPs = new Map<string, { reason: string; timestamp: number; duration: number }>();

// Utility functions
const generateEventId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const calculateThreatLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  if (score >= MONITORING_CONFIG.THREAT_LEVELS.CRITICAL) return 'CRITICAL';
  if (score >= MONITORING_CONFIG.THREAT_LEVELS.HIGH) return 'HIGH';
  if (score >= MONITORING_CONFIG.THREAT_LEVELS.MEDIUM) return 'MEDIUM';
  return 'LOW';
};

const updateThreatScore = (ip: string, score: number): void => {
  const currentScore = threatScores.get(ip) || 0;
  const newScore = currentScore + score;
  threatScores.set(ip, newScore);

  // Auto-block IPs with critical threat level
  if (newScore >= MONITORING_CONFIG.THREAT_LEVELS.CRITICAL) {
    blockIP(ip, 'Critical threat level reached', 24 * 60 * 60 * 1000); // 24 hours
  }
};

const blockIP = (ip: string, reason: string, duration: number): void => {
  blockedIPs.set(ip, {
    reason,
    timestamp: Date.now(),
    duration,
  });

  console.log(`[SECURITY] IP blocked: ${ip} - Reason: ${reason} - Duration: ${duration}ms`);
};

const isIPBlocked = (ip: string): boolean => {
  const blockInfo = blockedIPs.get(ip);
  if (!blockInfo) return false;

  if (Date.now() - blockInfo.timestamp > blockInfo.duration) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
};

// Pattern detection
export class PatternDetector {
  static detectSQLInjection(input: string): boolean {
    return MONITORING_CONFIG.SUSPICIOUS_PATTERNS.SQL_INJECTION.some(pattern => pattern.test(input));
  }

  static detectXSS(input: string): boolean {
    return MONITORING_CONFIG.SUSPICIOUS_PATTERNS.XSS_ATTACKS.some(pattern => pattern.test(input));
  }

  static detectPathTraversal(input: string): boolean {
    return MONITORING_CONFIG.SUSPICIOUS_PATTERNS.PATH_TRAVERSAL.some(pattern =>
      pattern.test(input),
    );
  }

  static detectCommandInjection(input: string): boolean {
    return MONITORING_CONFIG.SUSPICIOUS_PATTERNS.COMMAND_INJECTION.some(pattern =>
      pattern.test(input),
    );
  }

  static detectBruteForce(ip: string): boolean {
    const recentEvents = securityEvents.filter(
      event =>
        event.ip === ip &&
        event.type === SecurityEventType.AUTHENTICATION_FAILURE &&
        Date.now() - event.timestamp <
          MONITORING_CONFIG.SUSPICIOUS_PATTERNS.BRUTE_FORCE.TIME_WINDOW,
    );

    return (
      recentEvents.length >=
      MONITORING_CONFIG.SUSPICIOUS_PATTERNS.BRUTE_FORCE.FAILED_ATTEMPTS_THRESHOLD
    );
  }
}

// Security monitoring service
export class SecurityMonitor {
  static logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: generateEventId(),
      timestamp: Date.now(),
    };

    securityEvents.push(securityEvent);

    // Update threat score
    const threatScore = this.calculateEventScore(securityEvent);
    updateThreatScore(securityEvent.ip, threatScore);

    // Log to console
    console.log(
      `[SECURITY] ${securityEvent.type} - IP: ${securityEvent.ip} - Threat Level: ${securityEvent.threatLevel}`,
    );

    // Send alerts for high/critical events
    if (securityEvent.threatLevel === 'HIGH' || securityEvent.threatLevel === 'CRITICAL') {
      this.sendAlert(securityEvent);
    }

    // Clean up old events
    this.cleanupOldEvents();
  }

  static calculateEventScore(event: SecurityEvent): number {
    const baseScores = {
      [SecurityEventType.AUTHENTICATION_SUCCESS]: 0,
      [SecurityEventType.AUTHENTICATION_FAILURE]: 2,
      [SecurityEventType.SUSPICIOUS_ACTIVITY]: 5,
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: 3,
      [SecurityEventType.DDoS_ATTACK]: 15,
      [SecurityEventType.SQL_INJECTION_ATTEMPT]: 10,
      [SecurityEventType.XSS_ATTACK_ATTEMPT]: 8,
      [SecurityEventType.PATH_TRAVERSAL_ATTEMPT]: 6,
      [SecurityEventType.COMMAND_INJECTION_ATTEMPT]: 12,
      [SecurityEventType.BRUTE_FORCE_ATTEMPT]: 10,
      [SecurityEventType.SESSION_HIJACKING]: 15,
      [SecurityEventType.DATA_EXFILTRATION]: 20,
      [SecurityEventType.UNUSUAL_ACCESS_PATTERN]: 4,
    };

    let score = baseScores[event.type] || 1;

    // Additional scoring based on details
    if (event.details.frequency) {
      score += event.details.frequency * 2;
    }

    if (event.details.payloadSize && event.details.payloadSize > 1024 * 1024) {
      score += 3; // Large payload
    }

    return score;
  }

  static async sendAlert(event: SecurityEvent): Promise<void> {
    if (!MONITORING_CONFIG.ALERTS.ENABLED) return;

    const alert = {
      timestamp: new Date(event.timestamp).toISOString(),
      type: event.type,
      threatLevel: event.threatLevel,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details,
      source: event.source,
    };

    // Send webhook alert
    if (MONITORING_CONFIG.ALERTS.WEBHOOK_URL) {
      try {
        await fetch(MONITORING_CONFIG.ALERTS.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      } catch (error) {
        console.error('[SECURITY] Failed to send webhook alert:', error);
      }
    }

    // Send email alert
    if (
      MONITORING_CONFIG.ALERTS.EMAIL_ENABLED &&
      MONITORING_CONFIG.ALERTS.EMAIL_RECIPIENTS.length > 0
    ) {
      // Implement email sending logic here
      console.log(
        `[SECURITY] Email alert would be sent to: ${MONITORING_CONFIG.ALERTS.EMAIL_RECIPIENTS.join(
          ', ',
        )}`,
      );
    }
  }

  static cleanupOldEvents(): void {
    const cutoffTime = Date.now() - MONITORING_CONFIG.LOGGING.RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const initialLength = securityEvents.length;

    // Remove old events
    for (let i = securityEvents.length - 1; i >= 0; i--) {
      if (securityEvents[i].timestamp < cutoffTime) {
        securityEvents.splice(i, 1);
      }
    }

    if (securityEvents.length < initialLength) {
      console.log(
        `[SECURITY] Cleaned up ${initialLength - securityEvents.length} old security events`,
      );
    }
  }

  static getThreatScore(ip: string): number {
    return threatScores.get(ip) || 0;
  }

  static isIPBlocked(ip: string): boolean {
    return isIPBlocked(ip);
  }

  static getBlockedIPs(): Map<string, { reason: string; timestamp: number; duration: number }> {
    return new Map(blockedIPs);
  }

  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return securityEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  static getEventsByType(type: SecurityEventType, limit: number = 50): SecurityEvent[] {
    return securityEvents
      .filter(event => event.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  static getEventsByIP(ip: string, limit: number = 50): SecurityEvent[] {
    return securityEvents
      .filter(event => event.ip === ip)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  static getThreatStatistics(): {
    totalEvents: number;
    threatLevels: Record<string, number>;
    topThreatIPs: Array<{ ip: string; score: number }>;
    recentActivity: Array<{ type: SecurityEventType; count: number }>;
  } {
    const threatLevels = securityEvents.reduce(
      (acc, event) => {
        acc[event.threatLevel] = (acc[event.threatLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topThreatIPs = Array.from(threatScores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ip, score]) => ({ ip, score }));

    const recentActivity = securityEvents
      .filter(event => Date.now() - event.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .reduce(
        (acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        },
        {} as Record<SecurityEventType, number>,
      );

    return {
      totalEvents: securityEvents.length,
      threatLevels,
      topThreatIPs,
      recentActivity: Object.entries(recentActivity).map(([type, count]) => ({
        type: type as SecurityEventType,
        count,
      })),
    };
  }
}

// Real-time monitoring
export class RealTimeMonitor {
  private static instance: RealTimeMonitor;
  private isRunning = false;
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): RealTimeMonitor {
    if (!RealTimeMonitor.instance) {
      RealTimeMonitor.instance = new RealTimeMonitor();
    }
    return RealTimeMonitor.instance;
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.checkInterval = setInterval(() => {
      this.performSecurityChecks();
    }, 30000); // Check every 30 seconds

    console.log('[SECURITY] Real-time monitoring started');
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('[SECURITY] Real-time monitoring stopped');
  }

  private performSecurityChecks(): void {
    // Check for unusual activity patterns
    this.detectUnusualPatterns();

    // Check for potential DDoS attacks
    this.detectDDoSAttacks();

    // Check for session anomalies
    this.detectSessionAnomalies();
  }

  private detectUnusualPatterns(): void {
    const recentEvents = securityEvents.filter(
      event => Date.now() - event.timestamp < 5 * 60 * 1000, // Last 5 minutes
    );

    // Group by IP and check for unusual patterns
    const ipActivity = new Map<string, SecurityEvent[]>();
    recentEvents.forEach(event => {
      if (!ipActivity.has(event.ip)) {
        ipActivity.set(event.ip, []);
      }
      ipActivity.get(event.ip)!.push(event);
    });

    ipActivity.forEach((events, ip) => {
      if (events.length > 50) {
        // More than 50 events in 5 minutes
        SecurityMonitor.logEvent({
          type: SecurityEventType.UNUSUAL_ACCESS_PATTERN,
          ip,
          userAgent: events[0].userAgent,
          details: { eventCount: events.length, timeWindow: '5 minutes' },
          threatLevel: 'HIGH',
          source: 'RealTimeMonitor',
          metadata: {},
        });
      }
    });
  }

  private detectDDoSAttacks(): void {
    const recentEvents = securityEvents.filter(
      event => Date.now() - event.timestamp < 60 * 1000, // Last minute
    );

    const uniqueIPs = new Set(recentEvents.map(event => event.ip));

    if (uniqueIPs.size > 100) {
      // More than 100 unique IPs in 1 minute
      SecurityMonitor.logEvent({
        type: SecurityEventType.DDoS_ATTACK,
        ip: 'MULTIPLE',
        userAgent: 'DDoS Attack',
        details: { uniqueIPs: uniqueIPs.size, timeWindow: '1 minute' },
        threatLevel: 'CRITICAL',
        source: 'RealTimeMonitor',
        metadata: {},
      });
    }
  }

  private detectSessionAnomalies(): void {
    // Implement session anomaly detection logic
    // This could include detecting session hijacking, unusual session patterns, etc.
  }
}

// Initialize real-time monitoring
const realTimeMonitor = RealTimeMonitor.getInstance();
realTimeMonitor.start();

// Cleanup function
setInterval(
  () => {
    SecurityMonitor.cleanupOldEvents();
  },
  60 * 60 * 1000,
); // Clean up every hour
