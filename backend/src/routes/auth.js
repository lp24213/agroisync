import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import awsService from '../services/awsService.js';
import { 
  createTokenPair, 
  refreshAccessToken, 
  revokeRefreshToken, 
  revokeAllUserTokens,
  authenticateRefreshToken 
} from '../services/tokenService.js';

const router = express.Router();

// Rate limiting para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas por IP
  message: 'Muitas tentativas de recuperação de senha. Tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 3, // máximo 3 tentativas por IP
  message: 'Muitas tentativas de OTP. Tente novamente em 5 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validações comuns
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Email inválido');

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Senha deve ter pelo menos 6 caracteres');

const phoneValidation = body('phone')
  .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
  .withMessage('Telefone deve estar no formato (11) 99999-9999');

// POST /auth/register - Registro de usuário
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  emailValidation,
  passwordValidation,
  phoneValidation,
  body('documentType').isIn(['CPF', 'CNPJ']).withMessage('Tipo de documento inválido'),
  body('document').trim().isLength({ min: 11, max: 18 }).withMessage('Documento inválido'),
  body('cep').matches(/^\d{5}-\d{3}$/).withMessage('CEP deve estar no formato 12345-678'),
  body('address.street').trim().isLength({ min: 3, max: 200 }).withMessage('Rua deve ter entre 3 e 200 caracteres'),
  body('address.number').trim().isLength({ min: 1, max: 10 }).withMessage('Número inválido'),
  body('address.neighborhood').trim().isLength({ min: 2, max: 100 }).withMessage('Bairro deve ter entre 2 e 100 caracteres'),
  body('address.city').trim().isLength({ min: 2, max: 100 }).withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  body('address.state').trim().isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),
  body('userType').optional().isIn(['loja', 'agroconecta', 'both']).withMessage('Tipo de usuário inválido'),
  body('userCategory').optional().isIn(['anunciante', 'comprador', 'freteiro', 'ambos']).withMessage('Categoria de usuário inválida')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const {
      name, email, password, phone, documentType, document, ie,
      cep, address, userType, userCategory
    } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      $or: [{ email }, { document }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email já cadastrado' : 'Documento já cadastrado'
      });
    }

    // Verificar se IE é obrigatório para CNPJ
    if (documentType === 'CNPJ' && !ie) {
      return res.status(400).json({
        success: false,
        message: 'Inscrição Estadual é obrigatória para CNPJ'
      });
    }

    // Criar usuário
    const user = new User({
      name,
      email,
      password,
      phone,
      documentType,
      document,
      ie,
      cep,
      address,
      userType,
      userCategory
    });

    await user.save();

    // Gerar token de verificação de email
    await user.generateEmailVerificationToken();

    // Enviar email de verificação
    const emailResult = await awsService.sendEmailVerification(email, user.emailVerificationToken, name);

    // Enviar SMS de boas-vindas
    const smsResult = await awsService.sendWelcomeSMS(phone, name);

    // Gerar JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Atualizar último login
    user.lastLoginAt = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: user.getPublicData(),
        token,
        requiresEmailVerification: true,
        emailSent: emailResult.success,
        smsSent: smsResult.success
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/login - Login de usuário
router.post('/login', [
  emailValidation,
  body('password').notEmpty().withMessage('Senha é obrigatória')
], authLimiter, async (req, res) => {
  try {
    // Verificar erros de validação
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar se 2FA está habilitado
    if (user.twoFactorEnabled) {
      // Gerar token temporário para 2FA
      const tempToken = jwt.sign(
        { userId: user._id, email: user.email, requires2FA: true },
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

    // Login sem 2FA - usar sistema de refresh tokens
    const tokens = await createTokenPair(user);

    // Atualizar último login
    user.lastLoginAt = new Date();
    await user.save();

    // Configurar cookies seguros
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    };

    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.getPublicData(),
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
        requires2FA: false
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/forgot-password - Solicitar recuperação de senha
router.post('/forgot-password', [
  emailValidation
], passwordResetLimiter, async (req, res) => {
  try {
    // Verificar erros de validação
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
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar se não está bloqueado
    if (user.isPasswordResetLocked) {
      return res.status(429).json({
        success: false,
        message: 'Muitas tentativas. Tente novamente em alguns minutos.'
      });
    }

    // Gerar token de recuperação
    await user.generatePasswordResetToken();

    // Enviar email
    const emailResult = await awsService.sendPasswordResetEmail(email, user.passwordResetToken, user.name);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Link de recuperação enviado para seu email'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar email. Tente novamente.'
      });
    }

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/reset-password - Redefinir senha
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token é obrigatório'),
  passwordValidation,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Senhas não coincidem');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Buscar usuário pelo token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Atualizar senha
    user.password = password;
    await user.clearPasswordResetToken();
    await user.save();

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });

  } catch (error) {
    console.error('Erro na redefinição de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/send-otp - Enviar código OTP para 2FA
router.post('/send-otp', [
  body('userId').isMongoId().withMessage('ID de usuário inválido')
], otpLimiter, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { userId } = req.body;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se 2FA está habilitado
    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA não está habilitado para esta conta'
      });
    }

    // Verificar se não está bloqueado
    if (user.isTwoFactorLocked) {
      return res.status(429).json({
        success: false,
        message: 'Conta temporariamente bloqueada. Tente novamente em alguns minutos.'
      });
    }

    // Gerar código OTP de 6 dígitos
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Armazenar OTP temporariamente (em produção, usar Redis)
    user.phoneVerificationToken = otpCode;
    user.phoneVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    await user.save();

    // Enviar SMS
    const smsResult = await awsService.sendOTPSMS(user.phone, otpCode, user.name);

    if (smsResult.success) {
      res.json({
        success: true,
        message: 'Código OTP enviado para seu telefone'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar SMS. Tente novamente.'
      });
    }

  } catch (error) {
    console.error('Erro ao enviar OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/verify-otp - Verificar código OTP
router.post('/verify-otp', [
  body('userId').isMongoId().withMessage('ID de usuário inválido'),
  body('otpCode').isLength({ min: 6, max: 6 }).withMessage('Código OTP deve ter 6 dígitos')
], otpLimiter, async (req, res) => {
  try {
    // Verificar erros de validação
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

    // Verificar se 2FA está habilitado
    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA não está habilitado para esta conta'
      });
    }

    // Verificar se não está bloqueado
    if (user.isTwoFactorLocked) {
      return res.status(429).json({
        success: false,
        message: 'Conta temporariamente bloqueada. Tente novamente em alguns minutos.'
      });
    }

    // Verificar código OTP
    if (user.phoneVerificationToken !== otpCode) {
      // Incrementar tentativas falhadas
      user.failedTwoFactorAttempts += 1;
      
      // Bloquear após 5 tentativas falhadas
      if (user.failedTwoFactorAttempts >= 5) {
        user.twoFactorLockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      }
      
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Código OTP inválido'
      });
    }

    // Verificar se expirou
    if (user.phoneVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Código OTP expirado'
      });
    }

    // Código válido - limpar e gerar token final
    user.phoneVerificationToken = null;
    user.phoneVerificationExpires = null;
    user.failedTwoFactorAttempts = 0;
    user.lastTwoFactorAttempt = new Date();
    user.lastLoginAt = new Date();
    await user.save();

    // Gerar JWT final
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: '2FA verificado com sucesso',
      data: {
        user: user.getPublicData(),
        token,
        requires2FA: false
      }
    });

  } catch (error) {
    console.error('Erro na verificação OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/verify-email - Verificar email
router.post('/verify-email', [
  body('token').notEmpty().withMessage('Token é obrigatório')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { token } = req.body;

    // Buscar usuário pelo token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Verificar email
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verificado com sucesso'
    });

  } catch (error) {
    console.error('Erro na verificação de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/resend-verification - Reenviar email de verificação
router.post('/resend-verification', [
  emailValidation
], async (req, res) => {
  try {
    // Verificar erros de validação
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

    // Verificar se já está verificado
    if (user.emailVerifiedAt) {
      return res.status(400).json({
        success: false,
        message: 'Email já foi verificado'
      });
    }

    // Gerar novo token
    await user.generateEmailVerificationToken();

    // Enviar email
    const emailResult = await awsService.sendEmailVerification(email, user.emailVerificationToken, user.name);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Email de verificação reenviado'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar email. Tente novamente.'
      });
    }

  } catch (error) {
    console.error('Erro ao reenviar verificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /auth/profile - Obter perfil do usuário
router.get('/profile', async (req, res) => {
  try {
    // Extrair token do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicData()
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /auth/profile - Atualizar perfil do usuário
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('phone').optional().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/).withMessage('Telefone deve estar no formato (11) 99999-9999'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio não pode ter mais de 500 caracteres'),
  body('website').optional().isURL().withMessage('Website deve ser uma URL válida'),
  body('preferences.language').optional().isIn(['pt', 'en', 'es', 'zh']).withMessage('Idioma inválido'),
  body('preferences.timezone').optional().isLength({ min: 3, max: 50 }).withMessage('Timezone inválido')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Extrair token do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Atualizar campos permitidos
    const allowedFields = ['name', 'phone', 'bio', 'website', 'socialMedia', 'preferences'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: user.getPublicData()
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/refresh - Renovar token de acesso
router.post('/refresh', authenticateRefreshToken, async (req, res) => {
  try {
    const { refreshToken } = req;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;

    const newTokens = await refreshAccessToken(refreshToken, userAgent, ipAddress);

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        accessToken: newTokens.accessToken,
        expiresIn: newTokens.expiresIn
      }
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Erro ao renovar token'
    });
  }
});

// POST /auth/logout - Logout com revogação de tokens
router.post('/logout', authenticateRefreshToken, async (req, res) => {
  try {
    const { refreshToken } = req;

    // Revogar o refresh token atual
    await revokeRefreshToken(refreshToken);

    // Limpar cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /auth/logout-all - Logout de todos os dispositivos
router.post('/logout-all', authenticateRefreshToken, async (req, res) => {
  try {
    const { tokenInfo } = req;

    // Revogar todos os tokens do usuário
    await revokeAllUserTokens(tokenInfo.userId);

    // Limpar cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout de todos os dispositivos realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout de todos os dispositivos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
