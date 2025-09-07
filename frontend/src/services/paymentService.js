import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class PaymentService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/payments`;
    this.stripe = null;
    this.elements = null;
  }

  // Configurar token de autenticação
  setAuthToken(token) {
    this.authToken = token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Sistema de comissões para intermediação
  async calculateCommission(transactionAmount, transactionType) {
    try {
      const response = await axios.post(`${this.baseURL}/commission/calculate`, {
        transactionAmount,
        transactionType
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular comissão:', error);
      return { success: false, error: 'Erro ao calcular comissão' };
    }
  }

  // Processar comissão para carteira do proprietário
  async processCommission(transactionId, amount, paymentMethod, userWallet) {
    try {
      const response = await axios.post(`${this.baseURL}/commission/process`, {
        transactionId,
        amount,
        paymentMethod,
        userWallet
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao processar comissão:', error);
      return { success: false, error: 'Erro ao processar comissão' };
    }
  }

  // Inicializar Stripe
  async initializeStripe(publishableKey) {
    if (typeof window !== 'undefined' && window.Stripe) {
      this.stripe = window.Stripe(publishableKey);
      return this.stripe;
    }
    throw new Error('Stripe não está disponível');
  }

  // ===== STRIPE PAYMENT INTENT =====

  // Criar PaymentIntent
  async createPaymentIntent(paymentData) {
    try {
      const response = await axios.post(`${this.baseURL}/stripe/create-intent`, {
        amount: paymentData.amount,
        currency: paymentData.currency || 'brl',
        metadata: {
          orderId: paymentData.orderId,
          userId: paymentData.userId,
          type: paymentData.type, // 'order', 'freight', 'subscription'
          description: paymentData.description
        },
        automatic_payment_methods: {
          enabled: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar PaymentIntent:', error);
      throw error;
    }
  }

  // Confirmar pagamento
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      const response = await axios.post(`${this.baseURL}/stripe/confirm-payment`, {
        paymentIntentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  // ===== ESCROW SYSTEM =====

  // Criar conta Escrow
  async createEscrowAccount(userData) {
    try {
      const response = await axios.post(`${this.baseURL}/escrow/create-account`, {
        email: userData.email,
        name: userData.name,
        document: userData.document,
        address: userData.address,
        bankAccount: userData.bankAccount
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta Escrow:', error);
      throw error;
    }
  }

  // Criar transação Escrow
  async createEscrowTransaction(transactionData) {
    try {
      const response = await axios.post(`${this.baseURL}/escrow/create-transaction`, {
        amount: transactionData.amount,
        currency: transactionData.currency || 'brl',
        buyerId: transactionData.buyerId,
        sellerId: transactionData.sellerId,
        orderId: transactionData.orderId,
        description: transactionData.description,
        escrowFee: transactionData.escrowFee || 0,
        releaseConditions: transactionData.releaseConditions || []
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação Escrow:', error);
      throw error;
    }
  }

  // Liberar pagamento Escrow (Admin)
  async releaseEscrowPayment(transactionId, adminId, reason) {
    try {
      const response = await axios.post(`${this.baseURL}/escrow/release-payment`, {
        transactionId,
        adminId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao liberar pagamento Escrow:', error);
      throw error;
    }
  }

  // Cancelar transação Escrow
  async cancelEscrowTransaction(transactionId, reason) {
    try {
      const response = await axios.post(`${this.baseURL}/escrow/cancel-transaction`, {
        transactionId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar transação Escrow:', error);
      throw error;
    }
  }

  // Obter status da transação Escrow
  async getEscrowTransactionStatus(transactionId) {
    try {
      const response = await axios.get(`${this.baseURL}/escrow/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status da transação:', error);
      throw error;
    }
  }

  // ===== WEBHOOKS =====

  // Processar webhook do Stripe
  async processStripeWebhook(webhookData) {
    try {
      const response = await axios.post(`${this.baseURL}/webhooks/stripe`, webhookData);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar webhook Stripe:', error);
      throw error;
    }
  }

  // Processar webhook do Escrow
  async processEscrowWebhook(webhookData) {
    try {
      const response = await axios.post(`${this.baseURL}/webhooks/escrow`, webhookData);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar webhook Escrow:', error);
      throw error;
    }
  }

  // ===== PAYMENT METHODS =====

  // Obter métodos de pagamento do usuário
  async getPaymentMethods(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/payment-methods/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métodos de pagamento:', error);
      throw error;
    }
  }

  // Adicionar método de pagamento
  async addPaymentMethod(userId, paymentMethodData) {
    try {
      const response = await axios.post(`${this.baseURL}/payment-methods`, {
        userId,
        ...paymentMethodData
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  }

  // Remover método de pagamento
  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await axios.delete(`${this.baseURL}/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error);
      throw error;
    }
  }

  // ===== TRANSACTIONS =====

  // Obter histórico de transações
  async getTransactionHistory(userId, filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/transactions/${userId}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico de transações:', error);
      throw error;
    }
  }

  // Obter detalhes da transação
  async getTransactionDetails(transactionId) {
    try {
      const response = await axios.get(`${this.baseURL}/transactions/details/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter detalhes da transação:', error);
      throw error;
    }
  }

  // ===== REFUNDS =====

  // Solicitar reembolso
  async requestRefund(transactionId, reason, amount = null) {
    try {
      const response = await axios.post(`${this.baseURL}/refunds/request`, {
        transactionId,
        reason,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error);
      throw error;
    }
  }

  // Processar reembolso (Admin)
  async processRefund(refundId, adminId, action) {
    try {
      const response = await axios.post(`${this.baseURL}/refunds/process`, {
        refundId,
        adminId,
        action // 'approve', 'reject'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }

  // ===== SUBSCRIPTIONS =====

  // Criar assinatura
  async createSubscription(subscriptionData) {
    try {
      const response = await axios.post(`${this.baseURL}/subscriptions`, {
        userId: subscriptionData.userId,
        planId: subscriptionData.planId,
        paymentMethodId: subscriptionData.paymentMethodId,
        trialPeriod: subscriptionData.trialPeriod
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
    }

  // Cancelar assinatura
  async cancelSubscription(subscriptionId, reason) {
    try {
      const response = await axios.post(`${this.baseURL}/subscriptions/${subscriptionId}/cancel`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  // Atualizar assinatura
  async updateSubscription(subscriptionId, updates) {
    try {
      const response = await axios.put(`${this.baseURL}/subscriptions/${subscriptionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Validar cartão
  async validateCard(cardData) {
    try {
      const response = await axios.post(`${this.baseURL}/validate-card`, cardData);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar cartão:', error);
      throw error;
    }
  }

  // Calcular taxas
  async calculateFees(amount, currency = 'brl', type = 'payment') {
    try {
      const response = await axios.get(`${this.baseURL}/calculate-fees`, {
        params: { amount, currency, type }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular taxas:', error);
      throw error;
      }
    }

  // Obter estatísticas de pagamento
  async getPaymentStats(userId, period = 'month') {
    try {
      const response = await axios.get(`${this.baseURL}/stats/${userId}`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // ===== SECURITY =====

  // Verificar assinatura do webhook
  verifyWebhookSignature(payload, signature, secret) {
    // Implementar verificação de assinatura
    // Usar crypto para verificar HMAC
    return true; // Placeholder
  }

  // Criptografar dados sensíveis
  encryptSensitiveData(data) {
    // Implementar criptografia
    return data; // Placeholder
  }

  // Descriptografar dados sensíveis
  decryptSensitiveData(encryptedData) {
    // Implementar descriptografia
    return encryptedData; // Placeholder
  }
}

// Instância única do serviço
const paymentService = new PaymentService();

export default paymentService;
