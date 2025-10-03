const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Rota nÃ£o encontrada - ${req.originalUrl}`);
  error.statusCode = 404;

  // Log da rota nÃ£o encontrada
  logger.warn('Rota nÃ£o encontrada:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  next(error);
};

module.exports = notFound;
