import bcrypt from 'bcryptjs';
import { zxcvbn } from 'zxcvbn';

// Validação de senha forte
export const validatePasswordStrength = password => {
  const errors = [];

  // Verificar comprimento mínimo
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }

  // Verificar se contém letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  // Verificar se contém letra maiúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  // Verificar se contém número
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  // Verificar se contém caractere especial
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial (@$!%*?&)');
  }

  // Verificar senhas comuns usando zxcvbn
  const strength = zxcvbn(password);
  if (strength.score < 2) {
    errors.push('Senha muito fraca. Use uma combinação mais complexa');
  }

  // Verificar senhas comuns
  const commonPasswords = [
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
    'password1',
    'qwerty123',
    'dragon',
    'master'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Esta senha é muito comum. Escolha uma senha mais única');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: strength.score,
    feedback: strength.feedback
  };
};

// Middleware para validar senha antes de hash
export const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Senha é obrigatória'
    });
  }

  const validation = validatePasswordStrength(password);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Senha não atende aos critérios de segurança',
      errors: validation.errors,
      score: validation.score
    });
  }

  next();
};

// Middleware para verificar se senha foi comprometida
export const checkPasswordBreach = async password => {
  try {
    // Hash da senha para verificar em APIs de breach
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashPrefix = hashedPassword.substring(0, 5);

    // Aqui você pode integrar com APIs como HaveIBeenPwned
    // Por enquanto, vamos simular a verificação
    return {
      isBreached: false,
      breachCount: 0
    };
  } catch (error) {
    console.error('Erro ao verificar breach de senha:', error);
    return {
      isBreached: false,
      breachCount: 0
    };
  }
};

// Middleware para rate limiting de tentativas de senha
export const passwordAttemptLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.body.email || req.body.username || 'unknown'}`;
    const now = Date.now();

    // Limpar tentativas antigas
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key);
      userAttempts.timestamps = userAttempts.timestamps.filter(
        timestamp => now - timestamp < windowMs
      );

      if (userAttempts.timestamps.length === 0) {
        attempts.delete(key);
      }
    }

    // Verificar se excedeu o limite
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key);
      if (userAttempts.timestamps.length >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }
    }

    // Registrar tentativa
    if (!attempts.has(key)) {
      attempts.set(key, { timestamps: [] });
    }
    attempts.get(key).timestamps.push(now);

    next();
  };
};

// Middleware para sanitizar dados de entrada
export const sanitizeInput = (req, res, next) => {
  // Sanitizar strings removendo caracteres perigosos
  const sanitizeString = str => {
    if (typeof str !== 'string') {
      return str;
    }
    return str
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  // Sanitizar body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitizar query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

// Middleware para validar email
export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email é obrigatório'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  // Verificar domínios temporários/descartáveis
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return res.status(400).json({
      success: false,
      message: 'Emails temporários não são permitidos'
    });
  }

  next();
};

// Middleware para validar telefone
export const validatePhone = (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(); // Telefone é opcional
  }

  // Regex para telefone brasileiro
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de telefone inválido. Use o formato brasileiro'
    });
  }

  next();
};

// Middleware para validar CPF/CNPJ
export const validateDocument = (req, res, next) => {
  const { document } = req.body;

  if (!document) {
    return next(); // Documento é opcional
  }

  // Remover caracteres não numéricos
  const cleanDocument = document.replace(/\D/g, '');

  // Validar CPF
  if (cleanDocument.length === 11) {
    if (!isValidCPF(cleanDocument)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }
  }
  // Validar CNPJ
  else if (cleanDocument.length === 14) {
    if (!isValidCNPJ(cleanDocument)) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ inválido'
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)'
    });
  }

  next();
};

// Função para validar CPF
function isValidCPF(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i, 10)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i, 10)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(10, 10))) {
    return false;
  }

  return true;
}

// Função para validar CNPJ
function isValidCNPJ(cnpj) {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i, 10)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12, 10))) {
    return false;
  }

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i, 10)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13, 10))) {
    return false;
  }

  return true;
}

export default {
  validatePasswordStrength,
  validatePassword,
  checkPasswordBreach,
  passwordAttemptLimiter,
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateDocument
};
