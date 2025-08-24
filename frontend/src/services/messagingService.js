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

// Messaging service
export const messagingService = {
  // Get user conversations
  async getConversations(module = null) {
    try {
      const params = module ? `?module=${module}` : '';
      const response = await api.get(`/messaging/conversations${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao buscar conversas');
    }
  },

  // Get specific conversation
  async getConversation(conversationId) {
    try {
      const response = await api.get(`/messaging/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao buscar conversa');
    }
  },

  // Create new conversation
  async createConversation(conversationData) {
    try {
      const response = await api.post('/messaging/conversations', conversationData);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao criar conversa');
    }
  },

  // Send message
  async sendMessage(conversationId, messageData) {
    try {
      const response = await api.post(`/messaging/conversations/${conversationId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao enviar mensagem');
    }
  },

  // Update conversation status
  async updateConversationStatus(conversationId, status) {
    try {
      const response = await api.put(`/messaging/conversations/${conversationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao atualizar status da conversa');
    }
  },

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/messaging/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao buscar contador de não lidas');
    }
  },

  // Start conversation from product/freight
  async startConversationFromListing(listing, participants, subject, initialMessage) {
    try {
      const conversationData = {
        participants,
        listing,
        module: listing.type === 'product' ? 'store' : 'freight',
        subject,
        initialMessage
      };

      const response = await this.createConversation(conversationData);
      return response;
    } catch (error) {
      console.error('Error starting conversation from listing:', error);
      throw error;
    }
  }
};

export default messagingService;
