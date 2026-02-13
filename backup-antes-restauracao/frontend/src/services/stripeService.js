// Serviço de Pagamentos Stripe - AGROSYNC
// Integração completa para recebimento de pagamentos

import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (deve ser a chave publicável)
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_DEFAULT_KEY_NOT_SET';

// Inicializar Stripe
let stripe = null;

// Carregar Stripe de forma assíncrona
const initializeStripe = async () => {
  if (!stripe) {
    try {
      stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (process.env.NODE_ENV !== 'production') {

        console.log('Stripe inicializado com sucesso');

      }
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
      throw error;
    }
  }
  return stripe;
};

// Planos disponíveis
export const PLANS = {
  GERAL: {
    id: 'price_geral',
    name: 'Plano Geral',
    price: 14.99,
    currency: 'BRL',
    features: ['Até 1 frete e 1 produto', 'Acesso básico à plataforma', 'Suporte por email'],
    interval: 'month',
    semiannual: 89.94, // 6 meses sem desconto
    annual: 179.88 // 12 meses sem desconto
  },
  BASICO: {
    id: 'price_basico',
    name: 'Plano Básico',
    price: 29.99,
    currency: 'BRL',
    features: ['Até 3 produtos', 'Até 3 fretes mensais', 'Suporte prioritário', 'Relatórios básicos'],
    interval: 'month',
    semiannual: 161.94, // 10% desconto
    annual: 305.89 // 15% desconto
  },
  PROFISSIONAL: {
    id: 'price_profissional',
    name: 'Plano Profissional',
    price: 149.99,
    currency: 'BRL',
    features: [
      'Até 25 fretes mensais',
      'Até 25 produtos',
      'Análises avançadas',
      'Suporte prioritário',
      'Relatórios personalizados'
    ],
    interval: 'month',
    semiannual: 809.94, // 10% desconto
    annual: 1529.89 // 15% desconto
  },
  EMPRESARIAL: {
    id: 'price_empresarial',
    name: 'Plano Empresarial',
    price: 299.99,
    currency: 'BRL',
    features: [
      'Fretes ilimitados',
      'Produtos ilimitados',
      'Integração com sistemas ERP',
      'API dedicada',
      'Suporte 24/7',
      'Consultoria especializada'
    ],
    interval: 'month',
    semiannual: 1619.94, // 10% desconto
    annual: 3059.89 // 15% desconto
  }
};

// Planos específicos para LOJA (valores superiores)
export const STORE_PLANS = {
  LOJA_BASICA: {
    id: 'price_loja_basica',
    name: 'Loja Básica',
    price: 49.99,
    currency: 'BRL',
    features: ['1 loja online', 'Até 25 produtos na loja', 'Painel de vendas', 'Suporte por email'],
    interval: 'month',
    semiannual: 269.94, // 10% desconto
    annual: 509.89 // 15% desconto
  },
  LOJA_PROFISSIONAL: {
    id: 'price_loja_profissional',
    name: 'Loja Profissional',
    price: 99.99,
    currency: 'BRL',
    features: [
      '1 loja online',
      'Até 100 produtos na loja',
      'Relatórios de vendas',
      'Integração com pagamentos',
      'Suporte prioritário'
    ],
    interval: 'month',
    semiannual: 539.94, // 10% desconto
    annual: 1019.89 // 15% desconto
  },
  LOJA_ILIMITADA: {
    id: 'price_loja_ilimitada',
    name: 'Loja Ilimitada',
    price: 199.99,
    currency: 'BRL',
    features: [
      'Lojas ilimitadas',
      'Produtos ilimitados',
      'Dashboard avançado',
      'API de vendas',
      'Suporte 24/7',
      'Consultoria de e-commerce'
    ],
    interval: 'month',
    semiannual: 1079.94, // 10% desconto
    annual: 2039.89 // 15% desconto
  }
};

// Criar sessão de checkout
export const createCheckoutSession = async (planId, customerEmail, successUrl, cancelUrl) => {
  try {
    const stripe = await initializeStripe();

    // Dados do plano selecionado
    const plan = Object.values(PLANS).find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    // Criar sessão de checkout
    const response = await fetch(getApiUrl('/create-checkout-session'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        planName: plan.name,
        price: plan.price,
        currency: plan.currency,
        customerEmail,
        successUrl,
        cancelUrl,
        interval: plan.interval
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao criar sessão de checkout');
    }

    const session = await response.json();

    // Redirecionar para checkout do Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
};

// Processar pagamento com cartão
export const processPayment = async (paymentMethodId, amount, currency = 'BRL', description) => {
  try {
    const stripe = await initializeStripe();

    // Confirmar pagamento
    const { paymentIntent, error } = await stripe.confirmCardPayment(paymentMethodId, {
      payment_method: paymentMethodId,
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency.toLowerCase(),
      description: description,
      return_url: window.location.origin + '/payment/success'
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentIntent;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
};

// Verificar status do pagamento
export const checkPaymentStatus = async paymentIntentId => {
  try {
    const response = await fetch(getApiUrl(`/payment-status/${paymentIntentId}`));

    if (!response.ok) {
      throw new Error('Erro ao verificar status do pagamento');
    }

    const status = await response.json();
    return status;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

// Criar cliente no Stripe
export const createCustomer = async (email, name, phone) => {
  try {
    const response = await fetch(getApiUrl('/create-customer'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        phone
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao criar cliente');
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

// Obter histórico de pagamentos
export const getPaymentHistory = async customerId => {
  try {
    const response = await fetch(getApiUrl(`/payment-history/${customerId}`));

    if (!response.ok) {
      throw new Error('Erro ao obter histórico de pagamentos');
    }

    const history = await response.json();
    return history;
  } catch (error) {
    console.error('Erro ao obter histórico de pagamentos:', error);
    throw error;
  }
};

// Cancelar assinatura
export const cancelSubscription = async subscriptionId => {
  try {
    const response = await fetch(getApiUrl(`/cancel-subscription/${subscriptionId}`), {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Erro ao cancelar assinatura');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    throw error;
  }
};

// Utilitários
export const formatCurrency = (amount, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const validateCard = cardNumber => {
  // Algoritmo de Luhn para validação de cartão
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const stripeService = {
  initializeStripe,
  createCheckoutSession,
  processPayment,
  checkPaymentStatus,
  createCustomer,
  getPaymentHistory,
  cancelSubscription,
  formatCurrency,
  validateCard,
  PLANS
};

export default stripeService;
