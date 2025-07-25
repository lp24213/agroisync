import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { SOAREvent, PlaybookExecution, PlaybookStep } from './soar-engine';

export interface Playbook {
  id: string;
  name: string;
  description: string;
  version: string;
  triggers: PlaybookTrigger[];
  steps: PlaybookStepDefinition[];
  priority: number;
  enabled: boolean;
  tags: string[];
  framework: 'NIST' | 'ISO27001' | 'MITRE' | 'CUSTOM';
  compliance: string[];
}

export interface PlaybookTrigger {
  type: 'event_type' | 'severity' | 'source' | 'indicator' | 'custom';
  condition: string;
  value: any;
}

export interface PlaybookStepDefinition {
  id: string;
  name: string;
  type: 'investigation' | 'containment' | 'eradication' | 'recovery' | 'notification';
  automated: boolean;
  timeout: number;
  retries: number;
  action: PlaybookAction;
  conditions?: string[];
  onSuccess?: string;
  onFailure?: string;
}

export interface PlaybookAction {
  type: string;
  parameters: Record<string, any>;
  script?: string;
  api?: {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  };
}

export class PlaybookEngine extends EventEmitter {
  private logger: Logger;
  private playbooks: Map<string, Playbook>;
  private executions: Map<string, PlaybookExecution>;

  constructor() {
    super();
    this.logger = new Logger('PlaybookEngine');
    this.playbooks = new Map();
    this.executions = new Map();
  }

  async initialize(): Promise<void> {
    await this.loadDefaultPlaybooks();
    this.logger.info('Playbook Engine initialized');
  }

  private async loadDefaultPlaybooks(): Promise<void> {
    const defaultPlaybooks: Playbook[] = [
      {
        id: 'malware-response',
        name: 'Malware Incident Response',
        description: 'Automated response to malware detection',
        version: '1.0',
        framework: 'NIST',
        compliance: ['NIST-800-61', 'ISO-27035'],
        priority: 1,
        enabled: true,
        tags: ['malware', 'incident-response'],
        triggers: [
          { type: 'event_type', condition: 'equals', value: 'malware_detection' },
          { type: 'severity', condition: 'gte', value: 'high' }
        ],
        steps: [
          {
            id: 'isolate-host',
            name: 'Isolate Infected Host',
            type: 'containment',
            automated: true,
            timeout: 300,
            retries: 3,
            action: {
              type: 'network_isolation',
              parameters: { host: '{{event.source_ip}}' }
            }
          },
          {
            id: 'collect-artifacts',
            name: 'Collect Forensic Artifacts',
            type: 'investigation',
            automated: true,
            timeout: 600,
            retries: 2,
            action: {
              type: 'forensic_collection',
              parameters: { host: '{{event.source_ip}}', artifacts: ['memory', 'disk', 'network'] }
            }
          },
          {
            id: 'notify-team',
            name: 'Notify Security Team',
            type: 'notification',
            automated: true,
            timeout: 60,
            retries: 1,
            action: {
              type: 'send_notification',
              parameters: {
                channels: ['email', 'slack'],
                severity: '{{event.severity}}',
                message: 'Malware detected and contained on {{event.source_ip}}'
              }
            }
          }
        ]
      },
      {
        id: 'phishing-response',
        name: 'Phishing Email Response',
        description: 'Automated phishing email investigation and response',
        version: '1.0',
        framework: 'MITRE',
        compliance: ['NIST-800-61'],
        priority: 2,
        enabled: true,
        tags: ['phishing', 'email-security'],
        triggers: [
          { type: 'event_type', condition: 'equals', value: 'phishing_detection' }
        ],
        steps: [
          {
            id: 'block-sender',
            name: 'Block Sender Domain',
            type: 'containment',
            automated: true,
            timeout: 120,
            retries: 2,
            action: {
              type: 'email_block',
              parameters: { sender: '{{event.sender}}', domain: '{{event.sender_domain}}' }
            }
          },
          {
            id: 'quarantine-emails',
            name: 'Quarantine Similar Emails',
            type: 'containment',
            automated: true,
            timeout: 300,
            retries: 1,
            action: {
              type: 'email_quarantine',
              parameters: { subject_pattern: '{{event.subject}}', timeframe: '24h' }
            }
          }
        ]
      }
    ];

    for (const playbook of defaultPlaybooks) {
      this.playbooks.set(playbook.id, playbook);
    }
  }

  async findMatchingPlaybooks(event: SOAREvent): Promise<Playbook[]> {
    const matching: Playbook[] = [];

    for (const playbook of this.playbooks.values()) {
      if (!playbook.enabled) continue;

      const matches = playbook.triggers.every(trigger => 
        this.evaluateTrigger(trigger, event)
      );

      if (matches) {
        matching.push(playbook);
      }
    }

    return matching.sort((a, b) => a.priority - b.priority);
  }

  private evaluateTrigger(trigger: PlaybookTrigger, event: SOAREvent): boolean {
    switch (trigger.type) {
      case 'event_type':
        return this.evaluateCondition(event.type, trigger.condition, trigger.value);
      case 'severity':
        return this.evaluateSeverity(event.severity, trigger.condition, trigger.value);
      case 'source':
        return this.evaluateCondition(event.source, trigger.condition, trigger.value);
      default:
        return false;
    }
  }

  private evaluateCondition(actual: any, condition: string, expected: any): boolean {
    switch (condition) {
      case 'equals': return actual === expected;
      case 'contains': return actual.includes(expected);
      case 'matches': return new RegExp(expected).test(actual);
      default: return false;
    }
  }

  private evaluateSeverity(actual: string, condition: string, expected: string): boolean {
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const actualLevel = severityLevels[actual as keyof typeof severityLevels];
    const expectedLevel = severityLevels[expected as keyof typeof severityLevels];

    switch (condition) {
      case 'equals': return actualLevel === expectedLevel;
      case 'gte': return actualLevel >= expectedLevel;
      case 'lte': return actualLevel <= expectedLevel;
      default: return false;
    }
  }

  async executePlaybook(playbookId: string, event: SOAREvent): Promise<PlaybookExecution> {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) {
      throw new Error(`Playbook not found: ${playbookId}`);
    }

    const execution: PlaybookExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playbookId,
      eventId: event.id,
      status: 'running',
      startTime: new Date(),
      steps: [],
      results: {},
      metrics: {
        totalDuration: 0,
        automatedSteps: 0,
        manualSteps: 0,
        successRate: 0,
        mttr: 0,
        automationRate: 0
      }
    };

    this.executions.set(execution.id, execution);
    this.emit('execution:started', execution);

    // Execute steps sequentially
    for (const stepDef of playbook.steps) {
      const step = await this.executeStep(stepDef, event, execution);
      execution.steps.push(step);

      if (step.status === 'failed' && !stepDef.onFailure) {
        execution.status = 'failed';
        break;
      }
    }

    execution.endTime = new Date();
    execution.status = execution.status === 'running' ? 'completed' : execution.status;

    this.emit('execution:completed', execution);
    return execution;
  }

  private async executeStep(
    stepDef: PlaybookStepDefinition,
    event: SOAREvent,
    execution: PlaybookExecution
  ): Promise<PlaybookStep> {
    const step: PlaybookStep = {
      id: stepDef.id,
      name: stepDef.name,
      type: stepDef.type,
      status: 'running',
      automated: stepDef.automated
    };

    const startTime = Date.now();

    try {
      if (stepDef.automated) {
        step.output = await this.executeAutomatedAction(stepDef.action, event);
        step.status = 'completed';
      } else {
        // Manual step - mark as pending for human intervention
        step.status = 'pending';
      }
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : String(error);
    }

    step.duration = Date.now() - startTime;
    return step;
  }

  private async executeAutomatedAction(action: PlaybookAction, event: SOAREvent): Promise<any> {
    // Substitute event variables in parameters
    const parameters = this.substituteVariables(action.parameters, event);

    switch (action.type) {
      case 'network_isolation':
        return this.executeNetworkIsolation(parameters);
      case 'forensic_collection':
        return this.executeForensicCollection(parameters);
      case 'send_notification':
        return this.executeSendNotification(parameters);
      case 'email_block':
        return this.executeEmailBlock(parameters);
      case 'email_quarantine':
        return this.executeEmailQuarantine(parameters);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private substituteVariables(parameters: any, event: SOAREvent): any {
    const substituted = JSON.parse(JSON.stringify(parameters));
    
    const substitute = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
          const value = this.getNestedValue(event, path);
          return value !== undefined ? value : match;
        });
      } else if (Array.isArray(obj)) {
        return obj.map(substitute);
      } else if (obj && typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = substitute(value);
        }
        return result;
      }
      return obj;
    };

    return substitute(substituted);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async executeNetworkIsolation(parameters: any): Promise<any> {
    this.logger.info(`Isolating host: ${parameters.host}`);
    // Implementation would integrate with network security tools
    return { success: true, host: parameters.host, isolated: true };
  }

  private async executeForensicCollection(parameters: any): Promise<any> {
    this.logger.info(`Collecting forensic artifacts from: ${parameters.host}`);
    // Implementation would integrate with forensic tools
    return { success: true, artifacts: parameters.artifacts, collected: true };
  }

  private async executeSendNotification(parameters: any): Promise<any> {
    this.logger.info(`Sending notification: ${parameters.message}`);
    // Implementation would integrate with notification systems
    return { success: true, channels: parameters.channels, sent: true };
  }

  private async executeEmailBlock(parameters: any): Promise<any> {
    this.logger.info(`Blocking email sender: ${parameters.sender}`);
    // Implementation would integrate with email security tools
    return { success: true, sender: parameters.sender, blocked: true };
  }

  private async executeEmailQuarantine(parameters: any): Promise<any> {
    this.logger.info(`Quarantining emails with pattern: ${parameters.subject_pattern}`);
    // Implementation would integrate with email security tools
    return { success: true, pattern: parameters.subject_pattern, quarantined: true };
  }

  async cancelExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'cancelled';
      this.emit('execution:cancelled', execution);
    }
  }
}
