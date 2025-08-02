import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import securityMonitor from './security-monitor';

interface IntrusionPattern {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  category: 'sql_injection' | 'xss' | 'ddos' | 'malware' | 'suspicious' | 'custom';
  enabled: boolean;
  threshold: number;
  action: 'log' | 'block' | 'alert' | 'rate_limit';
}

interface IntrusionEvent {
  id: string;
  patternId: string;
  patternName: string;
  source: string;
  target: string;
  payload: string;
  severity: string;
  timestamp: Date;
  blocked: boolean;
  metadata: any;
}

interface BehavioralProfile {
  ip: string;
  userAgent: string;
  requestPatterns: string[];
  frequency: number;
  lastSeen: Date;
  threatScore: number;
  anomalies: number;
}

class IntrusionDetectionSystem extends EventEmitter {
  private patterns: Map<string, IntrusionPattern> = new Map();
  private events: IntrusionEvent[] = [];
  private behavioralProfiles: Map<string, BehavioralProfile> = new Map();
  private anomalyThresholds = {
    frequency: 100, // requests per minute
    patternDiversity: 0.3, // minimum unique patterns ratio
    userAgentConsistency: 0.8, // user agent consistency threshold
  };

  constructor() {
    super();
    this.initializePatterns();
    this.startBehavioralAnalysis();
  }

  private initializePatterns(): void {
    // SQL Injection Patterns
    this.addPattern({
      id: 'sql_union',
      name: 'SQL Union Injection',
      pattern: /(\bunion\s+select\b)/gi,
      severity: 'critical',
      description: 'SQL UNION injection attempt detected',
      category: 'sql_injection',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    this.addPattern({
      id: 'sql_select',
      name: 'SQL Select Injection',
      pattern: /(\bselect\s+.*\bfrom\b)/gi,
      severity: 'high',
      description: 'SQL SELECT injection attempt detected',
      category: 'sql_injection',
      enabled: true,
      threshold: 2,
      action: 'block',
    });

    this.addPattern({
      id: 'sql_drop',
      name: 'SQL Drop Injection',
      pattern: /(\bdrop\s+table\b|\bdrop\s+database\b)/gi,
      severity: 'critical',
      description: 'SQL DROP injection attempt detected',
      category: 'sql_injection',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    // XSS Patterns
    this.addPattern({
      id: 'xss_script',
      name: 'XSS Script Tag',
      pattern: /<script[^>]*>.*?<\/script>/gi,
      severity: 'high',
      description: 'XSS script tag injection detected',
      category: 'xss',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    this.addPattern({
      id: 'xss_javascript',
      name: 'XSS JavaScript Protocol',
      pattern: /javascript:/gi,
      severity: 'high',
      description: 'XSS JavaScript protocol detected',
      category: 'xss',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    this.addPattern({
      id: 'xss_event',
      name: 'XSS Event Handler',
      pattern: /on\w+\s*=/gi,
      severity: 'medium',
      description: 'XSS event handler detected',
      category: 'xss',
      enabled: true,
      threshold: 3,
      action: 'alert',
    });

    // DDoS Patterns
    this.addPattern({
      id: 'ddos_bot',
      name: 'DDoS Bot Detection',
      pattern: /(\bbot\b|\bcrawler\b|\bspider\b|\bscraper\b)/gi,
      severity: 'medium',
      description: 'Bot-like behavior detected',
      category: 'ddos',
      enabled: true,
      threshold: 5,
      action: 'rate_limit',
    });

    this.addPattern({
      id: 'ddos_flood',
      name: 'DDoS Flood Detection',
      pattern: /.*/gi, // Will be handled by behavioral analysis
      severity: 'high',
      description: 'Request flood detected',
      category: 'ddos',
      enabled: true,
      threshold: 50,
      action: 'rate_limit',
    });

    // Malware Patterns
    this.addPattern({
      id: 'malware_php',
      name: 'PHP Malware',
      pattern: /\.php\?.*=.*(eval|system|exec|shell_exec)/gi,
      severity: 'critical',
      description: 'PHP malware attempt detected',
      category: 'malware',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    this.addPattern({
      id: 'malware_upload',
      name: 'Malicious File Upload',
      pattern: /\.(php|asp|jsp|cfm|pl|py|sh|bat|exe)$/gi,
      severity: 'high',
      description: 'Malicious file upload attempt detected',
      category: 'malware',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    // Suspicious Patterns
    this.addPattern({
      id: 'suspicious_admin',
      name: 'Admin Access Attempt',
      pattern: /(\badmin\b|\broot\b|\bmanager\b)/gi,
      severity: 'medium',
      description: 'Admin access attempt detected',
      category: 'suspicious',
      enabled: true,
      threshold: 3,
      action: 'alert',
    });

    this.addPattern({
      id: 'suspicious_path',
      name: 'Suspicious Path Traversal',
      pattern: /\.\.\/|\.\.\\/gi,
      severity: 'high',
      description: 'Path traversal attempt detected',
      category: 'suspicious',
      enabled: true,
      threshold: 1,
      action: 'block',
    });

    logger.info('Intrusion detection patterns initialized', {
      totalPatterns: this.patterns.size,
    });
  }

  addPattern(pattern: IntrusionPattern): void {
    this.patterns.set(pattern.id, pattern);
    logger.info(`Intrusion pattern added: ${pattern.name}`, { pattern });
  }

  removePattern(patternId: string): boolean {
    const removed = this.patterns.delete(patternId);
    if (removed) {
      logger.info(`Intrusion pattern removed: ${patternId}`);
    }
    return removed;
  }

  async analyzeRequest(ip: string, request: any): Promise<{ blocked: boolean; events: IntrusionEvent[]; threatScore: number }> {
    const events: IntrusionEvent[] = [];
    let threatScore = 0;
    let blocked = false;

    // Update behavioral profile
    this.updateBehavioralProfile(ip, request);

    // Check patterns
    for (const [patternId, pattern] of this.patterns) {
      if (!pattern.enabled) continue;

      const matches = this.checkPattern(pattern, request);
      if (matches.length > 0) {
        const event = this.createIntrusionEvent(pattern, ip, request, matches);
        events.push(event);

        // Calculate threat score
        const patternThreatScore = this.getThreatScoreFromSeverity(pattern.severity);
        threatScore += patternThreatScore * matches.length;

        // Check if should block
        if (pattern.action === 'block' || (pattern.action === 'alert' && pattern.threshold <= matches.length)) {
          blocked = true;
        }

        // Rate limiting
        if (pattern.action === 'rate_limit') {
          this.applyRateLimit(ip, pattern);
        }
      }
    }

    // Behavioral analysis
    const behavioralThreatScore = await this.analyzeBehavior(ip, request);
    threatScore += behavioralThreatScore;

    // Update behavioral profile with threat score
    const profile = this.behavioralProfiles.get(ip);
    if (profile) {
      profile.threatScore = Math.max(profile.threatScore, threatScore);
      if (threatScore > 0.5) {
        profile.anomalies++;
      }
    }

    // Log events
    events.forEach(event => {
      logger.warn('Intrusion event detected', {
        id: event.id,
        pattern: event.patternName,
        source: event.source,
        severity: event.severity,
        blocked: event.blocked,
      });

      // Send to security monitor
      securityMonitor.recordEvent({
        type: 'threat',
        severity: event.severity as any,
        source: event.source,
        target: 'intrusion_detection',
        description: event.patternName,
        metadata: {
          patternId: event.patternId,
          payload: event.payload,
          threatScore,
        },
      });
    });

    return { blocked, events, threatScore };
  }

  private checkPattern(pattern: IntrusionPattern, request: any): string[] {
    const matches: string[] = [];
    const requestStr = JSON.stringify(request).toLowerCase();

    // Check URL
    if (request.url && pattern.pattern.test(request.url)) {
      matches.push(`URL: ${request.url}`);
    }

    // Check headers
    if (request.headers) {
      const headersStr = JSON.stringify(request.headers).toLowerCase();
      if (pattern.pattern.test(headersStr)) {
        matches.push(`Headers: ${headersStr}`);
      }
    }

    // Check body
    if (request.body) {
      const bodyStr = JSON.stringify(request.body).toLowerCase();
      if (pattern.pattern.test(bodyStr)) {
        matches.push(`Body: ${bodyStr}`);
      }
    }

    // Check query parameters
    if (request.query) {
      const queryStr = JSON.stringify(request.query).toLowerCase();
      if (pattern.pattern.test(queryStr)) {
        matches.push(`Query: ${queryStr}`);
      }
    }

    return matches;
  }

  private createIntrusionEvent(pattern: IntrusionPattern, ip: string, request: any, matches: string[]): IntrusionEvent {
    return {
      id: `intrusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patternId: pattern.id,
      patternName: pattern.name,
      source: ip,
      target: request.url || 'unknown',
      payload: matches.join('; '),
      severity: pattern.severity,
      timestamp: new Date(),
      blocked: pattern.action === 'block',
      metadata: {
        category: pattern.category,
        action: pattern.action,
        threshold: pattern.threshold,
        matches: matches.length,
      },
    };
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

  private updateBehavioralProfile(ip: string, request: any): void {
    let profile = this.behavioralProfiles.get(ip);
    
    if (!profile) {
      profile = {
        ip,
        userAgent: request.headers?.['user-agent'] || 'unknown',
        requestPatterns: [],
        frequency: 0,
        lastSeen: new Date(),
        threatScore: 0,
        anomalies: 0,
      };
      this.behavioralProfiles.set(ip, profile);
    }

    // Update frequency
    const now = new Date();
    const timeDiff = now.getTime() - profile.lastSeen.getTime();
    if (timeDiff < 60000) { // Within 1 minute
      profile.frequency++;
    } else {
      profile.frequency = 1;
    }
    profile.lastSeen = now;

    // Update request patterns
    const pattern = `${request.method} ${request.url}`;
    if (!profile.requestPatterns.includes(pattern)) {
      profile.requestPatterns.push(pattern);
    }

    // Keep only recent patterns
    if (profile.requestPatterns.length > 10) {
      profile.requestPatterns = profile.requestPatterns.slice(-10);
    }
  }

  private async analyzeBehavior(ip: string, request: any): Promise<number> {
    const profile = this.behavioralProfiles.get(ip);
    if (!profile) return 0;

    let threatScore = 0;

    // Frequency analysis
    if (profile.frequency > this.anomalyThresholds.frequency) {
      threatScore += 0.4;
    }

    // Pattern diversity analysis
    const uniquePatterns = new Set(profile.requestPatterns);
    const diversityRatio = uniquePatterns.size / Math.max(profile.requestPatterns.length, 1);
    if (diversityRatio < this.anomalyThresholds.patternDiversity) {
      threatScore += 0.3; // Low pattern diversity
    }

    // User agent consistency
    const currentUserAgent = request.headers?.['user-agent'] || 'unknown';
    if (currentUserAgent !== profile.userAgent) {
      threatScore += 0.2; // User agent changed
    }

    // Anomaly count
    if (profile.anomalies > 5) {
      threatScore += 0.3;
    }

    // Time-based analysis
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      threatScore += 0.1; // Unusual hours
    }

    return Math.min(threatScore, 1.0);
  }

  private applyRateLimit(ip: string, pattern: IntrusionPattern): void {
    // Implementation would integrate with rate limiting service
    logger.warn(`Rate limit applied to ${ip} for pattern ${pattern.name}`);
  }

  private startBehavioralAnalysis(): void {
    setInterval(() => {
      this.cleanupProfiles();
      this.analyzeProfiles();
    }, 10 * 60 * 1000); // Every 10 minutes
  }

  private cleanupProfiles(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [ip, profile] of this.behavioralProfiles) {
      if (profile.lastSeen < oneHourAgo) {
        this.behavioralProfiles.delete(ip);
      }
    }

    logger.debug('Behavioral profiles cleanup completed', {
      remainingProfiles: this.behavioralProfiles.size,
    });
  }

  private analyzeProfiles(): void {
    for (const [ip, profile] of this.behavioralProfiles) {
      if (profile.threatScore > 0.7) {
        securityMonitor.recordEvent({
          type: 'anomaly',
          severity: 'high',
          source: ip,
          target: 'behavioral_analysis',
          description: 'High threat behavioral profile detected',
          metadata: {
            threatScore: profile.threatScore,
            frequency: profile.frequency,
            anomalies: profile.anomalies,
            patterns: profile.requestPatterns.length,
          },
        });
      }
    }
  }

  getStats(): any {
    return {
      totalPatterns: this.patterns.size,
      totalEvents: this.events.length,
      activeProfiles: this.behavioralProfiles.size,
      eventsByCategory: this.getEventsByCategory(),
      topThreatSources: this.getTopThreatSources(),
    };
  }

  private getEventsByCategory(): any {
    const categories: Record<string, number> = {};
    
    this.events.forEach(event => {
      const pattern = this.patterns.get(event.patternId);
      if (pattern) {
        categories[pattern.category] = (categories[pattern.category] || 0) + 1;
      }
    });

    return categories;
  }

  private getTopThreatSources(): any[] {
    const sourceCounts: Record<string, number> = {};
    
    this.events.forEach(event => {
      sourceCounts[event.source] = (sourceCounts[event.source] || 0) + 1;
    });

    return Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  getProfile(ip: string): BehavioralProfile | null {
    return this.behavioralProfiles.get(ip) || null;
  }

  getAllPatterns(): IntrusionPattern[] {
    return Array.from(this.patterns.values());
  }

  getRecentEvents(hours: number): IntrusionEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => event.timestamp > cutoff);
  }
}

// Create singleton instance
export const intrusionDetection = new IntrusionDetectionSystem();

// Export for use in other modules
export default intrusionDetection; 