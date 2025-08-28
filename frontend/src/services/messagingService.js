import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Estados da mensagem
export const MESSAGE_STATUS = {
  'sent': { name: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  'delivered': { name: 'Entregue', color: 'bg-green-100 text-green-800' },
  'read': { name: 'Lida', color: 'bg-emerald-100 text-emerald-800' },
  'failed': { name: 'Falhou', color: 'bg-red-100 text-red-800' }
};

// Tipos de mensagem
export const MESSAGE_TYPES = {
  'text': 'Texto',
  'image': 'Imagem',
  'file': 'Arquivo',
  'location': 'Localização',
  'system': 'Sistema'
};

class MessagingService {
  constructor() {
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Conectar ao serviço de mensageria
  async connect(userId) {
    try {
      if (this.isConnected) return;

      // Simular conexão com AWS AppSync
      console.log('Conectando ao AWS AppSync...');
      
      // Em produção, aqui seria a conexão real com AppSync
      // const client = new AWSAppSyncClient({
      //   url: process.env.REACT_APP_APPSYNC_URL,
      //   region: process.env.REACT_APP_AWS_REGION,
      //   auth: {
      //     type: 'API_KEY',
      //     apiKey: process.env.REACT_APP_APPSYNC_API_KEY
      //   }
      // });

      this.isConnected = true;
      this.userId = userId;
      console.log('Conectado ao serviço de mensageria');
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao conectar:', error);
      return { success: false, error: error.message };
    }
  }

  // Desconectar do serviço
  async disconnect() {
    try {
      // Cancelar todas as subscrições
      this.subscriptions.forEach((subscription, key) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageHandlers.clear();
      
      this.isConnected = false;
      this.userId = null;
      
      console.log('Desconectado do serviço de mensageria');
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar mensagem
  async sendMessage(transactionId, toUserId, content, type = 'text', attachments = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Serviço de mensageria não conectado');
      }

      const messageData = {
        message: content,
        type,
        attachments,
        metadata: {}
      };

      // Enviar via API REST
      const response = await axios.post(`${API_BASE_URL}/transactions/${transactionId}/messages`, messageData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao enviar mensagem');
      }
      //   mutation: SEND_MESSAGE,
      //   variables: messageData
      // });

      // Simular envio para desenvolvimento
      const mockMessage = this.createMockMessage(messageData);
      
      // Salvar no localStorage para simular persistência
      this.saveMockMessage(mockMessage);
      
      // Notificar outros usuários (simulação de tempo real)
      this.notifyMessageReceived(mockMessage);
      
      return mockMessage;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Buscar mensagens de uma transação
  async getTransactionMessages(transactionId, limit = 50, offset = 0) {
    try {
      // Buscar via API REST
      const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}/messages`);
      
      if (response.data.success) {
        return response.data.messages;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar mensagens');
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  }

  // Buscar conversas do usuário
  async getUserConversations(userId) {
    try {
      // Buscar via API REST
      const response = await axios.get(`${API_BASE_URL}/transactions/conversations`);
      
      if (response.data.success) {
        return response.data.conversations;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar conversas');
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }

  // Marcar mensagem como lida
  async markMessageAsRead(messageId) {
    try {
      // Em produção, atualizar via AWS AppSync mutation
      // const result = await client.mutate({
      //   mutation: MARK_MESSAGE_READ,
      //   variables: { messageId }
      // });

      // Simular atualização para desenvolvimento
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      const messageIndex = allMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex !== -1) {
        allMessages[messageIndex].read = true;
        allMessages[messageIndex].readAt = new Date().toISOString();
        localStorage.setItem('agroisync_messages', JSON.stringify(allMessages));
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      return { success: false, error: error.message };
    }
  }

  // Marcar todas as mensagens de uma transação como lidas
  async markTransactionAsRead(transactionId, userId) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      let updated = false;

      allMessages.forEach(msg => {
        if (msg.transactionId === transactionId && msg.toUserId === userId && !msg.read) {
          msg.read = true;
          msg.readAt = new Date().toISOString();
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('agroisync_messages', JSON.stringify(allMessages));
      }

      return { success: true, updated };
    } catch (error) {
      console.error('Erro ao marcar transação como lida:', error);
      return { success: false, error: error.message };
    }
  }

  // Inscrever para receber mensagens em tempo real
  async subscribeToTransaction(transactionId, onMessageReceived) {
    try {
      if (!this.isConnected) {
        throw new Error('Serviço de mensageria não conectado');
      }

      // Em produção, usar AWS AppSync subscriptions
      // const subscription = client.subscribe({
      //   query: ON_MESSAGE_RECEIVED,
      //   variables: { transactionId }
      // });

      // Simular subscrição para desenvolvimento
      const subscriptionId = `sub_${transactionId}_${Date.now()}`;
      
      // Armazenar handler para notificações
      this.messageHandlers.set(transactionId, onMessageReceived);
      
      // Simular recebimento de mensagens em tempo real
      const mockSubscription = {
        id: subscriptionId,
        transactionId,
        unsubscribe: () => {
          this.messageHandlers.delete(transactionId);
          console.log(`Subscrição cancelada para transação: ${transactionId}`);
        }
      };

      this.subscriptions.set(subscriptionId, mockSubscription);
      
      console.log(`Inscrito para transação: ${transactionId}`);
      return mockSubscription;
    } catch (error) {
      console.error('Erro ao inscrever para transação:', error);
      throw error;
    }
    }

  // Cancelar subscrição
  async unsubscribeFromTransaction(subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(subscriptionId);
        console.log(`Subscrição cancelada: ${subscriptionId}`);
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar subscrição:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar mensagens não lidas
  async getUnreadMessages(userId) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      return allMessages.filter(msg => 
        msg.toUserId === userId && !msg.read
      );
    } catch (error) {
      console.error('Erro ao buscar mensagens não lidas:', error);
      return [];
    }
  }

  // Contar mensagens não lidas
  async getUnreadCount(userId) {
    try {
      const unreadMessages = await this.getUnreadMessages(userId);
      return unreadMessages.length;
    } catch (error) {
      console.error('Erro ao contar mensagens não lidas:', error);
      return 0;
    }
  }

  // Buscar mensagens por período
  async getMessagesByDateRange(transactionId, startDate, endDate) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      const start = new Date(startDate);
      const end = new Date(endDate);

      return allMessages.filter(msg => 
        msg.transactionId === transactionId &&
        new Date(msg.timestamp) >= start &&
        new Date(msg.timestamp) <= end
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      console.error('Erro ao buscar mensagens por período:', error);
      return [];
    }
  }

  // Buscar mensagens por tipo
  async getMessagesByType(transactionId, type) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      return allMessages.filter(msg => 
        msg.transactionId === transactionId && msg.type === type
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      console.error('Erro ao buscar mensagens por tipo:', error);
      return [];
    }
  }

  // Deletar mensagem
  async deleteMessage(messageId, userId) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      const messageIndex = allMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex !== -1) {
        const message = allMessages[messageIndex];
        
        // Apenas o remetente pode deletar
        if (message.fromUserId === userId) {
          allMessages.splice(messageIndex, 1);
          localStorage.setItem('agroisync_messages', JSON.stringify(allMessages));
          return { success: true };
        } else {
          return { success: false, error: 'Não autorizado a deletar esta mensagem' };
        }
      }
      
      return { success: false, error: 'Mensagem não encontrada' };
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      return { success: false, error: error.message };
    }
  }

  // Métodos auxiliares para desenvolvimento
  createMockMessage(messageData) {
    return {
      id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
      read: false,
      readAt: null,
      delivered: true,
      deliveredAt: new Date().toISOString()
    };
  }

  saveMockMessage(message) {
    try {
      const allMessages = JSON.parse(localStorage.getItem('agroisync_messages') || '[]');
      allMessages.push(message);
      localStorage.setItem('agroisync_messages', JSON.stringify(allMessages));
    } catch (error) {
      console.error('Erro ao salvar mensagem mock:', error);
    }
  }

  notifyMessageReceived(message) {
    // Simular notificação em tempo real
    const handler = this.messageHandlers.get(message.transactionId);
    if (handler && typeof handler === 'function') {
      // Simular delay de rede
      setTimeout(() => {
        handler(message);
      }, 100);
    }
  }

  // Gerar dados mock iniciais para demonstração
  generateMockData() {
    const mockMessages = [
      {
        id: 'MSG_1',
        transactionId: 'TXN_1',
        fromUserId: 'user_1',
        toUserId: 'user_2',
        content: 'Olá! Tenho interesse no seu frete. Qual o prazo de entrega?',
        type: 'text',
        timestamp: new Date('2024-01-15T10:00:00').toISOString(),
        read: true,
        readAt: new Date('2024-01-15T10:05:00').toISOString(),
        delivered: true,
        deliveredAt: new Date('2024-01-15T10:00:30').toISOString()
      },
      {
        id: 'MSG_2',
        transactionId: 'TXN_1',
        fromUserId: 'user_2',
        toUserId: 'user_1',
        content: 'Oi! O prazo é de 2-3 dias úteis. Posso fazer por R$ 800,00.',
        type: 'text',
        timestamp: new Date('2024-01-15T10:10:00').toISOString(),
        read: false,
        readAt: null,
        delivered: true,
        deliveredAt: new Date('2024-01-15T10:10:30').toISOString()
      },
      {
        id: 'MSG_3',
        transactionId: 'TXN_2',
        fromUserId: 'user_3',
        toUserId: 'user_1',
        content: 'Gostaria de saber mais sobre o frete de grãos.',
        type: 'text',
        timestamp: new Date('2024-01-16T14:00:00').toISOString(),
        read: false,
        readAt: null,
        delivered: true,
        deliveredAt: new Date('2024-01-16T14:00:30').toISOString()
      }
    ];

    localStorage.setItem('agroisync_messages', JSON.stringify(mockMessages));
    return mockMessages;
  }

  // Reconectar automaticamente
  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Máximo de tentativas de reconexão atingido');
      return { success: false, error: 'Máximo de tentativas de reconexão' };
    }

    try {
      this.reconnectAttempts++;
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      // Aguardar antes de tentar reconectar
      await new Promise(resolve => setTimeout(resolve, 1000 * this.reconnectAttempts));
      
      const result = await this.connect(this.userId);
      if (result.success) {
        this.reconnectAttempts = 0;
        console.log('Reconectado com sucesso');
      }
      
      return result;
    } catch (error) {
      console.error('Erro na reconexão:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new MessagingService();
