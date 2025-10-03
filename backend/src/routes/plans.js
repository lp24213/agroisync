// AUTO-GENERATED CLEAN PLANS ROUTER - single implementation
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

// Models
const { AgroConecta, Loja, Marketplace, Fazenda } = require('../models/Registration');

// Middleware
const auth = require('../middleware/auth');

// Plan definitions (Stripe price IDs are loaded from env vars)
const PLANS = {
  free: { id: 'free', name: 'Gratuito', price: 0 },
  monthly_basic: {
    id: 'monthly_basic',
    name: 'Básico Mensal',
    price: 1999,
    stripePriceId: process.env.STRIPE_PRICE_MONTHLY_BASIC
  },
  yearly_basic: {
    id: 'yearly_basic',
    name: 'Básico Anual',
    price: 19900,
    stripePriceId: process.env.STRIPE_PRICE_YEARLY_BASIC
  }
};

// Helper: find registration by type
function findRegistrationByType(type, id) {
  switch (type) {
    case 'agroconecta':
      return AgroConecta.findById(id);
    case 'loja':
      return Loja.findById(id);
    case 'marketplace':
      return Marketplace.findById(id);
    case 'fazenda':
      return Fazenda.findById(id);
    default:
      return null;
  }
}

// GET /api/plans - retorna planos públicos
router.get('/', (req, res) => {
  try {
    const plans = Object.values(PLANS).map(p => ({ id: p.id, name: p.name, price: p.price }));
    return res.json({ success: true, data: plans });
  } catch (err) {
    logger.error('GET /api/plans failed', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erro ao listar planos', error: err.message });
  }
});

// GET /api/plans/:planId - retorna detalhes do plano
router.get('/:planId', (req, res) => {
  try {
    const { planId } = req.params;
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plano não encontrado' });
    }

    return res.json({ success: true, data: plan });
  } catch (err) {
    logger.error('GET /api/plans/:planId failed', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erro ao obter plano', error: err.message });
  }
});

// POST /api/plans/subscribe - cria sessão de checkout para assinatura
// body: { planId, registrationId, type, successUrl?, cancelUrl? }
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, registrationId, type, successUrl, cancelUrl } = req.body;

    const plan = PLANS[planId];
    if (!plan || !plan.stripePriceId) {
      return res.status(400).json({ success: false, message: 'Plano inválido' });
    }

    const registration = await findRegistrationByType(type, registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
    }

    // Ensure Stripe customer
    let customerId = registration.payment?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: registration.email,
        metadata: { registrationId: registration._id.toString(), type }
      });
      customerId = customer.id;
      registration.payment = registration.payment || {};
      registration.payment.stripeCustomerId = customerId;
      await registration.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer: customerId,
      success_url: successUrl || `${process.env.FRONTEND_URL}/subscription/success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/subscription/cancel`
    });

    return res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (err) {
    logger.error('POST /api/plans/subscribe failed', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erro ao criar sessão de checkout', error: err.message });
  }
});

// GET /api/plans/subscription/:id - retorna status da assinatura associado ao cadastro
// query: ?type=agroconecta|loja|marketplace|fazenda
router.get('/subscription/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const registration = await findRegistrationByType(type, id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
    }

    if (!registration.payment?.stripeCustomerId) {
      return res.json({ success: true, data: { hasSubscription: false, plan: 'free' } });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: registration.payment.stripeCustomerId,
      status: 'all'
    });
    const activeSubscription = subscriptions.data.find(s => s.status === 'active');

    if (!activeSubscription) {
      return res.json({ success: true, data: { hasSubscription: false, plan: 'free' } });
    }

    return res.json({
      success: true,
      data: {
        hasSubscription: true,
        plan: registration.plan || 'unknown',
        status: activeSubscription.status,
        currentPeriodStart: new Date(activeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: activeSubscription.cancel_at_period_end
      }
    });
  } catch (err) {
    logger.error('GET /api/plans/subscription/:id failed', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erro ao buscar assinatura', error: err.message });
  }
});

// POST /api/plans/cancel - cancela assinatura (marca para terminar ao final do período)
// body: { registrationId, type }
router.post('/cancel', auth, async (req, res) => {
  try {
    const { registrationId, type } = req.body;
    const registration = await findRegistrationByType(type, registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
    }

    if (!registration.payment?.subscriptionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Nenhuma assinatura ativa encontrada' });
    }

    await stripe.subscriptions.update(registration.payment.subscriptionId, {
      cancel_at_period_end: true
    });

    return res.json({
      success: true,
      message:
        'Assinatura cancelada com sucesso. A cobrança será interrompida ao final do período atual.'
    });
  } catch (err) {
    logger.error('POST /api/plans/cancel failed', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erro ao cancelar assinatura', error: err.message });
  }
});

module.exports = router;
