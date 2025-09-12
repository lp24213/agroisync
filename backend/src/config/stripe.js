import Stripe from 'stripe';
import { createSecurityLog } from '../utils/securityLogger.js';

// Configuração do Stripe
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    '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',
  {
    apiVersion: '2024-06-20',
    typescript: true
  }
);

// ===== CONFIGURAÇÃO DE PREÇOS =====

export const STRIPE_PRICE_CONFIG = {
  store: {
    basic: {
      priceId: process.env.STRIPE_STORE_BASIC_PRICE_ID || 'price_store_basic',
      amount: 2500, // R$ 25,00 em centavos
      currency: 'brl',
      maxAds: 3,
      features: ['Anúncios básicos', 'Suporte por email', 'Dashboard básico']
    },
    pro: {
      priceId: process.env.STRIPE_STORE_PRO_PRICE_ID || 'price_store_pro',
      amount: 5000, // R$ 50,00 em centavos
      currency: 'brl',
      maxAds: 10,
      features: [
        'Anúncios premium',
        'Suporte prioritário',
        'Analytics básico',
        'Relatórios avançados'
      ]
    },
    enterprise: {
      priceId: process.env.STRIPE_STORE_ENTERPRISE_PRICE_ID || 'price_store_enterprise',
      amount: 10000, // R$ 100,00 em centavos
      currency: 'brl',
      maxAds: 50,
      features: [
        'Anúncios ilimitados',
        'Suporte 24/7',
        'Analytics avançado',
        'API access',
        'Integração personalizada'
      ]
    }
  },
  freight: {
    basic: {
      priceId: process.env.STRIPE_FREIGHT_BASIC_PRICE_ID || 'price_freight_basic',
      amount: 5000, // R$ 50,00 em centavos
      currency: 'brl',
      maxFreights: 5,
      features: ['Fretes básicos', 'Suporte por email', 'Rastreamento básico']
    },
    pro: {
      priceId: process.env.STRIPE_FREIGHT_PRO_PRICE_ID || 'price_freight_pro',
      amount: 14900, // R$ 149,00 em centavos
      currency: 'brl',
      maxFreights: 30,
      features: [
        'Fretes premium',
        'Suporte prioritário',
        'Rastreamento GPS',
        'Relatórios de entrega'
      ]
    },
    enterprise: {
      priceId: process.env.STRIPE_FREIGHT_ENTERPRISE_PRICE_ID || 'price_freight_enterprise',
      amount: 29900, // R$ 299,00 em centavos
      currency: 'brl',
      maxFreights: 100,
      features: [
        'Fretes ilimitados',
        'Suporte 24/7',
        'Rastreamento em tempo real',
        'API completo',
        'Integração ERP'
      ]
    }
  }
};

// ===== FUNÇÕES DE PAGAMENTO =====

// Criar PaymentIntent
export const createPaymentIntent = async (amount, currency, metadata) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true
      },
      payment_method_types: ['card', 'pix'],
      setup_future_usage: 'off_session'
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating Stripe PaymentIntent:', error);
    throw error;
  }
};

// Criar Checkout Session
export const createCheckoutSession = async (priceId, successUrl, cancelUrl, metadata) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      customer_email: metadata.email,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['BR', 'US', 'CA', 'MX', 'AR', 'CL', 'CO', 'PE']
      }
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    throw error;
  }
};

// Criar Customer
export const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
      description: `Customer for ${metadata.company || 'AGROTM'}`
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe Customer:', error);
    throw error;
  }
};

// Criar Subscription
export const createSubscription = async (customerId, priceId, metadata = {}) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    return subscription;
  } catch (error) {
    console.error('Error creating Stripe Subscription:', error);
    throw error;
  }
};

// Cancelar Subscription
export const cancelSubscription = async (subscriptionId, reason = 'customer_request') => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      cancellation_reason: reason
    });

    return subscription;
  } catch (error) {
    console.error('Error canceling Stripe Subscription:', error);
    throw error;
  }
};

// Obter Subscription
export const getSubscription = async subscriptionId => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'latest_invoice', 'latest_invoice.payment_intent']
    });

    return subscription;
  } catch (error) {
    console.error('Error retrieving Stripe Subscription:', error);
    throw error;
  }
};

// Obter Customer
export const getCustomer = async customerId => {
  try {
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions', 'invoices']
    });

    return customer;
  } catch (error) {
    console.error('Error retrieving Stripe Customer:', error);
    throw error;
  }
};

// Obter PaymentIntent
export const getPaymentIntent = async paymentIntentId => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['customer', 'payment_method']
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving Stripe PaymentIntent:', error);
    throw error;
  }
};

// Confirmar PaymentIntent
export const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error confirming Stripe PaymentIntent:', error);
    throw error;
  }
};

// Criar Refund
export const createRefund = async (paymentIntentId, amount, reason = 'requested_by_customer') => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason
    });

    return refund;
  } catch (error) {
    console.error('Error creating Stripe Refund:', error);
    throw error;
  }
};

// ===== WEBHOOKS =====

// Verificar assinatura do webhook
export const verifyWebhookSignature = (payload, signature, secret) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
};

// Processar eventos do webhook
export const processWebhookEvent = async (event, req) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object, req);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object, req);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, req);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, req);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, req);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSuccess(event.data.object, req);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailure(event.data.object, req);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    throw error;
  }
};

// ===== HANDLERS DE EVENTOS =====

const handlePaymentSuccess = async (paymentIntent, req) => {
  try {
    await createSecurityLog(
      'payment_success',
      'low',
      'Stripe payment succeeded via webhook',
      req,
      null,
      {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customerId: paymentIntent.customer
      }
    );
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

const handlePaymentFailure = async (paymentIntent, req) => {
  try {
    await createSecurityLog(
      'payment_failure',
      'medium',
      'Stripe payment failed via webhook',
      req,
      null,
      {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customerId: paymentIntent.customer,
        failureReason: paymentIntent.last_payment_error?.message
      }
    );
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

const handleSubscriptionCreated = async (subscription, req) => {
  try {
    await createSecurityLog(
      'subscription_created',
      'low',
      'Stripe subscription created via webhook',
      req,
      null,
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      }
    );
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
};

const handleSubscriptionUpdated = async (subscription, req) => {
  try {
    await createSecurityLog(
      'subscription_updated',
      'low',
      'Stripe subscription updated via webhook',
      req,
      null,
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      }
    );
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
};

const handleSubscriptionDeleted = async (subscription, req) => {
  try {
    await createSecurityLog(
      'subscription_deleted',
      'medium',
      'Stripe subscription deleted via webhook',
      req,
      null,
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        canceledAt: subscription.canceled_at
      }
    );
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
};

const handleInvoicePaymentSuccess = async (invoice, req) => {
  try {
    await createSecurityLog(
      'invoice_payment_success',
      'low',
      'Stripe invoice payment succeeded via webhook',
      req,
      null,
      {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        subscriptionId: invoice.subscription
      }
    );
  } catch (error) {
    console.error('Error handling invoice payment success:', error);
  }
};

const handleInvoicePaymentFailure = async (invoice, req) => {
  try {
    await createSecurityLog(
      'invoice_payment_failure',
      'medium',
      'Stripe invoice payment failed via webhook',
      req,
      null,
      {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amount: invoice.amount_due,
        currency: invoice.currency,
        subscriptionId: invoice.subscription,
        attemptCount: invoice.attempt_count
      }
    );
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
};

// ===== UTILIDADES =====

// Converter valor para centavos
export const toCents = amount => {
  return Math.round(amount * 100);
};

// Converter centavos para valor
export const fromCents = cents => {
  return cents / 100;
};

// Formatar valor para exibição
export const formatAmount = (amount, currency = 'brl') => {
  const value = fromCents(amount);
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase()
  });

  return formatter.format(value);
};

// Verificar se o Stripe está configurado
export const isStripeConfigured = () => {
  return !!process.env.STRIPE_SECRET_KEY;
};

export default stripe;
