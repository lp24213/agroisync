const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { AgroConecta, Loja, Marketplace, Fazenda } = require('../models/Registration');
const auth = require('../middleware/auth');

// Configurar Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Planos disponíveis
const PLANS = {
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    products: 1,
    description: '1 produto ou 1 frete',
    features: [
      '1 produto/frete',
      'Visibilidade básica',
      'Suporte por email',
      'Dashboard básico'
    ],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_monthly'
  },
  standard: {
    id: 'standard',
    name: 'Padrão',
    price: 99.90,
    products: 5,
    description: '5 produtos ou 5 fretes',
    features: [
      '5 produtos/fretes',
      'Visibilidade premium',
      'Suporte prioritário',
      'Analytics básico',
      'Chat em tempo real'
    ],
    stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID || 'price_standard_monthly'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 499.90,
    products: 25,
    description: '25 produtos ou 25 fretes',
    features: [
      '25 produtos/fretes',
      'Visibilidade máxima',
      'Suporte 24/7',
      'Analytics avançado',
      'API access',
      'Integração personalizada'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly'
  }
};

// GET /api/plans - Listar todos os planos
router.get('/', (req, res) => {
  try {
    const plans = Object.values(PLANS);
    
    res.json({
      success: true,
      data: plans,
      annualDiscount: 0.15 // 15% de desconto anual
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar planos',
      error: error.message
    });
  }
});

// GET /api/plans/:type - Listar planos por tipo
router.get('/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { frequency = 'monthly' } = req.query;
    
    let plans = Object.values(PLANS);
    
    // Aplicar desconto anual
    if (frequency === 'annual') {
      plans = plans.map(plan => ({
        ...plan,
        originalPrice: plan.price,
        price: plan.price * 12 * (1 - 0.15), // 15% de desconto
        savings: plan.price * 12 * 0.15,
        frequency: 'annual'
      }));
    } else {
      plans = plans.map(plan => ({
        ...plan,
        frequency: 'monthly'
      }));
    }
    
    res.json({
      success: true,
      data: plans,
      frequency,
      annualDiscount: frequency === 'annual' ? 0.15 : 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar planos',
      error: error.message
    });
  }
});

// POST /api/plans/subscribe - Criar assinatura
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, frequency = 'monthly', type, registrationId } = req.body;
    const userId = req.user.id;
    
    // Validar plano
    const plan = PLANS[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Plano inválido'
      });
    }
    
    // Calcular preço
    let price = plan.price;
    if (frequency === 'annual') {
      price = plan.price * 12 * (1 - 0.15); // 15% de desconto
    }
    
    // Buscar dados do usuário
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de cadastro inválido'
        });
    }
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Cadastro não encontrado'
      });
    }
    
    // Criar ou buscar customer no Stripe
    let customer;
    if (registration.payment?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(registration.payment.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: registration.email,
        name: registration.name,
        metadata: {
          registrationId: registrationId,
          type: type,
          userId: userId
        }
      });
      
      // Atualizar customer ID no banco
      registration.payment.stripeCustomerId = customer.id;
      await registration.save();
    }
    
    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${plan.name} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
              description: plan.description,
              metadata: {
                planId: planId,
                frequency: frequency,
                type: type
              }
            },
            unit_amount: Math.round(price * 100), // Converter para centavos
            recurring: frequency === 'monthly' ? {
              interval: 'month'
            } : {
              interval: 'year'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        registrationId: registrationId,
        type: type,
        planId: planId,
        frequency: frequency
      }
    });
    
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar pagamento',
      error: error.message
    });
  }
});

// POST /api/plans/webhook - Webhook do Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no webhook',
      error: error.message
    });
  }
});

// Handlers para eventos do Stripe
async function handleCheckoutSessionCompleted(session) {
  try {
    const { registrationId, type, planId, frequency } = session.metadata;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
    }
    
    if (!registration) {
      throw new Error('Cadastro não encontrado');
    }
    
    // Atualizar dados de pagamento
    registration.payment.subscriptionId = session.subscription;
    registration.payment.lastPayment = new Date();
    registration.plan = planId;
    registration.isPublic = true; // Tornar público após pagamento
    
    // Calcular próxima cobrança
    const nextPayment = new Date();
    if (frequency === 'monthly') {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    } else {
      nextPayment.setFullYear(nextPayment.getFullYear() + 1);
    }
    registration.payment.nextPayment = nextPayment;
    
    await registration.save();
    
    console.log(`Pagamento processado para ${type} ID: ${registrationId}`);
  } catch (error) {
    console.error('Erro ao processar checkout session:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    if (!customer.metadata.registrationId || !customer.metadata.type) {
      return;
    }
    
    const { registrationId, type } = customer.metadata;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
    }
    
    if (registration) {
      registration.payment.lastPayment = new Date();
      await registration.save();
    }
  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    if (!customer.metadata.registrationId || !customer.metadata.type) {
      return;
    }
    
    const { registrationId, type } = customer.metadata;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
    }
    
    if (registration) {
      // Opcional: desativar conta após falha no pagamento
      // registration.isActive = false;
      await registration.save();
    }
  } catch (error) {
    console.error('Erro ao processar falha no pagamento:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    if (!customer.metadata.registrationId || !customer.metadata.type) {
      return;
    }
    
    const { registrationId, type } = customer.metadata;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
    }
    
    if (registration) {
      registration.payment.subscriptionId = subscription.id;
      registration.isActive = subscription.status === 'active';
      
      // Calcular próxima cobrança
      const nextPayment = new Date(subscription.current_period_end * 1000);
      registration.payment.nextPayment = nextPayment;
      
      await registration.save();
    }
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    if (!customer.metadata.registrationId || !customer.metadata.type) {
      return;
    }
    
    const { registrationId, type } = customer.metadata;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
    }
    
    if (registration) {
      registration.payment.subscriptionId = null;
      registration.isActive = false;
      registration.plan = 'free';
      await registration.save();
    }
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
  }
}

// GET /api/plans/subscription/:id - Obter detalhes da assinatura
router.get('/subscription/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(id);
        break;
      case 'loja':
        registration = await Loja.findById(id);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(id);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de cadastro inválido'
        });
    }
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Cadastro não encontrado'
      });
    }
    
    if (!registration.payment?.stripeCustomerId) {
      return res.json({
        success: true,
        data: {
          hasSubscription: false,
          plan: 'free'
        }
      });
    }
    
    // Buscar assinatura no Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: registration.payment.stripeCustomerId,
      status: 'all'
    });
    
    const activeSubscription = subscriptions.data.find(sub => sub.status === 'active');
    
    if (!activeSubscription) {
      return res.json({
        success: true,
        data: {
          hasSubscription: false,
          plan: 'free'
        }
      });
    }
    
    const plan = PLANS[registration.plan];
    
    res.json({
      success: true,
      data: {
        hasSubscription: true,
        plan: registration.plan,
        planDetails: plan,
        status: activeSubscription.status,
        currentPeriodStart: new Date(activeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
        lastPayment: registration.payment.lastPayment,
        nextPayment: registration.payment.nextPayment
      }
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura',
      error: error.message
    });
  }
});

// POST /api/plans/cancel - Cancelar assinatura
router.post('/cancel', auth, async (req, res) => {
  try {
    const { registrationId, type } = req.body;
    
    // Buscar cadastro
    let registration;
    switch (type) {
      case 'agroconecta':
        registration = await AgroConecta.findById(registrationId);
        break;
      case 'loja':
        registration = await Loja.findById(registrationId);
        break;
      case 'marketplace':
        registration = await Marketplace.findById(registrationId);
        break;
      case 'fazenda':
        registration = await Fazenda.findById(registrationId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de cadastro inválido'
        });
    }
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Cadastro não encontrado'
      });
    }
    
    if (!registration.payment?.subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma assinatura ativa encontrada'
      });
    }
    
    // Cancelar assinatura no Stripe
    await stripe.subscriptions.update(registration.payment.subscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso. Você manterá acesso até o final do período atual.'
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura',
      error: error.message
    });
  }
});

module.exports = router;
