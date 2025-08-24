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

// Payment service
export const paymentService = {
  // Stripe payments
  async createStripeSession(module, tier) {
    try {
      const response = await api.post('/payments/stripe/session', {
        module,
        tier
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao criar sessão de pagamento');
    }
  },

  // Crypto payments
  async createCryptoInvoice(tier) {
    try {
      const response = await api.post('/payments/crypto/invoice', {
        tier
      });
      return response.data;
    } catch (error) {
      console.error('Error creating crypto invoice:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao criar fatura cripto');
    }
  },

  async verifyCryptoPayment(invoiceId, transactionHash) {
    try {
      const response = await api.post('/payments/crypto/verify', {
        invoiceId,
        transactionHash
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying crypto payment:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao verificar pagamento cripto');
    }
  },

  // Get plan prices
  getPlanPrices() {
    return {
      store: {
        basic: { price: 99.00, currency: 'BRL', features: ['Até 100 produtos', 'Suporte básico', 'Relatórios básicos'] },
        pro: { price: 199.00, currency: 'BRL', features: ['Até 500 produtos', 'Suporte prioritário', 'Relatórios avançados', 'API access'] },
        enterprise: { price: 499.00, currency: 'BRL', features: ['Produtos ilimitados', 'Suporte 24/7', 'Relatórios personalizados', 'API completa', 'Integração customizada'] }
      },
      freight: {
        basic: { price: 99.00, currency: 'BRL', features: ['Até 50 fretes/mês', 'Suporte básico', 'Relatórios básicos'] },
        pro: { price: 199.00, currency: 'BRL', features: ['Até 200 fretes/mês', 'Suporte prioritário', 'Relatórios avançados', 'API access'] },
        enterprise: { price: 499.00, currency: 'BRL', features: ['Fretes ilimitados', 'Suporte 24/7', 'Relatórios personalizados', 'API completa', 'Integração customizada'] }
      },
      crypto: {
        basic: { price: 20.00, currency: 'USD', features: ['Operações básicas', 'Suporte básico', 'Relatórios básicos'] },
        pro: { price: 40.00, currency: 'USD', features: ['Operações avançadas', 'Suporte prioritário', 'Relatórios avançados', 'API access'] },
        enterprise: { price: 100.00, currency: 'USD', features: ['Operações ilimitadas', 'Suporte 24/7', 'Relatórios personalizados', 'API completa', 'Integração customizada'] }
      }
    };
  }
};

export default paymentService;
