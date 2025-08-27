import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Estados das transações
export const TRANSACTION_STATUS = {
  'pending_negotiation': { 
    name: 'Aguardando Negociação', 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Comprador e vendedor devem negociar diretamente'
  },
  'negotiating': { 
    name: 'Em Negociação', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Partes estão negociando termos'
  },
  'agreement_reached': { 
    name: 'Acordo Alcançado', 
    color: 'bg-green-100 text-green-800',
    description: 'Termos foram acordados entre as partes'
  },
  'escrow_pending': { 
    name: 'Aguardando Escrow', 
    color: 'bg-purple-100 text-purple-800',
    description: 'Aguardando pagamento seguro via escrow'
  },
  'completed': { 
    name: 'Concluída', 
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Transação foi concluída com sucesso'
  },
  'cancelled': { 
    name: 'Cancelada', 
    color: 'bg-red-100 text-red-800',
    description: 'Transação foi cancelada'
  },
  'expired': { 
    name: 'Expirada', 
    color: 'bg-gray-100 text-gray-800',
    description: 'Prazo de negociação expirou'
  }
};

// Tipos de transação
export const TRANSACTION_TYPES = {
  'purchase_intent': 'Intenção de Compra',
  'freight_intent': 'Intenção de Frete',
  'service_request': 'Solicitação de Serviço'
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
      ...transactionData,
      status: 'pending_negotiation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      history: [
        {
          action: 'created',
          status: 'pending_negotiation',
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
        txn.buyer?.id === userId || txn.seller?.id === userId || txn.shipper?.id === userId || txn.carrier?.id === userId
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
      // Aqui seria implementada a notificação real (email, SMS, push)
      const notifications = [];

      if (transaction.buyer) {
        notifications.push({
          userId: transaction.buyer.id,
          type: 'transaction_created',
          title: 'Nova Intenção de Compra',
          message: `Sua intenção de compra foi registrada. Aguarde o vendedor entrar em contato.`,
          data: { transactionId: transaction.id }
        });
      }

      if (transaction.seller) {
        notifications.push({
          userId: transaction.seller.id,
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
      
      const expiredTransactions = allTransactions.filter(txn => 
        txn.status === 'pending_negotiation' && 
        txn.expiresAt && 
        new Date(txn.expiresAt) < now
      );

      // Atualizar status das transações expiradas
      expiredTransactions.forEach(async (txn) => {
        await this.updateTransactionStatus(txn.id, 'expired', 'Prazo de negociação expirou');
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
            txn.buyer?.name || txn.shipper?.name || 'N/A',
            txn.seller?.name || txn.carrier?.name || 'N/A',
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

export default new TransactionService();
