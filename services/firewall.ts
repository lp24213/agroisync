import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

interface FirewallRule {
  id: string;
  type: 'ip' | 'pattern' | 'behavior' | 'ai';
  action: 'allow' | 'block' | 'rate_limit';
  pattern?: string;
  ip?: string;
  threshold?: number;
  description: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FirewallEvent {
  type: 'block' | 'allow' | 'rate_limit' | 'threat_detected';
  ip: string;
  reason: string;
  threatScore?: number;
  timestamp: Date;
  metadata?: any;
}

class AIFirewall extends EventEmitter {
  private rules: Map<string, FirewallRule> = new Map();
  private ipStats: Map<string, { requests: number; lastRequest: Date; threatScore: number; blocked: boolean }> = new Map();
  private patterns: Map<string, RegExp> = new Map();
  private blacklist: Set<string> = new Set();
  private whitelist: Set<string> = new Set();
  private rateLimits: Map<string, { count: number; resetTime: Date }> = new Map();

  constructor() {
    super();
    this.initializeDefaultRules();
    this.startCleanupInterval();
  }

  private initializeDefaultRules() {
    // DDoS protection rules
    this.addRule({
      id: 'ddos_protection',
      type: 'behavior',
      action: 'rate_limit',
      threshold: 100,
      description: 'DDoS protection - limit requests per minute',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // SQL Injection patterns
    this.addRule({
      id: 'sql_injection',
      type: 'pattern',
      action: 'block',
      pattern: '(\b(union|select|insert|update|delete|drop|create|alter)\b)',
      description: 'Block SQL injection attempts',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // XSS patterns
    this.addRule({
      id: 'xss_protection',
      type: 'pattern',
      action: 'block',
      pattern: '(<script[^>]*>.*?</script>|javascript:|on\\w+\\s*=)',
      description: 'Block XSS attempts',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Bot detection
    this.addRule({
      id: 'bot_detection',
      type: 'pattern',
      action: 'rate_limit',
      pattern: '(bot|crawler|spider|scraper)',
      threshold: 10,
      description: 'Rate limit bot-like behavior',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // AI-powered anomaly detection
    this.addRule({
      id: 'ai_anomaly',
      type: 'ai',
      action: 'block',
      threshold: 0.8,
      description: 'AI-powered anomaly detection',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  addRule(rule: FirewallRule): void {
    this.rules.set(rule.id, rule);
    
    if (rule.pattern) {
      this.patterns.set(rule.id, new RegExp(rule.pattern, 'gi'));
    }

    logger.info(`Firewall rule added: ${rule.id}`, { rule });
  }

  removeRule(ruleId: string): boolean {
    const removed = this.rules.delete(ruleId);
    this.patterns.delete(ruleId);
    
    if (removed) {
      logger.info(`Firewall rule removed: ${ruleId}`);
    }
    
    return removed;
  }

  addToBlacklist(ip: string, reason: string): void {
    this.blacklist.add(ip);
    logger.warn(`IP added to blacklist: ${ip}`, { reason });
    this.emit('firewall_event', {
      type: 'block',
      ip,
      reason: `Blacklisted: ${reason}`,
      timestamp: new Date(),
    });
  }

  addToWhitelist(ip: string): void {
    this.whitelist.add(ip);
    logger.info(`IP added to whitelist: ${ip}`);
  }

  removeFromBlacklist(ip: string): boolean {
    return this.blacklist.delete(ip);
  }

  removeFromWhitelist(ip: string): boolean {
    return this.whitelist.delete(ip);
  }

  async checkRequest(ip: string, request: any): Promise<{ allowed: boolean; reason?: string; action?: string }> {
    // Check whitelist first
    if (this.whitelist.has(ip)) {
      return { allowed: true, reason: 'Whitelisted IP' };
    }

    // Check blacklist
    if (this.blacklist.has(ip)) {
      return { allowed: false, reason: 'IP is blacklisted', action: 'block' };
    }

    // Update IP statistics
    const stats = this.ipStats.get(ip) || { requests: 0, lastRequest: new Date(), threatScore: 0, blocked: false };
    stats.requests++;
    stats.lastRequest = new Date();
    this.ipStats.set(ip, stats);

    // Check all rules
    for (const [ruleId, rule] of this.rules) {
      if (!rule.enabled) continue;

      const result = await this.evaluateRule(rule, ip, request, stats);
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  private async evaluateRule(rule: FirewallRule, ip: string, request: any, stats: any): Promise<{ allowed: boolean; reason?: string; action?: string }> {
    switch (rule.type) {
      case 'ip':
        if (rule.ip === ip) {
          return {
            allowed: rule.action === 'allow',
            reason: rule.description,
            action: rule.action,
          };
        }
        break;

      case 'pattern':
        if (rule.pattern) {
          const pattern = this.patterns.get(rule.id);
          if (pattern) {
            const requestStr = JSON.stringify(request).toLowerCase();
            if (pattern.test(requestStr)) {
              return {
                allowed: rule.action === 'allow',
                reason: `${rule.description} - Pattern matched`,
                action: rule.action,
              };
            }
          }
        }
        break;

      case 'behavior':
        if (rule.threshold && stats.requests > rule.threshold) {
          return {
            allowed: rule.action === 'allow',
            reason: `${rule.description} - Threshold exceeded (${stats.requests}/${rule.threshold})`,
            action: rule.action,
          };
        }
        break;

      case 'ai':
        // AI-powered anomaly detection
        const threatScore = await this.calculateThreatScore(ip, request, stats);
        if (rule.threshold && threatScore > rule.threshold) {
          stats.threatScore = threatScore;
          return {
            allowed: false,
            reason: `${rule.description} - Threat score: ${threatScore.toFixed(2)}`,
            action: 'block',
          };
        }
        break;
    }

    return { allowed: true };
  }

  private async calculateThreatScore(ip: string, request: any, stats: any): Promise<number> {
    let score = 0;

    // Request frequency analysis
    const timeDiff = Date.now() - stats.lastRequest.getTime();
    if (timeDiff < 1000 && stats.requests > 50) {
      score += 0.4; // High frequency requests
    }

    // User agent analysis
    const userAgent = request.headers?.['user-agent'] || '';
    if (!userAgent || userAgent.length < 10) {
      score += 0.2; // Suspicious user agent
    }

    // Request pattern analysis
    const requestStr = JSON.stringify(request).toLowerCase();
    const suspiciousPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /(\b(admin|root|test|debug)\b)/gi,
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(requestStr)) {
        score += 0.3;
      }
    });

    // Geographic analysis (if available)
    // This would integrate with a geo-IP service
    // score += await this.getGeographicThreatScore(ip);

    // Behavioral analysis
    const recentRequests = this.getRecentRequests(ip);
    if (recentRequests.length > 10) {
      const uniquePaths = new Set(recentRequests.map(r => r.path));
      if (uniquePaths.size < 3) {
        score += 0.2; // Limited path diversity
      }
    }

    return Math.min(score, 1.0);
  }

  private getRecentRequests(ip: string): any[] {
    // This would track recent requests in a more sophisticated way
    // For now, return empty array
    return [];
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  private cleanup(): void {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Clean up old IP statistics
    for (const [ip, stats] of this.ipStats) {
      if (stats.lastRequest.getTime() < fiveMinutesAgo) {
        this.ipStats.delete(ip);
      }
    }

    // Clean up rate limits
    for (const [ip, rateLimit] of this.rateLimits) {
      if (rateLimit.resetTime.getTime() < now) {
        this.rateLimits.delete(ip);
      }
    }

    logger.debug('Firewall cleanup completed');
  }

  getStats(): any {
    return {
      rules: this.rules.size,
      blacklistedIPs: this.blacklist.size,
      whitelistedIPs: this.whitelist.size,
      activeConnections: this.ipStats.size,
      rateLimits: this.rateLimits.size,
    };
  }

  getIPStats(ip: string): any {
    return this.ipStats.get(ip) || null;
  }

  getAllRules(): FirewallRule[] {
    return Array.from(this.rules.values());
  }

  getBlacklistedIPs(): string[] {
    return Array.from(this.blacklist);
  }

  getWhitelistedIPs(): string[] {
    return Array.from(this.whitelist);
  }
}

// Create singleton instance
export const aiFirewall = new AIFirewall();

// Export for use in other modules
export default aiFirewall; 