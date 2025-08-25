import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço de mensageria para comunicação entre usuários
export const messagingService = {
  // Obter conversas do usuário
  async getConversations(serviceType = null) {
    try {
      const params = serviceType ? `?serviceType=${serviceType}` : '';
      const response = await api.get(`/conversations${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao buscar conversas' };
    }
  },

  // Obter mensagens de uma conversa
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao buscar mensagens' };
    }
  },

  // Enviar mensagem
  async sendMessage(conversationId, content, attachments = []) {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, { 
        content, 
        attachments 
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao enviar mensagem' };
    }
  },

  // Criar nova conversa
  async createConversation(serviceType, serviceId, participants, title = null) {
    try {
      const response = await api.post('/conversations', {
        serviceType,
        serviceId,
        participants,
        title
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao criar conversa' };
    }
  },

  // Marcar mensagens como lidas
  async markAsRead(conversationId) {
    try {
      const response = await api.put(`/conversations/${conversationId}`, { 
        status: 'read' 
      });
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao marcar como lida' };
    }
  },

  // Obter estatísticas
  async getStats() {
    try {
      const response = await api.get('/conversations/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.data?.error) {
        return { ok: false, message: error.response.data.error };
      }
      return { ok: false, message: 'Erro ao buscar estatísticas' };
    }
  },

  // Iniciar conversa a partir de produto/frete
  async startConversationFromListing(listing, participants, subject, initialMessage) {
    try {
      const serviceType = listing.type === 'product' ? 'product' : 'freight';
      const conversationData = {
        serviceType,
        serviceId: listing._id,
        participants,
        title: subject
      };

      const response = await this.createConversation(
        conversationData.serviceType,
        conversationData.serviceId,
        conversationData.participants,
        conversationData.title
      );

      if (response.ok && initialMessage) {
        await this.sendMessage(response.data.conversation._id, initialMessage);
      }

      return response;
    } catch (error) {
      console.error('Error starting conversation from listing:', error);
      return { ok: false, message: 'Erro ao iniciar conversa' };
    }
  }
};

export default messagingService;
