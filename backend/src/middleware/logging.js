
// Logging utilitário para Worker/D1
export async function logRequest(request, env, extra = {}) {
  try {
    const { method, url } = request;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const userId = request.user?.id || null;
    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO logs (type, method, url, user_agent, ip, user_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind('request', method, url, userAgent, ip, userId, JSON.stringify(extra), now).run();
  } catch (e) {
    // fallback para console
    console.log('[logRequest]', e);
  }
}

export async function logError(error, request, env, extra = {}) {
  try {
    const { method, url } = request;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const userId = request.user?.id || null;
    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO logs (type, method, url, user_agent, ip, user_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind('error', method, url, userAgent, ip, userId, JSON.stringify({ error: error.message, ...extra }), now).run();
  } catch (e) {
    console.log('[logError]', e);
  }
}

export async function logAuth(event, request, env, success, extra = {}) {
  try {
    const { method, url } = request;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const userId = request.user?.id || null;
    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO logs (type, method, url, user_agent, ip, user_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind('auth', method, url, userAgent, ip, userId, JSON.stringify({ event, success, ...extra }), now).run();
  } catch (e) {
    console.log('[logAuth]', e);
  }
}

export async function logPayment(event, request, env, success, extra = {}) {
  try {
    const { method, url } = request;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const userId = request.user?.id || null;
    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO logs (type, method, url, user_agent, ip, user_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind('payment', method, url, userAgent, ip, userId, JSON.stringify({ event, success, ...extra }), now).run();
  } catch (e) {
    console.log('[logPayment]', e);
  }
}

// Middleware para logging de escrow
export const escrowLogging = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log de transaÃ§Ãµes de escrow
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
    // Log de operaÃ§Ãµes do sistema
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
      // Interceptar operaÃ§Ãµes de banco de dados
      const startTime = Date.now();

      // Simular logging de operaÃ§Ãµes de banco (em produÃ§Ã£o, isso seria feito no nÃ­vel do modelo)
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
