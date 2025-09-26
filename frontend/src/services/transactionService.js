import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Estados das transações (conforme especificação)
export const TRANSACTION_STATUS = {
  'PENDING': { 
    name: 'Aguardando Negociação', 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Comprador e vendedor devem negociar diretamente'
  },
  'NEGOTIATING': { 
    name: 'Em Negociação', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Partes estão negociando termos'
  },
  'AGREED': { 
    name: 'Acordo Alcançado', 
    color: 'bg-green-100 text-green-800',
    description: 'Termos foram acordados entre as partes'
  },
  'CANCELLED': { 
    name: 'Cancelada', 
    color: 'bg-red-100 text-red-800',
    description: 'Transação foi cancelada'
  },
  'COMPLETED': { 
    name: 'Concluída', 
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Transação foi concluída com sucesso'
  }
};

// Tipos de transação (conforme especificação)
export const TRANSACTION_TYPES = {
  'PRODUCT': 'Intenção de Compra de Produto',
  'FREIGHT': 'Intenção de Frete',
  'SERVICE': 'Solicitação de Serviço'
};

class TransactionService {
  // Criar nova transação de intermediação
  async createTransaction(transactionData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      // Simular criação para desenvolvimento
      return this.createMockTransaction(transactionData);
    }
  }

  // Buscar transações do usuário
  async getUserTransactions(userId, type = null) {
    try {
      const params = type ? { userId, type } : { userId };
      const response = await axios.get(`${API_BASE_URL}/transactions/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações do usuário:', error);
      return this.getMockUserTransactions(userId, type);
    }
  }

  // Buscar transação por ID
  async getTransactionById(transactionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      return null;
    }
  }

  // Atualizar status da transação
  async updateTransactionStatus(transactionId, status, notes = '') {
    try {
      const response = await axios.patch(`${API_BASE_URL}/transactions/${transactionId}/status`, {
        status,
        notes,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status da transação:', error);
      return null;
    }
  }

  // Adicionar mensagem à transação
  async addMessageToTransaction(transactionId, messageData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions/${transactionId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      return null;
    }
  }

  // Buscar mensagens da transação
  async getTransactionMessages(transactionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  }

  // Buscar todas as transações (admin)
  async getAllTransactions(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todas as transações:', error);
      return this.getMockAllTransactions(filters);
    }
  }

  // Estatísticas das transações
  async getTransactionStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return this.getMockTransactionStats();
    }
  }

  // Criar transação mock para desenvolvimento
  createMockTransaction(transactionData) {
    const mockTransaction = {
      id: `TXN_${Date.now()}`,
      type: transactionData.type || 'PRODUCT',
      itemId: transactionData.itemId,
      buyerId: transactionData.buyerId,
      sellerId: transactionData.sellerId,
      status: transactionData.status || 'PENDING',
      lastMessageAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Dados adicionais para compatibilidade
      items: transactionData.items || [],
      total: transactionData.total || 0,
      shipping: transactionData.shipping || null,
      messages: [],
      history: [
        {
          action: 'created',
          status: transactionData.status || 'PENDING',
          timestamp: new Date().toISOString(),
          description: 'Transação criada'
        }
      ]
    };

    // Salvar no localStorage para simular persistência
    const existingTransactions = JSON.parse(localStorage.getItem('agroisync_transactions') || '[]');
    existingTransactions.push(mockTransaction);
    localStorage.setItem('agroisync_transactions', JSON.stringify(existingTransactions));

    return mockTransaction;
  }

  // Buscar transações mock do usuário
  getMockUserTransactions(userId, type = null) {
    try {
      const allTransactions = JSON.parse(localStorage.getItem('agroisync_transactions') || '[]');
      let userTransactions = allTransactions.filter(txn => 
        txn.buyerId === userId || txn.sellerId === userId
      );

      if (type) {
        userTransactions = userTransactions.filter(txn => txn.type === type);
      }

      return userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Erro ao buscar transações mock:', error);
      return [];
    }
  }

  // Buscar todas as transações mock
  getMockAllTransactions(filters = {}) {
    try {
      let allTransactions = JSON.parse(localStorage.getItem('agroisync_transactions') || '[]');
      
      // Aplicar filtros
      if (filters.status) {
        allTransactions = allTransactions.filter(txn => txn.status === filters.status);
      }
      if (filters.type) {
        allTransactions = allTransactions.filter(txn => txn.type === filters.type);
      }
      if (filters.dateFrom) {
        allTransactions = allTransactions.filter(txn => new Date(txn.createdAt) >= new Date(filters.dateFrom));
      }
      if (filters.dateTo) {
        allTransactions = allTransactions.filter(txn => new Date(txn.createdAt) <= new Date(filters.dateTo));
      }

      return allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Erro ao buscar transações mock:', error);
      return [];
    }
  }

  // Estatísticas mock
  getMockTransactionStats() {
    try {
      const allTransactions = JSON.parse(localStorage.getItem('agroisync_transactions') || '[]');
      
      const stats = {
        total: allTransactions.length,
        byStatus: {},
        byType: {},
        recentActivity: allTransactions.slice(0, 10),
        totalValue: allTransactions.reduce((sum, txn) => sum + (txn.total || 0), 0)
      };

      // Contar por status
      allTransactions.forEach(txn => {
        stats.byStatus[txn.status] = (stats.byStatus[txn.status] || 0) + 1;
        stats.byType[txn.type] = (stats.byType[txn.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas mock:', error);
      return {
        total: 0,
        byStatus: {},
        byType: {},
        recentActivity: [],
        totalValue: 0
      };
    }
  }

  // Notificar usuários sobre nova transação
  async notifyUsers(transaction) {
    try {
      // Aqui seria implementada a notificação real (email, push)
      const notifications = [];

      if (transaction.buyerId) {
        notifications.push({
          userId: transaction.buyerId,
          type: 'transaction_created',
          title: 'Nova Intenção de Compra',
          message: `Sua intenção de compra foi registrada. Aguarde o vendedor entrar em contato.`,
          data: { transactionId: transaction.id }
        });
      }

      if (transaction.sellerId) {
        notifications.push({
          userId: transaction.sellerId,
          type: 'transaction_created',
          title: 'Nova Intenção de Compra Recebida',
          message: `Você recebeu uma nova intenção de compra. Entre em contato com o comprador.`,
          data: { transactionId: transaction.id }
        });
      }

      // Simular envio de notificações
      console.log('Notificações enviadas:', notifications);
      
      return { success: true, notifications };
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar transações expiradas
  async checkExpiredTransactions() {
    try {
      const allTransactions = JSON.parse(localStorage.getItem('agroisync_transactions') || '[]');
      const now = new Date();
      
      // Transações PENDING por mais de 30 dias são consideradas expiradas
      const expiredTransactions = allTransactions.filter(txn => 
        txn.status === 'PENDING' && 
        new Date(txn.createdAt) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      );

      // Atualizar status das transações expiradas
      expiredTransactions.forEach(async (txn) => {
        await this.updateTransactionStatus(txn.id, 'CANCELLED', 'Prazo de negociação expirou');
      });

      return expiredTransactions;
    } catch (error) {
      console.error('Erro ao verificar transações expiradas:', error);
      return [];
    }
  }

  // Exportar transações
  exportTransactions(transactions, format = 'json') {
    try {
      let data, filename, mimeType;

      if (format === 'csv') {
        // Converter para CSV
        const headers = ['ID', 'Tipo', 'Status', 'Comprador', 'Vendedor', 'Valor', 'Data Criação'];
        const csvContent = [
          headers.join(','),
                  ...transactions.map(txn => [
          txn.id,
          txn.type,
          txn.status,
          txn.buyerId || 'N/A',
          txn.sellerId || 'N/A',
          txn.total || 0,
          new Date(txn.createdAt).toLocaleDateString('pt-BR')
        ].join(','))
        ].join('\n');

        data = csvContent;
        filename = `transacoes_agroisync_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // JSON padrão
        data = JSON.stringify(transactions, null, 2);
        filename = `transacoes_agroisync_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error('Erro ao exportar transações:', error);
      return { success: false, error: error.message };
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
