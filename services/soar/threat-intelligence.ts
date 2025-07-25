import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { SOAREvent } from './soar-engine';

export interface ThreatFeed {
  id: string;
  name: string;
  type: 'commercial' | 'open_source' | 'government' | 'internal';
  endpoint: string;
  apiKey?: string;
  format: 'stix' | 'taxii' | 'json' | 'csv' | 'xml';
  updateInterval: number;
  enabled: boolean;
}

export interface IOC {
  value: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file';
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
  context: Record<string, any>;
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  country: string;
  motivation: string[];
  targets: string[];
  ttps: string[];
  iocs: string[];
}

export class ThreatIntelligence extends EventEmitter {
  private logger: Logger;
  private feeds: Map<string, ThreatFeed>;
  private iocs: Map<string, IOC>;
  private threatActors: Map<string, ThreatActor>;

  constructor() {
    super();
    this.logger = new Logger('ThreatIntelligence');
    this.feeds = new Map();
    this.iocs = new Map();
    this.threatActors = new Map();
  }

  async initialize(): Promise<void> {
    await this.loadThreatFeeds();
    await this.startFeedUpdates();
    this.logger.info('Threat Intelligence initialized');
  }

  private async loadThreatFeeds(): Promise<void> {
    const defaultFeeds: ThreatFeed[] = [
      {
        id: 'misp',
        name: 'MISP Threat Sharing',
        type: 'open_source',
        endpoint: process.env.MISP_ENDPOINT || 'https://misp.local',
        apiKey: process.env.MISP_API_KEY,
        format: 'json',
        updateInterval: 3600000, // 1 hour
        enabled: true
      },
      {
        id: 'otx',
        name: 'AlienVault OTX',
        type: 'commercial',
        endpoint: 'https://otx.alienvault.com/api/v1',
        apiKey: process.env.OTX_API_KEY,
        format: 'json',
        updateInterval: 1800000, // 30 minutes
        enabled: true
      },
      {
        id: 'virustotal',
        name: 'VirusTotal Intelligence',
        type: 'commercial',
        endpoint: 'https://www.virustotal.com/vtapi/v2',
        apiKey: process.env.VT_API_KEY,
        format: 'json',
        updateInterval: 900000, // 15 minutes
        enabled: true
      }
    ];

    for (const feed of defaultFeeds) {
      if (feed.apiKey) {
        this.feeds.set(feed.id, feed);
      }
    }
  }

  private async startFeedUpdates(): Promise<void> {
    for (const feed of this.feeds.values()) {
      if (feed.enabled) {
        setInterval(async () => {
          await this.updateFeed(feed);
        }, feed.updateInterval);

        // Initial update
        await this.updateFeed(feed);
      }
    }
  }

  private async updateFeed(feed: ThreatFeed): Promise<void> {
    try {
      this.logger.info(`Updating threat feed: ${feed.name}`);
      
      const data = await this.fetchFeedData(feed);
      const newIOCs = await this.parseFeedData(feed, data);
      
      let updatedCount = 0;
      for (const ioc of newIOCs) {
        if (this.addOrUpdateIOC(ioc)) {
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        this.logger.info(`Updated ${updatedCount} IOCs from ${feed.name}`);
        this.emit('ioc:updated', newIOCs.map(ioc => ioc.value));
      }

    } catch (error) {
      this.logger.error(`Error updating feed ${feed.name}:`, error);
    }
  }

  private async fetchFeedData(feed: ThreatFeed): Promise<any> {
    // Mock implementation - replace with actual API calls
    switch (feed.id) {
      case 'misp':
        return this.fetchMISPData(feed);
      case 'otx':
        return this.fetchOTXData(feed);
      case 'virustotal':
        return this.fetchVirusTotalData(feed);
      default:
        return [];
    }
  }

  private async fetchMISPData(feed: ThreatFeed): Promise<any> {
    // MISP API implementation
    this.logger.debug(`Fetching MISP data from ${feed.endpoint}`);
    return [];
  }

  private async fetchOTXData(feed: ThreatFeed): Promise<any> {
    // OTX API implementation
    this.logger.debug(`Fetching OTX data from ${feed.endpoint}`);
    return [];
  }

  private async fetchVirusTotalData(feed: ThreatFeed): Promise<any> {
    // VirusTotal API implementation
    this.logger.debug(`Fetching VirusTotal data from ${feed.endpoint}`);
    return [];
  }

  private async parseFeedData(feed: ThreatFeed, data: any): Promise<IOC[]> {
    const iocs: IOC[] = [];
    
    // Parse based on feed format
    switch (feed.format) {
      case 'json':
        return this.parseJSONFeed(feed, data);
      case 'stix':
        return this.parseSTIXFeed(feed, data);
      default:
        return [];
    }
  }

  private parseJSONFeed(feed: ThreatFeed, data: any): IOC[] {
    const iocs: IOC[] = [];
    
    // Generic JSON parsing logic
    if (Array.isArray(data)) {
      for (const item of data) {
        const ioc = this.extractIOCFromJSON(feed, item);
        if (ioc) iocs.push(ioc);
      }
    }
    
    return iocs;
  }

  private parseSTIXFeed(feed: ThreatFeed, data: any): IOC[] {
    // STIX format parsing
    return [];
  }

  private extractIOCFromJSON(feed: ThreatFeed, item: any): IOC | null {
    // Extract IOC from JSON item based on feed structure
    return {
      value: item.indicator || item.value,
      type: this.determineIOCType(item.indicator || item.value),
      confidence: item.confidence || 50,
      severity: item.severity || 'medium',
      source: feed.name,
      firstSeen: new Date(item.first_seen || Date.now()),
      lastSeen: new Date(item.last_seen || Date.now()),
      tags: item.tags || [],
      context: item.context || {}
    };
  }

  private determineIOCType(value: string): IOC['type'] {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return 'ip';
    if (/^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(value)) return 'hash';
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'email';
    if (/^https?:\/\//.test(value)) return 'url';
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'domain';
    return 'file';
  }

  private addOrUpdateIOC(ioc: IOC): boolean {
    const existing = this.iocs.get(ioc.value);
    
    if (!existing) {
      this.iocs.set(ioc.value, ioc);
      return true;
    }
    
    // Update if newer or higher confidence
    if (ioc.lastSeen > existing.lastSeen || ioc.confidence > existing.confidence) {
      this.iocs.set(ioc.value, { ...existing, ...ioc });
      return true;
    }
    
    return false;
  }

  async enrichEvent(event: SOAREvent): Promise<SOAREvent> {
    const enrichedEvent = { ...event };
    const enrichments: any[] = [];

    // Check indicators against IOC database
    for (const indicator of event.indicators) {
      const ioc = this.iocs.get(indicator);
      if (ioc) {
        enrichments.push({
          indicator,
          threat_intel: {
            confidence: ioc.confidence,
            severity: ioc.severity,
            source: ioc.source,
            tags: ioc.tags,
            context: ioc.context
          }
        });

        // Escalate severity if high-confidence threat
        if (ioc.confidence > 80 && ioc.severity === 'critical') {
          enrichedEvent.severity = 'critical';
        }
      }
    }

    // Add enrichment data
    enrichedEvent.context = {
      ...enrichedEvent.context,
      threat_intelligence: enrichments
    };

    // Check for known threat actors
    const threatActors = await this.identifyThreatActors(event);
    if (threatActors.length > 0) {
      enrichedEvent.context.threat_actors = threatActors;
    }

    return enrichedEvent;
  }

  private async identifyThreatActors(event: SOAREvent): Promise<ThreatActor[]> {
    const matches: ThreatActor[] = [];

    for (const actor of this.threatActors.values()) {
      // Check if event indicators match known actor IOCs
      const matchingIOCs = event.indicators.filter(indicator => 
        actor.iocs.includes(indicator)
      );

      if (matchingIOCs.length > 0) {
        matches.push(actor);
      }
    }

    return matches;
  }

  async searchIOCs(query: string, type?: IOC['type']): Promise<IOC[]> {
    const results: IOC[] = [];

    for (const ioc of this.iocs.values()) {
      if (type && ioc.type !== type) continue;
      
      if (ioc.value.includes(query) || 
          ioc.tags.some(tag => tag.includes(query))) {
        results.push(ioc);
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  async getIOCsByType(type: IOC['type']): Promise<IOC[]> {
    return Array.from(this.iocs.values()).filter(ioc => ioc.type === type);
  }

  async addCustomIOC(ioc: Omit<IOC, 'source'>): Promise<void> {
    const customIOC: IOC = {
      ...ioc,
      source: 'custom'
    };

    this.iocs.set(customIOC.value, customIOC);
    this.emit('ioc:added', customIOC);
  }

  async removeIOC(value: string): Promise<void> {
    if (this.iocs.delete(value)) {
      this.emit('ioc:removed', value);
    }
  }

  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting threat intelligence feeds');
    // Cleanup connections
  }

  getStatistics(): any {
    const stats = {
      total_iocs: this.iocs.size,
      by_type: {} as Record<string, number>,
      by_severity: {} as Record<string, number>,
      by_source: {} as Record<string, number>
    };

    for (const ioc of this.iocs.values()) {
      stats.by_type[ioc.type] = (stats.by_type[ioc.type] || 0) + 1;
      stats.by_severity[ioc.severity] = (stats.by_severity[ioc.severity] || 0) + 1;
      stats.by_source[ioc.source] = (stats.by_source[ioc.source] || 0) + 1;
    }

    return stats;
  }
}
