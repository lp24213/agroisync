const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const router = express.Router();

// Configurações
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validações para registro
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .isIn(['comprador', 'anunciante', 'freteiro'])
    .withMessage('Tipo de usuário inválido'),
  body('cpfCnpj')
    .trim()
    .isLength({ min: 11, max: 18 })
    .withMessage('CPF/CNPJ inválido'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Telefone inválido'),
  body('address.cep')
    .trim()
    .isLength({ min: 8, max: 9 })
    .withMessage('CEP inválido'),
  body('address.street')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Logradouro inválido'),
  body('address.number')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Número inválido'),
  body('address.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade inválida'),
  body('address.state')
    .trim()
    .isLength({ min: 2, max: 2 })
    .isUppercase()
    .withMessage('Estado inválido'),
  body('aceita_termos')
    .isBoolean()
    .custom(value => {
      if (!value) {
        throw new Error('Você deve aceitar os termos de uso');
      }
      return true;
    })
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// POST /api/auth/register - Registro de usuário
router.post('/register', 
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 tentativas por 15 min
  registerValidation,
  async (req, res) => {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        name,
        email,
        password,
        role,
        cpfCnpj,
        ie,
        phone,
        address,
        aceita_termos
      } = req.body;

      // Verificar se email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      // Verificar se CPF/CNPJ já existe
      const existingCpfCnpj = await User.findOne({ cpfCnpj });
      if (existingCpfCnpj) {
        return res.status(400).json({
          success: false,
          message: 'CPF/CNPJ já cadastrado'
        });
      }

      // Criar usuário
      const user = new User({
        name,
        email,
        passwordHash: password, // Será hasheada pelo middleware
        role,
        cpfCnpj,
        ie: role === 'anunciante' ? ie : undefined,
        phone,
        address,
        aceita_termos
      });

      await user.save();

      // Gerar JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Configurar cookie httpOnly
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      // Retornar dados do usuário (sem senha)
      const userData = user.getPublicData();
      
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        user: userData,
        token
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/auth/login - Login de usuário
router.post('/login',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), // 10 tentativas por 15 min
  loginValidation,
  async (req, res) => {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar se usuário está ativo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada'
        });
      }

      // Verificar senha
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Atualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Gerar JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Configurar cookie httpOnly
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      // Retornar dados do usuário
      const userData = user.getPublicData();
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: userData,
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Retornar dados públicos
    const userData = user.getPublicData();
    
    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/me/private - Obter dados privados do usuário (apenas se pago)
router.get('/me/private', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se usuário pagou
    if (!user.isPaid || !user.isPlanActive()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: usuário não possui plano ativo'
      });
    }

    // Retornar dados privados
    const privateData = user.getPrivateData();
    
    res.json({
      success: true,
      user: privateData
    });

  } catch (error) {
    console.error('Erro ao buscar dados privados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado'
      });
    }

    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Configurar novo cookie
    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      token: newToken
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/change-password - Alterar senha
router.post('/change-password', 
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar senha atual
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      // Alterar senha
      user.passwordHash = newPassword; // Será hasheada pelo middleware
      await user.save();

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

module.exports = router;
