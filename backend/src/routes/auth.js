import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import emailService from '../services/emailService.js';
import cloudflareService from '../services/cloudflareService.js';

const router = express.Router();

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               businessType:
 *                 type: string
 *                 enum: [producer, buyer, transporter, all]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('businessType')
      .optional()
      .isIn(['producer', 'buyer', 'transporter', 'all'])
      .withMessage('Tipo de negócio inválido')
  ],
  async (req, res) => {
    try {
      // Validar dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { name, email, password, businessType = 'all' } = req.body;

      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'E-mail já cadastrado'
        });
      }

      // Criar usuário
      const user = new User({
        name,
        email,
        password,
        businessType,
        lgpdConsent: true,
        lgpdConsentDate: new Date(),
        dataProcessingConsent: true,
        marketingConsent: false
      });

      await user.save();

      // Gerar token de verificação de e-mail
      user.generateEmailVerificationToken();
      await user.save();

      // TODO: Enviar e-mail de verificação

      // Gerar token de autenticação
      const token = user.generateAuthToken();

      logger.info(`Novo usuário registrado: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            businessType: user.businessType,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
            isAdmin: user.isAdmin
          },
          token,
          requiresEmailVerification: !user.isEmailVerified
        }
      });
    } catch (error) {
      logger.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas
 */
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ],
  async (req, res) => {
    try {
      // Validar dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findByEmail(email).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar se conta está ativa
      if (!user.isActive || user.isBlocked) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada ou bloqueada'
        });
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar se 2FA está habilitado
      if (user.twoFactorEnabled) {
        // Gerar token temporário para 2FA
        const tempToken = jwt.sign({ userId: user._id, temp: true }, process.env.JWT_SECRET, {
          expiresIn: '5m'
        });

        return res.status(200).json({
          success: true,
          message: '2FA necessário',
          data: {
            requires2FA: true,
            tempToken,
            userId: user._id
          }
        });
      }

      // Atualizar última atividade
      user.lastLoginAt = new Date();
      user.lastActivityAt = new Date();
      await user.save();

      // Gerar token de autenticação
      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      logger.info(`Login realizado: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            businessType: user.businessType,
            role: user.role,
            isAdmin: user.isAdmin,
            isPaid: user.isPaid,
            plan: user.plan,
            avatar: user.avatar
          },
          token,
          refreshToken,
          requires2FA: false
        }
      });
    } catch (error) {
      logger.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verificar código 2FA
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - otpCode
 *             properties:
 *               userId:
 *                 type: string
 *               otpCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA verificado com sucesso
 *       400:
 *         description: Código inválido
 */
router.post(
  '/verify-otp',
  [
    body('userId').isMongoId().withMessage('ID de usuário inválido'),
    body('otpCode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Código OTP deve ter 6 dígitos')
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

      const { userId, otpCode } = req.body;

      // Buscar usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // TODO: Implementar verificação real do OTP com speakeasy
      // Por enquanto, aceitar qualquer código de 6 dígitos
      if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        return res.status(400).json({
          success: false,
          message: 'Código OTP inválido'
        });
      }

      // Atualizar última atividade
      user.lastLoginAt = new Date();
      user.lastActivityAt = new Date();
      await user.save();

      // Gerar token de autenticação
      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      logger.info(`2FA verificado para usuário: ${user.email}`);

      res.status(200).json({
        success: true,
        message: '2FA verificado com sucesso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            businessType: user.businessType,
            role: user.role,
            isAdmin: user.isAdmin,
            isPaid: user.isPaid,
            plan: user.plan,
            avatar: user.avatar
          },
          token,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Erro na verificação 2FA:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar token de autenticação
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido
 */
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive || user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        valid: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessType: user.businessType,
          role: user.role,
          isAdmin: user.isAdmin,
          isPaid: user.isPaid,
          plan: user.plan,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    logger.error('Erro na verificação de token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar reset de senha com Cloudflare Turnstile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - turnstileToken
 *             properties:
 *               email:
 *                 type: string
 *               turnstileToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail de reset enviado
 *       400:
 *         description: Token Turnstile inválido
 *       404:
 *         description: E-mail não encontrado
 */
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('turnstileToken').notEmpty().withMessage('Token Turnstile é obrigatório')
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

      const { email, turnstileToken } = req.body;

      // Verificar token Turnstile do Cloudflare
      const turnstileValid = await cloudflareService.verifyTurnstileToken(turnstileToken, req.ip);
      if (!turnstileValid) {
        return res.status(400).json({
          success: false,
          message: 'Token de verificação inválido'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        // Por segurança, sempre retornar sucesso mesmo se email não existir
        logger.warn(`Tentativa de reset para email inexistente: ${email} - IP: ${req.ip}`);
        return res.status(200).json({
          success: true,
          message: 'Se o e-mail estiver cadastrado, você receberá instruções de redefinição'
        });
      }

      // Verificar se usuário está ativo
      if (!user.isActive || user.isBlocked) {
        logger.warn(`Tentativa de reset para conta inativa: ${email} - IP: ${req.ip}`);
        return res.status(200).json({
          success: true,
          message: 'Se o e-mail estiver cadastrado, você receberá instruções de redefinição'
        });
      }

      // Criar token de reset seguro
      const { token, resetRecord } = await PasswordReset.createToken(user._id, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Enviar e-mail de reset
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}&id=${user._id}`;

      await emailService.sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
        expiresIn: '1 hora'
      });

      logger.info(`Reset de senha solicitado para: ${email} - Token: ${resetRecord._id}`);

      res.status(200).json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá instruções de redefinição'
      });
    } catch (error) {
      logger.error('Erro no reset de senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha com validação segura
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - userId
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
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

      const { token, password, userId } = req.body;

      // Validar token usando o modelo PasswordReset
      const resetRecord = await PasswordReset.validateToken(token);

      if (!resetRecord || resetRecord.userId.toString() !== userId) {
        // Incrementar tentativas se token existe mas é inválido
        if (resetRecord) {
          await PasswordReset.incrementAttempt(token);
        }

        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Buscar usuário
      const user = await User.findById(userId);
      if (!user || !user.isActive || user.isBlocked) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não encontrado ou inativo'
        });
      }

      // Atualizar senha
      user.password = password;
      await user.save();

      // Marcar token como usado
      await PasswordReset.markAsUsed(token, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Limpar tokens antigos do usuário
      await PasswordReset.updateMany(
        { userId: user._id, status: 'pending' },
        { status: 'revoked' }
      );

      logger.info(`Senha redefinida para usuário: ${user.email} - IP: ${req.ip}`);

      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso',
        data: {
          redirectToLogin: true
        }
      });
    } catch (error) {
      logger.error('Erro na redefinição de senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/logout', auth, (req, res) => {
  try {
    // TODO: Implementar blacklist de tokens se necessário

    logger.info(`Logout realizado para usuário: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
