import notificationService from '../services/notificationService.js';

/**
 * Middleware para disparar notificações automáticas
 * Este middleware deve ser usado após operações que geram eventos
 */

// Middleware para notificar nova transação
export const notifyNewTransaction = async (req, res, next) => {
  try {
    // Salvar a resposta original
    const originalJson = res.json;
    
    // Sobrescrever o método json para interceptar a resposta
    res.json = function(data) {
      // Se a transação foi criada com sucesso, disparar notificação
      if (data.success && data.data && data.data._id) {
        // Disparar notificação de forma assíncrona (não bloquear a resposta)
        setImmediate(async () => {
          try {
            await notificationService.notifyNewTransaction(data.data);
          } catch (error) {
            console.error('Erro ao disparar notificação de nova transação:', error);
          }
        });
      }
      
      // Restaurar o método original e chamar
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de transação:', error);
    next();
  }
};

// Middleware para notificar nova mensagem
export const notifyNewMessage = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data._id) {
        setImmediate(async () => {
          try {
            await notificationService.notifyNewMessage(data.data);
          } catch (error) {
            console.error('Erro ao disparar notificação de nova mensagem:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de mensagem:', error);
    next();
  }
};

// Middleware para notificar mudança de status
export const notifyStatusChange = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data.oldStatus && data.data.newStatus) {
        setImmediate(async () => {
          try {
            await notificationService.notifyStatusChange(
              data.data.transaction,
              data.data.oldStatus,
              data.data.newStatus
            );
          } catch (error) {
            console.error('Erro ao disparar notificação de mudança de status:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de mudança de status:', error);
    next();
  }
};

// Middleware para notificar pagamento recebido
export const notifyPaymentReceived = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data.status === 'COMPLETED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentReceived(data.data);
          } catch (error) {
            console.error('Erro ao disparar notificação de pagamento recebido:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de pagamento:', error);
    next();
  }
};

// Middleware para notificar falha no pagamento
export const notifyPaymentFailed = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data.status === 'FAILED') {
        setImmediate(async () => {
          try {
            await notificationService.notifyPaymentFailed(data.data);
          } catch (error) {
            console.error('Erro ao disparar notificação de falha no pagamento:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de falha no pagamento:', error);
    next();
  }
};

// Middleware para notificar boas-vindas (após registro)
export const notifyWelcome = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data.user && data.data.requiresEmailVerification === false) {
        setImmediate(async () => {
          try {
            await notificationService.notifyWelcome(data.data.user);
          } catch (error) {
            console.error('Erro ao disparar notificação de boas-vindas:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de boas-vindas:', error);
    next();
  }
};

// Middleware para notificar verificação necessária
export const notifyVerificationRequired = async (req, res, next) => {
  try {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success && data.data && data.data.requiresEmailVerification === true) {
        setImmediate(async () => {
          try {
            await notificationService.notifyVerificationRequired(
              data.data.user,
              'email'
            );
          } catch (error) {
            console.error('Erro ao disparar notificação de verificação necessária:', error);
          }
        });
      }
      
      res.json = originalJson;
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de notificação de verificação necessária:', error);
    next();
  }
};

// Middleware para verificar planos expirando (executar periodicamente)
export const checkExpiringPlans = async (req, res, next) => {
  try {
    // Este middleware pode ser usado para verificar planos expirando
    // em rotas específicas ou executado periodicamente
    next();
  } catch (error) {
    console.error('Erro ao verificar planos expirando:', error);
    next();
  }
};

// Função para verificar planos expirando (executar via cron job)
export const checkExpiringPlansJob = async () => {
  try {
    // Esta função deve ser executada diariamente via cron job
    // para verificar usuários com planos expirando
    console.log('Verificando planos expirando...');
    
    // Implementar lógica para buscar usuários com planos expirando
    // e disparar notificações apropriadas
    
  } catch (error) {
    console.error('Erro ao verificar planos expirando:', error);
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
