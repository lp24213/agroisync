import Notification from '../models/Notification.js';
import User from '../models/User.js';
import awsService from './awsService.js';

// Configurações de notificação
const NOTIFICATION_CONFIG = {
  // Templates de notificação por tipo
  templates: {
    NEW_TRANSACTION: {
      title: 'Nova Transação',
      body: 'Você tem uma nova transação pendente de {itemType}',
      priority: 'HIGH',
      channels: ['EMAIL', 'IN_APP'],
      category: 'TRANSACTION'
    },
    NEW_MESSAGE: {
      title: 'Nova Mensagem',
      body: 'Você recebeu uma nova mensagem de {senderName}',
      priority: 'NORMAL',
      channels: ['EMAIL', 'PUSH', 'IN_APP'],
      category: 'MESSAGE'
    },
    STATUS_CHANGED: {
      title: 'Status Alterado',
      body: 'O status da sua transação foi alterado para {newStatus}',
      priority: 'NORMAL',
      channels: ['EMAIL', 'IN_APP'],
      category: 'TRANSACTION'
    },
    PAYMENT_RECEIVED: {
      title: 'Pagamento Recebido',
      body: 'Seu pagamento de R$ {amount} foi processado com sucesso',
      priority: 'HIGH',
      channels: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
      category: 'PAYMENT'
    },
    PAYMENT_FAILED: {
      title: 'Falha no Pagamento',
      body: 'Houve uma falha no processamento do seu pagamento. Tente novamente.',
      priority: 'URGENT',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      category: 'PAYMENT'
    },
    PLAN_EXPIRING: {
      title: 'Plano Expirando',
      body: 'Seu plano {planName} expira em {daysLeft} dias. Renove agora!',
      priority: 'HIGH',
      channels: ['EMAIL', 'PUSH', 'IN_APP'],
      category: 'SYSTEM'
    },
    PLAN_EXPIRED: {
      title: 'Plano Expirado',
      body: 'Seu plano {planName} expirou. Renove para continuar usando todos os recursos.',
      priority: 'URGENT',
      channels: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
      category: 'SYSTEM'
    },
    SYSTEM_ALERT: {
      title: 'Alerta do Sistema',
      body: '{message}',
      priority: 'HIGH',
      channels: ['EMAIL', 'IN_APP'],
      category: 'SYSTEM'
    },
    SECURITY_ALERT: {
      title: 'Alerta de Segurança',
      body: '{message}',
      priority: 'URGENT',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      category: 'SECURITY'
    },
    WELCOME: {
      title: 'Bem-vindo ao AgroSync!',
      body: 'Sua conta foi criada com sucesso. Comece a usar todos os recursos da plataforma.',
      priority: 'NORMAL',
      channels: ['EMAIL', 'IN_APP'],
      category: 'MARKETING'
    },
    VERIFICATION_REQUIRED: {
      title: 'Verificação Necessária',
      body: 'Por favor, verifique seu {verificationType} para continuar.',
      priority: 'HIGH',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      category: 'SYSTEM'
    }
  },

  // Configurações de canal
  channels: {
    EMAIL: {
      enabled: true,
      priority: 1,
      maxRetries: 3,
      retryDelay: 300000 // 5 minutos
    },
    SMS: {
      enabled: true,
      priority: 2,
      maxRetries: 2,
      retryDelay: 600000 // 10 minutos
    },
    PUSH: {
      enabled: true,
      priority: 3,
      maxRetries: 2,
      retryDelay: 300000 // 5 minutos
    },
    IN_APP: {
      enabled: true,
      priority: 4,
      maxRetries: 0,
      retryDelay: 0
    }
  }
};

class NotificationService {
  constructor() {
    this.processingQueue = [];
    this.isProcessing = false;
  }

  /**
   * Criar e enviar notificação
   * @param {Object} options - Opções da notificação
   * @returns {Promise<Object>} Resultado da operação
   */
  async createAndSendNotification(options) {
    try {
      const {
        userId,
        type,
        data = {},
        channels = null,
        priority = null,
        category = null,
        metadata = {}
      } = options;

      // Verificar se o usuário existe
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Obter template da notificação
      const template = NOTIFICATION_CONFIG.templates[type];
      if (!template) {
        throw new Error(`Tipo de notificação inválido: ${type}`);
      }

      // Preparar dados da notificação
      const notificationData = {
        userId,
        type,
        title: this.interpolateTemplate(template.title, data),
        body: this.interpolateTemplate(template.body, data),
        channels: channels || template.channels,
        priority: priority || template.priority,
        category: category || template.category,
        data,
        metadata: {
          ...metadata,
          source: 'agrosync',
          trigger: type
        }
      };

      // Criar notificação no banco
      const notification = new Notification(notificationData);
      await notification.save();

      // Adicionar à fila de processamento
      this.addToProcessingQueue(notification);

      console.log(`Notificação ${notification.id} criada para usuário ${userId}`);

      return {
        success: true,
        notificationId: notification.id,
        message: 'Notificação criada e adicionada à fila de processamento'
      };

    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Interpolar template com dados
   * @param {string} template - Template da mensagem
   * @param {Object} data - Dados para interpolação
   * @returns {string} Mensagem interpolada
   */
  interpolateTemplate(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Adicionar notificação à fila de processamento
   * @param {Notification} notification - Notificação para processar
   */
  addToProcessingQueue(notification) {
    this.processingQueue.push(notification);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Processar fila de notificações
   */
  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.processingQueue.length > 0) {
        const notification = this.processingQueue.shift();
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error('Erro ao processar fila de notificações:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Processar notificação individual
   * @param {Notification} notification - Notificação para processar
   */
  async processNotification(notification) {
    try {
      console.log(`Processando notificação ${notification.id}`);

      // Processar cada canal configurado
      for (const channel of notification.channels) {
        if (NOTIFICATION_CONFIG.channels[channel]?.enabled) {
          await this.sendToChannel(notification, channel);
        }
      }

      // Marcar como processada
      notification.processed = true;
      notification.processedAt = new Date();
      await notification.save();

      console.log(`Notificação ${notification.id} processada com sucesso`);

    } catch (error) {
      console.error(`Erro ao processar notificação ${notification.id}:`, error);
      
      // Marcar como falha
      notification.processed = true;
      notification.processedAt = new Date();
      await notification.save();
    }
  }

  /**
   * Enviar notificação para canal específico
   * @param {Notification} notification - Notificação para enviar
   * @param {string} channel - Canal de envio
   */
  async sendToChannel(notification, channel) {
    try {
      const channelConfig = NOTIFICATION_CONFIG.channels[channel];
      
      if (!channelConfig?.enabled) {
        return;
      }

      // Verificar se já foi enviada
      if (notification.deliveryStatus[channel]?.status !== 'PENDING') {
        return;
      }

      // Marcar como enviando
      notification.deliveryStatus[channel].status = 'SENT';
      notification.deliveryStatus[channel].sentAt = new Date();
      await notification.save();

      // Enviar baseado no canal
      let result;
      switch (channel) {
        case 'EMAIL':
          result = await this.sendEmail(notification);
          break;
        case 'SMS':
          result = await this.sendSMS(notification);
          break;
        case 'PUSH':
          result = await this.sendPush(notification);
          break;
        case 'IN_APP':
          result = await this.sendInApp(notification);
          break;
        default:
          throw new Error(`Canal não suportado: ${channel}`);
      }

      if (result.success) {
        // Marcar como entregue
        await notification.markAsDelivered(channel);
      } else {
        // Marcar como falha
        await notification.markAsFailed(channel, result.error);
      }

    } catch (error) {
      console.error(`Erro ao enviar para canal ${channel}:`, error);
      await notification.markAsFailed(channel, error.message);
    }
  }

  /**
   * Enviar notificação por email
   * @param {Notification} notification - Notificação para enviar
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendEmail(notification) {
    try {
      const user = await User.findById(notification.userId);
      if (!user?.email) {
        throw new Error('Usuário não tem email válido');
      }

      const emailResult = await awsService.sendEmail(
        user.email,
        notification.title,
        this.generateEmailHTML(notification),
        notification.body
      );

      return emailResult;

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar notificação por SMS
   * @param {Notification} notification - Notificação para enviar
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendSMS(notification) {
    try {
      const user = await User.findById(notification.userId);
      if (!user?.phone) {
        throw new Error('Usuário não tem telefone válido');
      }

      const smsResult = await awsService.sendSMS(
        user.phone,
        `${notification.title}: ${notification.body}`
      );

      return smsResult;

    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar notificação push
   * @param {Notification} notification - Notificação para enviar
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendPush(notification) {
    try {
      // Em produção, implementar FCM ou AWS SNS
      // Por enquanto, simular sucesso
      console.log(`Push notification enviado para usuário ${notification.userId}`);
      
      return {
        success: true,
        message: 'Push notification enviado'
      };

    } catch (error) {
      console.error('Erro ao enviar push:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar notificação in-app
   * @param {Notification} notification - Notificação para enviar
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendInApp(notification) {
    try {
      // Notificação in-app é automaticamente "entregue" quando salva no banco
      console.log(`Notificação in-app criada para usuário ${notification.userId}`);
      
      return {
        success: true,
        message: 'Notificação in-app criada'
      };

    } catch (error) {
      console.error('Erro ao criar notificação in-app:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gerar HTML para email
   * @param {Notification} notification - Notificação para gerar HTML
   * @returns {string} HTML do email
   */
  generateEmailHTML(notification) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 AgroSync</h1>
            <p>Plataforma de Agronegócio</p>
          </div>
          
          <div class="content">
            <h2>${notification.title}</h2>
            <p>${notification.body}</p>
            
            <p>Acesse sua conta para mais detalhes.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Buscar notificações do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} options - Opções de busca
   * @returns {Promise<Object>} Notificações encontradas
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        read = null,
        archived = false,
        type = null,
        category = null
      } = options;

      const skip = (page - 1) * limit;
      const query = { userId, archived };

      if (read !== null) {
        query.read = read;
      }

      if (type) {
        query.type = type;
      }

      if (category) {
        query.category = category;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(query);

      return {
        success: true,
        data: {
          notifications,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      };

    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marcar notificação como lida
   * @param {string} notificationId - ID da notificação
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Resultado da operação
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      await notification.markAsRead();

      return {
        success: true,
        message: 'Notificação marcada como lida'
      };

    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Arquivar notificação
   * @param {string} notificationId - ID da notificação
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Resultado da operação
   */
  async archiveNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      await notification.archive();

      return {
        success: true,
        message: 'Notificação arquivada'
      };

    } catch (error) {
      console.error('Erro ao arquivar notificação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpar notificações expiradas
   * @returns {Promise<Object>} Resultado da operação
   */
  async cleanupExpiredNotifications() {
    try {
      const result = await Notification.cleanupExpired();
      
      console.log(`${result.deletedCount} notificações expiradas removidas`);

      return {
        success: true,
        deletedCount: result.deletedCount,
        message: 'Limpeza de notificações concluída'
      };

    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter estatísticas de notificações
   * @param {string} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Estatísticas
   */
  async getNotificationStats(userId = null) {
    try {
      const query = userId ? { userId } : {};

      const stats = await Notification.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: { $sum: { $cond: ['$read', 0, 1] } },
            read: { $sum: { $cond: ['$read', 1, 0] } },
            archived: { $sum: { $cond: ['$archived', 1, 0] } },
            byType: {
              $push: {
                type: '$type',
                category: '$category',
                priority: '$priority'
              }
            }
          }
        }
      ]);

      const result = stats[0] || {
        total: 0,
        unread: 0,
        read: 0,
        archived: 0,
        byType: []
      };

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância única do serviço
const notificationService = new NotificationService();

// Agendar limpeza automática de notificações expiradas
setInterval(() => {
  notificationService.cleanupExpiredNotifications();
}, 24 * 60 * 60 * 1000); // Diariamente

export default notificationService;
