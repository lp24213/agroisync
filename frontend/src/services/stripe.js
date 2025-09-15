import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key - substitua pela sua chave real
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz';

// Inicializar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Função para criar Payment Intent
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await fetch('/api/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(paymentData),
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
  individual: {
    name: 'Individual',
    price: 49.90,
    description: '1 anúncio/produto/frete',
    features: ['Acesso a 1 anúncio', 'Contato direto', 'Chat 1:1', 'Detalhes de frete']
  },
  intermediate: {
    name: 'Intermediário',
    price: 149.99,
    description: '5 anúncios/produtos/fretes',
    features: ['Acesso a 5 anúncios', 'Contato direto', 'Chat 1:1', 'Detalhes de frete', 'Suporte prioritário']
  },
  premium: {
    name: 'Premium',
    price: 449.90,
    description: '20 anúncios/produtos/fretes',
    features: ['Acesso a 20 anúncios', 'Contato direto', 'Chat 1:1', 'Detalhes de frete', 'Suporte prioritário', 'Analytics avançados']
  }
};

// Função para verificar acesso do usuário
export const checkUserAccess = async (userId, adId) => {
  try {
    const response = await fetch(`/api/user-access/${userId}/${adId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
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
    const response = await fetch('/api/unlock-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, adId }),
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
