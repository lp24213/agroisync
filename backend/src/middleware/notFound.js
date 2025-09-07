const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  error.statusCode = 404;

  // Log da rota não encontrada
  logger.warn('Rota não encontrada:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  next(error);
};

module.exports = notFound;
