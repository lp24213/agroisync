const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ethers } = require('ethers');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Message = require('../models/Message');
const { authenticateToken, requireActivePlan } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const router = express.Router();

// Configurações
const OWNER_WALLET = process.env.NEXT_PUBLIC_OWNER_WALLET;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Validações
const createCheckoutValidation = [
  body('planId')
    .isIn([
      'anunciante-basic', 'anunciante-premium', 'anunciante-enterprise',
      'freteiro-basic', 'freteiro-premium', 'freteiro-enterprise',
      'comprador-basic', 'comprador-premium'
    ])
    .withMessage('Plano inválido'),
  body('successUrl')
    .isURL()
    .withMessage('URL de sucesso inválida'),
  body('cancelUrl')
    .isURL()
    .withMessage('URL de cancelamento inválida')
];

const verifyCryptoValidation = [
  body('transactionHash')
    .isString()
    .isLength({ min: 64, max: 66 })
    .withMessage('Hash de transação inválido'),
  body('planId')
    .isIn(['comprador-basic', 'anunciante-premium', 'freteiro-premium'])
    .withMessage('Plano inválido')
];

// POST /api/payments/create-checkout-session - Criar sessão Stripe
router.post('/create-checkout-session',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }),
  createCheckoutValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { planId, successUrl, cancelUrl } = req.body;
      const userId = req.user.userId;

      // Buscar usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Definir preços dos planos
      const planPrices = {
        'comprador-basic': { amount: 2500, currency: 'brl', name: 'Plano Comprador Básico' },
        'comprador-premium': { amount: 4990, currency: 'brl', name: 'Plano Comprador Premium' },
        'anunciante-basic': { amount: 9900, currency: 'brl', name: 'Plano Anunciante Básico' },
        'anunciante-premium': { amount: 19900, currency: 'brl', name: 'Plano Anunciante Premium' },
        'anunciante-enterprise': { amount: 49900, currency: 'brl', name: 'Plano Anunciante Enterprise' },
        'freteiro-basic': { amount: 9900, currency: 'brl', name: 'Plano Freteiro Básico' },
        'freteiro-premium': { amount: 19900, currency: 'brl', name: 'Plano Freteiro Premium' },
        'freteiro-enterprise': { amount: 49900, currency: 'brl', name: 'Plano Freteiro Enterprise' }
      };

      const plan = planPrices[planId];
      if (!plan) {
        return res.status(400).json({
          success: false,
          message: 'Plano inválido'
        });
      }

      // Criar sessão Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: {
                name: plan.name,
                description: `Acesso completo ao painel ${planId.split('-')[0]}`
              },
              unit_amount: plan.amount
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId: userId,
          planId: planId,
          userEmail: user.email,
          userName: user.name
        },
        customer_email: user.email,
        billing_address_collection: 'required'
      });

      // Criar registro de pagamento
      const payment = new Payment({
        userId: userId,
        amount: plan.amount / 100, // Stripe usa centavos
        currency: plan.currency.toUpperCase(),
        method: 'stripe',
        status: 'pending',
        plan: {
          planId: planId,
          name: plan.name,
          description: `Acesso completo ao painel ${planId.split('-')[0]}`,
          duration: 30, // 30 dias
          features: getPlanFeatures(planId)
        },
        paymentDetails: {
          stripe: {
            sessionId: session.id
          }
        },
        metadata: {
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip || req.connection.remoteAddress
        }
      });

      await payment.save();

      res.json({
        success: true,
        message: 'Sessão de checkout criada com sucesso',
        sessionId: session.id,
        url: session.url,
        paymentId: payment._id
      });

    } catch (error) {
      console.error('Erro ao criar sessão Stripe:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/payments/stripe-webhook - Webhook Stripe
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Erro na verificação do webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Processar evento
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Buscar pagamento
      const payment = await Payment.findOne({
        'paymentDetails.stripe.sessionId': session.id
      });

      if (!payment) {
        console.error('Pagamento não encontrado para sessão:', session.id);
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      // Atualizar status do pagamento
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.paymentDetails.stripe.paymentIntentId = session.payment_intent;
      payment.paymentDetails.stripe.customerId = session.customer;
      payment.notifications.webhookReceived = true;
      payment.notifications.webhookPayload = event.data.object;

      await payment.save();

      // Atualizar usuário
      const user = await User.findById(payment.userId);
      if (user) {
        user.isPaid = true;
        user.paidPlan = {
          planId: payment.plan.planId,
          expiresAt: new Date(Date.now() + payment.plan.duration * 24 * 60 * 60 * 1000),
          amount: payment.amount,
          currency: payment.currency
        };

        if (session.customer) {
          user.stripeCustomerId = session.customer;
        }

        await user.save();

        // Enviar notificação interna
        await sendPaymentNotification(user, payment);
      }

      console.log(`Pagamento ${payment._id} processado com sucesso para usuário ${user?.email}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook Stripe:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/payments/verify-crypto - Verificar pagamento crypto
router.post('/verify-crypto',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }),
  verifyCryptoValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { transactionHash, planId } = req.body;
      const userId = req.user.userId;

      // Verificar se já existe pagamento com este hash
      const existingPayment = await Payment.findOne({
        'paymentDetails.crypto.transactionHash': transactionHash
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Transação já foi processada'
        });
      }

      // Configurar provider Ethereum (usar Infura ou similar)
      const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
      
      // Verificar transação
      const tx = await provider.getTransaction(transactionHash);
      if (!tx) {
        return res.status(400).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      // Verificar se foi enviada para a carteira owner
      if (tx.to.toLowerCase() !== OWNER_WALLET.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Transação enviada para endereço incorreto'
        });
      }

      // Verificar valor mínimo (0.01 ETH)
      const minAmount = ethers.parseEther('0.01');
      if (tx.value < minAmount) {
        return res.status(400).json({
          success: false,
          message: 'Valor da transação é muito baixo'
        });
      }

      // Aguardar confirmações
      const receipt = await tx.wait(1); // Mínimo 1 confirmação

      // Definir preços dos planos em ETH
      const planPrices = {
        'comprador-basic': ethers.parseEther('0.01'),
        'anunciante-premium': ethers.parseEther('0.02'),
        'freteiro-premium': ethers.parseEther('0.03')
      };

      const expectedAmount = planPrices[planId];
      if (tx.value < expectedAmount) {
        return res.status(400).json({
          success: false,
          message: 'Valor da transação é insuficiente para o plano selecionado'
        });
      }

      // Buscar usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Criar registro de pagamento
      const payment = new Payment({
        userId: userId,
        amount: parseFloat(ethers.formatEther(tx.value)),
        currency: 'ETH',
        method: 'crypto',
        status: 'completed',
        plan: {
          planId: planId,
          name: getPlanName(planId),
          description: `Acesso completo ao painel ${planId.split('-')[0]}`,
          duration: 30, // 30 dias
          features: getPlanFeatures(planId)
        },
        paymentDetails: {
          crypto: {
            transactionHash: transactionHash,
            network: 'ethereum',
            fromAddress: tx.from,
            toAddress: tx.to,
            gasUsed: receipt.gasUsed.toString(),
            gasPrice: tx.gasPrice.toString(),
            blockNumber: receipt.blockNumber,
            confirmations: receipt.confirmations
          }
        },
        completedAt: new Date(),
        metadata: {
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip || req.connection.remoteAddress
        }
      });

      await payment.save();

      // Atualizar usuário
      user.isPaid = true;
      user.paidPlan = {
        planId: planId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        amount: parseFloat(ethers.formatEther(tx.value)),
        currency: 'ETH'
      };

      if (!user.cryptoAddress) {
        user.cryptoAddress = tx.from;
      }

      await user.save();

      // Enviar notificação interna
      await sendPaymentNotification(user, payment);

      res.json({
        success: true,
        message: 'Pagamento crypto verificado com sucesso',
        payment: payment.getDisplayData(),
        user: user.getPublicData()
      });

    } catch (error) {
      console.error('Erro na verificação crypto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// GET /api/payments/history - Histórico de pagamentos do usuário
router.get('/history',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;

      const payments = await Payment.getUserPayments(
        userId,
        parseInt(limit),
        (parseInt(page) - 1) * parseInt(limit)
      );

      const total = await Payment.countDocuments({ userId });

      res.json({
        success: true,
        payments: payments.map(p => p.getDisplayData()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// GET /api/payments/plans - Listar planos disponíveis
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'comprador-basic',
      name: 'Plano Comprador Básico',
      description: 'Acesso a produtos e mensageria básica',
      price: 25.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Visualizar produtos',
        'Enviar mensagens (até 3 por mês)',
        'Acesso básico ao marketplace',
        'Painel individual'
      ]
    },
    {
      id: 'comprador-premium',
      name: 'Plano Comprador Premium',
      description: 'Acesso completo ao marketplace com funcionalidades avançadas',
      price: 49.90,
      currency: 'BRL',
      duration: 30,
      features: [
        'Visualizar produtos',
        'Mensageria ilimitada',
        'Acesso completo ao marketplace',
        'Painel individual',
        'Relatórios de compras',
        'Suporte prioritário'
      ]
    },
    {
      id: 'anunciante-basic',
      name: 'Plano Anunciante Básico',
      description: 'Publicar produtos e gerenciar anúncios básicos',
      price: 99.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Publicar até 100 produtos',
        'Mensageria básica',
        'Painel de gestão',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    {
      id: 'anunciante-premium',
      name: 'Plano Anunciante Premium',
      description: 'Publicar produtos e gerenciar anúncios avançados',
      price: 199.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Publicar até 500 produtos',
        'Mensageria ilimitada',
        'Painel de gestão',
        'Relatórios avançados',
        'Suporte prioritário',
        'API access'
      ]
    },
    {
      id: 'anunciante-enterprise',
      name: 'Plano Anunciante Enterprise',
      description: 'Solução completa para grandes empresas',
      price: 499.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Produtos ilimitados',
        'Mensageria ilimitada',
        'Painel de gestão',
        'Relatórios personalizados',
        'Suporte 24/7',
        'API completa',
        'Integração customizada',
        'White label'
      ]
    },
    {
      id: 'freteiro-basic',
      name: 'Plano Freteiro Básico',
      description: 'Publicar fretes e gerenciar transportes básicos',
      price: 99.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Publicar até 50 fretes/mês',
        'Mensageria básica',
        'Painel de gestão',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    {
      id: 'freteiro-premium',
      name: 'Plano Freteiro Premium',
      description: 'Publicar fretes e gerenciar transportes avançados',
      price: 199.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Publicar até 200 fretes/mês',
        'Mensageria ilimitada',
        'Painel de gestão',
        'Relatórios avançados',
        'Suporte prioritário',
        'API access'
      ]
    },
    {
      id: 'freteiro-enterprise',
      name: 'Plano Freteiro Enterprise',
      description: 'Solução completa para grandes transportadoras',
      price: 499.00,
      currency: 'BRL',
      duration: 30,
      features: [
        'Fretes ilimitados',
        'Mensageria ilimitada',
        'Painel de gestão',
        'Relatórios personalizados',
        'Suporte 24/7',
        'API completa',
        'Integração customizada',
        'White label'
      ]
    }
  ];

  res.json({
    success: true,
    plans
  });
});

// Funções auxiliares
function getPlanFeatures(planId) {
  const features = {
    'comprador-basic': ['Visualizar produtos', 'Enviar mensagens (até 3 por mês)', 'Painel individual', 'Acesso básico ao marketplace'],
    'comprador-premium': ['Visualizar produtos', 'Mensageria ilimitada', 'Painel individual', 'Acesso completo ao marketplace', 'Relatórios de compras'],
    'anunciante-basic': ['Publicar até 100 produtos', 'Mensageria básica', 'Painel de gestão', 'Relatórios básicos', 'Suporte por email'],
    'anunciante-premium': ['Publicar até 500 produtos', 'Mensageria ilimitada', 'Painel de gestão', 'Relatórios avançados', 'Suporte prioritário', 'API access'],
    'anunciante-enterprise': ['Produtos ilimitados', 'Mensageria ilimitada', 'Painel de gestão', 'Relatórios personalizados', 'Suporte 24/7', 'API completa', 'Integração customizada', 'White label'],
    'freteiro-basic': ['Publicar até 50 fretes/mês', 'Mensageria básica', 'Painel de gestão', 'Relatórios básicos', 'Suporte por email'],
    'freteiro-premium': ['Publicar até 200 fretes/mês', 'Mensageria ilimitada', 'Painel de gestão', 'Relatórios avançados', 'Suporte prioritário', 'API access'],
    'freteiro-enterprise': ['Fretes ilimitados', 'Mensageria ilimitada', 'Painel de gestão', 'Relatórios personalizados', 'Suporte 24/7', 'API completa', 'Integração customizada', 'White label']
  };
  return features[planId] || [];
}

function getPlanName(planId) {
  const names = {
    'comprador-basic': 'Plano Comprador Básico',
    'comprador-premium': 'Plano Comprador Premium',
    'anunciante-basic': 'Plano Anunciante Básico',
    'anunciante-premium': 'Plano Anunciante Premium',
    'anunciante-enterprise': 'Plano Anunciante Enterprise',
    'freteiro-basic': 'Plano Freteiro Básico',
    'freteiro-premium': 'Plano Freteiro Premium',
    'freteiro-enterprise': 'Plano Freteiro Enterprise'
  };
  return names[planId] || 'Plano';
}

async function sendPaymentNotification(user, payment) {
  try {
    // Enviar mensagem de notificação para o usuário
    const notification = new Message({
      fromUser: null, // Sistema
      toUser: user._id,
      subject: 'Pagamento Confirmado',
      message: `Seu pagamento de R$ ${payment.amount} foi confirmado com sucesso! Seu plano ${payment.plan.name} está ativo até ${new Date(user.paidPlan.expiresAt).toLocaleDateString('pt-BR')}.`,
      context: {
        type: 'payment',
        paymentId: payment._id
      },
      status: 'sent'
    });

    await notification.save();
  } catch (error) {
    console.error('Erro ao enviar notificação de pagamento:', error);
  }
}

module.exports = router;
