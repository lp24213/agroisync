import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class MessagingService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/messaging`;
    this.websocket = null;
    this.messageHandlers = new Map();
  }

  // Configurar token de autenticação
  setAuthToken(token) {
    this.authToken = token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Conectar WebSocket para mensagens em tempo real
  connectWebSocket(userId) {
    if (this.websocket) {
      this.websocket.close();
    }

    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3001'}/messaging/${userId}`;
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('WebSocket conectado para mensageria');
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    this.websocket.onclose = () => {
      console.log('WebSocket desconectado');
      // Tentar reconectar após 5 segundos
      setTimeout(() => {
        if (this.websocket?.readyState === WebSocket.CLOSED) {
          this.connectWebSocket(userId);
        }
      }, 5000);
    };

    this.websocket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };
  }

  // Desconectar WebSocket
  disconnectWebSocket() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Registrar handler para mensagens WebSocket
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
  }

  // Remover handler
  offMessage(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Processar mensagens WebSocket
  handleWebSocketMessage(data) {
    const { type, payload } = data;
    
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error('Erro no handler de mensagem:', error);
        }
      });
    }
  }

  // Enviar mensagem via WebSocket
  sendWebSocketMessage(type, payload) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type, payload }));
    }
  }

  // ===== API REST METHODS =====

  // Obter lista de conversas
  async getConversations(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conversas:', error);
      throw error;
    }
  }

  // Obter mensagens de uma conversa
  async getMessages(chatId, page = 1, limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/messages/${chatId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter mensagens:', error);
      throw error;
    }
  }

  // Enviar mensagem
  async sendMessage(messageData) {
    try {
      const response = await axios.post(`${this.baseURL}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Marcar mensagens como lidas
  async markAsRead(chatId, messageIds) {
    try {
      const response = await axios.put(`${this.baseURL}/messages/read`, {
        chatId,
        messageIds
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      throw error;
    }
  }

  // Criar nova conversa
  async createConversation(participants, context = 'general', contextId = null) {
    try {
      const response = await axios.post(`${this.baseURL}/conversations`, {
        participants,
        context,
        contextId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw error;
    }
  }

  // Obter conversa por ID
  async getConversation(chatId) {
    try {
      const response = await axios.get(`${this.baseURL}/conversations/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conversa:', error);
      throw error;
    }
  }

  // Arquivar conversa
  async archiveConversation(chatId) {
    try {
      const response = await axios.put(`${this.baseURL}/conversations/${chatId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Erro ao arquivar conversa:', error);
      throw error;
    }
  }

  // Desarquivar conversa
  async unarchiveConversation(chatId) {
    try {
      const response = await axios.put(`${this.baseURL}/conversations/${chatId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error('Erro ao desarquivar conversa:', error);
      throw error;
    }
  }

  // Fixar/desfixar conversa
  async togglePinConversation(chatId) {
    try {
      const response = await axios.put(`${this.baseURL}/conversations/${chatId}/pin`);
      return response.data;
    } catch (error) {
      console.error('Erro ao fixar/desfixar conversa:', error);
      throw error;
    }
  }

  // Deletar conversa
  async deleteConversation(chatId) {
    try {
      const response = await axios.delete(`${this.baseURL}/conversations/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      throw error;
    }
  }

  // Deletar mensagem
  async deleteMessage(messageId) {
    try {
      const response = await axios.delete(`${this.baseURL}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      throw error;
    }
  }

  // Editar mensagem
  async editMessage(messageId, content) {
    try {
      const response = await axios.put(`${this.baseURL}/messages/${messageId}`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao editar mensagem:', error);
      throw error;
    }
  }

  // Enviar arquivo/imagem
  async sendFile(chatId, file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);
      formData.append('type', type);

      const response = await axios.post(`${this.baseURL}/messages/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw error;
    }
  }

  // Obter estatísticas de mensagens
  async getMessageStats(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // Buscar mensagens
  async searchMessages(query, userId, filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          query,
          userId,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  // Obter conversas por contexto
  async getConversationsByContext(context, contextId) {
    try {
      const response = await axios.get(`${this.baseURL}/conversations/context/${context}/${contextId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conversas por contexto:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Verificar se usuário está online
  async checkUserOnline(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/online/${userId}`);
      return response.data.isOnline;
    } catch (error) {
      console.error('Erro ao verificar status online:', error);
      return false;
    }
  }

  // Obter usuários online
  async getOnlineUsers() {
    try {
      const response = await axios.get(`${this.baseURL}/online`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários online:', error);
      return [];
    }
  }

  // Configurar notificações
  async updateNotificationSettings(userId, settings) {
    try {
      const response = await axios.put(`${this.baseURL}/notifications/${userId}`, settings);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de notificação:', error);
      throw error;
    }
  }

  // Obter configurações de notificação
  async getNotificationSettings(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configurações de notificação:', error);
      return {};
    }
  }
}

// Instância única do serviço
const messagingService = new MessagingService();

export default messagingService;
