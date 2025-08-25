import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { paymentRateLimiter } from '../middleware/security.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import { 
  createPaymentIntent, 
  createCheckoutSession, 
  createCustomer, 
  createSubscription,
  cancelSubscription,
  getSubscription,
  getCustomer,
  getPaymentIntent,
  confirmPaymentIntent,
  createRefund,
  verifyWebhookSignature,
  processWebhookEvent,
  STRIPE_PRICE_CONFIG,
  toCents,
  fromCents,
  formatAmount,
  isStripeConfigured
} from '../config/stripe.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);
router.use(paymentRateLimiter);

// ===== MIDDLEWARE DE VALIDAÇÃO =====

// Validação para criação de pagamento
const validatePaymentData = (req, res, next) => {
  const { module, tier, amount, currency } = req.body;

  if (!module || !tier) {
    return res.status(400).json({
      success: false,
      message: 'Módulo e tier são obrigatórios'
    });
  }

  // Validar módulo
  const validModules = ['store', 'freight', 'crypto'];
  if (!validModules.includes(module)) {
    return res.status(400).json({
      success: false,
      message: 'Módulo inválido'
    });
  }

  // Validar tier
  const validTiers = ['basic', 'pro', 'enterprise'];
  if (!validTiers.includes(tier)) {
    return res.status(400).json({
      success: false,
      message: 'Tier inválido'
    });
  }

  // Validar valor se fornecido
  if (amount && (amount <= 0 || !Number.isFinite(amount))) {
    return res.status(400).json({
      success: false,
      message: 'Valor deve ser um número positivo'
    });
  }

  // Validar moeda se fornecida
  if (currency) {
    const validCurrencies = ['brl', 'usd', 'eth', 'btc', 'sol'];
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({
        success: false,
        message: 'Moeda inválida'
      });
    }
  }

  next();
};

// ===== CONFIGURAÇÃO DE PREÇOS =====

const PRICE_CONFIG = {
  store: {
    basic: {
      amount: 25.0,
      currency: 'brl',
      maxAds: 3,
      features: ['Anúncios básicos', 'Suporte por email']
    },
    pro: {
      amount: 50.0,
      currency: 'brl',
      maxAds: 10,
      features: ['Anúncios premium', 'Suporte prioritário', 'Analytics básico']
    },
    enterprise: {
      amount: 100.0,
      currency: 'brl',
      maxAds: 50,
      features: ['Anúncios ilimitados', 'Suporte 24/7', 'Analytics avançado', 'API access']
    }
  },
  freight: {
    basic: {
      amount: 50.0,
      currency: 'brl',
      maxFreights: 5,
      features: ['Fretes básicos', 'Suporte por email']
    },
    pro: {
      amount: 149.0,
      currency: 'brl',
      maxFreights: 30,
      features: ['Fretes premium', 'Suporte prioritário', 'Rastreamento GPS']
    },
    enterprise: {
      amount: 299.0,
      currency: 'brl',
      maxFreights: 100,
      features: ['Fretes ilimitados', 'Suporte 24/7', 'Rastreamento avançado', 'API access']
    }
  },
  crypto: {
    basic: { amount: 20.0, currency: 'usd', features: ['Staking básico', 'Suporte por email'] },
    pro: {
      amount: 40.0,
      currency: 'usd',
      features: ['Staking premium', 'Suporte prioritário', 'Yield farming']
    },
    enterprise: {
      amount: 100.0,
      currency: 'usd',
      features: ['Staking ilimitado', 'Suporte 24/7', 'Yield farming avançado', 'DeFi tools']
    }
  }
};

// ===== ROTAS DE PLANOS =====

// GET /api/payments/plans - Obter planos disponíveis
router.get('/plans', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        plans: PRICE_CONFIG,
        features: {
          store: [
            'Anúncios de produtos',
            'Gestão de estoque',
            'Relatórios de vendas',
            'Integração com marketplaces'
          ],
          freight: [
            'Gestão de fretes',
            'Rastreamento em tempo real',
            'Cálculo de rotas',
            'Integração com transportadoras'
          ],
          crypto: ['Staking de criptomoedas', 'Yield farming', 'DeFi tools', 'Portfolio tracking']
        }
      }
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS STRIPE =====

// POST /api/payments/stripe/create-payment-intent - Criar intenção de pagamento Stripe
router.post(
  '/stripe/create-payment-intent',
  authenticateToken,
  validatePaymentData,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { module, tier, currency = 'brl' } = req.body;

      // Obter configuração de preço
      const planConfig = PRICE_CONFIG[module]?.[tier];
      if (!planConfig) {
        return res.status(400).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }

      // Converter para centavos (Stripe trabalha com centavos)
      const amountInCents = Math.round(planConfig.amount * 100);

      // Criar registro de pagamento no MongoDB
      const payment = new Payment({
        userId,
        paymentId: `stripe_${Date.now()}_${userId}`,
        amount: planConfig.amount,
        currency: currency.toLowerCase(),
        paymentMethod: 'stripe',
        module,
        tier,
        description: `${module === 'store' ? 'Loja' : module === 'freight' ? 'AgroConecta' : 'Crypto'} - ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
      });

      await payment.save();

      // Em produção, aqui você criaria a PaymentIntent do Stripe
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: amountInCents,
      //   currency: currency.toLowerCase(),
      //   metadata: {
      //     paymentId: payment.paymentId,
      //     userId: userId,
      //     module: module,
      //     tier: tier
      //   }
      // });

      // Simulação para desenvolvimento
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amountInCents,
        currency: currency.toLowerCase()
      };

      // Log de segurança
      await createSecurityLog('payment_attempt', 'medium', 'User created Stripe payment intent', req, userId, {
        paymentId: payment.paymentId,
        module,
        tier,
        amount: planConfig.amount
      });

      res.json({
        success: true,
        message: 'Intenção de pagamento criada com sucesso',
        data: {
          paymentIntent,
          payment: {
            id: payment._id,
            paymentId: payment.paymentId,
            amount: payment.amount,
            currency: payment.currency,
            module: payment.module,
            tier: payment.tier
          }
        }
      });
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);

      await createSecurityLog('system_error', 'high', `Error creating Stripe payment intent: ${error.message}`, req, req.user?.userId);

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/payments/stripe/confirm - Confirmar pagamento Stripe
router.post('/stripe/confirm', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentIntentId, paymentId } = req.body;

    if (!paymentIntentId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'ID da intenção de pagamento e ID do pagamento são obrigatórios'
      });
    }

    // Buscar pagamento no MongoDB
    const payment = await Payment.findOne({ paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado'
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Pagamento já foi processado'
      });
    }

    // Em produção, aqui você verificaria o status do PaymentIntent no Stripe
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    // if (paymentIntent.status !== 'succeeded') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Pagamento não foi confirmado'
    //   }
    // }

    // Simulação para desenvolvimento
    const isConfirmed = true;

    if (isConfirmed) {
      // Atualizar status do pagamento
      payment.status = 'completed';
      payment.stripePaymentIntentId = paymentIntentId;
      payment.completedAt = new Date();
      await payment.save();

      // Atualizar plano do usuário
      const user = await User.findById(userId);
      if (user) {
        if (payment.module === 'store') {
          user.subscriptions.store = {
            plan: payment.tier,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            maxAds: PRICE_CONFIG.store[payment.tier].maxAds,
            currentAds: 0
          };
        } else if (payment.module === 'freight') {
          user.subscriptions.freight = {
            plan: payment.tier,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            maxFreights: PRICE_CONFIG.freight[payment.tier].maxFreights,
            currentFreights: 0
          };
        }

        await user.save();
      }

      // Log de segurança
      await createSecurityLog('payment_success', 'low', 'Stripe payment confirmed successfully', req, userId, {
        paymentId: payment.paymentId,
        module: payment.module,
        tier: payment.tier
      });

      res.json({
        success: true,
        message: 'Pagamento confirmado com sucesso',
        data: {
          payment: {
            id: payment._id,
            status: payment.status,
            completedAt: payment.completedAt
          },
          subscription: {
            module: payment.module,
            tier: payment.tier,
            status: 'active'
          }
        }
      });
    } else {
      payment.status = 'failed';
      payment.errorMessage = 'Pagamento não foi confirmado';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Pagamento não foi confirmado'
      });
    }
  } catch (error) {
    console.error('Error confirming Stripe payment:', error);

    await createSecurityLog('system_error', 'high', `Error confirming Stripe payment: ${error.message}`, req, req.user?.userId);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/payments/stripe/webhook - Webhook do Stripe
router.post('/stripe/webhook', async (req, res) => {
  try {
    // Em produção, você verificaria a assinatura do webhook
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    const event = req.body;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Buscar pagamento pelo metadata
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id
      });

      if (payment && payment.status === 'pending') {
        payment.status = 'completed';
        payment.completedAt = new Date();
        await payment.save();

        // Atualizar usuário (lógica similar à confirmação manual)
        // ... implementar lógica de atualização de plano
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ===== ROTAS METAMASK =====

// POST /api/payments/metamask/create-invoice - Criar fatura para Metamask
router.post('/metamask/create-invoice', authenticateToken, validatePaymentData, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { module, tier, currency = 'eth' } = req.body;

    // Obter configuração de preço
    const planConfig = PRICE_CONFIG[module]?.[tier];
    if (!planConfig) {
      return res.status(400).json({
        success: false,
        message: 'Plano não encontrado'
      });
    }

    // Converter valor para ETH (simulação)
    const ethAmount = module === 'crypto' ? planConfig.amount / 100 : planConfig.amount / 5000; // Taxa aproximada

    // Criar registro de pagamento no MongoDB
    const payment = new Payment({
      userId,
      paymentId: `metamask_${Date.now()}_${userId}`,
      amount: ethAmount,
      currency: 'eth',
      paymentMethod: 'metamask',
      module,
      tier,
      description: `${module === 'store' ? 'Loja' : module === 'freight' ? 'AgroConecta' : 'Crypto'} - ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    });

    await payment.save();

    // Log de segurança
    await createSecurityLog('payment_attempt', 'medium', 'User created Metamask payment invoice', req, userId, {
      paymentId: payment.paymentId,
      module,
      tier,
      amount: ethAmount
    });

    res.json({
      success: true,
      message: 'Fatura criada com sucesso',
      data: {
        payment: {
          id: payment._id,
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          module: payment.module,
          tier: payment.tier
        },
        network: 'ethereum',
        chainId: 1, // Mainnet
        expiresAt: payment.expiresAt
      }
    });
  } catch (error) {
    console.error('Error creating Metamask invoice:', error);

    await createSecurityLog('system_error', 'high', `Error creating Metamask invoice: ${error.message}`, req, req.user?.userId);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/payments/metamask/verify - Verificar pagamento Metamask
router.post('/metamask/verify', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId, transactionHash, walletAddress } = req.body;

    if (!paymentId || !transactionHash || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'ID do pagamento, hash da transação e endereço da carteira são obrigatórios'
      });
    }

    // Buscar pagamento no MongoDB
    const payment = await Payment.findOne({ paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado'
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Pagamento já foi processado'
      });
    }

    // Em produção, aqui você verificaria a transação na blockchain
    // const transaction = await web3.eth.getTransaction(transactionHash);
    // const isValid = transaction &&
    //                 transaction.to.toLowerCase() === process.env.PAYMENT_WALLET_ADDRESS.toLowerCase() &&
    //                 web3.utils.fromWei(transaction.value, 'ether') >= payment.amount;

    // Simulação para desenvolvimento
    const isValid = true;

    if (isValid) {
      // Atualizar status do pagamento
      payment.status = 'completed';
      payment.metamaskTransactionHash = transactionHash;
      payment.metamaskWalletAddress = walletAddress;
      payment.completedAt = new Date();
      await payment.save();

      // Atualizar plano do usuário
      const user = await User.findById(userId);
      if (user) {
        if (payment.module === 'store') {
          user.subscriptions.store = {
            plan: payment.tier,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            maxAds: PRICE_CONFIG.store[payment.tier].maxAds,
            currentAds: 0
          };
        } else if (payment.module === 'freight') {
          user.subscriptions.freight = {
            plan: payment.tier,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            maxFreights: PRICE_CONFIG.freight[payment.tier].maxFreights,
            currentFreights: 0
          };
        }

        await user.save();
      }

      // Log de segurança
      await createSecurityLog('payment_success', 'low', 'Metamask payment verified successfully', req, userId, {
        paymentId: payment.paymentId,
        module: payment.module,
        tier: payment.tier,
        transactionHash
      });

      res.json({
        success: true,
        message: 'Pagamento verificado com sucesso',
        data: {
          payment: {
            id: payment._id,
            status: payment.status,
            completedAt: payment.completedAt
          },
          subscription: {
            module: payment.module,
            tier: payment.tier,
            status: 'active'
          }
        }
      });
    } else {
      payment.status = 'failed';
      payment.errorMessage = 'Transação inválida';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Transação inválida'
      });
    }
  } catch (error) {
    console.error('Error verifying Metamask payment:', error);

    await createSecurityLog('system_error', 'high', `Error verifying Metamask payment: ${error.message}`, req, req.user?.userId);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE HISTÓRICO =====

// GET /api/payments/history - Histórico de pagamentos do usuário
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, status, module } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId };
    if (status) query.status = status;
    if (module) query.module = module;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/payments/subscriptions - Assinaturas ativas do usuário
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('subscriptions');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        subscriptions: user.subscriptions
      }
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN =====

// GET /api/payments/admin/stats - Estatísticas de pagamentos (admin only)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [statusStats, methodStats, moduleStats] = await Promise.all([
      Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      Payment.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      Payment.aggregate([
        {
          $group: {
            _id: '$module',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalPayments,
        revenue: totalRevenue[0]?.total || 0,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, totalAmount: stat.totalAmount };
          return acc;
        }, {}),
        byMethod: methodStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, totalAmount: stat.totalAmount };
          return acc;
        }, {}),
        byModule: moduleStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, totalAmount: stat.totalAmount };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
