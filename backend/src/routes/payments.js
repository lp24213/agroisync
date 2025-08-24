import express, { Router } from 'express';
import { authenticateToken, requireActivePlan } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

// POST /api/pay/stripe/session - Criar sessão do Stripe
router.post('/stripe/session', authenticateToken, async (req, res) => {
  try {
    const { module, tier } = req.body;
    const userId = req.user.id;

    if (!module || !tier) {
      return res.status(400).json({
        success: false,
        error: 'Módulo e tier são obrigatórios'
      });
    }

    // Validar módulo
    const validModules = ['store', 'freight'];
    if (!validModules.includes(module)) {
      return res.status(400).json({
        success: false,
        error: 'Módulo inválido'
      });
    }

    // Validar tier
    const validTiers = ['basic', 'pro', 'enterprise'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        error: 'Tier inválido'
      });
    }

    // Definir preços por tier
    const prices = {
      basic: 9900, // R$ 99,00
      pro: 19900,  // R$ 199,00
      enterprise: 49900 // R$ 499,00
    };

    // Criar sessão do Stripe (simulado por enquanto)
    const session = {
      id: `stripe_session_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/${Date.now()}`,
      amount: prices[tier],
      currency: 'brl',
      module,
      tier
    };

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar sessão de pagamento'
    });
  }
});

// POST /api/pay/stripe/webhook - Webhook do Stripe
router.post('/stripe/webhook', async (req, res) => {
  try {
    const { session_id, payment_status, module, tier, user_id } = req.body;

    if (payment_status === 'paid') {
      // Atualizar plano do usuário
      const user = await User.findById(user_id);
      if (user) {
        user.plans[module] = {
          status: 'active',
          tier,
          renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        };
        await user.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar webhook'
    });
  }
});

// POST /api/pay/crypto/invoice - Criar fatura cripto
router.post('/crypto/invoice', authenticateToken, async (req, res) => {
  try {
    const { tier } = req.body;
    const userId = req.user.id;

    if (!tier) {
      return res.status(400).json({
        success: false,
        error: 'Tier é obrigatório'
      });
    }

    // Validar tier
    const validTiers = ['basic', 'pro', 'enterprise'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        error: 'Tier inválido'
      });
    }

    // Definir preços por tier (em USD)
    const prices = {
      basic: 20,      // $20 USD
      pro: 40,        // $40 USD
      enterprise: 100 // $100 USD
    };

    // Criar fatura cripto (sem expor endereço público)
    const invoice = {
      id: `crypto_invoice_${Date.now()}`,
      amount: prices[tier],
      currency: 'usd',
      tier,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      // Endereço configurado no servidor, não exposto no frontend
      network: 'ethereum',
      chainId: 1
    };

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error creating crypto invoice:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar fatura cripto'
    });
  }
});

// POST /api/pay/crypto/verify - Verificar pagamento cripto
router.post('/crypto/verify', authenticateToken, async (req, res) => {
  try {
    const { invoiceId, transactionHash } = req.body;
    const userId = req.user.id;

    if (!invoiceId || !transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'ID da fatura e hash da transação são obrigatórios'
      });
    }

    // Verificar transação na blockchain (simulado)
    const isValidTransaction = true; // Aqui seria feita a verificação real

    if (isValidTransaction) {
      // Atualizar plano do usuário
      const user = await User.findById(userId);
      if (user) {
        user.plans.crypto = {
          status: 'active',
          tier: 'basic', // Por enquanto, sempre basic
          renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        };
        await user.save();
      }

      res.json({
        success: true,
        message: 'Pagamento verificado com sucesso'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Transação inválida'
      });
    }
  } catch (error) {
    console.error('Error verifying crypto payment:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar pagamento'
    });
  }
});

export default router;
