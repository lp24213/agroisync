const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { logger } = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Mock database - In production, replace with real database
let users = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@agrotm.com',
    phone: '+5511999999999',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isEmailVerified: true,
    isPhoneVerified: true,
    walletAddress: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let verificationCodes = new Map();
let passwordResetTokens = new Map();

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Send email verification (mock)
const sendEmailVerification = async (email, code) => {
  logger.info(`Email verification code ${code} sent to ${email}`);
  // In production, integrate with real email service (SendGrid, AWS SES, etc.)
  return true;
};

// Send SMS verification (mock)
const sendSMSVerification = async (phone, code) => {
  logger.info(`SMS verification code ${code} sent to ${phone}`);
  // In production, integrate with real SMS service (Twilio, AWS SNS, etc.)
  return true;
};

// Send password reset email (mock)
const sendPasswordResetEmail = async (email, token) => {
  logger.info(`Password reset link sent to ${email} with token ${token}`);
  // In production, integrate with real email service
  return true;
};

// Validate reCAPTCHA (mock)
const validateRecaptcha = async (token) => {
  logger.info(`reCAPTCHA validation for token: ${token}`);
  // In production, validate with Google reCAPTCHA API
  return true;
};

// Register user
router.post('/register', [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Telefone deve estar no formato internacional (+5511999999999)'),
  body('password').isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirmação de senha não confere');
    }
    return true;
  }),
  body('recaptchaToken').notEmpty().withMessage('Validação reCAPTCHA obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { fullName, email, phone, password, recaptchaToken } = req.body;

    // Validate reCAPTCHA
    const isRecaptchaValid = await validateRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'Validação reCAPTCHA falhou'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe com este e-mail'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: users.length + 1,
      fullName,
      email,
      phone,
      password: hashedPassword,
      isEmailVerified: false,
      isPhoneVerified: false,
      walletAddress: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    // Generate verification codes
    const emailCode = generateVerificationCode();
    const smsCode = generateVerificationCode();

    // Store verification codes (in production, use Redis with TTL)
    verificationCodes.set(`email:${email}`, {
      code: emailCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    verificationCodes.set(`sms:${phone}`, {
      code: smsCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send verification codes
    await sendEmailVerification(email, emailCode);
    await sendSMSVerification(phone, smsCode);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso. Verifique seu e-mail e telefone para ativar sua conta.',
      data: {
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Verify email
router.post('/verify-email', [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos'),
  checkValidation
], async (req, res) => {
  try {
    const { email, code } = req.body;

    const storedData = verificationCodes.get(`email:${email}`);
    if (!storedData || storedData.code !== code || Date.now() > storedData.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido ou expirado'
      });
    }

    // Update user
    const user = users.find(u => u.email === email);
    if (user) {
      user.isEmailVerified = true;
      user.updatedAt = new Date();
    }

    // Remove verification code
    verificationCodes.delete(`email:${email}`);

    logger.info(`Email verified for: ${email}`);

    res.json({
      success: true,
      message: 'E-mail verificado com sucesso'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Verify SMS
router.post('/verify-sms', [
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Telefone deve estar no formato internacional'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos'),
  checkValidation
], async (req, res) => {
  try {
    const { phone, code } = req.body;

    const storedData = verificationCodes.get(`sms:${phone}`);
    if (!storedData || storedData.code !== code || Date.now() > storedData.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido ou expirado'
      });
    }

    // Update user
    const user = users.find(u => u.phone === phone);
    if (user) {
      user.isPhoneVerified = true;
      user.updatedAt = new Date();
    }

    // Remove verification code
    verificationCodes.delete(`sms:${phone}`);

    logger.info(`SMS verified for: ${phone}`);

    res.json({
      success: true,
      message: 'Telefone verificado com sucesso'
    });

  } catch (error) {
    logger.error('SMS verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Resend verification code
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  body('type').isIn(['email', 'sms']).withMessage('Tipo deve ser email ou sms'),
  checkValidation
], async (req, res) => {
  try {
    const { email, type } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const code = generateVerificationCode();
    const key = `${type}:${type === 'email' ? email : user.phone}`;

    verificationCodes.set(key, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    if (type === 'email') {
      await sendEmailVerification(email, code);
    } else {
      await sendSMSVerification(user.phone, code);
    }

    logger.info(`Verification code resent to ${email} (${type})`);

    res.json({
      success: true,
      message: `Código de verificação reenviado para ${type === 'email' ? 'e-mail' : 'SMS'}`
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Login with email/password
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'E-mail não verificado. Verifique seu e-mail para ativar sua conta.'
      });
    }

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        walletAddress: user.walletAddress 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          walletAddress: user.walletAddress
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Login with Metamask
router.post('/login-metamask', [
  body('walletAddress').isEthereumAddress().withMessage('Endereço de carteira inválido'),
  body('signature').notEmpty().withMessage('Assinatura obrigatória'),
  body('message').notEmpty().withMessage('Mensagem obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    // In production, verify the signature with Web3.js or Ethers.js
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Assinatura inválida'
    //   });
    // }

    // Find or create user by wallet address
    let user = users.find(u => u.walletAddress === walletAddress);
    
    if (!user) {
      // Create new user with wallet
      user = {
        id: users.length + 1,
        fullName: `User_${walletAddress.slice(0, 8)}`,
        email: null,
        phone: null,
        password: null,
        isEmailVerified: true, // Wallet users are considered verified
        isPhoneVerified: false,
        walletAddress,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        walletAddress: user.walletAddress 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in with Metamask: ${walletAddress}`);

    res.json({
      success: true,
      message: 'Login com Metamask realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          walletAddress: user.walletAddress
        }
      }
    });

  } catch (error) {
    logger.error('Metamask login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Request password reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  checkValidation
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const resetToken = generatePasswordResetToken();
    passwordResetTokens.set(resetToken, {
      email,
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    await sendPasswordResetEmail(email, resetToken);

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'E-mail de redefinição de senha enviado'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token obrigatório'),
  body('password').isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirmação de senha não confere');
    }
    return true;
  }),
  checkValidation
], async (req, res) => {
  try {
    const { token, password } = req.body;

    const resetData = passwordResetTokens.get(token);
    if (!resetData || Date.now() > resetData.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    const user = users.find(u => u.email === resetData.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Update password
    user.password = await bcrypt.hash(password, 12);
    user.updatedAt = new Date();

    // Remove reset token
    passwordResetTokens.delete(token);

    logger.info(`Password reset for: ${resetData.email}`);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Update user profile
router.put('/profile', [
  authMiddleware,
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('phone').optional().matches(/^\+[1-9]\d{1,14}$/).withMessage('Telefone deve estar no formato internacional'),
  checkValidation
], async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (fullName) user.fullName = fullName;
    if (phone) {
      user.phone = phone;
      user.isPhoneVerified = false; // Reset phone verification if phone changed
    }

    user.updatedAt = new Date();

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        walletAddress: user.walletAddress,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Link wallet to account
router.post('/link-wallet', [
  authMiddleware,
  body('walletAddress').isEthereumAddress().withMessage('Endereço de carteira inválido'),
  body('signature').notEmpty().withMessage('Assinatura obrigatória'),
  body('message').notEmpty().withMessage('Mensagem obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // In production, verify the signature
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Assinatura inválida'
    //   });
    // }

    // Check if wallet is already linked to another account
    const existingWalletUser = users.find(u => u.walletAddress === walletAddress && u.id !== user.id);
    if (existingWalletUser) {
      return res.status(400).json({
        success: false,
        message: 'Carteira já está vinculada a outra conta'
      });
    }

    user.walletAddress = walletAddress;
    user.updatedAt = new Date();

    logger.info(`Wallet linked to user: ${user.email} -> ${walletAddress}`);

    res.json({
      success: true,
      message: 'Carteira vinculada com sucesso',
      data: {
        walletAddress: user.walletAddress
      }
    });

  } catch (error) {
    logger.error('Link wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In production, you might want to blacklist the token
    logger.info(`User logged out: ${req.user.email || req.user.walletAddress}`);

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Refresh token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        walletAddress: user.walletAddress 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Token refreshed for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
