import { getConfig } from '../config/app.config';

const config = getConfig();

class MessagingService {
  constructor() {
    this.baseURL = config.api.baseUrl;
  }

  async getConversations(serviceType = null, userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/messages/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return { ok: true, data: data.conversations };
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      // Em caso de erro, retornar dados mock para desenvolvimento
      const mockData = this.getMockConversations(serviceType, userType, userCategory);
      return { ok: false, message: error.message, data: mockData };
    }
  }

  async getMessages(conversationId, userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/messages/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return { ok: true, data: data.messages };
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      // Em caso de erro, retornar dados mock para desenvolvimento
      const mockData = this.getMockMessages(conversationId, userType, userCategory);
      return { ok: false, message: error.message, data: mockData };
    }
  }

  async sendMessage(messageData, userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Verificar limite de produtos gratuitos para compradores
      if (userCategory === 'comprador') {
        const limitCheck = await this.checkFreeProductLimit();
        if (!limitCheck.canSend) {
          return { 
            ok: false, 
            message: `Limite de produtos gratuitos atingido (${limitCheck.consumed}/3). Faça um pagamento para continuar.`, 
            requiresPayment: true 
          };
        }
      }

      const response = await fetch(`${this.baseURL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();

      // Se for comprador, consumir um produto gratuito
      if (userCategory === 'comprador' && data.success) {
        await this.consumeFreeProduct();
      }

      return { ok: true, data: data.message };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { ok: false, message: error.message };
    }
  }

  async checkFreeProductLimit() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/users/free-product-limit`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar limite de produtos gratuitos:', error);
      // Em caso de erro, retornar dados mock para desenvolvimento
      return this.getMockFreeProductLimit();
    }
  }

  async consumeFreeProduct() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/users/consume-free-product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao consumir produto gratuito:', error);
      // Em caso de erro, retornar dados mock para desenvolvimento
      return { success: true, message: 'Produto gratuito consumido (mock)' };
    }
  }

  async createConversation(participants, serviceId, serviceType, title = null, userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/messages/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        },
        body: JSON.stringify({
          participants,
          serviceId,
          serviceType,
          title
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return { ok: true, data: data.conversation };
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      return { ok: false, message: error.message };
    }
  }

  async markMessageAsRead(messageId, userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return { ok: true, data: data.message };
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      return { ok: false, message: error.message };
    }
  }

  async getMessageStats(userType = null, userCategory = null) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${this.baseURL}/api/messages/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Type': userType || 'user',
          'User-Category': userCategory || 'general'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return { ok: true, data: data.stats };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Em caso de erro, retornar dados mock para desenvolvimento
      const mockData = this.getMockMessageStats(userType, userCategory);
      return { ok: false, message: error.message, data: mockData };
    }
  }

  getAuthToken() {
    // Implementar lógica para obter token do localStorage ou contexto
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Dados mock para desenvolvimento
  getMockConversations(serviceType = null, userType = null, userCategory = null) {
    const baseConversations = [
      {
        _id: 'conv-1',
        title: 'Consulta sobre Produto Agrícola',
        participants: ['user1', 'user2'],
        serviceType: 'products',
        serviceId: 'prod-123',
        lastMessage: {
          content: 'Gostaria de saber mais sobre o produto',
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 min atrás
        },
        unreadCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
      },
      {
        _id: 'conv-2',
        title: 'Negociação de Frete',
        participants: ['user1', 'user3'],
        serviceType: 'freights',
        serviceId: 'freight-456',
        lastMessage: {
          content: 'Qual o valor do frete para essa distância?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hora atrás
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 horas atrás
      },
      {
        _id: 'conv-3',
        title: 'Dúvida sobre Anúncio',
        participants: ['user1', 'user4'],
        serviceType: 'products',
        serviceId: 'prod-789',
        lastMessage: {
          content: 'O produto ainda está disponível?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 min atrás
        },
        unreadCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hora atrás
      }
    ];

    if (serviceType) {
      return baseConversations.filter(conv => conv.serviceType === serviceType);
    }

    // Filtrar por tipo de usuário se especificado
    if (userType === 'loja' && userCategory === 'comprador') {
      return baseConversations.filter(conv => conv.serviceType === 'products');
    } else if (userType === 'agroconecta' && userCategory === 'freteiro') {
      return baseConversations.filter(conv => conv.serviceType === 'freights');
    }

    return baseConversations;
  }

  getMockMessages(conversationId, userType = null, userCategory = null) {
    const baseMessages = [
      {
        _id: 'msg-1',
        sender: 'user2',
        content: 'Olá! Gostaria de saber mais sobre o produto agrícola que você anunciou.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        isSystemMessage: false
      },
      {
        _id: 'msg-2',
        sender: 'user1',
        content: 'Claro! É um produto de alta qualidade, certificado e com garantia.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 horas atrás
        isSystemMessage: false
      },
      {
        _id: 'msg-3',
        sender: 'user2',
        content: 'Qual o preço e se tem desconto para compra em quantidade?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        isSystemMessage: false
      }
    ];

    // Adicionar mensagem do sistema para compradores
    if (userCategory === 'comprador') {
      const freeInfo = this.getMockFreeProductLimit();
      if (freeInfo.remaining < 3) {
        baseMessages.push({
          _id: 'msg-sys-1',
          sender: 'system',
          content: this.getSystemMessage(userCategory, freeInfo.remaining, freeInfo.consumed),
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min atrás
          isSystemMessage: true
        });
      }
    }

    return baseMessages;
  }

  getMockMessageStats(userType = null, userCategory = null) {
    const baseStats = {
      totalConversations: 3,
      unreadMessages: 3,
      totalMessages: 12,
      responseTime: '2.5h'
    };

    // Ajustar estatísticas baseado no tipo de usuário
    if (userType === 'loja' && userCategory === 'comprador') {
      return {
        ...baseStats,
        totalConversations: 2,
        unreadMessages: 2,
        totalMessages: 8
      };
    } else if (userType === 'agroconecta' && userCategory === 'freteiro') {
      return {
        ...baseStats,
        totalConversations: 1,
        unreadMessages: 0,
        totalMessages: 4
      };
    }

    return baseStats;
  }

  getMockFreeProductLimit() {
    // Simular dados de produtos gratuitos
    const consumed = Math.floor(Math.random() * 4); // 0 a 3
    const remaining = Math.max(0, 3 - consumed);
    
    return {
      canSend: remaining > 0,
      consumed: consumed,
      remaining: remaining,
      total: 3
    };
  }

  // Funções auxiliares para lógica do cliente
  canSendMessage(userCategory, freeProductsRemaining) {
    if (userCategory !== 'comprador') return true;
    return freeProductsRemaining > 0;
  }

  getSystemMessage(userCategory, freeProductsRemaining, freeProductsConsumed) {
    if (userCategory !== 'comprador') return null;
    
    if (freeProductsConsumed === 0) {
      return '🎁 Você tem 3 produtos gratuitos disponíveis para visualização completa.';
    } else if (freeProductsRemaining === 0) {
      return '⚠️ Você consumiu todos os produtos gratuitos. Faça um pagamento para continuar.';
    } else {
      return `ℹ️ Você consumiu ${freeProductsConsumed}/3 produtos gratuitos. Restam ${freeProductsRemaining} produtos.`;
    }
  }
}

const messagingService = new MessagingService();
export default messagingService;
