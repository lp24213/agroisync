// Payment Service - Integração Stripe e MetaMask
class PaymentService {
  constructor() {
    this.stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';
    this.metaMaskAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'; // Endereço MetaMask do usuário
    this.stripeAccountId = 'acct_1ABC123DEF456GHI'; // Account ID Stripe do usuário
  }

  // Stripe Payment Methods
  async initializeStripe() {
    try {
      const { loadStripe } = await import('@stripe/stripe-js');
      return await loadStripe(this.stripePublishableKey);
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
      throw error;
    }
  }

  async createStripePaymentIntent(amount, currency = 'brl', metadata = {}) {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta conectada');
      }

      return accounts[0];
    } catch (error) {
      console.error('Erro ao conectar MetaMask:', error);
      throw error;
    }
  }

  async sendCryptoPayment(toAddress, amount, currency = 'ETH') {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length === 0) {
        throw new Error('MetaMask não conectado');
      }

      // Converter valor para wei (ETH)
      const weiAmount = window.ethereum.utils.toWei(amount.toString(), 'ether');

      const transactionParameters = {
        to: toAddress,
        from: accounts[0],
        value: weiAmount,
        gas: '0x5208', // 21000 gas
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return {
        success: true,
        transactionHash: txHash,
        amount,
        currency,
        toAddress
      };
    } catch (error) {
      console.error('Erro ao enviar pagamento crypto:', error);
      throw error;
    }
  }

  // Payment Routing Logic
  async processPayment(paymentData) {
    const { amount, currency, paymentMethod, service, metadata = {} } = paymentData;

    try {
      switch (service) {
        case 'agroconecta':
        case 'loja':
          // AgroConecta e Loja → Stripe
          const paymentIntent = await this.createStripePaymentIntent(
            amount,
            currency,
            {
              ...metadata,
              service,
              platform: 'agroisync'
            }
          );
          return {
            method: 'stripe',
            paymentIntent,
            redirectUrl: `/payment/stripe?intent=${paymentIntent.client_secret}`
          };

        case 'crypto':
          // Crypto → MetaMask
          const cryptoPayment = await this.sendCryptoPayment(
            this.metaMaskAddress,
            amount,
            currency
          );
          return {
            method: 'metamask',
            ...cryptoPayment,
            redirectUrl: `/payment/crypto-success?tx=${cryptoPayment.transactionHash}`
          };

        default:
          throw new Error('Serviço de pagamento não suportado');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  // Plan Pricing Logic
  getPlanPricing(planType, service) {
    const pricing = {
      agroconecta: {
        basic: { price: 29.90, features: ['5 anúncios', 'Suporte básico', 'Relatórios básicos'] },
        premium: { price: 59.90, features: ['20 anúncios', 'Suporte prioritário', 'Relatórios avançados', 'API access'] },
        enterprise: { price: 149.90, features: ['Anúncios ilimitados', 'Suporte 24/7', 'Relatórios customizados', 'Integração completa'] }
      },
      loja: {
        basic: { price: 39.90, features: ['10 produtos', 'Suporte básico', 'Dashboard básico'] },
        premium: { price: 79.90, features: ['50 produtos', 'Suporte prioritário', 'Dashboard avançado', 'Analytics'] },
        enterprise: { price: 199.90, features: ['Produtos ilimitados', 'Suporte 24/7', 'Dashboard customizado', 'Integração ERP'] }
      },
      crypto: {
        basic: { price: 0.01, features: ['Transações básicas', 'Wallet integrado', 'Suporte básico'] },
        premium: { price: 0.05, features: ['Transações avançadas', 'Wallet premium', 'Suporte prioritário', 'Staking'] },
        enterprise: { price: 0.1, features: ['Transações ilimitadas', 'Wallet enterprise', 'Suporte 24/7', 'DeFi integration'] }
      }
    };

    return pricing[service]?.[planType] || null;
  }

  // Commission Calculation
  calculateCommission(amount, service) {
    const commissionRates = {
      agroconecta: 0.05, // 5%
      loja: 0.08, // 8%
      crypto: 0.02 // 2%
    };

    const rate = commissionRates[service] || 0.05;
    return {
      commission: amount * rate,
      netAmount: amount * (1 - rate),
      rate: rate * 100
    };
  }
}

const paymentService = new PaymentService();
export default paymentService;