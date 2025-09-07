// import axios from 'axios';

// Configuração da API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Status das transações de escrow
export const ESCROW_STATUS = {
  'PENDING': {
    name: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Aguardando confirmação das partes'
  },
  'FUNDED': {
    name: 'Fundado',
    color: 'bg-blue-100 text-blue-800',
    description: 'Valor depositado e em custódia'
  },
  'DISPUTED': {
    name: 'Em Disputa',
    color: 'bg-red-100 text-red-800',
    description: 'Conflito entre as partes'
  },
  'RELEASED': {
    name: 'Liberado',
    color: 'bg-green-100 text-green-800',
    description: 'Valor liberado para o vendedor'
  },
  'REFUNDED': {
    name: 'Reembolsado',
    color: 'bg-gray-100 text-gray-800',
    description: 'Valor devolvido para o comprador'
  },
  'CANCELLED': {
    name: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    description: 'Transação cancelada'
  }
};

// Tipos de moeda suportados
export const SUPPORTED_CURRENCIES = {
  'BRL': {
    name: 'Real Brasileiro',
    symbol: 'R$',
    code: 'BRL'
  },
  'USD': {
    name: 'Dólar Americano',
    symbol: '$',
    code: 'USD'
  },
  'EUR': {
    name: 'Euro',
    symbol: '€',
    code: 'EUR'
  }
};

// Configurações de escrow
export const ESCROW_CONFIG = {
  feePercentage: 2.5, // Taxa de 2.5%
  minAmount: 10.00, // Valor mínimo
  maxAmount: 100000.00, // Valor máximo
  autoReleaseDays: 7, // Liberação automática em 7 dias
  disputePeriod: 3 // Período de disputa em 3 dias
};

class EscrowService {
  constructor() {
    this.isEnabled = false; // Escrow desabilitado por padrão
    this.transactions = new Map();
    this.disputes = new Map();
  }

  // Verificar se o escrow está habilitado
  isEscrowEnabled() {
    return this.isEnabled;
  }

  // Habilitar/desabilitar escrow (apenas para desenvolvimento)
  setEscrowEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`Escrow ${enabled ? 'habilitado' : 'desabilitado'}`);
  }

  // Criar transação de escrow
  async createEscrowTransaction(escrowData) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = {
        id: `ESCROW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: escrowData.transactionId,
        payerId: escrowData.payerId,
        payeeId: escrowData.payeeId,
        amount: escrowData.amount,
        currency: escrowData.currency || 'BRL',
        fee: this.calculateFee(escrowData.amount),
        totalAmount: this.calculateTotalAmount(escrowData.amount),
        status: 'PENDING',
        description: escrowData.description || 'Transação via AgroSync',
        terms: escrowData.terms || this.getDefaultTerms(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: this.calculateExpiryDate(),
        autoReleaseAt: this.calculateAutoReleaseDate()
      };

      // Em produção, salvar no banco de dados
      // const response = await axios.post(`${API_BASE_URL}/escrow/transactions`, escrowTransaction);
      
      // Simular salvamento local
      this.transactions.set(escrowTransaction.id, escrowTransaction);
      
      console.log('Transação de escrow criada:', escrowTransaction.id);
      return { success: true, escrowTransaction };
    } catch (error) {
      console.error('Erro ao criar transação de escrow:', error);
      throw error;
    }
  }

  // Obter transação de escrow
  async getEscrowTransaction(escrowId) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      // Em produção, buscar do banco de dados
      // const response = await axios.get(`${API_BASE_URL}/escrow/transactions/${escrowId}`);
      
      // Simular busca local
      const escrowTransaction = this.transactions.get(escrowId);
      if (!escrowTransaction) {
        throw new Error('Transação de escrow não encontrada');
      }

      return escrowTransaction;
    } catch (error) {
      console.error('Erro ao buscar transação de escrow:', error);
      throw error;
    }
  }

  // Listar transações de escrow do usuário
  async getUserEscrowTransactions(userId, status = null) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      // Em produção, buscar do banco de dados
      // const response = await axios.get(`${API_BASE_URL}/escrow/transactions/user/${userId}`, {
      //   params: { status }
      // });

      // Simular busca local
      let userTransactions = Array.from(this.transactions.values()).filter(
        escrow => escrow.payerId === userId || escrow.payeeId === userId
      );

      if (status) {
        userTransactions = userTransactions.filter(escrow => escrow.status === status);
      }

      return userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Erro ao buscar transações de escrow do usuário:', error);
      throw error;
    }
  }

  // Depositar valor no escrow
  async fundEscrow(escrowId, paymentMethod) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = await this.getEscrowTransaction(escrowId);
      
      if (escrowTransaction.status !== 'PENDING') {
        throw new Error('Transação não está pendente para depósito');
      }

      // Em produção, processar pagamento real
      // const paymentResponse = await axios.post(`${API_BASE_URL}/escrow/${escrowId}/fund`, {
      //   paymentMethod,
      //   amount: escrowTransaction.totalAmount
      // });

      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay simulado
      
      // Atualizar status
      escrowTransaction.status = 'FUNDED';
      escrowTransaction.fundedAt = new Date().toISOString();
      escrowTransaction.paymentMethod = paymentMethod;
      escrowTransaction.updatedAt = new Date().toISOString();

      // Em produção, atualizar no banco
      // await axios.put(`${API_BASE_URL}/escrow/transactions/${escrowId}`, escrowTransaction);

      console.log(`Escrow ${escrowId} fundado com sucesso`);
      return { success: true, escrowTransaction };
    } catch (error) {
      console.error('Erro ao fundar escrow:', error);
      throw error;
    }
  }

  // Liberar valor do escrow
  async releaseEscrow(escrowId, reason = 'Liberação automática') {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = await this.getEscrowTransaction(escrowId);
      
      if (escrowTransaction.status !== 'FUNDED') {
        throw new Error('Escrow não está fundado para liberação');
      }

      // Em produção, processar transferência real
      // const releaseResponse = await axios.post(`${API_BASE_URL}/escrow/${escrowId}/release`, {
      //   reason,
      //   amount: escrowTransaction.amount
      // });

      // Simular processamento de transferência
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay simulado
      
      // Atualizar status
      escrowTransaction.status = 'RELEASED';
      escrowTransaction.releasedAt = new Date().toISOString();
      escrowTransaction.releaseReason = reason;
      escrowTransaction.updatedAt = new Date().toISOString();

      // Em produção, atualizar no banco
      // await axios.put(`${API_BASE_URL}/escrow/transactions/${escrowId}`, escrowTransaction);

      console.log(`Escrow ${escrowId} liberado com sucesso`);
      return { success: true, escrowTransaction };
    } catch (error) {
      console.error('Erro ao liberar escrow:', error);
      throw error;
    }
  }

  // Iniciar disputa
  async initiateDispute(escrowId, reason, evidence) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = await this.getEscrowTransaction(escrowId);
      
      if (!['FUNDED', 'PENDING'].includes(escrowTransaction.status)) {
        throw new Error('Escrow não pode ser disputado neste status');
      }

      const dispute = {
        id: `DISPUTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        escrowId,
        initiatorId: escrowTransaction.payerId,
        reason,
        evidence: evidence || [],
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Em produção, salvar disputa no banco
      // const disputeResponse = await axios.post(`${API_BASE_URL}/escrow/${escrowId}/disputes`, dispute);
      
      // Simular salvamento local
      this.disputes.set(dispute.id, dispute);
      
      // Atualizar status do escrow
      escrowTransaction.status = 'DISPUTED';
      escrowTransaction.disputeId = dispute.id;
      escrowTransaction.updatedAt = new Date().toISOString();

      console.log(`Disputa iniciada para escrow ${escrowId}`);
      return { success: true, dispute, escrowTransaction };
    } catch (error) {
      console.error('Erro ao iniciar disputa:', error);
      throw error;
    }
  }

  // Resolver disputa (apenas admin)
  async resolveDispute(disputeId, resolution, adminId) {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const dispute = this.disputes.get(disputeId);
      if (!dispute) {
        throw new Error('Disputa não encontrada');
      }

      const escrowTransaction = await this.getEscrowTransaction(dispute.escrowId);
      
      // Em produção, verificar permissões de admin
      // const adminCheck = await axios.get(`${API_BASE_URL}/admin/verify/${adminId}`);
      // if (!adminCheck.data.isAdmin) {
      //   throw new Error('Apenas administradores podem resolver disputas');
      // }

      // Atualizar disputa
      dispute.status = 'RESOLVED';
      dispute.resolution = resolution;
      dispute.resolvedBy = adminId;
      dispute.resolvedAt = new Date().toISOString();
      dispute.updatedAt = new Date().toISOString();

      // Aplicar resolução ao escrow
      if (resolution.action === 'RELEASE') {
        await this.releaseEscrow(escrowTransaction.id, `Resolvido por admin: ${resolution.reason}`);
      } else if (resolution.action === 'REFUND') {
        await this.refundEscrow(escrowTransaction.id, `Reembolso por admin: ${resolution.reason}`);
      }

      console.log(`Disputa ${disputeId} resolvida`);
      return { success: true, dispute, escrowTransaction };
    } catch (error) {
      console.error('Erro ao resolver disputa:', error);
      throw error;
    }
  }

  // Reembolsar escrow
  async refundEscrow(escrowId, reason = 'Reembolso solicitado') {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = await this.getEscrowTransaction(escrowId);
      
      if (escrowTransaction.status !== 'FUNDED') {
        throw new Error('Escrow não está fundado para reembolso');
      }

      // Em produção, processar reembolso real
      // const refundResponse = await axios.post(`${API_BASE_URL}/escrow/${escrowId}/refund`, {
      //   reason,
      //   amount: escrowTransaction.totalAmount
      // });

      // Simular processamento de reembolso
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay simulado
      
      // Atualizar status
      escrowTransaction.status = 'REFUNDED';
      escrowTransaction.refundedAt = new Date().toISOString();
      escrowTransaction.refundReason = reason;
      escrowTransaction.updatedAt = new Date().toISOString();

      // Em produção, atualizar no banco
      // await axios.put(`${API_BASE_URL}/escrow/transactions/${escrowId}`, escrowTransaction);

      console.log(`Escrow ${escrowId} reembolsado com sucesso`);
      return { success: true, escrowTransaction };
    } catch (error) {
      console.error('Erro ao reembolsar escrow:', error);
      throw error;
    }
  }

  // Cancelar escrow
  async cancelEscrow(escrowId, reason = 'Cancelamento solicitado') {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const escrowTransaction = await this.getEscrowTransaction(escrowId);
      
      if (!['PENDING', 'FUNDED'].includes(escrowTransaction.status)) {
        throw new Error('Escrow não pode ser cancelado neste status');
      }

      // Se estiver fundado, reembolsar primeiro
      if (escrowTransaction.status === 'FUNDED') {
        await this.refundEscrow(escrowId, 'Cancelamento - reembolso automático');
      }

      // Atualizar status
      escrowTransaction.status = 'CANCELLED';
      escrowTransaction.cancelledAt = new Date().toISOString();
      escrowTransaction.cancelReason = reason;
      escrowTransaction.updatedAt = new Date().toISOString();

      // Em produção, atualizar no banco
      // await axios.put(`${API_BASE_URL}/escrow/transactions/${escrowId}`, escrowTransaction);

      console.log(`Escrow ${escrowId} cancelado com sucesso`);
      return { success: true, escrowTransaction };
    } catch (error) {
      console.error('Erro ao cancelar escrow:', error);
      throw error;
    }
  }

  // Obter estatísticas de escrow
  async getEscrowStats() {
    try {
      if (!this.isEnabled) {
        throw new Error('Escrow não está habilitado no momento');
      }

      const allTransactions = Array.from(this.transactions.values());
      
      const stats = {
        total: allTransactions.length,
        pending: allTransactions.filter(t => t.status === 'PENDING').length,
        funded: allTransactions.filter(t => t.status === 'FUNDED').length,
        released: allTransactions.filter(t => t.status === 'RELEASED').length,
        disputed: allTransactions.filter(t => t.status === 'DISPUTED').length,
        refunded: allTransactions.filter(t => t.status === 'REFUNDED').length,
        cancelled: allTransactions.filter(t => t.status === 'CANCELLED').length,
        totalAmount: allTransactions.reduce((sum, t) => sum + t.amount, 0),
        totalFees: allTransactions.reduce((sum, t) => sum + t.fee, 0)
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de escrow:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  calculateFee(amount) {
    return (amount * ESCROW_CONFIG.feePercentage) / 100;
  }

  calculateTotalAmount(amount) {
    return amount + this.calculateFee(amount);
  }

  calculateExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Expira em 30 dias
    return expiryDate.toISOString();
  }

  calculateAutoReleaseDate() {
    const autoReleaseDate = new Date();
    autoReleaseDate.setDate(autoReleaseDate.getDate() + ESCROW_CONFIG.autoReleaseDays);
    return autoReleaseDate.toISOString();
  }

  getDefaultTerms() {
    return {
      autoRelease: true,
      autoReleaseDays: ESCROW_CONFIG.autoReleaseDays,
      disputePeriod: ESCROW_CONFIG.disputePeriod,
      feePercentage: ESCROW_CONFIG.feePercentage
    };
  }

  // Verificar se escrow pode ser liberado automaticamente
  canAutoRelease(escrowTransaction) {
    if (escrowTransaction.status !== 'FUNDED') return false;
    
    const now = new Date();
    const autoReleaseDate = new Date(escrowTransaction.autoReleaseAt);
    
    return now >= autoReleaseDate;
  }

  // Processar liberações automáticas (cron job)
  async processAutoReleases() {
    try {
      if (!this.isEnabled) return;

      const fundedTransactions = Array.from(this.transactions.values())
        .filter(t => t.status === 'FUNDED');

      for (const transaction of fundedTransactions) {
        if (this.canAutoRelease(transaction)) {
          try {
            await this.releaseEscrow(transaction.id, 'Liberação automática por prazo');
            console.log(`Escrow ${transaction.id} liberado automaticamente`);
          } catch (error) {
            console.error(`Erro ao liberar escrow ${transaction.id} automaticamente:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar liberações automáticas:', error);
    }
  }

  // Limpar dados de desenvolvimento
  clearDevelopmentData() {
    this.transactions.clear();
    this.disputes.clear();
    console.log('Dados de desenvolvimento do escrow limpos');
  }

  // Desconectar serviço
  disconnect() {
    try {
      this.clearDevelopmentData();
      console.log('Serviço de escrow desconectado');
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar serviço de escrow:', error);
      return { success: false, error: error.message };
    }
  }
}

const escrowService = new EscrowService();
export default escrowService;
