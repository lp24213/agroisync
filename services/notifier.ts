/**
 * AGROTM Premium Notification Service
 * Enterprise-grade notification system with multi-channel delivery
 */

import { logger } from '@/utils/logger';

export interface AlertData {
  id: string;
  farmId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'business' | 'technical';
  timestamp: Date;
  metadata: Record<string, any>;
  channels: NotificationChannel[];
  recipients: string[];
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  deliveryAttempts: number;
  deliveredAt?: Date;
  errorMessage?: string;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'discord' | 'telegram';
  config: Record<string, any>;
  priority: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  channels: NotificationChannel[];
}

export interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  byChannel: Record<string, { sent: number; delivered: number; failed: number }>;
  bySeverity: Record<string, number>;
  last24h: number;
}

class PremiumNotificationService {
  private notifications: AlertData[] = [];
  private templates: Map<string, NotificationTemplate> = new Map();
  private deliveryQueue: AlertData[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeTemplates();
    this.startDeliveryProcessor();
  }

  /**
   * Send alert with premium features
   */
  async sendAlert(
    farmId: string,
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'high',
    category: 'security' | 'performance' | 'business' | 'technical' = 'business',
    metadata: Record<string, any> = {},
    channels: NotificationChannel[] = [],
    recipients: string[] = []
  ): Promise<string> {
    try {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      const alert: AlertData = {
        id: alertId,
        farmId,
        message,
        severity,
        category,
        timestamp: new Date(),
        metadata,
        channels: channels.length > 0 ? channels : this.getDefaultChannels(severity),
        recipients: recipients.length > 0 ? recipients : await this.getDefaultRecipients(farmId),
        status: 'pending',
        deliveryAttempts: 0
      };

      this.notifications.push(alert);
      this.deliveryQueue.push(alert);

      // Log the alert
      logger.info('Alert created', { alertId, farmId, severity, category });

      // Trigger immediate delivery for critical alerts
      if (severity === 'critical') {
        await this.processDelivery(alert);
      }

      return alertId;
    } catch (error) {
      logger.error('Error creating alert', { farmId, message, error });
      throw new Error(`Failed to create alert for farm ${farmId}`);
    }
  }

  /**
   * Send notification with template
   */
  async sendNotification(
    farmId: string,
    templateId: string,
    variables: Record<string, any> = {},
    channels: NotificationChannel[] = [],
    recipients: string[] = []
  ): Promise<string> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Replace variables in template
      let subject = template.subject;
      let body = template.body;

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, String(value));
        body = body.replace(regex, String(value));
      });

      return await this.sendAlert(
        farmId,
        body,
        'medium',
        'business',
        { templateId, subject, variables },
        channels.length > 0 ? channels : template.channels,
        recipients
      );
    } catch (error) {
      logger.error('Error sending notification with template', { farmId, templateId, error });
      throw error;
    }
  }

  /**
   * Send productivity report
   */
  async sendProductivityReport(
    farmId: string,
    productivity: number,
    details: Record<string, any>,
    recipients: string[] = []
  ): Promise<string> {
    const message = `📊 Productivity Report - Farm ${farmId}: ${productivity}% efficiency`;
    
    const metadata = {
      productivity,
      details,
      reportType: 'productivity',
      generatedAt: new Date().toISOString()
    };

    return await this.sendAlert(
      farmId,
      message,
      productivity < 50 ? 'high' : productivity < 75 ? 'medium' : 'low',
      'business',
      metadata,
      [],
      recipients
    );
  }

  /**
   * Get notification metrics
   */
  getMetrics(): NotificationMetrics {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    
    const last24hNotifications = this.notifications.filter(
      n => n.timestamp.getTime() > last24h
    ).length;

    const totalSent = this.notifications.length;
    const totalDelivered = this.notifications.filter(n => n.status === 'delivered').length;
    const totalFailed = this.notifications.filter(n => n.status === 'failed').length;
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

    const byChannel: Record<string, { sent: number; delivered: number; failed: number }> = {};
    const bySeverity: Record<string, number> = {};

    this.notifications.forEach(notification => {
      // Count by severity
      bySeverity[notification.severity] = (bySeverity[notification.severity] || 0) + 1;

      // Count by channel
      notification.channels.forEach(channel => {
        if (!byChannel[channel.type]) {
          byChannel[channel.type] = { sent: 0, delivered: 0, failed: 0 };
        }
        byChannel[channel.type].sent++;
        
        if (notification.status === 'delivered') {
          byChannel[channel.type].delivered++;
        } else if (notification.status === 'failed') {
          byChannel[channel.type].failed++;
        }
      });
    });

    // Calculate average delivery time
    const deliveredNotifications = this.notifications.filter(n => n.deliveredAt);
    const totalDeliveryTime = deliveredNotifications.reduce((sum, n) => {
      return sum + (n.deliveredAt!.getTime() - n.timestamp.getTime());
    }, 0);
    const averageDeliveryTime = deliveredNotifications.length > 0 
      ? totalDeliveryTime / deliveredNotifications.length 
      : 0;

    return {
      totalSent,
      totalDelivered,
      totalFailed,
      deliveryRate,
      averageDeliveryTime,
      byChannel,
      bySeverity,
      last24h: last24hNotifications
    };
  }

  /**
   * Get recent notifications
   */
  getRecentNotifications(limit: number = 50): AlertData[] {
    return this.notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Add notification template
   */
  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template);
    logger.info('Notification template added', { templateId: template.id });
  }

  /**
   * Get notification template
   */
  getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  // Private methods

  private initializeTemplates(): void {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Notification',
        subject: 'Welcome to AGROTM, {{userName}}!',
        body: 'Welcome to AGROTM! Your account has been successfully created. Start exploring our DeFi platform for agricultural investments.',
        variables: ['userName'],
        channels: [
          { type: 'email', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 2 }
        ]
      },
      {
        id: 'stake_success',
        name: 'Stake Success',
        subject: 'Stake Successful - {{amount}} {{token}}',
        body: 'Your stake of {{amount}} {{token}} has been successfully processed. You can track your rewards in the dashboard.',
        variables: ['amount', 'token'],
        channels: [
          { type: 'email', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 2 }
        ]
      },
      {
        id: 'security_alert',
        name: 'Security Alert',
        subject: 'Security Alert - {{alertType}}',
        body: 'A security alert has been triggered: {{alertType}}. Please review your account activity immediately.',
        variables: ['alertType'],
        channels: [
          { type: 'email', config: {}, priority: 1 },
          { type: 'sms', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 1 }
        ]
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private getDefaultChannels(severity: string): NotificationChannel[] {
    switch (severity) {
      case 'critical':
        return [
          { type: 'email', config: {}, priority: 1 },
          { type: 'sms', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 1 },
          { type: 'slack', config: {}, priority: 2 }
        ];
      case 'high':
        return [
          { type: 'email', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 2 },
          { type: 'slack', config: {}, priority: 3 }
        ];
      case 'medium':
        return [
          { type: 'email', config: {}, priority: 1 },
          { type: 'push', config: {}, priority: 2 }
        ];
      default:
        return [
          { type: 'email', config: {}, priority: 1 }
        ];
    }
  }

  private async getDefaultRecipients(farmId: string): Promise<string[]> {
    // In a real implementation, this would fetch from database
    // For now, return default recipients
    return [
      'admin@agrotm.com',
      'support@agrotm.com'
    ];
  }

  private async startDeliveryProcessor(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    while (this.isProcessing) {
      const notification = this.deliveryQueue.shift();
      
      if (notification) {
        await this.processDelivery(notification);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async processDelivery(notification: AlertData): Promise<void> {
    try {
      notification.deliveryAttempts++;
      
      // Sort channels by priority
      const sortedChannels = [...notification.channels].sort((a, b) => a.priority - b.priority);
      
      for (const channel of sortedChannels) {
        try {
          await this.deliverToChannel(notification, channel);
          
          // Mark as delivered if at least one channel succeeded
          notification.status = 'delivered';
          notification.deliveredAt = new Date();
          
          logger.info('Notification delivered', { 
            alertId: notification.id, 
            channel: channel.type 
          });
          
          break; // Stop after first successful delivery
        } catch (error) {
          logger.error('Channel delivery failed', { 
            alertId: notification.id, 
            channel: channel.type, 
            error 
          });
        }
      }
      
      if (notification.status !== 'delivered') {
        notification.status = 'failed';
        notification.errorMessage = 'All delivery channels failed';
      }
    } catch (error) {
      logger.error('Error processing delivery', { alertId: notification.id, error });
      notification.status = 'failed';
      notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  private async deliverToChannel(notification: AlertData, channel: NotificationChannel): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.deliverEmail(notification, channel);
        break;
      case 'sms':
        await this.deliverSMS(notification, channel);
        break;
      case 'push':
        await this.deliverPush(notification, channel);
        break;
      case 'webhook':
        await this.deliverWebhook(notification, channel);
        break;
      case 'slack':
        await this.deliverSlack(notification, channel);
        break;
      case 'discord':
        await this.deliverDiscord(notification, channel);
        break;
      case 'telegram':
        await this.deliverTelegram(notification, channel);
        break;
      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }
  }

  private async deliverEmail(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use SendGrid, AWS SES, etc.
    logger.info('Email delivery simulated', { alertId: notification.id });
  }

  private async deliverSMS(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use Twilio, AWS SNS, etc.
    logger.info('SMS delivery simulated', { alertId: notification.id });
  }

  private async deliverPush(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use Firebase Cloud Messaging, etc.
    logger.info('Push notification delivery simulated', { alertId: notification.id });
  }

  private async deliverWebhook(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would send HTTP POST to webhook URL
    logger.info('Webhook delivery simulated', { alertId: notification.id });
  }

  private async deliverSlack(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use Slack Web API
    logger.info('Slack delivery simulated', { alertId: notification.id });
  }

  private async deliverDiscord(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use Discord Webhook API
    logger.info('Discord delivery simulated', { alertId: notification.id });
  }

  private async deliverTelegram(notification: AlertData, channel: NotificationChannel): Promise<void> {
    // Implementation would use Telegram Bot API
    logger.info('Telegram delivery simulated', { alertId: notification.id });
  }
}

export const notificationService = new PremiumNotificationService();
export default notificationService;