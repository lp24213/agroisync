import notificationService from '../services/notificationService.js';
import logger from '../utils/logger.js';

/**
 * Middleware para disparar notificaÃ§Ãµes automÃ¡ticas
 * Este middleware deve ser usado apÃ³s operaÃ§Ãµes que geram eventos
 */

// Middleware para notificar nova transaÃ§Ã£o
export const notifyNewTransaction = async (req, res, next) => {
  try {
    // Salvar a resposta original
    const originalJson = res.json;

    // Sobrescrever o mÃ©todo json para interceptar a resposta
    res.json = function (data) {
      // Se a transaÃ§Ã£o foi criada com sucesso, disparar notificaÃ§Ã£o
      if (data.success && data.data && data.data._id) {
        // Disparar notificaÃ§Ã£o de forma assÃ­ncrona (nÃ£o bloquear a resposta)
        setImmediate(async () => {
          try {
            await notificationService.notifyNewTransaction(data.data);
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de nova transaÃ§Ã£o:', error);
          }
        });
      }

      // Restaurar o mÃ©todo original e chamar
      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de transaÃ§Ã£o:', error);
    next();
  }
};

// Middleware para notificar nova mensagem
export const notifyNewMessage = async (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data._id) {
        setImmediate(async () => {
          try {
            await notificationService.notifyNewMessage(data.data);
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de nova mensagem:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de mensagem:', error);
    next();
  }
};

// Middleware para notificar mudanÃ§a de status
export const notifyStatusChange = async (req, res, next) => {
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
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de mudanÃ§a de status:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de mudanÃ§a de status:', error);
    next();
  }
};

// Middleware para notificar pagamento recebido
export const notifyPaymentReceived = async (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.status === 'COMPLETED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentReceived(data.data);
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de pagamento recebido:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de pagamento:', error);
    next();
  }
};

// Middleware para notificar falha no pagamento
export const notifyPaymentFailed = async (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.status === 'FAILED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentFailed(data.data);
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de falha no pagamento:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de falha no pagamento:', error);
    next();
  }
};

// Middleware para notificar boas-vindas (apÃ³s registro)
export const notifyWelcome = async (req, res, next) => {
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
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de boas-vindas:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de boas-vindas:', error);
    next();
  }
};

// Middleware para notificar verificaÃ§Ã£o necessÃ¡ria
export const notifyVerificationRequired = async (req, res, next) => {
  try {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.requiresEmailVerification === true) {
        setImmediate(async () => {
          try {
            await notificationService.notifyVerificationRequired(data.data.user, 'email');
          } catch (error) {
            logger.error('Erro ao disparar notificaÃ§Ã£o de verificaÃ§Ã£o necessÃ¡ria:', error);
          }
        });
      }

      res.json = originalJson;
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Erro no middleware de notificaÃ§Ã£o de verificaÃ§Ã£o necessÃ¡ria:', error);
    next();
  }
};

// Middleware para verificar planos expirando (executar periodicamente)
export const checkExpiringPlans = (req, res, next) => {
  try {
    // Este middleware pode ser usado para verificar planos expirando
    // em rotas especÃ­ficas ou executado periodicamente
    next();
  } catch (error) {
    logger.error('Erro ao verificar planos expirando:', error);
    next();
  }
};

// FunÃ§Ã£o para verificar planos expirando (executar via cron job)
export const checkExpiringPlansJob = () => {
  try {
    // Esta funÃ§Ã£o deve ser executada diariamente via cron job
    // para verificar usuÃ¡rios com planos expirando
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Verificando planos expirando...');
    }
    // Implementar lÃ³gica para buscar usuÃ¡rios com planos expirando
    // e disparar notificaÃ§Ãµes apropriadas
  } catch (error) {
    logger.error('Erro ao verificar planos expirando:', error);
  }
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
