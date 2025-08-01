/**
 * AGROTM Premium Security Service
 * Enterprise-grade security monitoring and threat detection for Web3
 */

import { logger } from '@/utils/logger';

export interface SecurityEvent {
  id: string;
  type: 'suspicious_transaction' | 'blacklisted_address' | 'rate_limit_exceeded' | 'malicious_contract' | 'anomaly_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  address: string;
  details: Record<string, any>;
  timestamp: Date;
  chainId: number;
  transactionHash?: string;
  blockNumber?: number;
}

export interface BlacklistEntry {
  address: string;
  reason: string;
  source: 'manual' | 'automated' | 'external_api';
  timestamp: Date;
  expiresAt?: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  blacklistedAddresses: number;
  suspiciousTransactions: number;
  last24hEvents: number;
}

class PremiumSecurityService {
  private blacklist: Map<string, BlacklistEntry> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();
  private suspiciousPatterns: RegExp[] = [
    /0x0000000000000000000000000000000000000000/i, // Zero address
    /0x1111111111111111111111111111111111111111/i, // Known malicious
    /0xdead000000000000000000000000000000000000/i, // Dead address
  ];

  // Premium blacklist checking with multiple sources
  async isBlacklisted(address: string): Promise<{ blacklisted: boolean; reason?: string; severity?: string }> {
    try {
      const normalizedAddress = address.toLowerCase();
      
      // Check local blacklist
      const localEntry = this.blacklist.get(normalizedAddress);
      if (localEntry) {
        if (localEntry.expiresAt && localEntry.expiresAt < new Date()) {
          this.blacklist.delete(normalizedAddress);
        } else {
          return {
            blacklisted: true,
            reason: localEntry.reason,
            severity: localEntry.severity
          };
        }
      }

      // Check against known malicious patterns
      if (this.suspiciousPatterns.some(pattern => pattern.test(normalizedAddress))) {
        return {
          blacklisted: true,
          reason: 'Matches known malicious address pattern',
          severity: 'high'
        };
      }

      // External API checks (Chainalysis, TRM, etc.)
      const externalCheck = await this.checkExternalBlacklists(normalizedAddress);
      if (externalCheck.blacklisted) {
        await this.addToBlacklist(normalizedAddress, externalCheck.reason!, 'external_api', externalCheck.severity!);
        return externalCheck;
      }

      return { blacklisted: false };
    } catch (error) {
      logger.error('Error checking blacklist', { address, error });
      return { blacklisted: false };
    }
  }

  // Premium security event logging
  async logSecurityEvent(
    type: SecurityEvent['type'],
    address: string,
    details: Record<string, any>,
    severity: SecurityEvent['severity'] = 'medium',
    chainId: number = 1,
    transactionHash?: string,
    blockNumber?: number
  ): Promise<void> {
    try {
      const event: SecurityEvent = {
        id: `sec_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        type,
        severity,
        address: address.toLowerCase(),
        details,
        timestamp: new Date(),
        chainId,
        transactionHash,
        blockNumber
      };

      this.securityEvents.push(event);
      
      // Keep only last 10,000 events
      if (this.securityEvents.length > 10000) {
        this.securityEvents = this.securityEvents.slice(-10000);
      }

      // Log to external security monitoring systems
      await this.sendToSecurityMonitoring(event);
      
      // Trigger alerts for high severity events
      if (severity === 'high' || severity === 'critical') {
        await this.triggerSecurityAlert(event);
      }

      logger.security('Security event logged', { event });
    } catch (error) {
      logger.error('Error logging security event', { type, address, error });
    }
  }

  // Add address to blacklist
  async addToBlacklist(
    address: string,
    reason: string,
    source: BlacklistEntry['source'] = 'manual',
    severity: BlacklistEntry['severity'] = 'medium',
    expiresAt?: Date
  ): Promise<void> {
    const entry: BlacklistEntry = {
      address: address.toLowerCase(),
      reason,
      source,
      timestamp: new Date(),
      expiresAt,
      severity
    };

    this.blacklist.set(address.toLowerCase(), entry);
    
    await this.logSecurityEvent(
      'blacklisted_address',
      address,
      { reason, source, severity },
      severity
    );

    logger.security('Address added to blacklist', { entry });
  }

  // Remove address from blacklist
  async removeFromBlacklist(address: string): Promise<void> {
    const normalizedAddress = address.toLowerCase();
    const entry = this.blacklist.get(normalizedAddress);
    
    if (entry) {
      this.blacklist.delete(normalizedAddress);
      
      await this.logSecurityEvent(
        'blacklisted_address',
        address,
        { action: 'removed', previousReason: entry.reason },
        'low'
      );

      logger.security('Address removed from blacklist', { address });
    }
  }

  // Rate limiting with advanced patterns
  async checkRateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    const entry = this.rateLimitCache.get(key);

    if (!entry || now > entry.resetTime) {
      this.rateLimitCache.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    
    const last24hEvents = this.securityEvents.filter(
      event => event.timestamp.getTime() > last24h
    ).length;

    const eventsByType = this.securityEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = this.securityEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const suspiciousTransactions = this.securityEvents.filter(
      event => event.type === 'suspicious_transaction'
    ).length;

    return {
      totalEvents: this.securityEvents.length,
      eventsByType,
      eventsBySeverity,
      blacklistedAddresses: this.blacklist.size,
      suspiciousTransactions,
      last24hEvents
    };
  }

  // Get recent security events
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Private methods for external integrations
  private async checkExternalBlacklists(address: string): Promise<{ blacklisted: boolean; reason?: string; severity?: string }> {
    try {
      // Integration with Chainalysis API
      const chainalysisCheck = await this.checkChainalysis(address);
      if (chainalysisCheck.blacklisted) return chainalysisCheck;

      // Integration with TRM API
      const trmCheck = await this.checkTRM(address);
      if (trmCheck.blacklisted) return trmCheck;

      // Integration with Etherscan API
      const etherscanCheck = await this.checkEtherscan(address);
      if (etherscanCheck.blacklisted) return etherscanCheck;

      return { blacklisted: false };
    } catch (error) {
      logger.error('Error checking external blacklists', { address, error });
      return { blacklisted: false };
    }
  }

  private async checkChainalysis(address: string): Promise<{ blacklisted: boolean; reason?: string; severity?: string }> {
    // Implementation would use Chainalysis API
    // For now, return false
    return { blacklisted: false };
  }

  private async checkTRM(address: string): Promise<{ blacklisted: boolean; reason?: string; severity?: string }> {
    // Implementation would use TRM API
    // For now, return false
    return { blacklisted: false };
  }

  private async checkEtherscan(address: string): Promise<{ blacklisted: boolean; reason?: string; severity?: string }> {
    // Implementation would use Etherscan API
    // For now, return false
    return { blacklisted: false };
  }

  private async sendToSecurityMonitoring(event: SecurityEvent): Promise<void> {
    try {
      // Send to SIEM systems (Splunk, ELK, etc.)
      // Send to security dashboards
      // Send to incident response systems
      
      // Example: Send to webhook
      if (process.env.SECURITY_WEBHOOK_URL) {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
      }
    } catch (error) {
      logger.error('Error sending to security monitoring', { error });
    }
  }

  private async triggerSecurityAlert(event: SecurityEvent): Promise<void> {
    try {
      // Send to PagerDuty, OpsGenie, etc.
      // Send SMS/email alerts
      // Trigger automated responses
      
      logger.security('Security alert triggered', { event });
    } catch (error) {
      logger.error('Error triggering security alert', { error });
    }
  }
}

export const securityService = new PremiumSecurityService();
export default securityService;