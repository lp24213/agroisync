import { LoggingService } from '../services/loggingService.js';

// Middleware para logging de requisições HTTP
export const requestLogging = (req, res, next) => {
  const startTime = Date.now();

  // Interceptar o método end da resposta
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - startTime;

    // Log da requisição
    LoggingService.logRequest(req, res, responseTime);

    // Log de performance se a resposta for lenta
    if (responseTime > 1000) {
      LoggingService.logPerformance(
        `${req.method} ${req.originalUrl}`,
        responseTime,
        res.statusCode < 400,
        {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          userId: req.user?.userId
        }
      );
    }

    // Log de erro se status >= 400
    if (res.statusCode >= 400) {
      LoggingService.logSecurity(
        'HTTP_ERROR',
        req.user?.userId,
        req.ip,
        req.get('User-Agent'),
        res.statusCode >= 500 ? 'HIGH' : 'MEDIUM',
        {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          userEmail: req.user?.email,
          body: req.method !== 'GET' ? req.body : undefined
        }
      );
    }

    // Chamar o método original
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Middleware para logging de erros
export const errorLogging = (error, req, res, next) => {
  // Log do erro
  LoggingService.error(`Unhandled Error: ${error.message}`, error, {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.userId,
    userEmail: req.user?.email,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Log de segurança para erros críticos
  if (error.status >= 500) {
    LoggingService.logSecurity(
      'CRITICAL_ERROR',
      req.user?.userId,
      req.ip,
      req.get('User-Agent'),
      'HIGH',
      {
        error: error.message,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl
      }
    );
  }

  next(error);
};

// Middleware para logging de autenticação
export const authLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de tentativas de autenticação
    if (req.originalUrl.includes('/auth/')) {
      const isLogin = req.originalUrl.includes('/login');
      const isRegister = req.originalUrl.includes('/register');
      const isPasswordReset = req.originalUrl.includes('/forgot-password');

      if (isLogin || isRegister || isPasswordReset) {
        const success = res.statusCode < 400 && data?.success;
        const email = req.body?.email || data?.data?.user?.email;
        const userId = data?.data?.user?.id || data?.data?.userId;

        LoggingService.logAuth(
          isLogin ? 'login' : isRegister ? 'register' : 'password_reset',
          userId,
          email,
          success,
          {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            url: req.originalUrl,
            success,
            error: success ? null : data?.message
          }
        );
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware para logging de pagamentos
export const paymentLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de transações de pagamento
    if (req.originalUrl.includes('/payments/') || req.originalUrl.includes('/stripe/')) {
      const isPayment =
        req.originalUrl.includes('/create-payment') ||
        req.originalUrl.includes('/confirm-payment') ||
        req.originalUrl.includes('/webhook');

      if (isPayment) {
        const success = res.statusCode < 400 && data?.success;
        const amount = req.body?.amount || data?.data?.amount;
        const currency = req.body?.currency || data?.data?.currency || 'BRL';
        const paymentMethod = req.body?.paymentMethod || data?.data?.paymentMethod;

        LoggingService.logPayment(
          req.originalUrl.includes('/webhook') ? 'webhook' : 'payment',
          req.user?.userId,
          amount,
          currency,
          success,
          {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userEmail: req.user?.email,
            paymentMethod,
            transactionId: data?.data?.transactionId,
            stripeId: data?.data?.stripeId,
            error: success ? null : data?.message
          }
        );
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware para logging de escrow
export const escrowLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de transações de escrow
    if (req.originalUrl.includes('/escrow/')) {
      const success = res.statusCode < 400 && data?.success;
      const amount = req.body?.amount || data?.data?.amount;
      const transactionId = req.params?.id || data?.data?.transactionId;

      LoggingService.logEscrow(
        req.method.toLowerCase(),
        transactionId,
        req.user?.userId,
        amount,
        success,
        {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userEmail: req.user?.email,
          action: req.originalUrl.split('/').pop(),
          error: success ? null : data?.message
        }
      );
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware para logging de mensageria
export const messagingLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de mensagens
    if (req.originalUrl.includes('/messaging/') || req.originalUrl.includes('/messages/')) {
      const success = res.statusCode < 400 && data?.success;
      const messageId = data?.data?.messageId || data?.data?.id;
      const toUserId = req.body?.toUserId || data?.data?.toUserId;

      LoggingService.logMessaging(
        req.method.toLowerCase(),
        req.user?.userId,
        toUserId,
        messageId,
        success,
        {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          fromEmail: req.user?.email,
          toEmail: data?.data?.toEmail,
          messageType: req.body?.type || 'text',
          error: success ? null : data?.message
        }
      );
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware para logging de sistema
export const systemLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de operações do sistema
    if (req.originalUrl.includes('/admin/') || req.originalUrl.includes('/system/')) {
      const success = res.statusCode < 400 && data?.success;
      const component = req.originalUrl.split('/')[2] || 'unknown';

      LoggingService.logSystem(req.method.toLowerCase(), component, success, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.userId,
        userEmail: req.user?.email,
        action: req.originalUrl,
        error: success ? null : data?.message
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Middleware para logging de performance de banco de dados
export const databaseLogging = Model => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      // Interceptar operações de banco de dados
      const startTime = Date.now();

      // Simular logging de operações de banco (em produção, isso seria feito no nível do modelo)
      setTimeout(() => {
        const duration = Date.now() - startTime;
        const operation = req.method.toLowerCase();
        const collection = Model.collection.name;
        const success = res.statusCode < 400;

        LoggingService.logDatabase(operation, collection, success, duration, {
          userId: req.user?.userId,
          url: req.originalUrl,
          recordCount: data?.data?.length || (data?.data ? 1 : 0)
        });
      }, 0);

      return originalJson.call(this, data);
    };

    next();
  };
};

export default {
  requestLogging,
  errorLogging,
  authLogging,
  paymentLogging,
  escrowLogging,
  messagingLogging,
  systemLogging,
  databaseLogging
};
