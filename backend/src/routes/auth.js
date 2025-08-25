import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { SecurityLog } from '../models/SecurityLog.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { authRateLimiter } from '../middleware/security.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Rate limiting for auth routes
router.use(rateLimiter);
router.use(authRateLimiter);

// Helper function to create security log
const createSecurityLog = async (eventType, severity, description, req, userId = null) => {
  try {
    await SecurityLog.create({
      eventType,
      severity,
      description,
      userId,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: req.headers,
      geolocation: {
        country: req.headers['cf-ipcountry'] || 'Unknown',
        region: req.headers['cf-ipregion'] || 'Unknown',
        city: req.headers['cf-ipcity'] || 'Unknown'
      },
      cloudflare: {
        rayId: req.headers['cf-ray'] || null,
        country: req.headers['cf-ipcountry'] || null,
        threatScore: parseInt(req.headers['cf-threat-score']) || 0,
        botScore: parseInt(req.headers['cf-bot-score']) || 0
      }
    });
  } catch (error) {
    console.error('Error creating security log:', error);
  }
};

// POST /api/auth/register - User registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password, phone, company, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await createSecurityLog(
        'suspicious_activity',
        'medium',
        `Registration attempt with existing email: ${email}`,
        req
      );
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe com este email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      userType: userType || 'buyer'
    });

    await user.save();

    // Create security log
    await createSecurityLog('login_success', 'low', `New user registered: ${email}`, req, user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          company: user.company
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    await createSecurityLog('system_error', 'high', `Registration error: ${error.message}`, req);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      await createSecurityLog(
        'login_failure',
        'medium',
        `Login attempt with non-existent email: ${email}`,
        req
      );
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      await createSecurityLog(
        'account_lock',
        'high',
        `Login attempt to locked account: ${email}`,
        req,
        user._id
      );
      return res.status(423).json({
        success: false,
        message:
          'Conta bloqueada devido a múltiplas tentativas de login. Tente novamente em 2 horas.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      await user.incLoginAttempts();

      await createSecurityLog(
        'login_failure',
        'medium',
        `Failed login attempt for: ${email}`,
        req,
        user._id
      );

      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create security log
    await createSecurityLog('login_success', 'low', `Successful login: ${email}`, req, user._id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
        hasStorePlan: user.hasActivePlan('store'),
        hasFreightPlan: user.hasActivePlan('freight')
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          company: user.company,
          subscriptions: user.subscriptions
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    await createSecurityLog('system_error', 'high', `Login error: ${error.message}`, req);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just log the logout
      await createSecurityLog('logout', 'low', 'User logged out', req);
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/forgot-password - Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha'
      });
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Store reset token and expiry (you might want to add these fields to User model)
    // For now, we'll just log the request

    await createSecurityLog(
      'password_reset',
      'medium',
      `Password reset requested for: ${email}`,
      req,
      user._id
    );

    // In production, send email with reset link
    // For now, just return success message

    res.json({
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha'
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    await createSecurityLog('system_error', 'high', `Forgot password error: ${error.message}`, req);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/reset-password - Password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // In production, validate token and find user
    // For now, we'll just return a message

    await createSecurityLog('password_reset', 'medium', 'Password reset attempted', req);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    console.error('Reset password error:', error);

    await createSecurityLog('system_error', 'high', `Reset password error: ${error.message}`, req);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          company: user.company,
          subscriptions: user.subscriptions,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/change-password - Change password
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      await createSecurityLog(
        'suspicious_activity',
        'medium',
        'Failed password change attempt - invalid current password',
        req,
        user._id
      );

      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, user.password);

    // Update password
    user.password = hashedPassword;
    await user.save();

    await createSecurityLog(
      'password_change',
      'medium',
      'Password changed successfully',
      req,
      user._id
    );

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Change password error:', error);

    await createSecurityLog('system_error', 'high', `Change password error: ${error.message}`, req);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
