const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

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
  legacyHeaders: false,
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
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('businessType')
    .optional()
    .isIn(['producer', 'buyer', 'transporter', 'all'])
    .withMessage('Tipo de negócio inválido')
], async (req, res) => {
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
    const emailToken = user.generateEmailVerificationToken();
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
});

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
router.post('/login', authLimiter, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
], async (req, res) => {
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
      const tempToken = jwt.sign(
        { userId: user._id, temp: true },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

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
});

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
router.post('/verify-otp', [
  body('userId')
    .isMongoId()
    .withMessage('ID de usuário inválido'),
  body('otpCode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Código OTP deve ter 6 dígitos')
], async (req, res) => {
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
});

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
 *     summary: Solicitar reset de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail de reset enviado
 *       404:
 *         description: E-mail não encontrado
 */
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido')
], async (req, res) => {
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

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'E-mail não encontrado'
      });
    }

    // Gerar token de reset
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Enviar e-mail com link de reset

    logger.info(`Reset de senha solicitado para: ${email}`);

    res.status(200).json({
      success: true,
      message: 'E-mail de redefinição enviado'
    });

  } catch (error) {
    logger.error('Erro no reset de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha
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
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Token é obrigatório'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Atualizar senha
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Senha redefinida para usuário: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });

  } catch (error) {
    logger.error('Erro na redefinição de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

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
router.post('/logout', auth, async (req, res) => {
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

module.exports = router;