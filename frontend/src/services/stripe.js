import { loadStripe } from '@stripe/stripe-js';
import { getAuthToken, getApiUrl } from '../config/constants.js';

// Stripe publishable key - substitua pela sua chave real
const STRIPE_PUBLISHABLE_KEY =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_PLACEHOLDER_KEY_NOT_SET';

// Inicializar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Função para criar Payment Intent
export const createPaymentIntent = async paymentData => {
  try {
    const response = await fetch(getApiUrl('/payment-intent'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar Payment Intent');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    throw error;
  }
};

// Função para processar pagamento individual
export const processIndividualPayment = async (adId, userId, amount) => {
  try {
    const paymentData = {
      amount: amount * 100, // Stripe usa centavos
      currency: 'brl',
      metadata: {
        type: 'individual',
        adId: adId,
        userId: userId,
        service: 'ad_access'
      }
    };

    const clientSecret = await createPaymentIntent(paymentData);
    return clientSecret;
  } catch (error) {
    console.error('Erro ao processar pagamento individual:', error);
    throw error;
  }
};

// Função para processar pagamento de plano
export const processPlanPayment = async (planType, userId, amount) => {
  try {
    const paymentData = {
      amount: amount * 100, // Stripe usa centavos
      currency: 'brl',
      metadata: {
        type: 'plan',
        planType: planType,
        userId: userId,
        service: 'subscription'
      }
    };

    const clientSecret = await createPaymentIntent(paymentData);
    return clientSecret;
  } catch (error) {
    console.error('Erro ao processar pagamento de plano:', error);
    throw error;
  }
};

// Planos definidos
export const PAYMENT_PLANS = {
  geral: {
    name: 'Plano Geral',
    price: 14.99,
    description: 'Até 1 frete e 1 produto',
    features: ['Até 1 frete e 1 produto', 'Acesso básico à plataforma', 'Suporte por email'],
    semiannual: 89.94,
    annual: 179.88
  },
  basico: {
    name: 'Plano Básico',
    price: 29.99,
    description: 'Até 3 produtos/fretes',
    features: ['Até 3 produtos', 'Até 3 fretes mensais', 'Suporte prioritário', 'Relatórios básicos'],
    semiannual: 161.94,
    annual: 305.89
  },
  profissional: {
    name: 'Plano Profissional',
    price: 149.99,
    description: 'Até 25 produtos/fretes',
    features: [
      'Até 25 fretes mensais',
      'Até 25 produtos',
      'Análises avançadas',
      'Suporte prioritário',
      'Relatórios personalizados'
    ],
    semiannual: 809.94,
    annual: 1529.89
  },
  empresarial: {
    name: 'Plano Empresarial',
    price: 299.99,
    description: 'Fretes e produtos ilimitados',
    features: [
      'Fretes ilimitados',
      'Produtos ilimitados',
      'Integração com sistemas ERP',
      'API dedicada',
      'Suporte 24/7',
      'Consultoria especializada'
    ],
    semiannual: 1619.94,
    annual: 3059.89
  }
};

// Planos específicos para LOJA
export const STORE_PAYMENT_PLANS = {
  loja_basica: {
    name: 'Loja Básica',
    price: 49.99,
    description: '1 loja com até 25 produtos',
    features: ['1 loja online', 'Até 25 produtos na loja', 'Painel de vendas', 'Suporte por email'],
    semiannual: 269.94,
    annual: 509.89
  },
  loja_profissional: {
    name: 'Loja Profissional',
    price: 99.99,
    description: '1 loja com até 100 produtos',
    features: [
      '1 loja online',
      'Até 100 produtos na loja',
      'Relatórios de vendas',
      'Integração com pagamentos',
      'Suporte prioritário'
    ],
    semiannual: 539.94,
    annual: 1019.89
  },
  loja_ilimitada: {
    name: 'Loja Ilimitada',
    price: 199.99,
    description: 'Lojas e produtos ilimitados',
    features: [
      'Lojas ilimitadas',
      'Produtos ilimitados',
      'Dashboard avançado',
      'API de vendas',
      'Suporte 24/7',
      'Consultoria de e-commerce'
    ],
    semiannual: 1079.94,
    annual: 2039.89
  }
};

// Função para verificar acesso do usuário
export const checkUserAccess = async (userId, adId) => {
  try {
    const response = await fetch(getApiUrl(`/user-access/${userId}/${adId}`), {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar acesso');
    }

    const accessData = await response.json();
    return accessData;
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return { hasAccess: false, contacts: false, chat: false, shipping: false };
  }
};

// Função para liberar dados sensíveis após pagamento
export const unlockSensitiveData = async (userId, adId) => {
  try {
    const response = await fetch(getApiUrl('/v1/data-access/unlock-data'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ userId, adId })
    });

    if (!response.ok) {
      throw new Error('Erro ao liberar dados');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao liberar dados sensíveis:', error);
    throw error;
  }
};

// Função para obter dados liberados
export const getUnlockedData = async adId => {
  try {
    const response = await fetch(getApiUrl(`/v1/data-access/unlocked-data/${adId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter dados liberados');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao obter dados liberados:', error);
    throw error;
  }
};
