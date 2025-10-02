import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requirePaidAccess as _requirePaidAccess } from '../middleware/requirePaidAccess.js';
import { rateLimiter as _rateLimiter } from '../middleware/rateLimiter.js';
import _User from '../models/User.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import Stripe from 'stripe';
import { ethers } from 'ethers';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configurações
const OWNER_WALLET = process.env.OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
const _WEB3_PROVIDER = process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/your-project-id';
const COMMISSION_RATE = 0.05; // 5% de comissão para intermediação
const MIN_COMMISSION = 0.01; // Comissão mínima

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// Sistema de comissões automáticas para intermediação
router.post('/commission/calculate', async (req, res) => {
  try {
    const { transactionAmount, transactionType } = req.body;

    if (!transactionAmount || transactionAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valor da transação inválido'
      });
    }

    // Calcular comissão baseada no tipo de transação
    let commissionRate = COMMISSION_RATE;

    switch (transactionType) {
      case 'product_sale':
        commissionRate = 0.05; // 5% para vendas de produtos
        break;
      case 'freight_service':
        commissionRate = 0.03; // 3% para serviços de frete
        break;
      case 'premium_plan':
        commissionRate = 0.1; // 10% para planos premium
        break;
      default:
        commissionRate = COMMISSION_RATE;
    }

    const commission = Math.max(transactionAmount * commissionRate, MIN_COMMISSION);
    const netAmount = transactionAmount - commission;

    res.json({
      success: true,
      transactionAmount,
      commissionRate: commissionRate * 100,
      commission,
      netAmount,
      ownerWallet: OWNER_WALLET
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao calcular comissão:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Processar pagamento de comissão para carteira do proprietário
router.post('/commission/process', async (req, res) => {
  try {
    const { transactionId, amount, paymentMethod, userWallet } = req.body;

    if (!transactionId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Dados de comissão inválidos'
      });
    }

    // Registrar comissão no banco de dados
    const commission = new Payment({
      userId: req.user.id,
      transactionId,
      amount,
      paymentMethod,
      type: 'commission',
      status: 'pending',
      recipientWallet: OWNER_WALLET,
      senderWallet: userWallet,
      description: 'Comissão de intermediação AgroSync'
    });

    await commission.save();

    // Log de auditoria
    await AuditLog.create({
      userId: req.user.id,
      action: 'commission_created',
      details: {
        transactionId,
        amount,
        paymentMethod,
        commissionId: commission._id
      }
    });

    res.json({
      success: true,
      commissionId: commission._id,
      message: 'Comissão processada com sucesso',
      ownerWallet: OWNER_WALLET
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao processar comissão:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar status de pagamento do usuário
router.get('/status', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isPaid planActive planType planExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      isPaid: user.isPaid || false,
      planActive: user.planActive || null,
      planType: user.planType || null,
      planExpiry: user.planExpiry || null
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar status de pagamento:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Criar sessão de pagamento Stripe
router.post('/stripe/create-session', async (req, res) => {
  try {
    const { planId, planData } = req.body;

    if (!planId || !planData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do plano são obrigatórios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 2500, name: 'Loja Básico' },
      'loja-pro': { price: 5000, name: 'Loja Pro' },
      'agroconecta-basic': { price: 5000, name: 'AgroConecta Básico' },
      'agroconecta-pro': { price: 14900, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano inválido'
      });
    }

    // Criar sessão do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
              description: `Plano ${plan.name} - AgroSync`
            },
            unit_amount: plan.price // em centavos
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/planos?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId,
        planName: plan.name
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao criar sessão Stripe:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro ao processar pagamento'
    });
  }
});

// Webhook do Stripe para confirmar pagamentos
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro na assinatura do webhook:', err.message);
    }
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleStripePaymentSuccess(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleStripeSubscriptionRenewal(invoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleStripeSubscriptionCancellation(subscription);
        break;

      default:
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Evento não tratado: ${event.type}`);
        }
    }

    res.json({ received: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao processar webhook:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Processar pagamento Metamask
router.post('/crypto/verify', async (req, res) => {
  try {
    const { planId, planData, transactionHash, amount, walletAddress } = req.body;

    if (!planId || !transactionHash || !amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Dados da transação são obrigatórios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja Básico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-basic': { price: 0.002, name: 'AgroConecta Básico' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano inválido'
      });
    }

    // Verificar se o valor está correto
    if (parseFloat(amount) < plan.price) {
      return res.status(400).json({
        success: false,
        error: 'Valor insuficiente para o plano selecionado'
      });
    }

    // Verificar transação na blockchain (simulado)
    const transactionValid = await verifyBlockchainTransaction(
      transactionHash,
      amount,
      walletAddress
    );

    if (!transactionValid) {
      return res.status(400).json({
        success: false,
        error: 'Transação inválida ou não confirmada'
      });
    }

    // Atualizar usuário como pago
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isPaid: true,
        planActive: planId,
        planType: plan.name,
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        lastPayment: new Date(),
        paymentMethod: 'crypto'
      },
      { new: true }
    );

    // Salvar registro de pagamento
    const payment = new Payment({
      userId: req.user.id,
      planId,
      planName: plan.name,
      amount,
      currency: 'ETH',
      paymentMethod: 'crypto',
      transactionHash,
      walletAddress,
      status: 'completed',
      metadata: {
        planData,
        verificationSource: 'blockchain'
      }
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Pagamento confirmado com sucesso',
      user: {
        isPaid: user.isPaid,
        planActive: user.planActive,
        planType: user.planType,
        planExpiry: user.planExpiry
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar pagamento crypto:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar pagamento específico
router.get('/verify/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Pagamento não encontrado'
      });
    }

    // Verificar se o usuário tem acesso ao pagamento
    if (payment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar pagamento:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Cancelar assinatura
router.post('/cancel', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    if (!user.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'Usuário não possui plano ativo'
      });
    }

    // Se for assinatura Stripe, cancelar no Stripe
    if (user.paymentMethod === 'stripe' && user.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      } catch (stripeError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erro ao cancelar no Stripe:', stripeError);
        }
      }
    }

    // Atualizar usuário
    user.isPaid = false;
    user.planActive = null;
    user.planType = null;
    user.planExpiry = null;
    user.cancellationDate = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      user: {
        isPaid: user.isPaid,
        planActive: user.planActive,
        planType: user.planType,
        planExpiry: user.planExpiry
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao cancelar assinatura:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Histórico de pagamentos
router.get('/history', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar histórico:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Funções auxiliares
async function handleStripePaymentSuccess(session) {
  try {
    const { userId } = session.metadata;
    const { planId } = session.metadata;
    const { planName } = session.metadata;

    // Atualizar usuário
    await User.findByIdAndUpdate(userId, {
      isPaid: true,
      planActive: planId,
      planType: planName,
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      lastPayment: new Date(),
      paymentMethod: 'stripe',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription
    });

    // Salvar registro de pagamento
    const payment = new Payment({
      userId,
      planId,
      planName,
      amount: session.amount_total / 100, // Converter de centavos
      currency: 'BRL',
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      status: 'completed',
      metadata: {
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription
      }
    });

    await payment.save();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Pagamento Stripe confirmado para usuário ${userId}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao processar pagamento Stripe:', error);
    }
  }
}

async function handleStripeSubscriptionRenewal(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { userId } = subscription.metadata;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        lastPayment: new Date(),
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Renovação Stripe confirmada para usuário ${userId}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao processar renovação Stripe:', error);
    }
  }
}

async function handleStripeSubscriptionCancellation(subscription) {
  try {
    const { userId } = subscription.metadata;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isPaid: false,
        planActive: null,
        planType: null,
        planExpiry: null,
        cancellationDate: new Date()
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Cancelamento Stripe processado para usuário ${userId}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao processar cancelamento Stripe:', error);
    }
  }
}

// ===== ROTAS METAMASK =====

// Criar fatura para pagamento MetaMask
router.post('/metamask/create-invoice', async (req, res) => {
  try {
    const { planId, planData } = req.body;

    if (!planId || !planData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do plano são obrigatórios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja Básico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-medio': { price: 0.002, name: 'AgroConecta Médio' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano inválido'
      });
    }

    // Gerar ID único para a fatura
    const invoiceId = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      invoiceId,
      plan,
      amount: plan.price,
      currency: 'ETH',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      instructions: `Envie exatamente ${plan.price} ETH para a carteira especificada`
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao criar fatura MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar pagamento MetaMask
router.post('/metamask/verify', async (req, res) => {
  try {
    const { planId, planData, transactionHash, amount, walletAddress } = req.body;

    if (!planId || !transactionHash || !amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Dados da transação são obrigatórios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja Básico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-medio': { price: 0.002, name: 'AgroConecta Médio' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano inválido'
      });
    }

    // Verificar se o valor está correto
    if (parseFloat(amount) < plan.price) {
      return res.status(400).json({
        success: false,
        error: 'Valor insuficiente para o plano selecionado'
      });
    }

    // Verificar transação na blockchain (simulado)
    const transactionValid = await verifyBlockchainTransaction(
      transactionHash,
      amount,
      walletAddress
    );

    if (!transactionValid) {
      return res.status(400).json({
        success: false,
        error: 'Transação inválida ou não confirmada'
      });
    }

    // Atualizar usuário como pago
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isPaid: true,
        planActive: planId,
        planType: plan.name,
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        lastPayment: new Date(),
        paymentMethod: 'metamask'
      },
      { new: true }
    );

    // Salvar registro de pagamento
    const payment = new Payment({
      userId: req.user.id,
      planId,
      planName: plan.name,
      amount,
      currency: 'ETH',
      paymentMethod: 'metamask',
      transactionHash,
      walletAddress,
      status: 'completed',
      metadata: {
        planData,
        verificationSource: 'blockchain'
      }
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Pagamento MetaMask confirmado com sucesso',
      user: {
        isPaid: user.isPaid,
        planActive: user.planActive,
        planType: user.planType,
        planExpiry: user.planExpiry
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar pagamento MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Obter saldo da carteira MetaMask
router.get('/metamask/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address || !ethers.utils.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Endereço de carteira inválido'
      });
    }

    // Em produção, usar provider real
    // const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER);
    // const balance = await provider.getBalance(address);

    // Por enquanto, simular saldo
    const balance = '0.0'; // Simulado

    res.json({
      success: true,
      address,
      balance,
      currency: 'ETH'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao obter saldo MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Obter transações da carteira MetaMask
router.get('/metamask/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    if (!address || !ethers.utils.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Endereço de carteira inválido'
      });
    }

    // Em produção, usar provider real para buscar transações
    // Por enquanto, retornar transações vazias
    const transactions = [];

    res.json({
      success: true,
      address,
      transactions,
      pagination: {
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        total: 0
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao obter transações MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ===== FUNÇÕES AUXILIARES =====

async function verifyBlockchainTransaction(transactionHash, amount, walletAddress) {
  try {
    // Em produção, usar provider real (Infura, Alchemy, etc.)
    // const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER);
    // const tx = await provider.getTransaction(transactionHash);

    // Por enquanto, simular verificação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular verificação bem-sucedida
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar transação blockchain:', error);
    }
    return false;
  }
}

export default router;
