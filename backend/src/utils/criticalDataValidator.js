// Sistema de ValidaÃ§Ã£o de Dados CrÃ­ticos - AGROISYNC
// ValidaÃ§Ã£o rigorosa de todos os dados sensÃ­veis e crÃ­ticos

import crypto from 'crypto';
import validator from 'validator';

class CriticalDataValidator {
  constructor() {
    this.validationRules = {
      // ValidaÃ§Ã£o de CPF
      cpf: {
        required: true,
        minLength: 11,
        maxLength: 14,
        pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
        customValidation: this.validateCPF
      },

      // ValidaÃ§Ã£o de CNPJ
      cnpj: {
        required: true,
        minLength: 14,
        maxLength: 18,
        pattern: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
        customValidation: this.validateCNPJ
      },

      // ValidaÃ§Ã£o de email
      email: {
        required: true,
        minLength: 5,
        maxLength: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        customValidation: this.validateEmail
      },

      // ValidaÃ§Ã£o de telefone
      phone: {
        required: true,
        minLength: 10,
        maxLength: 15,
        pattern: /^[\+]?[0-9\s\-\(\)]+$/,
        customValidation: this.validatePhone
      },

      // ValidaÃ§Ã£o de senha
      password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        customValidation: this.validatePassword
      },

      // ValidaÃ§Ã£o de CEP
      cep: {
        required: true,
        minLength: 8,
        maxLength: 9,
        pattern: /^\d{5}-?\d{3}$/,
        customValidation: this.validateCEP
      },

      // ValidaÃ§Ã£o de placa
      plate: {
        required: true,
        minLength: 7,
        maxLength: 8,
        pattern: /^[A-Z]{3}\d[A-Z]\d{2}$|^[A-Z]{3}\d{2}[A-Z]\d$/,
        customValidation: this.validatePlate
      }
    };

    this.sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'creditCard',
      'ssn',
      'cpf',
      'cnpj',
      'bankAccount',
      'routingNumber',
      'pin',
      'otp',
      'verificationCode'
    ];
  }

  // Validar dados crÃ­ticos
  validateCriticalData(data, rules = {}) {
    const errors = [];
    const warnings = [];

    for (const [field, value] of Object.entries(data)) {
      const fieldRules = rules[field] || this.validationRules[field];

      if (!fieldRules) {
        continue; // Campo nÃ£o tem regras de validaÃ§Ã£o
      }

      // Verificar se Ã© obrigatÃ³rio
      if (fieldRules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} Ã© obrigatÃ³rio`);
        continue;
      }

      // Verificar comprimento mÃ­nimo
      if (fieldRules.minLength && value.toString().length < fieldRules.minLength) {
        errors.push(`${field} deve ter pelo menos ${fieldRules.minLength} caracteres`);
      }

      // Verificar comprimento mÃ¡ximo
      if (fieldRules.maxLength && value.toString().length > fieldRules.maxLength) {
        errors.push(`${field} deve ter no mÃ¡ximo ${fieldRules.maxLength} caracteres`);
      }

      // Verificar padrÃ£o
      if (fieldRules.pattern && !fieldRules.pattern.test(value.toString())) {
        errors.push(`${field} tem formato invÃ¡lido`);
      }

      // ValidaÃ§Ã£o customizada
      if (fieldRules.customValidation) {
        const customResult = fieldRules.customValidation(value);
        if (!customResult.valid) {
          errors.push(`${field}: ${customResult.error}`);
        }
      }

      // Verificar se Ã© campo sensÃ­vel
      if (this.sensitiveFields.includes(field)) {
        warnings.push(`${field} Ã© um campo sensÃ­vel`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validar CPF
  validateCPF(cpf) {
    if (!cpf) {
      return { valid: false, error: 'CPF Ã© obrigatÃ³rio' };
    }

    // Remover formataÃ§Ã£o
    const cleanCPF = cpf.replace(/[^\d]/g, '');

    // Verificar se tem 11 dÃ­gitos
    if (cleanCPF.length !== 11) {
      return { valid: false, error: 'CPF deve ter 11 dÃ­gitos' };
    }

    // Verificar se nÃ£o sÃ£o todos iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return { valid: false, error: 'CPF invÃ¡lido' };
    }

    // Validar dÃ­gitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i, 10, 10)) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanCPF.charAt(9, 10, 10)) !== digit1) {
      return { valid: false, error: 'CPF invÃ¡lido' };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i, 10, 10)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanCPF.charAt(10, 10, 10)) !== digit2) {
      return { valid: false, error: 'CPF invÃ¡lido' };
    }

    return { valid: true };
  }

  // Validar CNPJ
  validateCNPJ(cnpj) {
    if (!cnpj) {
      return { valid: false, error: 'CNPJ Ã© obrigatÃ³rio' };
    }

    // Remover formataÃ§Ã£o
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

    // Verificar se tem 14 dÃ­gitos
    if (cleanCNPJ.length !== 14) {
      return { valid: false, error: 'CNPJ deve ter 14 dÃ­gitos' };
    }

    // Verificar se nÃ£o sÃ£o todos iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
      return { valid: false, error: 'CNPJ invÃ¡lido' };
    }

    // Validar primeiro dÃ­gito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i, 10, 10)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanCNPJ.charAt(12, 10, 10)) !== digit1) {
      return { valid: false, error: 'CNPJ invÃ¡lido' };
    }

    // Validar segundo dÃ­gito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i, 10, 10)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanCNPJ.charAt(13, 10, 10)) !== digit2) {
      return { valid: false, error: 'CNPJ invÃ¡lido' };
    }

    return { valid: true };
  }

  // Validar email
  validateEmail(email) {
    if (!email) {
      return { valid: false, error: 'Email Ã© obrigatÃ³rio' };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, error: 'Email invÃ¡lido' };
    }

    // Verificar domÃ­nios suspeitos
    const suspiciousDomains = [
      'localhost',
      '127.0.0.1',
      'test.com',
      'example.com',
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com'
    ];

    const domain = email.split('@')[1];
    if (suspiciousDomains.includes(domain)) {
      return { valid: false, error: 'DomÃ­nio de email nÃ£o permitido' };
    }

    return { valid: true };
  }

  // Validar telefone
  validatePhone(phone) {
    if (!phone) {
      return { valid: false, error: 'Telefone Ã© obrigatÃ³rio' };
    }

    // Remover formataÃ§Ã£o
    const cleanPhone = phone.replace(/[^\d]/g, '');

    // Verificar se tem pelo menos 10 dÃ­gitos
    if (cleanPhone.length < 10) {
      return { valid: false, error: 'Telefone deve ter pelo menos 10 dÃ­gitos' };
    }

    // Verificar se tem no mÃ¡ximo 15 dÃ­gitos
    if (cleanPhone.length > 15) {
      return { valid: false, error: 'Telefone deve ter no mÃ¡ximo 15 dÃ­gitos' };
    }

    // Verificar se Ã© um nÃºmero vÃ¡lido
    if (!/^\d+$/.test(cleanPhone)) {
      return { valid: false, error: 'Telefone deve conter apenas nÃºmeros' };
    }

    return { valid: true };
  }

  // Validar senha
  validatePassword(password) {
    if (!password) {
      return { valid: false, error: 'Senha Ã© obrigatÃ³ria' };
    }

    if (password.length < 8) {
      return { valid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }

    if (password.length > 128) {
      return { valid: false, error: 'Senha deve ter no mÃ¡ximo 128 caracteres' };
    }

    // Verificar maiÃºscula
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos uma letra maiÃºscula' };
    }

    // Verificar minÃºscula
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos uma letra minÃºscula' };
    }

    // Verificar nÃºmero
    if (!/\d/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos um nÃºmero' };
    }

    // Verificar caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos um caractere especial' };
    }

    // Verificar senhas comuns
    const commonPasswords = [
      '123456',
      'password',
      'qwerty',
      'abc123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      '1234567890'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return { valid: false, error: 'Senha muito comum, escolha uma mais segura' };
    }

    return { valid: true };
  }

  // Validar CEP
  validateCEP(cep) {
    if (!cep) {
      return { valid: false, error: 'CEP Ã© obrigatÃ³rio' };
    }

    // Remover formataÃ§Ã£o
    const cleanCEP = cep.replace(/[^\d]/g, '');

    // Verificar se tem 8 dÃ­gitos
    if (cleanCEP.length !== 8) {
      return { valid: false, error: 'CEP deve ter 8 dÃ­gitos' };
    }

    // Verificar se Ã© um nÃºmero vÃ¡lido
    if (!/^\d{8}$/.test(cleanCEP)) {
      return { valid: false, error: 'CEP deve conter apenas nÃºmeros' };
    }

    return { valid: true };
  }

  // Validar placa
  validatePlate(plate) {
    if (!plate) {
      return { valid: false, error: 'Placa Ã© obrigatÃ³ria' };
    }

    // Converter para maiÃºsculo
    const cleanPlate = plate.toUpperCase().replace(/[^\w]/g, '');

    // Verificar padrÃ£o Mercosul (carro)
    const mercosulCarPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/;

    // Verificar padrÃ£o Mercosul (moto)
    const mercosulMotoPattern = /^[A-Z]{3}\d{2}[A-Z]\d$/;

    // Verificar padrÃ£o antigo
    const oldPattern = /^[A-Z]{3}\d{4}$/;

    if (
      !mercosulCarPattern.test(cleanPlate) &&
      !mercosulMotoPattern.test(cleanPlate) &&
      !oldPattern.test(cleanPlate)
    ) {
      return { valid: false, error: 'Placa invÃ¡lida' };
    }

    return { valid: true };
  }

  // Sanitizar dados sensÃ­veis
  sanitizeSensitiveData(data) {
    const sanitized = { ...data };

    for (const field of this.sensitiveFields) {
      if (sanitized[field]) {
        // Mascarar dados sensÃ­veis para logs
        sanitized[field] = this.maskSensitiveData(sanitized[field]);
      }
    }

    return sanitized;
  }

  // Mascarar dados sensÃ­veis
  maskSensitiveData(value) {
    if (!value) {
      return value;
    }

    const str = value.toString();

    if (str.length <= 4) {
      return '*'.repeat(str.length);
    }

    if (str.length <= 8) {
      return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
    }

    return str.substring(0, 3) + '*'.repeat(str.length - 6) + str.substring(str.length - 3);
  }

  // Validar dados de pagamento
  validatePaymentData(paymentData) {
    const errors = [];

    // Validar valor
    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    // Validar moeda
    if (!paymentData.currency || !['BRL', 'USD', 'EUR'].includes(paymentData.currency)) {
      errors.push('Moeda invÃ¡lida');
    }

    // Validar mÃ©todo de pagamento
    if (!paymentData.method || !['stripe', 'metamask', 'pix'].includes(paymentData.method)) {
      errors.push('MÃ©todo de pagamento invÃ¡lido');
    }

    // Validar dados especÃ­ficos do mÃ©todo
    if (paymentData.method === 'stripe') {
      if (!paymentData.stripeToken) {
        errors.push('Token Stripe Ã© obrigatÃ³rio');
      }
    }

    if (paymentData.method === 'metamask') {
      if (!paymentData.walletAddress) {
        errors.push('EndereÃ§o da carteira Ã© obrigatÃ³rio');
      }
    }

    if (paymentData.method === 'pix') {
      if (!paymentData.pixKey) {
        errors.push('Chave PIX Ã© obrigatÃ³ria');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validar dados de produto
  validateProductData(productData) {
    const errors = [];

    // Validar nome
    if (!productData.name || productData.name.trim().length < 3) {
      errors.push('Nome do produto deve ter pelo menos 3 caracteres');
    }

    // Validar preÃ§o
    if (!productData.price || productData.price <= 0) {
      errors.push('PreÃ§o deve ser maior que zero');
    }

    // Validar categoria
    if (!productData.category) {
      errors.push('Categoria Ã© obrigatÃ³ria');
    }

    // Validar descriÃ§Ã£o
    if (!productData.description || productData.description.trim().length < 10) {
      errors.push('DescriÃ§Ã£o deve ter pelo menos 10 caracteres');
    }

    // Validar estoque
    if (productData.stock !== undefined && productData.stock < 0) {
      errors.push('Estoque deve ser maior ou igual a zero');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validar dados de frete
  validateFreightData(freightData) {
    const errors = [];

    // Validar origem
    if (!freightData.origin || freightData.origin.trim().length < 2) {
      errors.push('Origem Ã© obrigatÃ³ria');
    }

    // Validar destino
    if (!freightData.destination || freightData.destination.trim().length < 2) {
      errors.push('Destino Ã© obrigatÃ³rio');
    }

    // Validar peso
    if (!freightData.weight || freightData.weight <= 0) {
      errors.push('Peso deve ser maior que zero');
    }

    // Validar volume
    if (!freightData.volume || freightData.volume <= 0) {
      errors.push('Volume deve ser maior que zero');
    }

    // Validar preÃ§o
    if (!freightData.price || freightData.price <= 0) {
      errors.push('PreÃ§o deve ser maior que zero');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Obter regras de validaÃ§Ã£o
  getValidationRules() {
    return this.validationRules;
  }

  // Adicionar regra de validaÃ§Ã£o
  addValidationRule(field, rules) {
    this.validationRules[field] = rules;
  }

  // Remover regra de validaÃ§Ã£o
  removeValidationRule(field) {
    delete this.validationRules[field];
  }
}

// InstÃ¢ncia Ãºnica
const criticalDataValidator = new CriticalDataValidator();

export default criticalDataValidator;
