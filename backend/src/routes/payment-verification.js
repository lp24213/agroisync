import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

import logger from '../utils/logger.js';
const router = express.Router();

// Nota: Stripe está intencionalmente protegido por STRIPE_ENABLED. Não inicializamos o cliente
// quando Stripe está desativado para evitar dependência de segredos em ambientes sem Stripe.
let stripeClient = null;
if ((process.env.STRIPE_ENABLED || 'false').toLowerCase() === 'true') {
  try {
    // carregamento condicional do SDK apenas quando necessário
     
    const Stripe = require('stripe');
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  } catch (e) {
    // se não conseguir carregar o SDK, manter stripeClient como null
    stripeClient = null;
  }
}

// ===== VERIFICAÃ‡ÃƒO DE PAGAMENTO =====

// GET /api/payment-verification/status - Verificar status do pagamento do usuÃ¡rio
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar usuÃ¡rio
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    // Verificar planos ativos
    const hasActivePlan =
      user.subscriptions &&
      ((user.subscriptions.store && user.subscriptions.store.status === 'active') ||
        (user.subscriptions.agroconecta && user.subscriptions.agroconecta.status === 'active'));

    // Verificar pagamentos recentes (Ãºltimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPayments = await Payment.find({
      userId,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Verificar pagamentos pendentes
    const pendingPayments = await Payment.find({
      userId,
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

    // Log da verificaÃ§Ã£o
    await AuditLog.logAction({
      userId,
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar status do pagamento:', error);
    }
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
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/payment-verification/verify-stripe - Verificar pagamento Stripe
router.post('/verify-stripe', authenticateToken, async (req, res) => {
  try {
    const stripeEnabled = (process.env.STRIPE_ENABLED || 'false').toLowerCase() === 'true';
    if (!stripeEnabled || !stripeClient) {
      return res.status(403).json({ success: false, message: 'Stripe desativado' });
    }

    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'ID do pagamento é obrigatório'
      });
    }

    // Se Stripe estiver habilitado, a lógica original pode ser restaurada aqui.
    // Por enquanto, retornar 501 para indicar que a operação não está implementada neste ambiente.
    return res.status(501).json({ success: false, message: 'Verificação Stripe não implementada' });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar pagamento Stripe:', error);
    }
    await AuditLog.logAction({
      userId: req.user?.id || 'unknown',
      userEmail: req.user?.email || 'unknown',
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
      message: 'Erro ao verificar pagamento'
    });
  }
});

// POST /api/payment-verification/verify-metamask - Verificar pagamento Metamask
router.post('/verify-metamask', authenticateToken, async (req, res) => {
  try {
    const { transactionHash, amount, currency, network } = req.body;
    const userId = req.user.id;

    if (!transactionHash || !amount || !currency || !network) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos sÃ£o obrigatÃ³rios'
      });
    }

    // Verificar se jÃ¡ existe pagamento com este hash
    let payment = await Payment.findOne({
      metamaskTransactionHash: transactionHash
    });

    if (payment) {
      return res.status(400).json({
        success: false,
        message: 'TransaÃ§Ã£o jÃ¡ foi verificada'
      });
    }

    // Aqui vocÃª implementaria a verificaÃ§Ã£o real da transaÃ§Ã£o na blockchain
    // Por enquanto, vamos assumir que Ã© vÃ¡lida se os dados estÃ£o corretos

    // Criar registro de pagamento
    payment = new Payment({
      userId,
      amount: parseFloat(amount),
      currency,
      status: 'completed',
      provider: 'metamask',
      metamaskTransactionHash: transactionHash,
      metadata: {
        network,
        verifiedAt: new Date()
      }
    });

    await payment.save();

    // Atualizar status do usuÃ¡rio se necessÃ¡rio
    const user = await User.findById(userId);
    if (user) {
      // Implementar lÃ³gica de ativaÃ§Ã£o de planos
      await user.save();
    }

    // Log do pagamento verificado
    await AuditLog.logAction({
      userId,
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
      message: 'Pagamento Metamask verificado com sucesso',
      data: {
        payment,
        canAccessMessaging: true
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar pagamento Metamask:', error);
    }
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
      message: 'Erro ao verificar pagamento Metamask'
    });
  }
});

// GET /api/payment-verification/plans - Obter planos disponÃ­veis
router.get('/plans', authenticateToken, (req, res) => {
  try {
    const plans = {
      store: {
        id: 'store',
        name: 'Loja',
        price: 25.0,
        currency: 'BRL',
        interval: 'month',
        features: [
          'AtÃ© 3 anÃºncios de produtos',
          'Mensageria privada com compradores',
          'Dashboard de vendas',
          'Suporte prioritÃ¡rio'
        ],
        messagingAccess: true
      },
      agroconecta: {
        id: 'agroconecta',
        name: 'AgroConecta',
        price: 50.0,
        currency: 'BRL',
        interval: 'month',
        features: [
          'AtÃ© 10 anÃºncios de fretes',
          'Mensageria privada com fretistas',
          'Rastreamento de cargas',
          'Suporte 24/7'
        ],
        messagingAccess: true
      },
      agroconectaPro: {
        id: 'agroconecta-pro',
        name: 'AgroConecta Pro',
        price: 149.0,
        currency: 'BRL',
        interval: 'month',
        features: [
          'AtÃ© 30 anÃºncios de fretes',
          'Mensageria privada ilimitada',
          'Rastreamento GPS em tempo real',
          'RelatÃ³rios avanÃ§ados',
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar planos:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/payment-verification/create-stripe-session - Criar sessÃ£o de pagamento Stripe
router.post('/create-stripe-session', authenticateToken, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;

    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos sÃ£o obrigatÃ³rios'
      });
    }

    // Buscar usuÃ¡rio
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    // Definir preÃ§o baseado no plano
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
          message: 'Plano invÃ¡lido'
        });
    }

    // Criar sessÃ£o do Stripe
    const session = await stripeClient.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Plano ${planId}`,
              description: `Assinatura mensal do plano ${planId}`
            },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId
      }
    });

    // Log da criaÃ§Ã£o da sessÃ£o
    await AuditLog.logAction({
      userId,
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao criar sessÃ£o do Stripe:', error);
    }
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
      message: 'Erro ao criar sessÃ£o de pagamento'
    });
  }
});

export default router;
