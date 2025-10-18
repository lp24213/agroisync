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
  inicial: {
    id: 'inicial',
    name: 'Inicial',
    price: 9.9,
    description: 'Ideal para quem está começando no agronegócio digital',
    icon: '🌱',
    target: 'Pequenos produtores testarem a plataforma',
    semiannualPrice: 59.4,
    annualPrice: 118.8,
    annualPixPrice: 118.8,
    noDiscount: true,
    trialDays: 3,
    features: [
      '2 fretes por mês',
      '2 anúncios de produtos',
      'Suporte por e-mail',
      'Dashboard básico com relatórios simples',
      'Visibilidade padrão nas buscas'
    ],
    popular: false,
    color: 'green'
  },
  profissional: {
    id: 'profissional',
    name: 'Profissional',
    description: 'Para produtores e caminhoneiros em crescimento',
    icon: '🚜',
    target: 'Quem quer profissionalizar seus negócios',
    price: 19.9,
    semiannualPrice: 113.43,
    annualPrice: 214.92,
    annualPixPrice: 191.04,
    noDiscount: false,
    features: [
      '10 fretes por mês',
      '10 anúncios de produtos',
      'Suporte prioritário (resposta em até 2h úteis)',
      'Dashboard avançado com gráficos e métricas',
      'Relatórios detalhados de desempenho',
      'Prioridade nas buscas e nos resultados regionais',
      'Acesso ao painel de cotação instantânea'
    ],
    popular: true,
    color: 'blue'
  },
  empresarial: {
    id: 'empresarial',
    name: 'Empresarial',
    description: 'Para transportadoras, cooperativas e empresas do agro',
    icon: '🏗️',
    target: 'Performance, automação e alcance nacional',
    price: 79.9,
    semiannualPrice: 455.43,
    annualPrice: 863.52,
    annualPixPrice: 767.04,
    noDiscount: false,
    features: [
      '50 fretes por mês',
      '50 anúncios de produtos',
      'Suporte 24h (WhatsApp e e-mail)',
      'Dashboard e relatórios personalizados',
      'API de integração com ERPs e planilhas',
      'Notificações automáticas via WhatsApp e e-mail',
      'Destaque Premium nas buscas',
      'Acesso ao painel de parceiros e distribuidores'
    ],
    popular: false,
    color: 'purple'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Para grandes operações com foco em automação e escala',
    icon: '💎',
    target: 'Dominar o mercado agro digital com IA',
    price: 249.9,
    semiannualPrice: 1424.43,
    annualPrice: 2699.52,
    annualPixPrice: 2399.04,
    noDiscount: false,
    features: [
      'Fretes e anúncios ilimitados',
      'Loja personalizada com até 20 produtos',
      'Dashboard e relatórios avançados com IA',
      'API completa e integração com marketplaces externos',
      'Suporte 24/7 dedicado',
      'Gerente de conta exclusivo',
      'Notificações inteligentes com IA',
      'Treinamento personalizado e onboarding',
      'Selo de verificação "Empresa Ouro"'
    ],
    popular: false,
    color: 'gold'
  },
  loja_ilimitada: {
    id: 'loja_ilimitada',
    name: 'Loja Ilimitada',
    description: 'Operação completa com recursos empresariais e loja virtual expandida',
    icon: '🏬',
    target: 'Grandes redes, cooperativas e empresas',
    price: 499.9,
    semiannualPrice: 2849.43,
    annualPrice: 5399.52,
    annualPixPrice: 4799.04,
    noDiscount: false,
    features: [
      'Loja virtual com produtos ilimitados',
      'API e integrações corporativas completas',
      'Dashboard avançado + relatórios financeiros',
      'Integração com sistemas de pagamento e logística',
      'Equipe de suporte Premium 24/7',
      'Treinamento para equipes',
      'Consultoria estratégica de vendas no agro',
      'Selo "AGROiSYNC PRO"'
    ],
    popular: false,
    color: 'black'
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
