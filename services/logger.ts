import winston from 'winston';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { EventEmitter } from 'events';

interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  meta: any;
  userId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
  error?: Error;
}

interface LogStats {
  totalLogs: number;
  logsByLevel: Record<string, number>;
  logsByHour: Record<number, number>;
  errors: number;
  warnings: number;
  lastError?: Date;
}

class AdvancedLogger extends EventEmitter {
  private logger: winston.Logger;
  private logs: LogEntry[] = [];
  private stats: LogStats = {
    totalLogs: 0,
    logsByLevel: {},
    logsByHour: {},
    errors: 0,
    warnings: 0,
  };

  constructor() {
    super();
    this.initializeLogger();
    this.startStatsCollection();
  }

  private initializeLogger(): void {
    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.json(),
      format.printf(({ timestamp, level, message, meta, stack, ...rest }) => {
        const logEntry: LogEntry = {
          timestamp: new Date(timestamp),
          level,
          message,
          meta: { ...meta, ...rest },
          error: stack ? new Error(stack) : undefined,
        };

        this.processLogEntry(logEntry);
        return JSON.stringify(logEntry);
      })
    );

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        // Console transport
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, level, message, meta }) => {
              const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          ),
        }),

        // Daily rotate file transport for all logs
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat,
        }),

        // Error logs
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: logFormat,
        }),

        // Security logs
        new DailyRotateFile({
          filename: 'logs/security-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '90d',
          level: 'warn',
          format: logFormat,
        }),

        // Access logs
        new DailyRotateFile({
          filename: 'logs/access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          format: logFormat,
        }),
      ],
    });

    // Handle uncaught exceptions
    this.logger.exceptions.handle(
      new DailyRotateFile({
        filename: 'logs/exceptions-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
      })
    );

    // Handle unhandled rejections
    this.logger.rejections.handle(
      new DailyRotateFile({
        filename: 'logs/rejections-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
      })
    );
  }

  private processLogEntry(entry: LogEntry): void {
    // Store log entry
    this.logs.push(entry);

    // Keep only last 10000 logs in memory
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000);
    }

    // Update statistics
    this.updateStats(entry);

    // Emit event for real-time monitoring
    this.emit('log_entry', entry);

    // Check for critical errors
    if (entry.level === 'error') {
      this.emit('critical_error', entry);
    }

    // Check for security events
    if (entry.level === 'warn' && entry.meta?.security) {
      this.emit('security_event', entry);
    }
  }

  private updateStats(entry: LogEntry): void {
    this.stats.totalLogs++;
    this.stats.logsByLevel[entry.level] = (this.stats.logsByLevel[entry.level] || 0) + 1;

    const hour = entry.timestamp.getHours();
    this.stats.logsByHour[hour] = (this.stats.logsByHour[hour] || 0) + 1;

    if (entry.level === 'error') {
      this.stats.errors++;
      this.stats.lastError = entry.timestamp;
    } else if (entry.level === 'warn') {
      this.stats.warnings++;
    }
  }

  // Public logging methods
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // Security-specific logging
  security(message: string, meta?: any): void {
    this.logger.warn(message, { ...meta, security: true });
  }

  // Access logging
  access(req: any, res: any, responseTime?: number): void {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
      sessionId: req.session?.id,
    };

    this.logger.info('HTTP Access', logData);
  }

  // Database logging
  database(operation: string, table: string, duration: number, meta?: any): void {
    this.logger.info('Database Operation', {
      operation,
      table,
      duration,
      ...meta,
    });
  }

  // API logging
  api(method: string, endpoint: string, statusCode: number, duration: number, meta?: any): void {
    this.logger.info('API Request', {
      method,
      endpoint,
      statusCode,
      duration,
      ...meta,
    });
  }

  // Blockchain logging
  blockchain(operation: string, txHash?: string, meta?: any): void {
    this.logger.info('Blockchain Operation', {
      operation,
      txHash,
      ...meta,
    });
  }

  // Performance logging
  performance(operation: string, duration: number, meta?: any): void {
    this.logger.info('Performance', {
      operation,
      duration,
      ...meta,
    });
  }

  // Audit logging
  audit(action: string, userId: string, resource: string, meta?: any): void {
    this.logger.info('Audit Log', {
      action,
      userId,
      resource,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  // Structured logging with context
  logWithContext(level: string, message: string, context: any): void {
    this.logger.log(level, message, context);
  }

  // Get logs with filters
  getLogs(filters: {
    level?: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    ip?: string;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = this.logs;

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.meta?.userId === filters.userId);
    }

    if (filters.ip) {
      filteredLogs = filteredLogs.filter(log => log.meta?.ip === filters.ip);
    }

    if (filters.limit) {
      filteredLogs = filteredLogs.slice(-filters.limit);
    }

    return filteredLogs;
  }

  // Get error logs
  getErrorLogs(hours: number = 24): LogEntry[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.logs.filter(log => log.level === 'error' && log.timestamp > cutoff);
  }

  // Get security logs
  getSecurityLogs(hours: number = 24): LogEntry[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.logs.filter(log => 
      log.level === 'warn' && 
      log.meta?.security && 
      log.timestamp > cutoff
    );
  }

  // Get performance logs
  getPerformanceLogs(hours: number = 24): LogEntry[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.logs.filter(log => 
      log.message === 'Performance' && 
      log.timestamp > cutoff
    );
  }

  // Get statistics
  getStats(): LogStats {
    return { ...this.stats };
  }

  // Get real-time dashboard data
  getDashboardData(): any {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = this.logs.filter(log => log.timestamp > oneHourAgo);
    const dailyLogs = this.logs.filter(log => log.timestamp > oneDayAgo);

    return {
      stats: this.stats,
      recentLogs: recentLogs.length,
      dailyLogs: dailyLogs.length,
      errorRate: this.calculateErrorRate(dailyLogs),
      topErrors: this.getTopErrors(dailyLogs),
      performanceMetrics: this.getPerformanceMetrics(dailyLogs),
      securityEvents: this.getSecurityEvents(dailyLogs),
    };
  }

  private calculateErrorRate(logs: LogEntry[]): number {
    const errors = logs.filter(log => log.level === 'error').length;
    return logs.length > 0 ? (errors / logs.length) * 100 : 0;
  }

  private getTopErrors(logs: LogEntry[]): any[] {
    const errorMessages: Record<string, number> = {};
    
    logs
      .filter(log => log.level === 'error')
      .forEach(log => {
        errorMessages[log.message] = (errorMessages[log.message] || 0) + 1;
      });

    return Object.entries(errorMessages)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getPerformanceMetrics(logs: LogEntry[]): any {
    const performanceLogs = logs.filter(log => log.message === 'Performance');
    
    if (performanceLogs.length === 0) {
      return { avgDuration: 0, maxDuration: 0, minDuration: 0 };
    }

    const durations = performanceLogs.map(log => log.meta?.duration || 0);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    return { avgDuration, maxDuration, minDuration };
  }

  private getSecurityEvents(logs: LogEntry[]): any[] {
    return logs
      .filter(log => log.level === 'warn' && log.meta?.security)
      .map(log => ({
        timestamp: log.timestamp,
        message: log.message,
        meta: log.meta,
      }))
      .slice(-10);
  }

  private startStatsCollection(): void {
    setInterval(() => {
      this.emit('stats_update', this.stats);
    }, 60 * 1000); // Every minute
  }

  // Cleanup old logs
  cleanup(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => log.timestamp > oneWeekAgo);
    
    // Reset hourly stats
    this.stats.logsByHour = {};
  }

  // Export logs
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'meta'];
      const csvData = this.logs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.message,
        JSON.stringify(log.meta),
      ]);

      return [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const advancedLogger = new AdvancedLogger();

// Export for use in other modules
export default advancedLogger; 