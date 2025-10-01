// =============================================================
// AGROISYNC BACKEND • Configuração Stripe
// =============================================================

import Stripe from 'stripe';

// Inicializar Stripe com chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: false
});

// IDs reais dos produtos Stripe
export const STRIPE_PRODUCTS = {
  // Planos para Lojas
  STORE: {
    BASIC: {
      priceId: process.env.STRIPE_STORE_BASIC_PRICE_ID || 'price_1QEXAMPLE1',
      productId: process.env.STRIPE_STORE_BASIC_PRODUCT_ID || 'prod_EXAMPLE1',
      name: 'Loja Básica',
      price: 2990, // em centavos
      interval: 'month'
    },
    PROFESSIONAL: {
      priceId: process.env.STRIPE_STORE_PRO_PRICE_ID || 'price_1QEXAMPLE2',
      productId: process.env.STRIPE_STORE_PRO_PRODUCT_ID || 'prod_EXAMPLE2',
      name: 'Loja Profissional',
      price: 7990, // em centavos
      interval: 'month'
    },
    ENTERPRISE: {
      priceId: process.env.STRIPE_STORE_ENTERPRISE_PRICE_ID || 'price_1QEXAMPLE3',
      productId: process.env.STRIPE_STORE_ENTERPRISE_PRODUCT_ID || 'prod_EXAMPLE3',
      name: 'Loja Enterprise',
      price: 19990, // em centavos
      interval: 'month'
    }
  },

  // Planos para Frete (AgroConecta)
  FREIGHT: {
    BASIC: {
      priceId: process.env.STRIPE_FREIGHT_BASIC_PRICE_ID || 'price_1QEXAMPLE4',
      productId: process.env.STRIPE_FREIGHT_BASIC_PRODUCT_ID || 'prod_EXAMPLE4',
      name: 'Frete Básico',
      price: 1990, // em centavos
      interval: 'month'
    },
    PROFESSIONAL: {
      priceId: process.env.STRIPE_FREIGHT_PRO_PRICE_ID || 'price_1QEXAMPLE5',
      productId: process.env.STRIPE_FREIGHT_PRO_PRODUCT_ID || 'prod_EXAMPLE5',
      name: 'Frete Profissional',
      price: 4990, // em centavos
      interval: 'month'
    },
    ENTERPRISE: {
      priceId: process.env.STRIPE_FREIGHT_ENTERPRISE_PRICE_ID || 'price_1QEXAMPLE6',
      productId: process.env.STRIPE_FREIGHT_ENTERPRISE_PRODUCT_ID || 'prod_EXAMPLE6',
      name: 'Frete Enterprise',
      price: 12990, // em centavos
      interval: 'month'
    }
  }
};

// Configurações do Stripe
export const STRIPE_CONFIG = {
  CURRENCY: 'brl',
  LOCALE: 'pt-BR',
  SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || 'https://agroisync.com/payment/success',
  CANCEL_URL: process.env.STRIPE_CANCEL_URL || 'https://agroisync.com/payment/cancel',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
};

// Função para criar sessão de checkout
export const createCheckoutSession = async (priceId, customerEmail, userId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      customer_email: customerEmail,
      metadata: {
        userId,
        source: 'agroisync'
      },
      success_url: `${STRIPE_CONFIG.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      locale: STRIPE_CONFIG.LOCALE,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true
      }
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    // console.error('Erro ao criar sessão Stripe:', error);
    return { success: false, error: error.message };
  }
};

// Função para verificar webhook
export const verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, STRIPE_CONFIG.WEBHOOK_SECRET);
    return { success: true, event };
  } catch (error) {
    // console.error('Erro na verificação do webhook:', error);
    return { success: false, error: error.message };
  }
};

// Função para obter detalhes da sessão
export const getSessionDetails = async sessionId => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return { success: true, session };
  } catch (error) {
    // console.error('Erro ao obter sessão:', error);
    return { success: false, error: error.message };
  }
};

// Função para cancelar assinatura
export const cancelSubscription = async subscriptionId => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return { success: true, subscription };
  } catch (error) {
    // console.error('Erro ao cancelar assinatura:', error);
    return { success: false, error: error.message };
  }
};

// Função para obter assinatura
export const getSubscription = async subscriptionId => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return { success: true, subscription };
  } catch (error) {
    // console.error('Erro ao obter assinatura:', error);
    return { success: false, error: error.message };
  }
};

// Helper para validar price ID
export const validatePriceId = priceId => {
  const allPriceIds = [];
  Object.values(STRIPE_PRODUCTS).forEach(category => {
    Object.values(category).forEach(product => {
      allPriceIds.push(product.priceId);
    });
  });
  return allPriceIds.includes(priceId);
};

export default stripe;
