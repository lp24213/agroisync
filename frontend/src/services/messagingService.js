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
    this.socket = null;
    this.transactionSubscriptions = new Map();
  }

  // Conectar ao serviço de mensageria com Socket.IO
  async connect(userId) {
    try {
      if (this.isConnected) return { success: true };

      // Em produção, usar Socket.IO real
      // this.socket = io(process.env.REACT_APP_SOCKET_URL, {
      //   auth: { userId }
      // });
      
      // Simular conexão Socket.IO para desenvolvimento
      console.log('Conectando ao Socket.IO...');
      
      // Simular eventos de conexão
      setTimeout(() => {
        this.isConnected = true;
        this.userId = userId;
        console.log('Conectado ao Socket.IO');
        
        // Simular evento de conexão
        if (this.onConnect) {
          this.onConnect();
        }
      }, 1000);

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
      
      // Desconectar Socket.IO
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      
      this.isConnected = false;
      this.userId = null;
      
      console.log('Desconectado do serviço de mensageria');
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return { success: false, error: error.message };
    }
  }

  // Inscrever-se em mensagens de uma transação específica
  subscribeToTransaction(transactionId, messageHandler) {
    try {
      if (!this.isConnected) {
        throw new Error('Serviço de mensageria não conectado');
      }

      // Cancelar subscrição anterior se existir
      if (this.transactionSubscriptions.has(transactionId)) {
        this.unsubscribeFromTransaction(transactionId);
      }

      // Em produção, usar Socket.IO real
      // this.socket.emit('join-transaction', { transactionId });
      // this.socket.on(`message-${transactionId}`, messageHandler);
      
      // Simular subscrição para desenvolvimento
      const subscription = {
        transactionId,
        handler: messageHandler,
        unsubscribe: () => {
          // Em produção: this.socket.emit('leave-transaction', { transactionId });
          this.transactionSubscriptions.delete(transactionId);
        }
      };

      this.transactionSubscriptions.set(transactionId, subscription);
      
      // Simular recebimento de mensagens em tempo real
      this.simulateRealTimeMessages(transactionId, messageHandler);
      
      console.log(`Inscrito em mensagens da transação: ${transactionId}`);
      
      return subscription;
    } catch (error) {
      console.error('Erro ao inscrever-se na transação:', error);
      throw error;
    }
  }

  // Cancelar inscrição de uma transação
  unsubscribeFromTransaction(transactionId) {
    try {
      const subscription = this.transactionSubscriptions.get(transactionId);
      if (subscription) {
        subscription.unsubscribe();
        this.transactionSubscriptions.delete(transactionId);
        console.log(`Inscrição cancelada da transação: ${transactionId}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
    }
  }

  // Simular mensagens em tempo real para desenvolvimento
  simulateRealTimeMessages(transactionId, messageHandler) {
    // Em produção, isso seria removido e substituído por Socket.IO real
    const interval = setInterval(() => {
      // Simular mensagens ocasionais (apenas para demonstração)
      if (Math.random() < 0.1) { // 10% de chance a cada intervalo
        const mockMessage = {
          id: `mock_${Date.now()}`,
          transactionId,
          from: 'other_user',
          to: this.userId,
          body: 'Mensagem simulada em tempo real',
          type: 'text',
          createdAt: new Date().toISOString(),
          status: 'delivered'
        };
        messageHandler(mockMessage);
      }
    }, 10000); // Verificar a cada 10 segundos

    // Armazenar o intervalo para limpeza
    const subscription = this.transactionSubscriptions.get(transactionId);
    if (subscription) {
      subscription.cleanupInterval = interval;
    }
  }

  // Enviar mensagem
  async sendMessage(transactionId, toUserId, content, type = 'text', attachments = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Serviço de mensageria não conectado');
      }

      const messageData = {
        transactionId,
        from: this.userId,
        to: toUserId,
        body: content,
        type,
        attachments,
        createdAt: new Date().toISOString(),
        status: 'sent'
      };

      // Enviar via API REST
      const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
      
      if (response.data.success) {
        const sentMessage = response.data.data;
        
        // Em produção, emitir via Socket.IO
        // this.socket.emit('send-message', {
        //   transactionId,
        //   message: sentMessage
        // });
        
        // Simular envio em tempo real
        this.simulateMessageDelivery(transactionId, sentMessage);
        
        return sentMessage;
      } else {
        throw new Error(response.data.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Simular entrega de mensagem em tempo real
  simulateMessageDelivery(transactionId, message) {
    // Em produção, isso seria gerenciado pelo Socket.IO
    setTimeout(() => {
      // Atualizar status para entregue
      message.status = 'delivered';
      
      // Notificar outros usuários inscritos na transação
      const subscription = this.transactionSubscriptions.get(transactionId);
      if (subscription && subscription.handler) {
        subscription.handler(message);
      }
    }, 1000);
  }

  // Obter mensagens de uma transação
  async getTransactionMessages(transactionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/transaction/${transactionId}`);
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        console.warn('Nenhuma mensagem encontrada para a transação:', transactionId);
        return [];
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      return [];
    }
  }

  // Obter conversas do usuário
  async getUserConversations(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/conversations/${userId}`);
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      return [];
    }
  }

  // Marcar mensagem como lida
  async markMessageAsRead(messageId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/messages/${messageId}/read`);
      
      if (response.data.success) {
        // Em produção, emitir via Socket.IO para atualizar em tempo real
        // this.socket.emit('message-read', { messageId });
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao marcar mensagem como lida');
      }
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      throw error;
    }
  }

  // Marcar todas as mensagens de uma transação como lidas
  async markTransactionAsRead(transactionId, userId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/messages/transaction/${transactionId}/read`, {
        userId
      });
      
      if (response.data.success) {
        // Em produção, emitir via Socket.IO para atualizar em tempo real
        // this.socket.emit('transaction-read', { transactionId, userId });
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Erro ao marcar transação como lida');
      }
    } catch (error) {
      console.error('Erro ao marcar transação como lida:', error);
      throw error;
    }
  }

  // Obter estatísticas de mensagens
  async getMessageStats(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/stats/${userId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return {
          total: 0,
          unread: 0,
          conversations: 0
        };
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return {
        total: 0,
        unread: 0,
        conversations: 0
      };
    }
  }
}

export default new MessagingService();
