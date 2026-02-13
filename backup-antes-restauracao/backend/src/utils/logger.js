import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Simple logger wrapper to centralize console usage and allow easy swapping
// of the implementation later (e.g., winston, pino). Exports CommonJS and
// sets default for ESM import compatibility.
const isProd = process.env.NODE_ENV === 'production';

const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Configurar transportes
const transports = [
  // Console para desenvolvimento
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
    format: winston.format.combine(
      winston.format.colorize({ all: !isProd }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}]: ${message}${metaStr}`;
      })
    )
  })
];

// Adicionar arquivos de log em produÃ§Ã£o
if (isProd) {
  // Log geral
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: process.env.LOG_LEVEL || 'info',
      format: jsonFormat
    })
  );

  // Log de erros
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: jsonFormat
    })
  );
}

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: jsonFormat,
  transports,
  exitOnError: false
});

// Adicionar mÃ©todos personalizados
logger.audit = (action, userId, details = {}) => {
  logger.info('AUDIT', { action, userId, timestamp: new Date().toISOString(), ...details });
};

logger.security = (event, details = {}) => {
  logger.warn('SECURITY', { event, timestamp: new Date().toISOString(), ...details });
};

logger.performance = (operation, duration, details = {}) => {
  logger.info('PERFORMANCE', {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.business = (event, details = {}) => {
  logger.info('BUSINESS', { event, timestamp: new Date().toISOString(), ...details });
};

// Middleware para log de requests
logger.requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    };

    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

export default logger;
