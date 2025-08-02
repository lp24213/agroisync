// Simple logger implementation without external dependencies
export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

class ConsoleLogger implements Logger {
  info(message: string, ...args: any[]) {
    console.log(`[INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

// Export singleton instance
export const logger = new ConsoleLogger();

// Export logger factory for creating custom loggers
export const createLogger = (prefix: string): Logger => {
  return {
    info: (message: string, ...args: any[]) => logger.info(`[${prefix}] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => logger.warn(`[${prefix}] ${message}`, ...args),
    error: (message: string, ...args: any[]) => logger.error(`[${prefix}] ${message}`, ...args),
    debug: (message: string, ...args: any[]) => logger.debug(`[${prefix}] ${message}`, ...args),
  };
};
