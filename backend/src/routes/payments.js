import { Router } from '@agroisync/router';
import { authenticateToken } from '../middleware/auth.js';
import { generateId, now } from '../utils/d1-helper.js';

const router = new Router();
const COMMISSION_RATE = 0.05;
const MIN_COMMISSION = 0.01;

// Calcular comissão
router.post('/payments/commission/calculate', authenticateToken, async (request, env) => {
  try {
    const { transactionAmount, transactionType } = await request.json();
    if (!transactionAmount || transactionAmount <= 0) {
      return new Response(JSON.stringify({ success: false, error: 'Valor da transação inválido' }), { status: 400 });
    }
    let commissionRate = COMMISSION_RATE;
    switch (transactionType) {
      case 'product_sale': commissionRate = 0.05; break;
      case 'freight_service': commissionRate = 0.03; break;
      case 'premium_plan': commissionRate = 0.1; break;
      default: commissionRate = COMMISSION_RATE;
    }
    const commission = Math.max(transactionAmount * commissionRate, MIN_COMMISSION);
    const netAmount = transactionAmount - commission;
    return new Response(JSON.stringify({
      success: true,
      transactionAmount,
      commissionRate: commissionRate * 100,
      commission,
      netAmount,
      ownerWallet: env.OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

// Processar pagamento de comissão (registro no D1)
router.post('/payments/commission/process', authenticateToken, async (request, env) => {
  try {
    const { transactionId, amount, paymentMethod, userWallet } = await request.json();
    if (!transactionId || !amount || !paymentMethod) {
      return new Response(JSON.stringify({ success: false, error: 'Dados de comissão inválidos' }), { status: 400 });
    }
    const id = generateId('commission');
    const createdAt = now();
    const query = `INSERT INTO payments (id, user_id, transaction_id, amount, payment_method, type, status, recipient_wallet, sender_wallet, description, created_at) VALUES (?, ?, ?, ?, ?, 'commission', 'pending', ?, ?, ?, ?)`;
    await env.DB.prepare(query).bind(
      id,
      request.user.id,
      transactionId,
      amount,
      paymentMethod,
      env.OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      userWallet,
      'Comissão de intermediação AgroSync',
      createdAt
    ).run();
    return new Response(JSON.stringify({
      success: true,
      commissionId: id,
      message: 'Comissão processada com sucesso',
      ownerWallet: env.OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

// Processar pagamento de comissÃ£o para carteira do proprietÃ¡rio
router.post('/commission/process', async (req, res) => {
  try {
    const { transactionId, amount, paymentMethod, userWallet } = req.body;

    if (!transactionId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Dados de comissÃ£o invÃ¡lidos'
      });
    }

    // Registrar comissÃ£o no banco de dados
    const commission = new Payment({
      userId: req.user.id,
      transactionId,
      amount,
      paymentMethod,
      type: 'commission',
      status: 'pending',
      recipientWallet: OWNER_WALLET,
      senderWallet: userWallet,
      description: 'ComissÃ£o de intermediaÃ§Ã£o AgroSync'
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
      message: 'ComissÃ£o processada com sucesso',
      ownerWallet: OWNER_WALLET
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar comissÃ£o:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});


// Verificar status de pagamento do usuário
router.get('/payments/status', authenticateToken, async (request, env) => {
  try {
    const user = await env.DB.prepare('SELECT is_paid, plan_active, plan_type, plan_expiry FROM users WHERE id = ?').bind(request.user.id).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Usuário não encontrado' }), { status: 404 });
    }
    return new Response(JSON.stringify({
      success: true,
      isPaid: !!user.is_paid,
      planActive: user.plan_active,
      planType: user.plan_type,
      planExpiry: user.plan_expiry
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

// Criar sessÃ£o de pagamento Stripe
router.post('/stripe/create-session', async (req, res) => {
  try {
    const { planId, planData } = req.body;


    // Cancelar assinatura
    router.post('/payments/cancel', authenticateToken, async (request, env) => {
      try {
        const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(request.user.id).first();
        if (!user) {
          return new Response(JSON.stringify({ success: false, error: 'Usuário não encontrado' }), { status: 404 });
        }
        if (!user.is_paid) {
          return new Response(JSON.stringify({ success: false, error: 'Usuário não possui plano ativo' }), { status: 400 });
        }
        // Cancelar assinatura Stripe (se aplicável) - implementar via fetch se necessário
        await env.DB.prepare('UPDATE users SET is_paid = 0, plan_active = NULL, plan_type = NULL, plan_expiry = NULL, cancellation_date = ? WHERE id = ?').bind(now(), request.user.id).run();
        return new Response(JSON.stringify({
          success: true,
          message: 'Assinatura cancelada com sucesso',
          user: {
            isPaid: false,
            planActive: null,
            planType: null,
            planExpiry: null
          }
        }), { headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor', details: error.message }), { status: 500 });
      }
    });
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
      logger.error('Erro na assinatura do webhook:', err.message);
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
          logger.log(`Evento nÃ£o tratado: ${event.type}`);
        }
    }

    res.json({ received: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar webhook:', error);
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
        error: 'Dados da transaÃ§Ã£o sÃ£o obrigatÃ³rios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja BÃ¡sico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-basic': { price: 0.002, name: 'AgroConecta BÃ¡sico' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano invÃ¡lido'
      });
    }

    // Verificar se o valor estÃ¡ correto
    if (parseFloat(amount) < plan.price) {
      return res.status(400).json({
        success: false,
        error: 'Valor insuficiente para o plano selecionado'
      });
    }

    // Verificar transaÃ§Ã£o na blockchain (simulado)
    const transactionValid = await verifyBlockchainTransaction(
      transactionHash,
      amount,
      walletAddress
    );

    if (!transactionValid) {
      return res.status(400).json({
        success: false,
        error: 'TransaÃ§Ã£o invÃ¡lida ou nÃ£o confirmada'
      });
    }

    // Atualizar usuÃ¡rio como pago
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
      logger.error('Erro ao verificar pagamento crypto:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar pagamento especÃ­fico
router.get('/verify/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Pagamento nÃ£o encontrado'
      });
    }

    // Verificar se o usuÃ¡rio tem acesso ao pagamento
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
      logger.error('Erro ao verificar pagamento:', error);
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
        error: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    if (!user.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'UsuÃ¡rio nÃ£o possui plano ativo'
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
          logger.error('Erro ao cancelar no Stripe:', stripeError);
        }
      }
    }

    // Atualizar usuÃ¡rio
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
      logger.error('Erro ao cancelar assinatura:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});


// Histórico de pagamentos
router.get('/payments/history', authenticateToken, async (request, env) => {
  try {
    const result = await env.DB.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(request.user.id).all();
    return new Response(JSON.stringify({ success: true, payments: result.results }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

// FunÃ§Ãµes auxiliares
async function handleStripePaymentSuccess(session) {
  try {
    const { userId } = session.metadata;
    const { planId } = session.metadata;
    const { planName } = session.metadata;

    // Atualizar usuÃ¡rio
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
      logger.log(`Pagamento Stripe confirmado para usuÃ¡rio ${userId}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar pagamento Stripe:', error);
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
        logger.log(`RenovaÃ§Ã£o Stripe confirmada para usuÃ¡rio ${userId}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar renovaÃ§Ã£o Stripe:', error);
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
        logger.log(`Cancelamento Stripe processado para usuÃ¡rio ${userId}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar cancelamento Stripe:', error);
    }
  }
}

// ===== ROTAS METAMASK =====

// Criar fatura para pagamento MetaMask
router.post('/metamask/create-invoice', (req, res) => {
  try {
    const { planId, planData } = req.body;

    if (!planId || !planData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do plano sÃ£o obrigatÃ³rios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja BÃ¡sico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-medio': { price: 0.002, name: 'AgroConecta MÃ©dio' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano invÃ¡lido'
      });
    }

    // Gerar ID Ãºnico para a fatura
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
      logger.error('Erro ao criar fatura MetaMask:', error);
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
        error: 'Dados da transaÃ§Ã£o sÃ£o obrigatÃ³rios'
      });
    }

    // Validar dados do plano
    const validPlans = {
      'loja-basic': { price: 0.001, name: 'Loja BÃ¡sico' },
      'loja-pro': { price: 0.002, name: 'Loja Pro' },
      'agroconecta-medio': { price: 0.002, name: 'AgroConecta MÃ©dio' },
      'agroconecta-pro': { price: 0.005, name: 'AgroConecta Pro' }
    };

    const plan = validPlans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plano invÃ¡lido'
      });
    }

    // Verificar se o valor estÃ¡ correto
    if (parseFloat(amount) < plan.price) {
      return res.status(400).json({
        success: false,
        error: 'Valor insuficiente para o plano selecionado'
      });
    }

    // Verificar transaÃ§Ã£o na blockchain (simulado)
    const transactionValid = await verifyBlockchainTransaction(
      transactionHash,
      amount,
      walletAddress
    );

    if (!transactionValid) {
      return res.status(400).json({
        success: false,
        error: 'TransaÃ§Ã£o invÃ¡lida ou nÃ£o confirmada'
      });
    }

    // Atualizar usuÃ¡rio como pago
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
      logger.error('Erro ao verificar pagamento MetaMask:', error);
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
        error: 'EndereÃ§o de carteira invÃ¡lido'
      });
    }

    // Em produÃ§Ã£o, usar provider real
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
      logger.error('Erro ao obter saldo MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Obter transaÃ§Ãµes da carteira MetaMask
router.get('/metamask/transactions/:address', (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    if (!address || !ethers.utils.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'EndereÃ§o de carteira invÃ¡lido'
      });
    }

    // Em produÃ§Ã£o, usar provider real para buscar transaÃ§Ãµes
    // Por enquanto, retornar transaÃ§Ãµes vazias
    const transactions = [];

    res.json({
      success: true,
      address,
      transactions,
      pagination: {
        limit: parseInt(limit, 10, 10),
        offset: parseInt(offset, 10, 10),
        total: 0
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter transaÃ§Ãµes MetaMask:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ===== FUNÃ‡Ã•ES AUXILIARES =====

async function verifyBlockchainTransaction(transactionHash, amount, walletAddress) {
  try {
    // Em produÃ§Ã£o, usar provider real (Infura, Alchemy, etc.)
    // const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER);
    // const tx = await provider.getTransaction(transactionHash);

    // Por enquanto, simular verificaÃ§Ã£o
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular verificaÃ§Ã£o bem-sucedida
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar transaÃ§Ã£o blockchain:', error);
    }
    return false;
  }
}

export default router;
