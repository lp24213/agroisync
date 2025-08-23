// Serviço de Pagamentos Stripe - AGROSYNC
// Integração completa para recebimento de pagamentos

import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (deve ser a chave publicável)
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51QVXlZGYY0MfrP1anFzugW5vwON3FAMt1lNmJymqfLA4qLhS6FaZiqDIRV4Pp3hhdtzbDzbFXiURqt6jHCtT82TX000u4uxsEr';

// Inicializar Stripe
let stripe = null;

// Carregar Stripe de forma assíncrona
const initializeStripe = async () => {
  if (!stripe) {
    try {
      stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      console.log('Stripe inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
      throw error;
    }
  }
  return stripe;
};

// Planos disponíveis
export const PLANS = {
  BASIC: {
    id: 'price_basic',
    name: 'Plano Básico',
    price: 29.90,
    currency: 'BRL',
    features: [
      'Cotações básicas de grãos',
      'Acesso ao marketplace',
      'Suporte por email'
    ],
    interval: 'month'
  },
  PROFESSIONAL: {
    id: 'price_professional',
    name: 'Plano Profissional',
    price: 79.90,
    currency: 'BRL',
    features: [
      'Cotações avançadas em tempo real',
      'Análises de mercado',
      'API de dados agrícolas',
      'Suporte prioritário',
      'Relatórios personalizados'
    ],
    interval: 'month'
  },
  ENTERPRISE: {
    id: 'price_enterprise',
    name: 'Plano Empresarial',
    price: 199.90,
    currency: 'BRL',
    features: [
      'Todas as funcionalidades do Profissional',
      'Integração com sistemas ERP',
      'API dedicada',
      'Suporte 24/7',
      'Consultoria especializada',
      'Dashboard personalizado'
    ],
    interval: 'month'
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
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar sessão de checkout');
    }

    const session = await response.json();
    
    // Redirecionar para checkout do Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
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
      return_url: window.location.origin + '/payment-success'
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
export const checkPaymentStatus = async (paymentIntentId) => {
  try {
    const response = await fetch(`/api/payment-status/${paymentIntentId}`);
    
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
    const response = await fetch('/api/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        phone
      }),
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
export const getPaymentHistory = async (customerId) => {
  try {
    const response = await fetch(`/api/payment-history/${customerId}`);
    
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
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
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

export const validateCard = (cardNumber) => {
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

export default {
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
