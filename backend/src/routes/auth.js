import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';

const router = Router();

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    success: false,
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }
});

// Rate limiting para registro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas
  message: {
    success: false,
    error: 'Muitas tentativas de registro. Tente novamente em 1 hora.'
  }
});

// POST /api/auth/register - Registrar novo usuário
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cpfCnpj,
      password,
      city,
      state,
      country,
      cep,
      modules
    } = req.body;

    // Validações básicas
    if (!name || !email || !phone || !cpfCnpj || !password || !city || !state) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Validar CPF/CNPJ (formato básico)
    const cpfCnpjRegex = /^\d{11}|\d{14}$/;
    if (!cpfCnpjRegex.test(cpfCnpj.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'CPF/CNPJ inválido'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      $or: [{ email }, { cpfCnpj }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email ou CPF/CNPJ já cadastrado'
      });
    }

    // Criar usuário
    const user = new User({
      name,
      email,
      phone,
      cpfCnpj,
      passwordHash: password,
      address: {
        city,
        state,
        country: country || 'Brasil',
        cep
      },
      modules: modules || {
        store: false,
        freight: false,
        crypto: false
      }
    });

    await user.save();

    // Gerar JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'agroisync-secret-key',
      { expiresIn: '7d' }
    );

    // Configurar cookie HttpOnly
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    // Retornar dados do usuário (sem senha)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      modules: user.modules,
      plans: user.plans
    };

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'Usuário cadastrado com sucesso'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cadastrar usuário'
    });
  }
});

// POST /api/auth/login - Login do usuário
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'agroisync-secret-key',
      { expiresIn: '7d' }
    );

    // Configurar cookie HttpOnly
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    // Retornar dados do usuário
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      modules: user.modules,
      plans: user.plans
    };

    res.json({
      success: true,
      data: userResponse,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login'
    });
  }
});

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agroisync-secret-key');
    
    // Buscar usuário
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado ou inativo'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
});

// POST /api/auth/logout - Logout do usuário
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

export default router;
