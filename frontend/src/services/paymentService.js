// Payment Service - Integração Stripe e MetaMask
class PaymentService {
  constructor() {
    this.stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';
    this.metaMaskAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'; // Endereço MetaMask do usuário
    this.stripeAccountId = 'acct_1ABC123DEF456GHI'; // Account ID Stripe do usuário
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Stripe Payment Methods
  async initializeStripe() {
    if (window.Stripe) {
      return window.Stripe(this.stripePublishableKey);
    }
    
    const { loadStripe } = await import('@stripe/stripe-js');
    return await loadStripe(this.stripePublishableKey);
  }

  async createPaymentIntent(amount, currency = 'brl', metadata = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe usa centavos
          currency,
          metadata: {
            ...metadata,
            account_id: this.stripeAccountId,
            platform: 'agroisync'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar Payment Intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      throw error;
    }
  }

  async processStripePayment(paymentIntentId, paymentMethodId) {
    try {
      const stripe = await this.initializeStripe();
      
      const { error } = await stripe.confirmPayment({
        clientSecret: paymentIntentId,
        confirmParams: {
          payment_method: paymentMethodId,
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao processar pagamento Stripe:', error);
      throw error;
    }
  }

  // MetaMask Payment Methods
  async connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        this.metaMaskAddress = accounts[0];
        return accounts[0];
      } catch (error) {
        console.error('Erro ao conectar MetaMask:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask não está instalado');
    }
  }

  async sendEthereumPayment(toAddress, amount, gasPrice = '0x4a817c800') {
    try {
      const transactionParameters = {
        to: toAddress,
        from: this.metaMaskAddress,
        value: '0x' + (amount * Math.pow(10, 18)).toString(16), // Converter para Wei
        gas: '0x5208', // 21000 gas
        gasPrice: gasPrice
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return { success: true, txHash };
    } catch (error) {
      console.error('Erro ao enviar pagamento Ethereum:', error);
      throw error;
    }
  }

  // Subscription Management
  async createSubscription(priceId, customerId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          priceId,
          customerId,
          metadata: {
            platform: 'agroisync',
            account_id: this.stripeAccountId
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar assinatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao cancelar assinatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  // Utility Methods
  formatCurrency(amount, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  calculateFee(amount, feePercentage = 2.9) {
    return (amount * feePercentage) / 100;
  }

  calculateTotal(amount, feePercentage = 2.9) {
    const fee = this.calculateFee(amount, feePercentage);
    return amount + fee;
  }

  // Price calculation for different user types
  calculatePrice(basePrice, userType = 'standard') {
    const multipliers = {
      'standard': 1.0,
      'premium': 0.9,    // 10% desconto
      'enterprise': 0.8, // 20% desconto
      'vip': 0.7         // 30% desconto
    };

    const multiplier = multipliers[userType] || 1.0;
    return basePrice * multiplier;
  }

  // Dynamic pricing based on market conditions
  calculateDynamicPrice(basePrice, marketConditions = {}) {
    let adjustedPrice = basePrice;

    // Ajustar baseado na demanda
    if (marketConditions.demand === 'high') {
      adjustedPrice *= 1.1; // 10% aumento
    } else if (marketConditions.demand === 'low') {
      adjustedPrice *= 0.9; // 10% desconto
    }

    // Ajustar baseado na sazonalidade
    if (marketConditions.season === 'peak') {
      adjustedPrice *= 1.05; // 5% aumento
    } else if (marketConditions.season === 'off') {
      adjustedPrice *= 0.95; // 5% desconto
    }

    return adjustedPrice;
  }

  // Escrow system for secure transactions
  async createEscrowPayment(buyerAddress, sellerAddress, amount, conditions) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/escrow/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          buyerAddress,
          sellerAddress,
          amount,
          conditions,
          platform: 'agroisync'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar escrow');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar escrow:', error);
      throw error;
    }
  }

  async releaseEscrowPayment(escrowId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/escrow/${escrowId}/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao liberar escrow');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao liberar escrow:', error);
      throw error;
    }
  }

  // Payment history and analytics
  async getPaymentHistory(limit = 50, offset = 0) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/history?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  async getPaymentAnalytics(period = '30d') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      throw error;
    }
  }

  // Refund system
  async processRefund(paymentId, amount = null, reason = '') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount,
          reason,
          platform: 'agroisync'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar reembolso');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }

  // Multi-currency support
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/currency/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          from: fromCurrency,
          to: toCurrency
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao converter moeda');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao converter moeda:', error);
      throw error;
    }
  }

  // Tax calculation
  calculateTax(amount, taxRate = 0.1) {
    return amount * taxRate;
  }

  // Final price calculation with all fees and taxes
  calculateFinalPrice(basePrice, userType = 'standard', marketConditions = {}) {
    let price = this.calculatePrice(basePrice, userType);
    price = this.calculateDynamicPrice(price, marketConditions);
    
    const fee = this.calculateFee(price);
    const tax = this.calculateTax(price);
    
    return price + fee + tax;
  }

  // Payment method validation
  validatePaymentMethod(method) {
    const validMethods = ['stripe', 'metamask', 'pix', 'boleto'];
    return validMethods.includes(method);
  }

  // Security checks
  async validateTransaction(transactionData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Transação inválida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao validar transação:', error);
      throw error;
    }
  }

  // Get base price for calculations
  getBasePrice() {
    return 100; // Preço base padrão
  }
}

// Instância única do serviço
const paymentService = new PaymentService();

export default paymentService;