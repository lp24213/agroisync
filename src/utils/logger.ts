/**
 * Logger Utility
 * Sistema de logging profissional para AGROTM
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

export class Logger {
  private logLevel: LogLevel;
  private context?: string;

  constructor(logLevel: LogLevel = 'info', context?: string) {
    this.logLevel = logLevel;
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    return levels[level] <= levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    
    return `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}${dataStr}`;
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'info':
        return console.info;
      case 'debug':
        return console.debug;
      default:
        return console.log;
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      const consoleMethod = this.getConsoleMethod('error');
      consoleMethod(this.formatMessage('error', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      const consoleMethod = this.getConsoleMethod('warn');
      consoleMethod(this.formatMessage('warn', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      const consoleMethod = this.getConsoleMethod('info');
      consoleMethod(this.formatMessage('info', message, data));
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      const consoleMethod = this.getConsoleMethod('debug');
      consoleMethod(this.formatMessage('debug', message, data));
    }
  }

  child(context: string): Logger {
    const childContext = this.context ? `${this.context}:${context}` : context;
    return new Logger(this.logLevel, childContext);
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// Instância global do logger
export const logger = new Logger(
  (process.env.LOG_LEVEL as LogLevel) || 'info'
);

// Factory function para criar loggers com contexto
export function createLogger(context: string): Logger {
  return logger.child(context);
}

export default logger;
