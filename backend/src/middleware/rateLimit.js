const rateLimit = require('express-rate-limit');

/**
 * Middleware de rate limiting configurável
 * @param {Object} options - Opções de configuração
 * @param {number} options.windowMs - Janela de tempo em milissegundos
 * @param {number} options.max - Máximo de requests por janela
 * @param {string} options.message - Mensagem de erro personalizada
 * @param {boolean} options.standardHeaders - Incluir headers padrão
 * @param {boolean} options.legacyHeaders - Incluir headers legados
 * @returns {Function} Middleware de rate limiting
 */
const createRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutos por padrão
    max: 100, // 100 requests por padrão
    message: {
      success: false,
      message: 'Muitas requisições. Tente novamente mais tarde.',
      retryAfter: Math.ceil(options.windowMs / 1000)
    },
    standardHeaders: true, // Retorna `RateLimit-*` headers
    legacyHeaders: false, // Retorna `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json(
        options.message || {
          success: false,
          message: 'Muitas requisições. Tente novamente mais tarde.'
        }
      );
    },
    skip: req => {
      // Pular rate limiting para IPs locais em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        const localIPs = ['127.0.0.1', '::1', 'localhost'];
        return localIPs.includes(req.ip);
      }
      return false;
    },
    keyGenerator: req => {
      // Usar IP do cliente ou user ID se autenticado
      return req.user ? req.user.userId : req.ip;
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// Rate limiters pré-configurados para diferentes cenários

/**
 * Rate limiter para APIs públicas (mais permissivo)
 */
const publicAPILimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 requests por 15 minutos
  message: {
    success: false,
    message: 'Limite de requisições atingido para APIs públicas. Tente novamente em 15 minutos.'
  }
});

/**
 * Rate limiter para autenticação (mais restritivo)
 */
const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas de login por 15 minutos
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    security: 'Sua conta pode ser temporariamente bloqueada por segurança.'
  }
});

/**
 * Rate limiter para pagamentos (muito restritivo)
 */
const paymentLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de pagamento por 15 minutos
  message: {
    success: false,
    message: 'Muitas tentativas de pagamento. Tente novamente em 15 minutos.',
    security: 'Por segurança, suas tentativas de pagamento foram limitadas.'
  }
});

/**
 * Rate limiter para uploads de arquivos
 */
const uploadLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 uploads por hora
  message: {
    success: false,
    message: 'Limite de uploads atingido. Tente novamente em 1 hora.'
  }
});

/**
 * Rate limiter para mensagens (moderado)
 */
const messagingLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // 50 mensagens por 15 minutos
  message: {
    success: false,
    message: 'Limite de mensagens atingido. Tente novamente em 15 minutos.'
  }
});

/**
 * Rate limiter para busca e consultas (moderado)
 */
const searchLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 buscas por 15 minutos
  message: {
    success: false,
    message: 'Limite de buscas atingido. Tente novamente em 15 minutos.'
  }
});

/**
 * Rate limiter para webhooks (muito permissivo para serviços externos)
 */
const webhookLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 webhooks por 15 minutos
  message: {
    success: false,
    message: 'Limite de webhooks atingido.'
  },
  skip: req => {
    // Pular rate limiting para webhooks de serviços confiáveis
    const trustedWebhooks = ['stripe.com', 'github.com', 'gitlab.com', 'bitbucket.org'];

    const origin = req.get('Origin') || req.get('User-Agent') || '';
    return trustedWebhooks.some(trusted => origin.includes(trusted));
  }
});

/**
 * Rate limiter para admin (muito permissivo)
 */
const adminLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // 500 requests por 15 minutos
  message: {
    success: false,
    message: 'Limite de requisições admin atingido.'
  },
  skip: req => {
    // Pular rate limiting para usuários admin
    return req.user && req.user.role === 'admin';
  }
});

/**
 * Rate limiter para usuários premium (mais permissivo)
 */
const premiumLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // 300 requests por 15 minutos
  message: {
    success: false,
    message: 'Limite de requisições atingido para usuários premium.'
  },
  skip: req => {
    // Pular rate limiting para usuários premium
    return req.user && req.user.isPaid && req.user.planActive;
  }
});

/**
 * Rate limiter para desenvolvimento (muito permissivo)
 */
const devLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por 15 minutos
  message: {
    success: false,
    message: 'Limite de requisições atingido em desenvolvimento.'
  },
  skip: req => {
    // Pular rate limiting em desenvolvimento
    return process.env.NODE_ENV === 'development';
  }
});

/**
 * Rate limiter personalizado baseado em headers específicos
 */
const headerBasedLimiter = (headerName, maxRequests) => {
  return createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: maxRequests,
    keyGenerator: req => {
      return req.get(headerName) || req.ip;
    },
    message: {
      success: false,
      message: `Limite de requisições atingido para ${headerName}.`
    }
  });
};

/**
 * Rate limiter para diferentes tipos de usuário
 */
const userTypeLimiter = {
  guest: createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
      success: false,
      message: 'Limite de requisições para visitantes atingido. Faça login para aumentar o limite.'
    }
  }),

  basic: createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: {
      success: false,
      message: 'Limite de requisições para usuários básicos atingido.'
    }
  }),

  premium: createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
      success: false,
      message: 'Limite de requisições para usuários premium atingido.'
    }
  }),

  admin: createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
      success: false,
      message: 'Limite de requisições para administradores atingido.'
    }
  })
};

/**
 * Função para aplicar rate limiting baseado no tipo de usuário
 */
const applyUserTypeLimiting = (req, res, next) => {
  let limiter;

  if (!req.user) {
    limiter = userTypeLimiter.guest;
  } else if (req.user.role === 'admin') {
    limiter = userTypeLimiter.admin;
  } else if (req.user.isPaid && req.user.planActive) {
    limiter = userTypeLimiter.premium;
  } else {
    limiter = userTypeLimiter.basic;
  }

  limiter(req, res, next);
};

module.exports = {
  createRateLimit,
  publicAPILimiter,
  authLimiter,
  paymentLimiter,
  uploadLimiter,
  messagingLimiter,
  searchLimiter,
  webhookLimiter,
  adminLimiter,
  premiumLimiter,
  devLimiter,
  headerBasedLimiter,
  userTypeLimiter,
  applyUserTypeLimiting
};
