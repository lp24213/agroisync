import express from 'express';
import logger from '../utils/logger.js';
import { default as auth } from '../middleware/auth.js';
import { AgroConecta, Loja, Marketplace, Fazenda } from '../models/Registration.js';

const router = express.Router();
// Carregamento condicional do cliente Stripe apenas quando habilitado
let stripe = null;
if ((process.env.STRIPE_ENABLED || 'false').toLowerCase() === 'true') {
  try {
     
    const Stripe = require('stripe');
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  } catch (e) {
    stripe = null;
    logger.warn('Stripe requested but failed to initialize', e);
  }
}

// Plan definitions (canônico - valores em reais)
// Esses valores correspondem exatamente aos exibidos na página de planos (AgroisyncPlans.js)
const PLANS = {
  gratuito: {
    id: 'gratuito',
    name: 'Gratuito',
    price: 0,
    description: 'O melhor plano FREE do Brasil! Melhor que MF Rural e FreteBrás!',
    icon: '🌱',
    target: 'Comece GRÁTIS e venda HOJE!',
    semiannualPrice: 0,
    annualPrice: 0,
    annualPixPrice: 0,
    noDiscount: true,
    trialDays: 0,
    features: [
      '✅ 5 FRETES por mês GRÁTIS',
      '✅ 5 PRODUTOS GRÁTIS',
      '✅ IA que calcula fretes automaticamente',
      '✅ Rastreamento GPS em tempo real',
      '✅ Chat ilimitado',
      '✅ Dashboard completo com analytics',
      '✅ Suporte WhatsApp + E-mail',
      '💰 Zero comissão nos primeiros 30 dias',
      '💰 Depois: apenas 2% (concorrência cobra 8-15%!)',
      '🎁 API básica inclusa'
    ],
    popular: false,
    color: 'green',
    freightLimit: 5,
    productLimit: 5
  },
  profissional: {
    id: 'profissional',
    name: 'Profissional',
    description: 'Plano PRO completo por menos que um almoço! Concorrência cobra R$ 100+',
    icon: '💼',
    target: 'Profissionalize-se gastando MENOS!',
    price: 29.9,
    semiannualPrice: 161.46,
    annualPrice: 299.04,
    annualPixPrice: 239.23,
    noDiscount: false,
    trialDays: 30,
    features: [
      '✅ FRETES ILIMITADOS',
      '✅ PRODUTOS ILIMITADOS',
      '✅ IA Premium que otimiza TUDO',
      '✅ Matching automático em 2 minutos',
      '✅ Rotas otimizadas (economiza até 40%)',
      '✅ Rastreamento GPS avançado',
      '✅ Previsão climática integrada',
      '✅ Dashboard com IA e insights',
      '✅ Relatórios de lucro em tempo real',
      '✅ Prioridade total nas buscas',
      '✅ Selo "Verificado ✓"',
      '✅ API completa sem limites',
      '✅ Suporte prioritário (1h)',
      '💰 Comissão ZERO!',
      '🎁 2% cashback em AgroToken',
      '🚀 30 DIAS GRÁTIS!'
    ],
    popular: true,
    color: 'blue',
    freightLimit: -1,
    productLimit: -1
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Plano corporativo COMPLETO por 1/5 do preço da concorrência!',
    icon: '🏢',
    target: 'Domine o mercado com tecnologia de ponta!',
    price: 99.9,
    semiannualPrice: 539.46,
    annualPrice: 1019.04,
    annualPixPrice: 815.23,
    noDiscount: false,
    trialDays: 60,
    features: [
      '✅ TUDO ILIMITADO (fretes, produtos, usuários)',
      '✅ IA Corporativa dedicada só pra você',
      '✅ Loja virtual com domínio próprio',
      '✅ White-label (sua marca em tudo)',
      '✅ API Enterprise + Webhooks',
      '✅ Integração ERP, CRM, marketplaces',
      '✅ Até 20 usuários na conta',
      '✅ Gerente de conta exclusivo',
      '✅ Consultoria estratégica semanal',
      '✅ Treinamento completo da equipe',
      '✅ Dashboard corporativo customizado',
      '✅ Selo "Enterprise ⭐⭐"',
      '✅ SLA 99,9% garantido',
      '✅ Suporte 24/7 VIP dedicado',
      '💰 Comissão ZERO para sempre!',
      '🎁 5% cashback em AgroToken',
      '🎁 Features customizadas',
      '🚀 60 DIAS GRÁTIS + consultoria!'
    ],
    popular: false,
    color: 'purple',
    freightLimit: -1,
    productLimit: -1
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

// GET /api/plans - retorna planos públicos (objeto completo para exibição)
router.get('/', (req, res) => {
  try {
    const plans = Object.values(PLANS).map(p => ({
      ...p,
      price_cents: Math.round((p.price || 0) * 100),
      semiannualPrice_cents: Math.round((p.semiannualPrice || 0) * 100),
      annualPrice_cents: Math.round((p.annualPrice || 0) * 100),
      annualPixPrice_cents: Math.round((p.annualPixPrice || 0) * 100)
    }));
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
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plano inválido' });
    }

    // Se Stripe não estiver habilitado neste ambiente, retornar 403
    if (!stripe) {
      return res.status(403).json({ success: false, message: 'Stripe desativado' });
    }

    // Se chegamos aqui, Stripe está habilitado — exigir stripePriceId
    if (!plan.stripePriceId) {
      return res.status(400).json({ success: false, message: 'Plano sem configuração de preço no Stripe' });
    }

    const registration = await findRegistrationByType(type, registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
    }

    // Ensure Stripe customer
    if (!stripe) {
      return res.status(403).json({ success: false, message: 'Stripe desativado' });
    }
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
    if (!stripe) {
      return res.status(403).json({ success: false, message: 'Stripe desativado' });
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

export default router;
