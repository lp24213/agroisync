import notificationService from '../services/notificationService.js';

/**
 * Middleware para disparar notificações automáticas
 * Este middleware deve ser usado após operações que geram eventos
 */

// Middleware para notificar nova transação
export const notifyNewTransaction = (req, res, next) => {
  try {
    // Salvar a resposta original
    const originalJson = res.json;

    // Sobrescrever o método json para interceptar a resposta
    res.json = function (data) {
      // Se a transação foi criada com sucesso, disparar notificação
      if (data.success && data.data && data.data._id) {
        // Disparar notificação de forma assíncrona (não bloquear a resposta)
        setImmediate(async () => {
          try {
            await notificationService.notifyNewTransaction(data.data);
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      // Restaurar o método original e chamar
      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar nova mensagem
export const notifyNewMessage = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data._id) {
        setImmediate(async () => {
          try {
            await notificationService.notifyNewMessage(data.data);
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar mudança de status
export const notifyStatusChange = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.oldStatus && data.data.newStatus) {
        setImmediate(async () => {
          try {
            await notificationService.notifyStatusChange(
              data.data.transaction,
              data.data.oldStatus,
              data.data.newStatus
            );
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar pagamento recebido
export const notifyPaymentReceived = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.status === 'COMPLETED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentReceived(data.data);
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar falha no pagamento
export const notifyPaymentFailed = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.status === 'FAILED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentFailed(data.data);
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar boas-vindas (após registro)
export const notifyWelcome = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (
        data.success &&
        data.data &&
        data.data.user &&
        data.data.requiresEmailVerification === false
      ) {
        setImmediate(async () => {
          try {
            await notificationService.notifyWelcome(data.data.user);
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para notificar verificação necessária
export const notifyVerificationRequired = (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.requiresEmailVerification === true) {
        setImmediate(async () => {
          try {
            await notificationService.notifyVerificationRequired(data.data.user, 'email');
          } catch {
            // Log de erro silencioso para não bloquear a resposta
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    return next();
  } catch {
    return next();
  }
};

// Middleware para verificar planos expirando (executar periodicamente)
export const checkExpiringPlans = (req, res, next) => {
  try {
    // Este middleware pode ser usado para verificar planos expirando
    // em rotas específicas ou executado periodicamente
    return next();
  } catch {
    return next();
  }
};

// Função para verificar planos expirando (executar via cron job)
export const checkExpiringPlansJob = () => {
  // Esta função deve ser executada diariamente via cron job
  // para verificar usuários com planos expirando

  // Implementar lógica para buscar usuários com planos expirando
  // e disparar notificações apropriadas
  return true;
};

export default {
  notifyNewTransaction,
  notifyNewMessage,
  notifyStatusChange,
  notifyPaymentReceived,
  notifyPaymentFailed,
  notifyWelcome,
  notifyVerificationRequired,
  checkExpiringPlans,
  checkExpiringPlansJob
};
