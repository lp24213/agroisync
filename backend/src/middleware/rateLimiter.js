// import rateLimit from 'express-rate-limit';

// Tornar Redis dependÃªncias externas para Cloudflare Workers
// import RedisStore from 'rate-limit-redis';
// import Redis from 'ioredis';

// ConfiguraÃ§Ã£o do Redis para rate limiting (comentado para Workers)
// const redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD,
//   retryDelayOnFailover: 100,
//   maxRetriesPerRequest: 3
// });

// Rate limiter geral (comentado para Workers)
// export const generalLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 100, // mÃ¡ximo 100 requests por IP por janela
//   message: {
//     success: false,
//     message: 'Muitas tentativas. Tente novamente em 15 minutos.',
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: req => {
//     // Pular rate limiting para IPs confiÃ¡veis (admin, etc.)
//     const trustedIPs = process.env.TRUSTED_IPS?.split(',') || [];
//     return trustedIPs.includes(req.ip);
//   }
// });

// Rate limiter para autenticaÃ§Ã£o (comentado para Workers)
// export const authLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 5, // mÃ¡ximo 5 tentativas de login por IP por janela
//   message: {
//     success: false,
//     message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: true, // NÃ£o contar requests bem-sucedidos
//   keyGenerator: req => {
//     // Usar email + IP para rate limiting de auth
//     const email = req.body?.email || req.body?.username || 'unknown';
//     return `auth:${req.ip}:${email}`;
//   }
// });

// Rate limiter para admin (comentado para Workers)
// export const adminLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 5 * 60 * 1000, // 5 minutos
//   max: 10, // mÃ¡ximo 10 requests admin por IP por janela
//   message: {
//     success: false,
//     message: 'Muitas tentativas de acesso admin. Tente novamente em 5 minutos.',
//     retryAfter: 5 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Rate limiter para API pÃºblica (comentado para Workers)
// export const apiLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 1 * 60 * 1000, // 1 minuto
//   max: 60, // mÃ¡ximo 60 requests por IP por minuto
//   message: {
//     success: false,
//     message: 'Muitas requisiÃ§Ãµes. Tente novamente em 1 minuto.',
//     retryAfter: 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Rate limiter para uploads (comentado para Workers)
// export const uploadLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 60 * 60 * 1000, // 1 hora
//   max: 10, // mÃ¡ximo 10 uploads por IP por hora
//   message: {
//     success: false,
//     message: 'Muitos uploads. Tente novamente em 1 hora.',
//     retryAfter: 60 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Rate limiter para mensagens (comentado para Workers)
// export const messageLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 1 * 60 * 1000, // 1 minuto
//   max: 30, // mÃ¡ximo 30 mensagens por IP por minuto
//   message: {
//     success: false,
//     message: 'Muitas mensagens. Tente novamente em 1 minuto.',
//     retryAfter: 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Rate limiter para contato (comentado para Workers)
// export const contactLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
//   }),
//   windowMs: 60 * 60 * 1000, // 1 hora
//   max: 5, // mÃ¡ximo 5 mensagens de contato por IP por hora
//   message: {
//     success: false,
//     message: 'Muitas mensagens de contato. Tente novamente em 1 hora.',
//     retryAfter: 60 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Exportar placeholders vazios para manter compatibilidade
export const generalLimiter = null;
export const authLimiter = null;
export const adminLimiter = null;
export const apiLimiter = null;
export const uploadLimiter = null;
export const messageLimiter = null;
export const contactLimiter = null;

export default {
  generalLimiter,
  authLimiter,
  adminLimiter,
  apiLimiter,
  uploadLimiter,
  messageLimiter,
  contactLimiter
};
