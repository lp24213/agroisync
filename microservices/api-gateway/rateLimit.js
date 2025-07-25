const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por minuto por IP
  message: { error: 'Muitas requisições, tente novamente em breve.' },
}); 