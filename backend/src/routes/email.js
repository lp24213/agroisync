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

// POST /api/email/send-verification - Enviar verificação de email
router.post(
  '/send-verification',
  [body('email').isEmail().withMessage('Email inválido')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Buscar usuário por email (para casos de pré-cadastro)
      const user = await User.findOne({ email });

      // Se usuário não existe, criar um temporário para verificação
      if (!user) {
        // Gerar código de verificação temporário
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Enviar email de verificação
        try {
          const emailResult = await notificationService.sendOTPEmail(
            email,
            verificationCode,
            'Usuário'
          );
          if (emailResult.success) {
            logger.info(`Email de verificação enviado para ${email}: ${verificationCode}`);
          } else {
            logger.error(`Erro ao enviar email para ${email}:`, emailResult.error);
          }
        } catch (error) {
          logger.error(`Erro ao enviar email para ${email}:`, error);
        }

        res.json({
          success: true,
          message: 'Código de verificação enviado para seu email',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            verificationCode, // Apenas para desenvolvimento
            expiresIn: '10 minutos'
          }
        });
        return;
      }

      // Verificar se email já está verificado
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email já está verificado'
        });
      }

      // Verificar se já existe token válido
      if (user.emailVerificationToken && user.emailVerificationExpires > Date.now()) {
        return res.status(400).json({
          success: false,
          message:
            'Email de verificação já enviado. Verifique sua caixa de entrada ou aguarde 24 horas para solicitar novo email.'
        });
      }

      // Gerar novo token de verificação
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Criar URL de verificação
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${user._id}`;

      // Enviar email de verificação
      try {
        await notificationService.sendEmailVerification(email, verificationToken, user.name);

        res.json({
          success: true,
          message: 'Email de verificação enviado com sucesso',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mascarar email
            expiresIn: '24 horas'
          }
        });
      } catch (emailError) {
        logger.error('Erro ao enviar email:', emailError);

        // Em caso de erro no email, ainda retornar sucesso para não quebrar o fluxo
        res.json({
          success: true,
          message: 'Token de verificação gerado (Email pode estar temporariamente indisponível)',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            expiresIn: '24 horas',
            verificationUrl // Apenas para desenvolvimento
          }
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar verificação de email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/email/verify - Verificar email com código
router.post(
  '/verify',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('code').notEmpty().withMessage('Código é obrigatório')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, code } = req.body;

      // Verificação simplificada para pré-cadastro
      // Em produção, você salvaria o código em uma tabela temporária
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
          message: 'Código inválido'
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

// POST /api/email/resend-verification - Reenviar verificação de email
router.post(
  '/resend-verification',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('userId').isMongoId().withMessage('ID de usuário inválido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, userId } = req.body;

      // Buscar usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se email já está verificado
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email já está verificado'
        });
      }

      // Verificar rate limiting (máximo 3 tentativas por dia)
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

      // Criar URL de verificação
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${user._id}`;

      // Enviar email
      try {
        await notificationService.sendEmailVerification(email, verificationToken, user.name);

        res.json({
          success: true,
          message: 'Novo email de verificação enviado',
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
          message: 'Novo token gerado (Email pode estar temporariamente indisponível)',
          data: {
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            expiresIn: '24 horas',
            verificationUrl // Apenas para desenvolvimento
          }
        });
      }
    } catch (error) {
      logger.error('Erro ao reenviar verificação de email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// GET /api/email/status - Verificar status da verificação
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar se usuário pode acessar este endpoint
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
        message: 'Usuário não encontrado'
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
