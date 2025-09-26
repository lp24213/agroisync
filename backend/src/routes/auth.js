import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import emailService from '../services/emailService.js';
import cloudflareService from '../services/cloudflareService.js';
import { verifyTurnstile } from '../utils/verifyTurnstile.js';
import notificationService from '../services/notificationService.js';
import {
  validatePassword,
  validateEmail,
  validatePhone,
  validateDocument,
  sanitizeInput,
  passwordAttemptLimiter
} from '../middleware/securityValidation.js';

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
  sanitizeInput,
  validateEmail,
  validatePassword,
  validatePhone,
  validateDocument,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('phone')
      .optional()
      .matches(/^\+?[\d\s\-()]+$/)
      .withMessage('Telefone inválido'),
    body('businessType')
      .optional()
      .isIn(['producer', 'buyer', 'transporter', 'all'])
      .withMessage('Tipo de negócio inválido'),
    body('turnstileToken').notEmpty().withMessage('Token Turnstile é obrigatório')
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

      const { name, email, password, phone, businessType = 'all', turnstileToken } = req.body;

      // Verificar token Turnstile do Cloudflare
      const turnstileResult = await verifyTurnstile(turnstileToken, req.ip);
      if (!turnstileResult.success) {
        return res.status(401).json({
          success: false,
          message: 'Verificação de segurança falhou. Tente novamente.'
        });
      }

      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'E-mail já cadastrado'
        });
      }

      // Criar usuário admin especial se for o email específico
      if (email === 'luispaulodeoliveira@agrotm.com.br') {
        // Verificar se já existe um admin com este email
        let adminUser = await User.findByEmail(email);

        if (adminUser) {
          // Atualizar usuário existente para admin
          adminUser.isAdmin = true;
          adminUser.adminRole = 'super_admin';
          adminUser.adminPermissions = ['*'];
          adminUser.isActive = true;
          adminUser.isEmailVerified = true;
          adminUser.isPhoneVerified = true;
          adminUser.plan = 'enterprise';
          await adminUser.save();
          logger.info('Usuário admin existente atualizado: luispaulodeoliveira@agrotm.com.br');
        } else {
          // Criar novo usuário admin
          adminUser = new User({
            name: 'Luis Paulo de Oliveira',
            email: 'luispaulodeoliveira@agrotm.com.br',
            password: 'Th@ys15221008',
            phone: '+5511999999999',
            businessType: 'all',
            isAdmin: true,
            adminRole: 'super_admin',
            adminPermissions: ['*'],
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            plan: 'enterprise',
            lgpdConsent: true,
            lgpdConsentDate: Math.floor(Date.now() / 1000),
            dataProcessingConsent: true,
            marketingConsent: false
          });
          await adminUser.save();
          logger.info('Novo usuário admin criado: luispaulodeoliveira@agrotm.com.br');
        }

        const token = adminUser.generateAuthToken();
        return res.status(201).json({
          success: true,
          message: 'Usuário admin registrado com sucesso',
          data: {
            user: {
              id: adminUser._id,
              name: adminUser.name,
              email: adminUser.email,
              businessType: adminUser.businessType,
              isAdmin: adminUser.isAdmin,
              adminRole: adminUser.adminRole,
              plan: adminUser.plan,
              avatar: adminUser.avatar
            },
            token,
            requires2FA: false
          }
        });
      }

      // Gerar código de verificação
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Criar usuário normal
      const user = new User({
        name,
        email,
        password,
        phone,
        businessType,
        lgpdConsent: true,
        lgpdConsentDate: Math.floor(Date.now() / 1000),
        dataProcessingConsent: true,
        marketingConsent: false,
        verificationCode,
        codeExpires,
        isEmailVerified: false
      });

      await user.save();

      // Gerar código de verificação SMS se telefone foi fornecido
      if (phone) {
        const smsCode = user.generatePhoneVerificationCode();
        await user.save();

        // Enviar SMS de verificação
        try {
          const smsResult = await notificationService.sendOTPSMS(phone, smsCode, name);
          if (smsResult.success) {
            logger.info(`SMS de verificação enviado para ${phone}: ${smsCode}`);
          } else {
            logger.error(`Erro ao enviar SMS para ${phone}:`, smsResult.error);
          }
        } catch (error) {
          logger.error(`Erro ao enviar SMS para ${phone}:`, error);
        }
      }

      // Enviar código de verificação por email
      try {
        await emailService.sendVerificationCode({
          to: email,
          name: name,
          code: verificationCode
        });
        logger.info(`Código de verificação enviado para ${email}: ${verificationCode}`);
      } catch (error) {
        logger.error(`Erro ao enviar email para ${email}:`, error);
      }

      // Gerar token de autenticação
      const token = user.generateAuthToken();

      logger.info(`Novo usuário registrado: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso. Verifique seu email para ativar a conta.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            businessType: user.businessType,
            isEmailVerified: user.isEmailVerified,
            isAdmin: user.isAdmin,
            plan: user.plan
          },
          token,
          requiresEmailVerification: true,
          verificationCode // Apenas para desenvolvimento
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
  passwordAttemptLimiter(5, 15 * 60 * 1000), // 5 tentativas em 15 minutos
  sanitizeInput,
  validateEmail,
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    body('turnstileToken').notEmpty().withMessage('Token Turnstile é obrigatório')
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

      const { email, password, turnstileToken } = req.body;

      // Verificar token Turnstile do Cloudflare
      const turnstileResult = await verifyTurnstile(turnstileToken, req.ip);
      if (!turnstileResult.success) {
        return res.status(401).json({
          success: false,
          message: 'Verificação de segurança falhou. Tente novamente.'
        });
      }

      // Buscar usuário
      logger.info(`[LOGIN] Buscando usuário: ${email}`);
      const user = await User.findByEmail(email);
      logger.info('[LOGIN] Usuário encontrado:', user ? 'SIM' : 'NÃO');

      if (user) {
        logger.info(
          `[LOGIN] Usuário encontrado - ID: ${user._id}, Email: ${user.email}, Ativo: ${user.isActive}`
        );
      }

      if (!user) {
        logger.info(`[LOGIN] Usuário não encontrado: ${email}`);
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
        logger.info(`[LOGIN] Senha inválida para usuário: ${email}`);
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
      await User.update(req.db, user.id, {
        lastLoginAt: Math.floor(Date.now() / 1000),
        lastActivityAt: Math.floor(Date.now() / 1000)
      });

      // Gerar token de autenticação
      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      logger.info(`Login realizado: ${email}`);

      const responseData = {
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
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
      };

      logger.info('[LOGIN] Response data:', JSON.stringify(responseData, null, 2));
      res.status(200).json(responseData);
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
      const turnstileResult = await verifyTurnstile(turnstileToken, req.ip);
      if (!turnstileResult.success) {
        return res.status(401).json({
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

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Listar usuários (DEBUG)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email businessType role isActive createdAt phone').sort(
      {
        createdAt: -1
      }
    );

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          businessType: user.businessType,
          role: user.role,
          isActive: user.isActive,
          phone: user.phone,
          createdAt: user.createdAt
        })),
        total: users.length
      }
    });
  } catch (error) {
    logger.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para dados do painel administrativo
router.get('/admin/dashboard', auth, async (req, res) => {
  try {
    // Verificar se é super-admin
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - apenas super-admins'
      });
    }

    // Buscar estatísticas gerais
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const paidUsers = await User.countDocuments({ plan: { $ne: 'free' }, planActive: true });
    const transporters = await User.countDocuments({ businessType: 'transporter' });
    const producers = await User.countDocuments({ businessType: 'producer' });

    // Usuários recentes
    const recentUsers = await User.find({}, 'name email businessType role createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(10);

    // Estatísticas por plano
    const planStats = await User.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$planActive', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          paidUsers,
          transporters,
          producers,
          freeUsers: totalUsers - paidUsers
        },
        recentUsers,
        planStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar dados do painel admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para listar todos os usuários (admin)
router.get('/admin/users', auth, async (req, res) => {
  try {
    // Verificar se é super-admin
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - apenas super-admins'
      });
    }

    const { page = 1, limit = 50, search = '', businessType = '', plan = '' } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filters = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (businessType) {
      filters.businessType = businessType;
    }
    if (plan) {
      filters.plan = plan;
    }

    const users = await User.find(
      filters,
      'name email businessType role plan planActive isActive createdAt phone'
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao listar usuários (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para estatísticas de pagamentos (admin)
router.get('/admin/payments', auth, async (req, res) => {
  try {
    // Verificar se é super-admin
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - apenas super-admins'
      });
    }

    // Estatísticas de planos
    const planStats = await User.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$planActive', 1, 0] } },
          revenue: { $sum: { $cond: [{ $ne: ['$plan', 'free'] }, 1, 0] } }
        }
      }
    ]);

    // Usuários por tipo de negócio
    const businessStats = await User.aggregate([
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 },
          paid: { $sum: { $cond: [{ $ne: ['$plan', 'free'] }, 1, 0] } }
        }
      }
    ]);

    // Crescimento mensal
    const monthlyGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        planStats,
        businessStats,
        monthlyGrowth,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas de pagamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/verify-email - Verificar email com código
router.post(
  '/verify-email',
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos')
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

      const { email, code } = req.body;

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se email já está verificado
      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email já está verificado'
        });
      }

      // Verificar código
      if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido'
        });
      }

      // Verificar se código não expirou
      if (user.emailVerificationExpires < Date.now()) {
        return res.status(400).json({
          success: false,
          message: 'Código expirado. Solicite um novo código.'
        });
      }

      // Verificar email
      user.isEmailVerified = true;
      user.emailVerificationCode = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      logger.info(`Email verificado para usuário: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Email verificado com sucesso',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao verificar email:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/auth/resend-verification - Reenviar código de verificação
router.post(
  '/resend-verification',
  [body('email').isEmail().normalizeEmail().withMessage('E-mail inválido')],
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

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se email já está verificado
      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email já está verificado'
        });
      }

      // Verificar rate limiting (máximo 3 tentativas por hora)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (
        user.emailVerificationAttempts &&
        user.emailVerificationAttempts > 2 &&
        user.lastEmailVerificationAttempt > oneHourAgo
      ) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Tente novamente em 1 hora.'
        });
      }

      // Gerar novo código
      const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailVerificationCode = emailCode;
      user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
      user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
      user.lastEmailVerificationAttempt = Date.now();
      await user.save();

      // Enviar novo código
      try {
        const emailResult = await notificationService.sendOTPEmail(email, emailCode, user.name);
        if (emailResult.success) {
          logger.info(`Novo código de verificação enviado para ${email}: ${emailCode}`);
        } else {
          logger.error(`Erro ao reenviar email para ${email}:`, emailResult.error);
        }
      } catch (error) {
        logger.error(`Erro ao reenviar email para ${email}:`, error);
      }

      res.status(200).json({
        success: true,
        message: 'Novo código de verificação enviado',
        data: {
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
          emailCode, // Apenas para desenvolvimento
          expiresIn: '10 minutos',
          attemptsRemaining: Math.max(0, 3 - user.emailVerificationAttempts)
        }
      });
    } catch (error) {
      logger.error('Erro ao reenviar verificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/auth/forgot-password - Solicitar recuperação de senha
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('E-mail inválido')],
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

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        // Por segurança, sempre retornar sucesso mesmo se usuário não existir
        return res.status(200).json({
          success: true,
          message: 'Se o email existir, você receberá um código de recuperação'
        });
      }

      // Verificar rate limiting (máximo 3 tentativas por hora)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (
        user.passwordResetAttempts &&
        user.passwordResetAttempts > 2 &&
        user.lastPasswordResetAttempt > oneHourAgo
      ) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Tente novamente em 1 hora.'
        });
      }

      // Gerar código de recuperação
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.passwordResetCode = resetCode;
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
      user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
      user.lastPasswordResetAttempt = Date.now();
      await user.save();

      // Enviar email de recuperação
      try {
        const emailResult = await notificationService.sendPasswordResetEmail(
          email,
          resetCode,
          user.name
        );
        if (emailResult.success) {
          logger.info(`Código de recuperação enviado para ${email}: ${resetCode}`);
        } else {
          logger.error(`Erro ao enviar email de recuperação para ${email}:`, emailResult.error);
        }
      } catch (error) {
        logger.error(`Erro ao enviar email de recuperação para ${email}:`, error);
      }

      res.status(200).json({
        success: true,
        message: 'Se o email existir, você receberá um código de recuperação',
        data: {
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
          resetCode, // Apenas para desenvolvimento
          expiresIn: '15 minutos'
        }
      });
    } catch (error) {
      logger.error('Erro ao solicitar recuperação de senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/auth/reset-password - Redefinir senha com código
router.post(
  '/reset-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Nova senha deve ter pelo menos 6 caracteres')
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

      const { email, code, newPassword } = req.body;

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar código
      if (!user.passwordResetCode || user.passwordResetCode !== code) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido'
        });
      }

      // Verificar se código não expirou
      if (user.passwordResetExpires < Date.now()) {
        return res.status(400).json({
          success: false,
          message: 'Código expirado. Solicite um novo código.'
        });
      }

      // Atualizar senha
      user.password = await bcrypt.hash(newPassword, 12);
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetAttempts = 0;
      user.lastPasswordResetAttempt = undefined;
      await user.save();

      logger.info(`Senha redefinida para usuário: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso',
        data: {
          user: {
            id: user._id,
            email: user.email
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao redefinir senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

export default router;
