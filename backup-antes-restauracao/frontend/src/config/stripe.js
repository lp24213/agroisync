// =============================================================
// AGROISYNC • Configuração Stripe
// =============================================================

// IDs reais dos produtos Stripe para produção
export const STRIPE_PRODUCTS = {
  // Planos para Lojas
  STORE: {
    BASIC: {
      priceId: process.env.REACT_APP_STRIPE_STORE_BASIC_PRICE_ID || 'price_1QEXAMPLE1',
      name: 'Loja Básica',
      price: 29.90,
      features: ['Até 50 produtos', 'Suporte por email', 'Relatórios básicos']
    },
    PROFESSIONAL: {
      priceId: process.env.REACT_APP_STRIPE_STORE_PRO_PRICE_ID || 'price_1QEXAMPLE2',
      name: 'Loja Profissional',
      price: 79.90,
      features: ['Produtos ilimitados', 'Suporte prioritário', 'Analytics avançados', 'Integração API']
    },
    ENTERPRISE: {
      priceId: process.env.REACT_APP_STRIPE_STORE_ENTERPRISE_PRICE_ID || 'price_1QEXAMPLE3',
      name: 'Loja Enterprise',
      price: 199.90,
      features: ['Tudo do Pro', 'Suporte 24/7', 'Customização', 'White-label']
    }
  },

  // Planos para Frete (AgroConecta)
  FREIGHT: {
    BASIC: {
      priceId: process.env.REACT_APP_STRIPE_FREIGHT_BASIC_PRICE_ID || 'price_1QEXAMPLE4',
      name: 'Frete Básico',
      price: 19.90,
      features: ['Até 10 ofertas/mês', 'Rastreamento básico', 'Suporte email']
    },
    PROFESSIONAL: {
      priceId: process.env.REACT_APP_STRIPE_FREIGHT_PRO_PRICE_ID || 'price_1QEXAMPLE5',
      name: 'Frete Profissional',
      price: 49.90,
      features: ['Ofertas ilimitadas', 'Rastreamento avançado', 'Suporte prioritário', 'API integrada']
    },
    ENTERPRISE: {
      priceId: process.env.REACT_APP_STRIPE_FREIGHT_ENTERPRISE_PRICE_ID || 'price_1QEXAMPLE6',
      name: 'Frete Enterprise',
      price: 129.90,
      features: ['Tudo do Pro', 'Suporte 24/7', 'Dashboard customizado', 'Integração ERP']
    }
  }
};

// Configuração de webhooks
export const STRIPE_WEBHOOKS = {
  SUCCESS_URL: `${window.location.origin}/payment/success`,
  CANCEL_URL: `${window.location.origin}/payment/cancel`,
  WEBHOOK_SECRET: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET || 'whsec_example'
};

// URLs de redirecionamento
export const STRIPE_REDIRECTS = {
  SUCCESS: '/payment/success',
  CANCEL: '/payment/cancel',
  ERROR: '/payment/error'
};

// Configurações de moeda e localização
export const STRIPE_LOCALE = {
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',
  COUNTRY: 'BR'
};

// Validação de IDs Stripe
export const validateStripePriceId = (priceId) => {
  const stripePriceIdRegex = /^price_[a-zA-Z0-9]{14}$/;
  return stripePriceIdRegex.test(priceId);
};

// Helper para obter produto por price ID
export const getProductByPriceId = (priceId) => {
  for (const category of Object.values(STRIPE_PRODUCTS)) {
    for (const product of Object.values(category)) {
      if (product.priceId === priceId) {
        return product;
      }
    }
  }
  return null;
};

// Helper para obter todos os price IDs
export const getAllPriceIds = () => {
  const priceIds = [];
  for (const category of Object.values(STRIPE_PRODUCTS)) {
    for (const product of Object.values(category)) {
      priceIds.push(product.priceId);
    }
  }
  return priceIds;
};

export default {
  STRIPE_PRODUCTS,
  STRIPE_WEBHOOKS,
  STRIPE_REDIRECTS,
  STRIPE_LOCALE,
  validateStripePriceId,
  getProductByPriceId,
  getAllPriceIds
};
