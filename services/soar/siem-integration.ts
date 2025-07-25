import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { SOAREvent } from './soar-engine';

export interface SIEMConfig {
  type: 'splunk' | 'elastic' | 'qradar' | 'sentinel' | 'chronicle';
  endpoint: string;
  apiKey: string;
  username?: string;
  password?: string;
  index?: string;
  workspace?: string;
}

export interface SIEMQuery {
  id: string;
  name: string;
  query: string;
  timeRange: string;
  fields: string[];
  threshold?: number;
}

export class SIEMIntegration extends EventEmitter {
  private logger: Logger;
  private configs: Map<string, SIEMConfig>;
  private queries: Map<string, SIEMQuery>;
  private pollingInterval: number = 30000; // 30 seconds

  constructor() {
    super();
    this.logger = new Logger('SIEMIntegration');
    this.configs = new Map();
    this.queries = new Map();
  }

  async initialize(): Promise<void> {
    await this.loadConfigurations();
    await this.loadQueries();
    this.startPolling();
    this.logger.info('SIEM Integration initialized');
  }

  private async loadConfigurations(): Promise<void> {
    // Default SIEM configurations
    const defaultConfigs: Record<string, SIEMConfig> = {
      splunk: {
        type: 'splunk',
        endpoint: process.env.SPLUNK_ENDPOINT || 'https://splunk.company.com:8089',
        apiKey: process.env.SPLUNK_API_KEY || '',
        username: process.env.SPLUNK_USERNAME,
        password: process.env.SPLUNK_PASSWORD
      },
      elastic: {
        type: 'elastic',
        endpoint: process.env.ELASTIC_ENDPOINT || 'https://elasticsearch.company.com:9200',
        apiKey: process.env.ELASTIC_API_KEY || '',
        index: process.env.ELASTIC_INDEX || 'security-*'
      },
      sentinel: {
        type: 'sentinel',
        endpoint: process.env.SENTINEL_ENDPOINT || 'https://management.azure.com',
        apiKey: process.env.SENTINEL_API_KEY || '',
        workspace: process.env.SENTINEL_WORKSPACE_ID
      }
    };

    for (const [name, config] of Object.entries(defaultConfigs)) {
      if (config.apiKey) {
        this.configs.set(name, config);
      }
    }
  }

  private async loadQueries(): Promise<void> {
    const defaultQueries: SIEMQuery[] = [
      {
        id: 'failed-logins',
        name: 'Failed Login Attempts',
        query: 'EventCode=4625 OR action=failed_login',
        timeRange: '-15m',
        fields: ['timestamp', 'user', 'source_ip', 'destination'],
        threshold: 5
      },
      {
        id: 'malware-detection',
        name: 'Malware Detection',
        query: 'signature_name=*malware* OR threat_type=malware',
        timeRange: '-5m',
        fields: ['timestamp', 'file_hash', 'file_path', 'host', 'severity']
      },
      {
        id: 'network-anomalies',
        name: 'Network Anomalies',
        query: 'anomaly_score>80 OR traffic_type=suspicious',
        timeRange: '-10m',
        fields: ['timestamp', 'source_ip', 'destination_ip', 'port', 'protocol']
      }
    ];

    for (const query of defaultQueries) {
      this.queries.set(query.id, query);
    }
  }

  private startPolling(): void {
    setInterval(async () => {
      await this.pollAllSIEMs();
    }, this.pollingInterval);
  }

  private async pollAllSIEMs(): Promise<void> {
    for (const [name, config] of this.configs) {
      try {
        await this.pollSIEM(name, config);
      } catch (error) {
        this.logger.error(`Error polling SIEM ${name}:`, error);
      }
    }
  }

  private async pollSIEM(name: string, config: SIEMConfig): Promise<void> {
    for (const query of this.queries.values()) {
      try {
        const results = await this.executeQuery(config, query);
        await this.processResults(name, query, results);
      } catch (error) {
        this.logger.error(`Error executing query ${query.id} on ${name}:`, error);
      }
    }
  }

  private async executeQuery(config: SIEMConfig, query: SIEMQuery): Promise<any[]> {
    switch (config.type) {
      case 'splunk':
        return this.executeSplunkQuery(config, query);
      case 'elastic':
        return this.executeElasticQuery(config, query);
      case 'sentinel':
        return this.executeSentinelQuery(config, query);
      default:
        throw new Error(`Unsupported SIEM type: ${config.type}`);
    }
  }

  private async executeSplunkQuery(config: SIEMConfig, query: SIEMQuery): Promise<any[]> {
    const searchQuery = `search ${query.query} earliest=${query.timeRange} | head 1000`;
    
    // Mock implementation - replace with actual Splunk API calls
    this.logger.debug(`Executing Splunk query: ${searchQuery}`);
    
    // Simulate API response
    return [];
  }

  private async executeElasticQuery(config: SIEMConfig, query: SIEMQuery): Promise<any[]> {
    const elasticQuery = {
      query: {
        bool: {
          must: [
            { query_string: { query: query.query } },
            { range: { '@timestamp': { gte: query.timeRange } } }
          ]
        }
      },
      size: 1000,
      _source: query.fields
    };

    this.logger.debug(`Executing Elastic query:`, elasticQuery);
    
    // Mock implementation - replace with actual Elasticsearch API calls
    return [];
  }

  private async executeSentinelQuery(config: SIEMConfig, query: SIEMQuery): Promise<any[]> {
    const kqlQuery = `${query.query} | where TimeGenerated >= ago(15m) | limit 1000`;
    
    this.logger.debug(`Executing Sentinel KQL query: ${kqlQuery}`);
    
    // Mock implementation - replace with actual Azure Sentinel API calls
    return [];
  }

  private async processResults(siemName: string, query: SIEMQuery, results: any[]): Promise<void> {
    if (results.length === 0) return;

    // Check threshold if defined
    if (query.threshold && results.length < query.threshold) return;

    for (const result of results) {
      const event = this.convertToSOAREvent(siemName, query, result);
      this.emit('event', event);
    }
  }

  private convertToSOAREvent(siemName: string, query: SIEMQuery, result: any): SOAREvent {
    return {
      id: `${siemName}-${query.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(result.timestamp || Date.now()),
      severity: this.determineSeverity(query.id, result),
      type: this.determineEventType(query.id),
      source: siemName,
      data: result,
      indicators: this.extractIndicators(result),
      context: {
        query: query.name,
        siem: siemName,
        original_query: query.query
      }
    };
  }

  private determineSeverity(queryId: string, result: any): 'low' | 'medium' | 'high' | 'critical' {
    // Logic to determine severity based on query type and result content
    if (queryId.includes('malware')) return 'high';
    if (queryId.includes('failed-login') && result.count > 10) return 'medium';
    if (queryId.includes('anomaly') && result.score > 90) return 'high';
    return 'medium';
  }

  private determineEventType(queryId: string): string {
    const typeMapping: Record<string, string> = {
      'failed-logins': 'authentication_failure',
      'malware-detection': 'malware_detection',
      'network-anomalies': 'network_anomaly'
    };
    return typeMapping[queryId] || 'security_event';
  }

  private extractIndicators(result: any): string[] {
    const indicators: string[] = [];
    
    // Extract common IOCs
    if (result.source_ip) indicators.push(result.source_ip);
    if (result.file_hash) indicators.push(result.file_hash);
    if (result.domain) indicators.push(result.domain);
    if (result.url) indicators.push(result.url);
    
    return indicators;
  }

  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from SIEMs');
    // Cleanup connections
  }

  async testConnection(siemName: string): Promise<boolean> {
    const config = this.configs.get(siemName);
    if (!config) return false;

    try {
      // Test connection logic for each SIEM type
      return true;
    } catch (error) {
      this.logger.error(`Connection test failed for ${siemName}:`, error);
      return false;
    }
  }

  addCustomQuery(query: SIEMQuery): void {
    this.queries.set(query.id, query);
    this.logger.info(`Added custom query: ${query.name}`);
  }

  removeQuery(queryId: string): void {
    this.queries.delete(queryId);
    this.logger.info(`Removed query: ${queryId}`);
  }
}
