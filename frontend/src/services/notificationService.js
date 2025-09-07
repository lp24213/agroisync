// import axios from 'axios';

// Configuração da API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  'NEW_TRANSACTION': {
    name: 'Nova Transação',
    icon: '🔄',
    color: 'bg-blue-100 text-blue-800',
    description: 'Uma nova transação foi criada'
  },
  'NEW_MESSAGE': {
    name: 'Nova Mensagem',
    icon: '💬',
    color: 'bg-green-100 text-green-800',
    description: 'Você recebeu uma nova mensagem'
  },
  'STATUS_CHANGED': {
    name: 'Status Alterado',
    icon: '📊',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'O status de uma transação foi alterado'
  },
  'PAYMENT_RECEIVED': {
    name: 'Pagamento Recebido',
    icon: '💰',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Um pagamento foi processado'
  },
  'SYSTEM_ALERT': {
    name: 'Alerta do Sistema',
    icon: '⚠️',
    color: 'bg-red-100 text-red-800',
    description: 'Alerta importante do sistema'
  }
};

// Canais de notificação
export const NOTIFICATION_CHANNELS = {
  'EMAIL': 'E-mail',
  'SMS': 'SMS',
  'PUSH': 'Push',
  'IN_APP': 'No App'
};

// Status da notificação
export const NOTIFICATION_STATUS = {
  'PENDING': 'Pendente',
  'SENT': 'Enviada',
  'DELIVERED': 'Entregue',
  'FAILED': 'Falhou',
  'READ': 'Lida'
};

class NotificationService {
  constructor() {
    this.subscriptions = new Map();
    this.notificationHandlers = new Map();
    this.isConnected = false;
    this.userId = null;
  }

  // Inicializar serviço de notificações
  async initialize(userId) {
    try {
      this.userId = userId;
      
      // Conectar ao serviço de notificações em tempo real
      await this.connectToNotificationService();
      
      // Carregar preferências do usuário
      await this.loadUserPreferences();
      
      console.log('Serviço de notificações inicializado');
      return { success: true };
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  // Conectar ao serviço de notificações em tempo real
  async connectToNotificationService() {
    try {
      // Em produção, conectar ao AWS AppSync ou Firebase Cloud Messaging
      // const client = new AWSAppSyncClient({
      //   url: process.env.REACT_APP_APPSYNC_URL,
      //   region: process.env.REACT_APP_AWS_REGION,
      //   auth: {
      //     type: 'API_KEY',
      //     apiKey: process.env.REACT_APP_APPSYNC_API_KEY
      //   }
      // });

      this.isConnected = true;
      console.log('Conectado ao serviço de notificações');
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao conectar ao serviço de notificações:', error);
      throw error;
    }
  }

  // Carregar preferências do usuário
  async loadUserPreferences() {
    try {
      const preferences = localStorage.getItem(`agroisync_notifications_${this.userId}`);
      if (preferences) {
        this.userPreferences = JSON.parse(preferences);
      } else {
        // Preferências padrão
        this.userPreferences = {
          email: true,
          sms: true,
          push: true,
          inApp: true,
          frequency: 'immediate', // immediate, hourly, daily
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        };
        this.saveUserPreferences();
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }

  // Salvar preferências do usuário
  saveUserPreferences() {
    try {
      localStorage.setItem(
        `agroisync_notifications_${this.userId}`, 
        JSON.stringify(this.userPreferences)
      );
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  }

  // Enviar notificação
  async sendNotification(notificationData) {
    try {
      if (!this.isConnected) {
        throw new Error('Serviço de notificações não conectado');
      }

      const notification = {
        id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: this.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        payload: notificationData.payload || {},
        channels: notificationData.channels || ['IN_APP'],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        sentAt: null,
        deliveredAt: null,
        readAt: null
      };

      // Salvar notificação localmente
      this.saveNotification(notification);

      // Enviar via canais configurados
      const results = await Promise.allSettled(
        notification.channels.map(channel => 
          this.sendViaChannel(notification, channel)
        )
      );

      // Atualizar status baseado nos resultados
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      if (successCount > 0) {
        notification.status = 'SENT';
        notification.sentAt = new Date().toISOString();
        this.updateNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  // Enviar via canal específico
  async sendViaChannel(notification, channel) {
    try {
      switch (channel) {
        case 'EMAIL':
          return await this.sendEmail(notification);
        case 'SMS':
          return await this.sendSMS(notification);
        case 'PUSH':
          return await this.sendPush(notification);
        case 'IN_APP':
          return await this.sendInApp(notification);
        default:
          throw new Error(`Canal não suportado: ${channel}`);
      }
    } catch (error) {
      console.error(`Erro ao enviar via ${channel}:`, error);
      throw error;
    }
  }

  // Enviar e-mail via AWS SES
  async sendEmail(notification) {
    try {
      // Em produção, chamar endpoint do backend que usa AWS SES
      // const response = await axios.post(`${API_BASE_URL}/notifications/email`, {
      //   to: this.userEmail,
      //   subject: notification.title,
      //   body: notification.message,
      //   template: 'transaction_notification'
      // });

      // Simular envio para desenvolvimento
      console.log('📧 E-mail enviado via AWS SES:', {
        to: this.userEmail,
        subject: notification.title,
        body: notification.message
      });

      return { success: true, channel: 'EMAIL' };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  // Enviar SMS via AWS SNS
  async sendSMS(notification) {
    try {
      // Em produção, chamar endpoint do backend que usa AWS SNS
      // const response = await axios.post(`${API_BASE_URL}/notifications/sms`, {
      //   to: this.userPhone,
      //   message: notification.message
      // });

      // Simular envio para desenvolvimento
      console.log('📱 SMS enviado via AWS SNS:', {
        to: this.userPhone,
        message: notification.message
      });

      return { success: true, channel: 'SMS' };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      throw error;
    }
  }

  // Enviar push via Firebase Cloud Messaging
  async sendPush(notification) {
    try {
      // Em produção, usar Firebase Cloud Messaging
      // const messaging = getMessaging();
      // const token = await getToken(messaging);
      
      // const response = await axios.post(`${API_BASE_URL}/notifications/push`, {
      //   token: token,
      //   title: notification.title,
      //   body: notification.message,
      //   data: notification.payload
      // });

      // Simular envio para desenvolvimento
      console.log('🔔 Push enviado via FCM:', {
        title: notification.title,
        body: notification.message,
        data: notification.payload
      });

      return { success: true, channel: 'PUSH' };
    } catch (error) {
      console.error('Erro ao enviar push:', error);
      throw error;
    }
  }

  // Enviar notificação no app
  async sendInApp(notification) {
    try {
      // Notificar handlers registrados
      const handlers = this.notificationHandlers.get('inApp') || [];
      handlers.forEach(handler => {
        if (typeof handler === 'function') {
          handler(notification);
        }
      });

      return { success: true, channel: 'IN_APP' };
    } catch (error) {
      console.error('Erro ao enviar notificação no app:', error);
      throw error;
    }
  }

  // Buscar notificações do usuário
  async getUserNotifications(limit = 50, offset = 0) {
    try {
      // Em produção, buscar via API
      // const response = await axios.get(`${API_BASE_URL}/notifications/user/${this.userId}`, {
      //   params: { limit, offset }
      // });

      // Simular busca para desenvolvimento
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );

      return allNotifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + limit);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId) {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      const notificationIndex = allNotifications.findIndex(n => n.id === notificationId);
      if (notificationIndex !== -1) {
        allNotifications[notificationIndex].readAt = new Date().toISOString();
        allNotifications[notificationIndex].status = 'READ';
        
        localStorage.setItem(
          `agroisync_notifications_${this.userId}`, 
          JSON.stringify(allNotifications)
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      return { success: false, error: error.message };
    }
  }

  // Marcar todas como lidas
  async markAllAsRead() {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      const now = new Date().toISOString();
      allNotifications.forEach(n => {
        n.readAt = now;
        n.status = 'READ';
      });
      
      localStorage.setItem(
        `agroisync_notifications_${this.userId}`, 
        JSON.stringify(allNotifications)
      );

      return { success: true, updated: allNotifications.length };
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      return { success: false, error: error.message };
    }
  }

  // Deletar notificação
  async deleteNotification(notificationId) {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      const filteredNotifications = allNotifications.filter(n => n.id !== notificationId);
      
      localStorage.setItem(
        `agroisync_notifications_${this.userId}`, 
        JSON.stringify(filteredNotifications)
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  // Limpar notificações antigas
  async clearOldNotifications(daysOld = 30) {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const recentNotifications = allNotifications.filter(n => 
        new Date(n.createdAt) > cutoffDate
      );
      
      localStorage.setItem(
        `agroisync_notifications_${this.userId}`, 
        JSON.stringify(recentNotifications)
      );

      return { success: true, deleted: allNotifications.length - recentNotifications.length };
    } catch (error) {
      console.error('Erro ao limpar notificações antigas:', error);
      return { success: false, error: error.message };
    }
  }

  // Contar notificações não lidas
  async getUnreadCount() {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      return allNotifications.filter(n => !n.readAt).length;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  }

  // Registrar handler para notificações no app
  registerInAppHandler(handler) {
    if (!this.notificationHandlers.has('inApp')) {
      this.notificationHandlers.set('inApp', []);
    }
    this.notificationHandlers.get('inApp').push(handler);
  }

  // Remover handler
  unregisterInAppHandler(handler) {
    const handlers = this.notificationHandlers.get('inApp') || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // Atualizar preferências
  async updatePreferences(newPreferences) {
    try {
      this.userPreferences = { ...this.userPreferences, ...newPreferences };
      this.saveUserPreferences();
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar se está em horário silencioso
  isQuietHours() {
    if (!this.userPreferences?.quietHours?.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.userPreferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.userPreferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Horário que cruza a meia-noite
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // Métodos auxiliares para desenvolvimento
  saveNotification(notification) {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      allNotifications.unshift(notification);
      localStorage.setItem(
        `agroisync_notifications_${this.userId}`, 
        JSON.stringify(allNotifications)
      );
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
    }
  }

  updateNotification(notification) {
    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(`agroisync_notifications_${this.userId}`) || '[]'
      );
      
      const index = allNotifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        allNotifications[index] = notification;
        localStorage.setItem(
          `agroisync_notifications_${this.userId}`, 
          JSON.stringify(allNotifications)
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
    }
  }

  // Gerar dados mock iniciais para demonstração
  generateMockData() {
    const mockNotifications = [
      {
        id: 'NOTIF_1',
        userId: this.userId,
        type: 'NEW_TRANSACTION',
        title: 'Nova Intenção de Compra',
        message: 'Você recebeu uma nova intenção de compra para seu produto "Soja Premium"',
        payload: { transactionId: 'TXN_1', productId: 'PROD_1' },
        channels: ['IN_APP', 'EMAIL'],
        status: 'READ',
        createdAt: new Date('2024-01-15T10:00:00').toISOString(),
        sentAt: new Date('2024-01-15T10:00:05').toISOString(),
        deliveredAt: new Date('2024-01-15T10:00:10').toISOString(),
        readAt: new Date('2024-01-15T10:05:00').toISOString()
      },
      {
        id: 'NOTIF_2',
        userId: this.userId,
        type: 'NEW_MESSAGE',
        title: 'Nova Mensagem',
        message: 'João Silva enviou uma mensagem sobre o frete #FREIGHT_123',
        payload: { transactionId: 'FREIGHT_123', senderId: 'user_2' },
        channels: ['IN_APP', 'PUSH'],
        status: 'SENT',
        createdAt: new Date('2024-01-16T14:30:00').toISOString(),
        sentAt: new Date('2024-01-16T14:30:05').toISOString(),
        deliveredAt: null,
        readAt: null
      },
      {
        id: 'NOTIF_3',
        userId: this.userId,
        type: 'STATUS_CHANGED',
        title: 'Status da Transação Alterado',
        message: 'Sua transação #TXN_456 foi alterada para "Em Negociação"',
        payload: { transactionId: 'TXN_456', oldStatus: 'PENDING', newStatus: 'NEGOTIATING' },
        channels: ['IN_APP', 'EMAIL', 'SMS'],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        sentAt: null,
        deliveredAt: null,
        readAt: null
      }
    ];

    localStorage.setItem(
      `agroisync_notifications_${this.userId}`, 
      JSON.stringify(mockNotifications)
    );
    
    return mockNotifications;
  }

  // Desconectar do serviço
  async disconnect() {
    try {
      this.isConnected = false;
      this.userId = null;
      this.notificationHandlers.clear();
      
      console.log('Desconectado do serviço de notificações');
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return { success: false, error: error.message };
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
