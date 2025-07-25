import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { PlaybookExecution } from './soar-engine';

export interface ResponseReport {
  id: string;
  executionId: string;
  timestamp: Date;
  summary: string;
  actions: ResponseAction[];
  metrics: ResponseMetrics;
  recommendations: string[];
  compliance: ComplianceMapping[];
}

export interface ResponseAction {
  type: string;
  description: string;
  status: 'completed' | 'failed' | 'partial';
  timestamp: Date;
  evidence: string[];
}

export interface ResponseMetrics {
  detectionTime: number;
  responseTime: number;
  containmentTime: number;
  recoveryTime: number;
  totalIncidentTime: number;
  automationRate: number;
}

export interface ExecutionMetrics {
  totalDuration: number;
  automatedSteps: number;
  manualSteps: number;
  successRate: number;
  mttr: number;
  automationRate: number;
}

export interface ComplianceMapping {
  framework: 'NIST' | 'ISO27001' | 'SOX' | 'GDPR' | 'HIPAA';
  controls: string[];
  status: 'compliant' | 'non_compliant' | 'partial';
}

export class ResponseOrchestrator extends EventEmitter {
  private logger: Logger;
  private escalationRules: Map<string, EscalationRule>;
  private notificationChannels: Map<string, NotificationChannel>;

  constructor() {
    super();
    this.logger = new Logger('ResponseOrchestrator');
    this.escalationRules = new Map();
    this.notificationChannels = new Map();
  }

  async initialize(): Promise<void> {
    await this.loadEscalationRules();
    await this.loadNotificationChannels();
    this.logger.info('Response Orchestrator initialized');
  }

  private async loadEscalationRules(): Promise<void> {
    const rules: EscalationRule[] = [
      {
        id: 'critical-escalation',
        severity: 'critical',
        timeThreshold: 300000, // 5 minutes
        actions: ['notify-ciso', 'activate-crisis-team', 'external-notification']
      },
      {
        id: 'high-escalation',
        severity: 'high',
        timeThreshold: 900000, // 15 minutes
        actions: ['notify-security-manager', 'page-on-call']
      }
    ];

    for (const rule of rules) {
      this.escalationRules.set(rule.id, rule);
    }
  }

  private async loadNotificationChannels(): Promise<void> {
    const channels: NotificationChannel[] = [
      {
        id: 'email',
        type: 'email',
        config: {
          smtp: process.env.SMTP_SERVER,
          recipients: ['security@company.com', 'soc@company.com']
        }
      },
      {
        id: 'slack',
        type: 'slack',
        config: {
          webhook: process.env.SLACK_WEBHOOK,
          channel: '#security-alerts'
        }
      },
      {
        id: 'teams',
        type: 'teams',
        config: {
          webhook: process.env.TEAMS_WEBHOOK
        }
      }
    ];

    for (const channel of channels) {
      this.notificationChannels.set(channel.id, channel);
    }
  }

  async generateReport(execution: PlaybookExecution): Promise<ResponseReport> {
    const report: ResponseReport = {
      id: `report-${execution.id}`,
      executionId: execution.id,
      timestamp: new Date(),
      summary: this.generateSummary(execution),
      actions: this.extractActions(execution),
      metrics: this.calculateMetrics(execution),
      recommendations: this.generateRecommendations(execution),
      compliance: this.mapCompliance(execution)
    };

    this.logger.info(`Generated response report: ${report.id}`);
    return report;
  }

  private generateSummary(execution: PlaybookExecution): string {
    const completedSteps = execution.steps.filter(s => s.status === 'completed').length;
    const totalSteps = execution.steps.length;
    const duration = execution.endTime ? 
      execution.endTime.getTime() - execution.startTime.getTime() : 0;

    return `Incident response completed with ${completedSteps}/${totalSteps} steps successful. ` +
           `Total response time: ${Math.round(duration / 1000)} seconds. ` +
           `Automation rate: ${Math.round(execution.metrics.automationRate * 100)}%.`;
  }

  private extractActions(execution: PlaybookExecution): ResponseAction[] {
    return execution.steps.map(step => ({
      type: step.type,
      description: step.name,
      status: step.status === 'completed' ? 'completed' : 
              step.status === 'failed' ? 'failed' : 'partial',
      timestamp: new Date(execution.startTime.getTime() + (step.duration || 0)),
      evidence: step.output ? [JSON.stringify(step.output)] : []
    }));
  }

  private calculateMetrics(execution: PlaybookExecution): ResponseMetrics {
    const totalTime = execution.endTime ? 
      execution.endTime.getTime() - execution.startTime.getTime() : 0;

    return {
      detectionTime: 0, // Would be calculated from event timestamp
      responseTime: totalTime,
      containmentTime: this.getStepDuration(execution, 'containment'),
      recoveryTime: this.getStepDuration(execution, 'recovery'),
      totalIncidentTime: totalTime,
      automationRate: execution.metrics.automationRate
    };
  }

  private getStepDuration(execution: PlaybookExecution, type: string): number {
    return execution.steps
      .filter(s => s.type === type)
      .reduce((total, step) => total + (step.duration || 0), 0);
  }

  private generateRecommendations(execution: PlaybookExecution): string[] {
    const recommendations: string[] = [];

    // Analyze failed steps
    const failedSteps = execution.steps.filter(s => s.status === 'failed');
    if (failedSteps.length > 0) {
      recommendations.push('Review and improve failed automation steps');
      recommendations.push('Consider manual backup procedures for critical steps');
    }

    // Analyze response time
    if (execution.metrics.mttr > 1800000) { // 30 minutes
      recommendations.push('Optimize playbook for faster response times');
    }

    // Analyze automation rate
    if (execution.metrics.automationRate < 0.8) {
      recommendations.push('Increase automation coverage for better efficiency');
    }

    return recommendations;
  }

  private mapCompliance(execution: PlaybookExecution): ComplianceMapping[] {
    const mappings: ComplianceMapping[] = [];

    // NIST Cybersecurity Framework mapping
    mappings.push({
      framework: 'NIST',
      controls: this.mapNISTControls(execution),
      status: this.assessComplianceStatus(execution, 'NIST')
    });

    // ISO 27001 mapping
    mappings.push({
      framework: 'ISO27001',
      controls: this.mapISO27001Controls(execution),
      status: this.assessComplianceStatus(execution, 'ISO27001')
    });

    return mappings;
  }

  private mapNISTControls(execution: PlaybookExecution): string[] {
    const controls: string[] = [];
    
    for (const step of execution.steps) {
      switch (step.type) {
        case 'investigation':
          controls.push('DE.AE-2', 'DE.AE-3'); // Detection and Analysis
          break;
        case 'containment':
          controls.push('RS.MI-1', 'RS.MI-2'); // Mitigation
          break;
        case 'eradication':
          controls.push('RS.MI-3'); // Mitigation
          break;
        case 'recovery':
          controls.push('RC.RP-1', 'RC.IM-1'); // Recovery
          break;
        case 'notification':
          controls.push('RS.CO-2', 'RS.CO-3'); // Communications
          break;
      }
    }

    return [...new Set(controls)];
  }

  private mapISO27001Controls(execution: PlaybookExecution): string[] {
    const controls: string[] = [];
    
    for (const step of execution.steps) {
      switch (step.type) {
        case 'investigation':
          controls.push('A.16.1.2', 'A.16.1.4');
          break;
        case 'containment':
          controls.push('A.16.1.5');
          break;
        case 'notification':
          controls.push('A.16.1.2');
          break;
      }
    }

    return [...new Set(controls)];
  }

  private assessComplianceStatus(execution: PlaybookExecution, framework: string): 'compliant' | 'non_compliant' | 'partial' {
    const completedSteps = execution.steps.filter(s => s.status === 'completed').length;
    const totalSteps = execution.steps.length;
    const completionRate = completedSteps / totalSteps;

    if (completionRate >= 0.9) return 'compliant';
    if (completionRate >= 0.7) return 'partial';
    return 'non_compliant';
  }

  async handleFailure(execution: PlaybookExecution): Promise<void> {
    this.logger.error(`Handling execution failure: ${execution.id}`);

    // Check escalation rules
    for (const rule of this.escalationRules.values()) {
      if (this.shouldEscalate(execution, rule)) {
        await this.escalate(execution, rule);
      }
    }

    // Generate failure report
    const failureReport = await this.generateFailureReport(execution);
    await this.sendNotification('failure', failureReport);
  }

  private shouldEscalate(execution: PlaybookExecution, rule: EscalationRule): boolean {
    const duration = Date.now() - execution.startTime.getTime();
    return duration > rule.timeThreshold;
  }

  private async escalate(execution: PlaybookExecution, rule: EscalationRule): Promise<void> {
    this.logger.warn(`Escalating execution ${execution.id} due to rule ${rule.id}`);

    for (const action of rule.actions) {
      await this.executeEscalationAction(action, execution);
    }
  }

  private async executeEscalationAction(action: string, execution: PlaybookExecution): Promise<void> {
    switch (action) {
      case 'notify-ciso':
        await this.notifyCISO(execution);
        break;
      case 'activate-crisis-team':
        await this.activateCrisisTeam(execution);
        break;
      case 'external-notification':
        await this.sendExternalNotification(execution);
        break;
      default:
        this.logger.warn(`Unknown escalation action: ${action}`);
    }
  }

  private async notifyCISO(execution: PlaybookExecution): Promise<void> {
    // Implementation for CISO notification
    this.logger.info(`Notifying CISO about execution: ${execution.id}`);
  }

  private async activateCrisisTeam(execution: PlaybookExecution): Promise<void> {
    // Implementation for crisis team activation
    this.logger.info(`Activating crisis team for execution: ${execution.id}`);
  }

  private async sendExternalNotification(execution: PlaybookExecution): Promise<void> {
    // Implementation for external notifications (regulators, customers, etc.)
    this.logger.info(`Sending external notification for execution: ${execution.id}`);
  }

  private async generateFailureReport(execution: PlaybookExecution): Promise<any> {
    return {
      executionId: execution.id,
      failureReason: 'Playbook execution failed',
      failedSteps: execution.steps.filter(s => s.status === 'failed'),
      timestamp: new Date()
    };
  }

  private async sendNotification(type: string, data: any): Promise<void> {
    for (const channel of this.notificationChannels.values()) {
      try {
        await this.sendToChannel(channel, type, data);
      } catch (error) {
        this.logger.error(`Failed to send notification to ${channel.id}:`, error);
      }
    }
  }

  private async sendToChannel(channel: NotificationChannel, type: string, data: any): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel, type, data);
        break;
      case 'slack':
        await this.sendSlack(channel, type, data);
        break;
      case 'teams':
        await this.sendTeams(channel, type, data);
        break;
    }
  }

  private async sendEmail(channel: NotificationChannel, type: string, data: any): Promise<void> {
    // Email implementation
    this.logger.debug(`Sending email notification: ${type}`);
  }

  private async sendSlack(channel: NotificationChannel, type: string, data: any): Promise<void> {
    // Slack implementation
    this.logger.debug(`Sending Slack notification: ${type}`);
  }

  private async sendTeams(channel: NotificationChannel, type: string, data: any): Promise<void> {
    // Teams implementation
    this.logger.debug(`Sending Teams notification: ${type}`);
  }
}

interface EscalationRule {
  id: string;
  severity: string;
  timeThreshold: number;
  actions: string[];
}

interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'teams' | 'webhook';
  config: Record<string, any>;
}
