import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class MessagingService {
  async getConversations(serviceType) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/conversations?serviceType=${serviceType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.conversations };
      } else {
        return { ok: false, message: data.error || 'Erro ao carregar conversas' };
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async getMessages(conversationId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages?conversationId=${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.messages };
      } else {
        return { ok: false, message: data.error || 'Erro ao carregar mensagens' };
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async sendMessage(messageData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao enviar mensagem' };
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async createConversation(participants, serviceType, serviceId, title) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          participants,
          serviceType,
          serviceId,
          title,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.conversation };
      } else {
        return { ok: false, message: data.error || 'Erro ao criar conversa' };
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async markAsRead(messageId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao marcar como lida' };
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async getStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, data: data.stats };
      } else {
        return { ok: false, message: data.error || 'Erro ao carregar estatísticas' };
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async startConversationFromListing(serviceType, serviceId, otherUserId, initialMessage) {
    try {
      // Primeiro, criar a conversa
      const conversationResult = await this.createConversation(
        [otherUserId],
        serviceType,
        serviceId,
        `Conversa sobre ${serviceType === 'product' ? 'produto' : 'frete'}`
      );

      if (!conversationResult.ok) {
        return conversationResult;
      }

      // Depois, enviar a mensagem inicial
      const messageResult = await this.sendMessage({
        destinatarioId: otherUserId,
        tipo: serviceType,
        servicoId: serviceId,
        conteudo: initialMessage,
      });

      if (!messageResult.ok) {
        return messageResult;
      }

      return { 
        ok: true, 
        conversation: conversationResult.data,
        message: messageResult.data 
      };
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      return { ok: false, message: 'Erro ao iniciar conversa' };
    }
  }

  async deleteMessage(messageId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, message: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao deletar mensagem' };
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async reportMessage(messageId, reason) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, message: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao reportar mensagem' };
      }
    } catch (error) {
      console.error('Erro ao reportar mensagem:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }
}

export default new MessagingService();
