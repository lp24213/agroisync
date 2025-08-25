import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { apiRateLimiter } from "../middleware/rateLimiter.js";
import { AuditLog } from "../models/AuditLog.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import stripe from "stripe";

const router = express.Router();

// Inicializar Stripe
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

// ===== VERIFICAÇÃO DE PAGAMENTO =====

// GET /api/payment-verification/status - Verificar status do pagamento do usuário
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // Verificar planos ativos
    const hasActivePlan = user.subscriptions && (
      (user.subscriptions.store && user.subscriptions.store.status === 'active') ||
      (user.subscriptions.agroconecta && user.subscriptions.agroconecta.status === 'active')
    );

    // Verificar pagamentos recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPayments = await Payment.find({
      userId: userId,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Verificar pagamentos pendentes
    const pendingPayments = await Payment.find({
      userId: userId,
      status: { $in: ['pending', 'processing'] }
    }).sort({ createdAt: -1 });

    // Status geral
    const paymentStatus = {
      hasActivePlan,
      hasRecentPayment: recentPayments.length > 0,
      hasPendingPayment: pendingPayments.length > 0,
      lastPayment: recentPayments[0] || null,
      pendingPayment: pendingPayments[0] || null,
      canAccessMessaging: hasActivePlan || recentPayments.length > 0
    };

    // Log da verificação
    await AuditLog.logAction({
      userId: userId,
      userEmail: req.user.email,
      action: 'PAYMENT_STATUS_CHECKED',
      resource: 'payment_verification',
      details: `Payment status checked. Has access: ${paymentStatus.canAccessMessaging}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: paymentStatus
    });

  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'PAYMENT_STATUS_CHECK_ERROR',
      resource: 'payment_verification',
      details: `Error checking payment status: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'STATUS_CHECK_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/payment-verification/verify-stripe - Verificar pagamento Stripe
router.post("/verify-stripe", authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "ID do pagamento é obrigatório"
      });
    }

    // Verificar pagamento no Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Buscar ou criar registro de pagamento
      let payment = await Payment.findOne({ 
        stripePaymentIntentId: paymentIntentId 
      });

      if (!payment) {
        payment = new Payment({
          userId: userId,
          amount: paymentIntent.amount / 100, // Stripe usa centavos
          currency: paymentIntent.currency,
          status: 'completed',
          provider: 'stripe',
          stripePaymentIntentId: paymentIntentId,
          metadata: {
            stripeCustomerId: paymentIntent.customer,
            stripeChargeId: paymentIntent.latest_charge
          }
        });

        await payment.save();
      }

      // Atualizar status do usuário se necessário
      const user = await User.findById(userId);
      if (user) {
        // Aqui você pode implementar lógica para ativar planos específicos
        // baseado no valor do pagamento ou metadata
        await user.save();
      }

      // Log do pagamento verificado
      await AuditLog.logAction({
        userId: userId,
        userEmail: req.user.email,
        action: 'STRIPE_PAYMENT_VERIFIED',
        resource: 'payment_verification',
        resourceId: payment._id,
        details: `Stripe payment verified: ${paymentIntentId}`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        message: "Pagamento verificado com sucesso",
        data: {
          payment,
          canAccessMessaging: true
        }
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Pagamento não foi concluído com sucesso",
        data: {
          status: paymentIntent.status,
          canAccessMessaging: false
        }
      });
    }

  } catch (error) {
    console.error('Erro ao verificar pagamento Stripe:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'STRIPE_PAYMENT_VERIFICATION_ERROR',
      resource: 'payment_verification',
      details: `Error verifying Stripe payment: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'STRIPE_VERIFICATION_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro ao verificar pagamento"
    });
  }
});

// POST /api/payment-verification/verify-metamask - Verificar pagamento Metamask
router.post("/verify-metamask", authenticateToken, async (req, res) => {
  try {
    const { transactionHash, amount, currency, network } = req.body;
    const userId = req.user.id;

    if (!transactionHash || !amount || !currency || !network) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios"
      });
    }

    // Verificar se já existe pagamento com este hash
    let payment = await Payment.findOne({ 
      metamaskTransactionHash: transactionHash 
    });

    if (payment) {
      return res.status(400).json({
        success: false,
        message: "Transação já foi verificada"
      });
    }

    // Aqui você implementaria a verificação real da transação na blockchain
    // Por enquanto, vamos assumir que é válida se os dados estão corretos
    
    // Criar registro de pagamento
    payment = new Payment({
      userId: userId,
      amount: parseFloat(amount),
      currency: currency,
      status: 'completed',
      provider: 'metamask',
      metamaskTransactionHash: transactionHash,
      metadata: {
        network: network,
        verifiedAt: new Date()
      }
    });

    await payment.save();

    // Atualizar status do usuário se necessário
    const user = await User.findById(userId);
    if (user) {
      // Implementar lógica de ativação de planos
      await user.save();
    }

    // Log do pagamento verificado
    await AuditLog.logAction({
      userId: userId,
      userEmail: req.user.email,
      action: 'METAMASK_PAYMENT_VERIFIED',
      resource: 'payment_verification',
      resourceId: payment._id,
      details: `Metamask payment verified: ${transactionHash}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: "Pagamento Metamask verificado com sucesso",
      data: {
        payment,
        canAccessMessaging: true
      }
    });

  } catch (error) {
    console.error('Erro ao verificar pagamento Metamask:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'METAMASK_PAYMENT_VERIFICATION_ERROR',
      resource: 'payment_verification',
      details: `Error verifying Metamask payment: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'METAMASK_VERIFICATION_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro ao verificar pagamento Metamask"
    });
  }
});

// GET /api/payment-verification/plans - Obter planos disponíveis
router.get("/plans", authenticateToken, async (req, res) => {
  try {
    const plans = {
      store: {
        id: 'store',
        name: 'Loja',
        price: 25.00,
        currency: 'BRL',
        interval: 'month',
        features: [
          'Até 3 anúncios de produtos',
          'Mensageria privada com compradores',
          'Dashboard de vendas',
          'Suporte prioritário'
        ],
        messagingAccess: true
      },
      agroconecta: {
        id: 'agroconecta',
        name: 'AgroConecta',
        price: 50.00,
        currency: 'BRL',
        interval: 'month',
        features: [
          'Até 10 anúncios de fretes',
          'Mensageria privada com fretistas',
          'Rastreamento de cargas',
          'Suporte 24/7'
        ],
        messagingAccess: true
      },
      agroconectaPro: {
        id: 'agroconecta-pro',
        name: 'AgroConecta Pro',
        price: 149.00,
        currency: 'BRL',
        interval: 'month',
        features: [
          'Até 30 anúncios de fretes',
          'Mensageria privada ilimitada',
          'Rastreamento GPS em tempo real',
          'Relatórios avançados',
          'Suporte VIP'
        ],
        messagingAccess: true
      }
    };

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/payment-verification/create-stripe-session - Criar sessão de pagamento Stripe
router.post("/create-stripe-session", authenticateToken, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;

    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios"
      });
    }

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // Definir preço baseado no plano
    let price;
    switch (planId) {
      case 'store':
        price = 2500; // R$25.00 em centavos
        break;
      case 'agroconecta':
        price = 5000; // R$50.00 em centavos
        break;
      case 'agroconecta-pro':
        price = 14900; // R$149.00 em centavos
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Plano inválido"
        });
    }

    // Criar sessão do Stripe
    const session = await stripeClient.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Plano ${planId}`,
              description: `Assinatura mensal do plano ${planId}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        planId: planId
      }
    });

    // Log da criação da sessão
    await AuditLog.logAction({
      userId: userId,
      userEmail: user.email,
      action: 'STRIPE_SESSION_CREATED',
      resource: 'payment_verification',
      details: `Stripe session created for plan: ${planId}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });

  } catch (error) {
    console.error('Erro ao criar sessão do Stripe:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'STRIPE_SESSION_CREATION_ERROR',
      resource: 'payment_verification',
      details: `Error creating Stripe session: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'SESSION_CREATION_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro ao criar sessão de pagamento"
    });
  }
});

export default router;
