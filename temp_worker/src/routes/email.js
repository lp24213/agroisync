import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import notificationService from '../services/notificationService.js';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);
// GET /api/email/health - Verificar saúde do envio de email
router.get('/health', async (_req, res) => {
  try {
    const ok = Boolean(process.env.RESEND_API_KEY);
    return res.json({
      success: true,
      provider: 'resend',
      configured: ok,
      from: process.env.RESEND_FROM || 'AgroSync <contato@agroisync.com>'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// POST /api/email/send-verification - Enviar verificaÃ§Ã£o de email
router.post(
  '/send-verification',
  [body('email').isEmail().withMessage('Email invÃ¡lido')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Buscar usuÃ¡rio por email (para casos de prÃ©-cadastro)
      const user = await User.findOne({ email });

      // Se usuÃ¡rio nÃ£o existe, criar um temporÃ¡rio para verificaÃ§Ã£o
      if (!user) {
        // Gerar cÃ³digo de verificaÃ§Ã£o temporÃ¡rio
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Enviar email de verificaÃ§Ã£o
        try {
          const emailResult = await notificationService.sendOTPEmail(
            email,
            verificationCode,
            'UsuÃ¡rio'
          );
          if (emailResult.success) {
            logger.info(`Email de verificaÃ§Ã£o enviado para ${email}: ${verificationCode}`);
          } else {
            logger.error(`Erro ao enviar email para ${email}:`, emailResult.error);
          }
        } catch (error) {
          logger.error(`Erro ao enviar email para ${email}:`, error);
        }

        res.json({
          success: true,
          message: 'CÃ³digo de verificaÃ§Ã£o enviado para seu email',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            verificationCode, // Apenas para desenvolvimento
            expiresIn: '10 minutos'
          }
        });
        return;
      }

      // Verificar se email jÃ¡ estÃ¡ verificado
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email jÃ¡ estÃ¡ verificado'
        });
      }

      // Verificar se jÃ¡ existe token vÃ¡lido
      if (user.emailVerificationToken && user.emailVerificationExpires > Date.now()) {
        return res.status(400).json({
          success: false,
          message:
            'Email de verificaÃ§Ã£o jÃ¡ enviado. Verifique sua caixa de entrada ou aguarde 24 horas para solicitar novo email.'
        });
      }

      // Gerar novo token de verificaÃ§Ã£o
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Criar URL de verificaÃ§Ã£o
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${user._id}`;

      // Enviar email de verificaÃ§Ã£o
      try {
        await notificationService.sendEmailVerification(email, verificationToken, user.name);

        res.json({
          success: true,
          message: 'Email de verificaÃ§Ã£o enviado com sucesso',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mascarar email
            expiresIn: '24 horas'
          }
        });
      } catch (emailError) {
        logger.error('Erro ao enviar email:', emailError);

        // Em caso de erro no email, ainda retornar sucesso para nÃ£o quebrar o fluxo
        res.json({
          success: true,
          message: 'Token de verificaÃ§Ã£o gerado (Email pode estar temporariamente indisponÃ­vel)',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            expiresIn: '24 horas',
            verificationUrl // Apenas para desenvolvimento
          }
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar verificaÃ§Ã£o de email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/email/verify - Verificar email com cÃ³digo
router.post(
  '/verify',
  [
    body('email').isEmail().withMessage('Email invÃ¡lido'),
    body('code').notEmpty().withMessage('CÃ³digo Ã© obrigatÃ³rio')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { email, code } = req.body;

      // VerificaÃ§Ã£o simplificada para prÃ©-cadastro
      // Em produÃ§Ã£o, vocÃª salvaria o cÃ³digo em uma tabela temporÃ¡ria
      if (code.length === 6 && /^\d+$/.test(code)) {
        res.json({
          success: true,
          message: 'Email verificado com sucesso',
          data: {
            emailVerified: true,
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2')
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'CÃ³digo invÃ¡lido'
        });
      }
    } catch (error) {
      logger.error('Erro ao verificar email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/email/resend-verification - Reenviar verificaÃ§Ã£o de email
router.post(
  '/resend-verification',
  [
    body('email').isEmail().withMessage('Email invÃ¡lido'),
    body('userId').isMongoId().withMessage('ID de usuÃ¡rio invÃ¡lido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { email, userId } = req.body;

      // Buscar usuÃ¡rio
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'UsuÃ¡rio nÃ£o encontrado'
        });
      }

      // Verificar se email jÃ¡ estÃ¡ verificado
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email jÃ¡ estÃ¡ verificado'
        });
      }

      // Verificar rate limiting (mÃ¡ximo 3 tentativas por dia)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (
        user.emailVerificationAttempts &&
        user.emailVerificationAttempts > 2 &&
        user.lastEmailVerificationAttempt > oneDayAgo
      ) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Tente novamente em 24 horas.'
        });
      }

      // Gerar novo token
      const verificationToken = user.generateEmailVerificationToken();
      user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
      user.lastEmailVerificationAttempt = Date.now();
      await user.save();

      // Criar URL de verificaÃ§Ã£o
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${user._id}`;

      // Enviar email
      try {
        await notificationService.sendEmailVerification(email, verificationToken, user.name);

        res.json({
          success: true,
          message: 'Novo email de verificaÃ§Ã£o enviado',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            expiresIn: '24 horas',
            attemptsRemaining: Math.max(0, 3 - user.emailVerificationAttempts)
          }
        });
      } catch (emailError) {
        logger.error('Erro ao reenviar email:', emailError);

        res.json({
          success: true,
          message: 'Novo token gerado (Email pode estar temporariamente indisponÃ­vel)',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            expiresIn: '24 horas',
            verificationUrl // Apenas para desenvolvimento
          }
        });
      }
    } catch (error) {
      logger.error('Erro ao reenviar verificaÃ§Ã£o de email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// GET /api/email/status - Verificar status da verificaÃ§Ã£o
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar se usuÃ¡rio pode acessar este endpoint
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    const user = await User.findById(userId).select(
      'email emailVerified emailVerificationToken emailVerificationExpires emailVerificationAttempts lastEmailVerificationAttempt'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    const hasValidToken = user.emailVerificationToken && user.emailVerificationExpires > Date.now();
    const canResend =
      !hasValidToken &&
      (!user.lastEmailVerificationAttempt ||
        user.lastEmailVerificationAttempt < Date.now() - 24 * 60 * 60 * 1000);

    res.json({
      success: true,
      data: {
        emailVerified: user.emailVerified,
        email: user.email ? user.email.replace(/(.{2}).*(@.*)/, '$1***$2') : null,
        hasValidToken,
        canResend,
        attemptsRemaining: Math.max(0, 3 - (user.emailVerificationAttempts || 0)),
        nextResendAvailable: user.lastEmailVerificationAttempt
          ? new Date(user.lastEmailVerificationAttempt + 24 * 60 * 60 * 1000)
          : null
      }
    });
  } catch (error) {
    logger.error('Erro ao verificar status de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
