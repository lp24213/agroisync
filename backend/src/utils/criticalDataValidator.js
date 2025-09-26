// Sistema de Validação de Dados Críticos - AGROISYNC
// Validação rigorosa de todos os dados sensíveis e críticos

import crypto from 'crypto';
import validator from 'validator';

class CriticalDataValidator {
  constructor() {
    this.validationRules = {
      // Validação de CPF
      cpf: {
        required: true,
        minLength: 11,
        maxLength: 14,
        pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
        customValidation: this.validateCPF
      },
      
      // Validação de CNPJ
      cnpj: {
        required: true,
        minLength: 14,
        maxLength: 18,
        pattern: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
        customValidation: this.validateCNPJ
      },
      
      // Validação de email
      email: {
        required: true,
        minLength: 5,
        maxLength: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        customValidation: this.validateEmail
      },
      
      // Validação de telefone
      phone: {
        required: true,
        minLength: 10,
        maxLength: 15,
        pattern: /^[\+]?[0-9\s\-\(\)]+$/,
        customValidation: this.validatePhone
      },
      
      // Validação de senha
      password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        customValidation: this.validatePassword
      },
      
      // Validação de CEP
      cep: {
        required: true,
        minLength: 8,
        maxLength: 9,
        pattern: /^\d{5}-?\d{3}$/,
        customValidation: this.validateCEP
      },
      
      // Validação de placa
      plate: {
        required: true,
        minLength: 7,
        maxLength: 8,
        pattern: /^[A-Z]{3}\d[A-Z]\d{2}$|^[A-Z]{3}\d{2}[A-Z]\d$/,
        customValidation: this.validatePlate
      }
    };
    
    this.sensitiveFields = [
      'password', 'token', 'secret', 'key', 'creditCard', 'ssn', 'cpf', 'cnpj',
      'bankAccount', 'routingNumber', 'pin', 'otp', 'verificationCode'
    ];
  }

  // Validar dados críticos
  validateCriticalData(data, rules = {}) {
    const errors = [];
    const warnings = [];
    
    for (const [field, value] of Object.entries(data)) {
      const fieldRules = rules[field] || this.validationRules[field];
      
      if (!fieldRules) {
        continue; // Campo não tem regras de validação
      }
      
      // Verificar se é obrigatório
      if (fieldRules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} é obrigatório`);
        continue;
      }
      
      // Verificar comprimento mínimo
      if (fieldRules.minLength && value.toString().length < fieldRules.minLength) {
        errors.push(`${field} deve ter pelo menos ${fieldRules.minLength} caracteres`);
      }
      
      // Verificar comprimento máximo
      if (fieldRules.maxLength && value.toString().length > fieldRules.maxLength) {
        errors.push(`${field} deve ter no máximo ${fieldRules.maxLength} caracteres`);
      }
      
      // Verificar padrão
      if (fieldRules.pattern && !fieldRules.pattern.test(value.toString())) {
        errors.push(`${field} tem formato inválido`);
      }
      
      // Validação customizada
      if (fieldRules.customValidation) {
        const customResult = fieldRules.customValidation(value);
        if (!customResult.valid) {
          errors.push(`${field}: ${customResult.error}`);
        }
      }
      
      // Verificar se é campo sensível
      if (this.sensitiveFields.includes(field)) {
        warnings.push(`${field} é um campo sensível`);
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
      return { valid: false, error: 'CPF é obrigatório' };
    }
    
    // Remover formatação
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Verificar se tem 11 dígitos
    if (cleanCPF.length !== 11) {
      return { valid: false, error: 'CPF deve ter 11 dígitos' };
    }
    
    // Verificar se não são todos iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCPF.charAt(9)) !== digit1) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCPF.charAt(10)) !== digit2) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    return { valid: true };
  }

  // Validar CNPJ
  validateCNPJ(cnpj) {
    if (!cnpj) {
      return { valid: false, error: 'CNPJ é obrigatório' };
    }
    
    // Remover formatação
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    
    // Verificar se tem 14 dígitos
    if (cleanCNPJ.length !== 14) {
      return { valid: false, error: 'CNPJ deve ter 14 dígitos' };
    }
    
    // Verificar se não são todos iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    // Validar primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCNPJ.charAt(12)) !== digit1) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    // Validar segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCNPJ.charAt(13)) !== digit2) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    return { valid: true };
  }

  // Validar email
  validateEmail(email) {
    if (!email) {
      return { valid: false, error: 'Email é obrigatório' };
    }
    
    if (!validator.isEmail(email)) {
      return { valid: false, error: 'Email inválido' };
    }
    
    // Verificar domínios suspeitos
    const suspiciousDomains = [
      'localhost', '127.0.0.1', 'test.com', 'example.com',
      'tempmail.com', '10minutemail.com', 'guerrillamail.com'
    ];
    
    const domain = email.split('@')[1];
    if (suspiciousDomains.includes(domain)) {
      return { valid: false, error: 'Domínio de email não permitido' };
    }
    
    return { valid: true };
  }

  // Validar telefone
  validatePhone(phone) {
    if (!phone) {
      return { valid: false, error: 'Telefone é obrigatório' };
    }
    
    // Remover formatação
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Verificar se tem pelo menos 10 dígitos
    if (cleanPhone.length < 10) {
      return { valid: false, error: 'Telefone deve ter pelo menos 10 dígitos' };
    }
    
    // Verificar se tem no máximo 15 dígitos
    if (cleanPhone.length > 15) {
      return { valid: false, error: 'Telefone deve ter no máximo 15 dígitos' };
    }
    
    // Verificar se é um número válido
    if (!/^\d+$/.test(cleanPhone)) {
      return { valid: false, error: 'Telefone deve conter apenas números' };
    }
    
    return { valid: true };
  }

  // Validar senha
  validatePassword(password) {
    if (!password) {
      return { valid: false, error: 'Senha é obrigatória' };
    }
    
    if (password.length < 8) {
      return { valid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }
    
    if (password.length > 128) {
      return { valid: false, error: 'Senha deve ter no máximo 128 caracteres' };
    }
    
    // Verificar maiúscula
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
    }
    
    // Verificar minúscula
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos uma letra minúscula' };
    }
    
    // Verificar número
    if (!/\d/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos um número' };
    }
    
    // Verificar caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos um caractere especial' };
    }
    
    // Verificar senhas comuns
    const commonPasswords = [
      '123456', 'password', 'qwerty', 'abc123', 'admin',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      return { valid: false, error: 'Senha muito comum, escolha uma mais segura' };
    }
    
    return { valid: true };
  }

  // Validar CEP
  validateCEP(cep) {
    if (!cep) {
      return { valid: false, error: 'CEP é obrigatório' };
    }
    
    // Remover formatação
    const cleanCEP = cep.replace(/[^\d]/g, '');
    
    // Verificar se tem 8 dígitos
    if (cleanCEP.length !== 8) {
      return { valid: false, error: 'CEP deve ter 8 dígitos' };
    }
    
    // Verificar se é um número válido
    if (!/^\d{8}$/.test(cleanCEP)) {
      return { valid: false, error: 'CEP deve conter apenas números' };
    }
    
    return { valid: true };
  }

  // Validar placa
  validatePlate(plate) {
    if (!plate) {
      return { valid: false, error: 'Placa é obrigatória' };
    }
    
    // Converter para maiúsculo
    const cleanPlate = plate.toUpperCase().replace(/[^\w]/g, '');
    
    // Verificar padrão Mercosul (carro)
    const mercosulCarPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    
    // Verificar padrão Mercosul (moto)
    const mercosulMotoPattern = /^[A-Z]{3}\d{2}[A-Z]\d$/;
    
    // Verificar padrão antigo
    const oldPattern = /^[A-Z]{3}\d{4}$/;
    
    if (!mercosulCarPattern.test(cleanPlate) && 
        !mercosulMotoPattern.test(cleanPlate) && 
        !oldPattern.test(cleanPlate)) {
      return { valid: false, error: 'Placa inválida' };
    }
    
    return { valid: true };
  }

  // Sanitizar dados sensíveis
  sanitizeSensitiveData(data) {
    const sanitized = { ...data };
    
    for (const field of this.sensitiveFields) {
      if (sanitized[field]) {
        // Mascarar dados sensíveis para logs
        sanitized[field] = this.maskSensitiveData(sanitized[field]);
      }
    }
    
    return sanitized;
  }

  // Mascarar dados sensíveis
  maskSensitiveData(value) {
    if (!value) return value;
    
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
      errors.push('Moeda inválida');
    }
    
    // Validar método de pagamento
    if (!paymentData.method || !['stripe', 'metamask', 'pix'].includes(paymentData.method)) {
      errors.push('Método de pagamento inválido');
    }
    
    // Validar dados específicos do método
    if (paymentData.method === 'stripe') {
      if (!paymentData.stripeToken) {
        errors.push('Token Stripe é obrigatório');
      }
    }
    
    if (paymentData.method === 'metamask') {
      if (!paymentData.walletAddress) {
        errors.push('Endereço da carteira é obrigatório');
      }
    }
    
    if (paymentData.method === 'pix') {
      if (!paymentData.pixKey) {
        errors.push('Chave PIX é obrigatória');
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
    
    // Validar preço
    if (!productData.price || productData.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    // Validar categoria
    if (!productData.category) {
      errors.push('Categoria é obrigatória');
    }
    
    // Validar descrição
    if (!productData.description || productData.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
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
      errors.push('Origem é obrigatória');
    }
    
    // Validar destino
    if (!freightData.destination || freightData.destination.trim().length < 2) {
      errors.push('Destino é obrigatório');
    }
    
    // Validar peso
    if (!freightData.weight || freightData.weight <= 0) {
      errors.push('Peso deve ser maior que zero');
    }
    
    // Validar volume
    if (!freightData.volume || freightData.volume <= 0) {
      errors.push('Volume deve ser maior que zero');
    }
    
    // Validar preço
    if (!freightData.price || freightData.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Obter regras de validação
  getValidationRules() {
    return this.validationRules;
  }

  // Adicionar regra de validação
  addValidationRule(field, rules) {
    this.validationRules[field] = rules;
  }

  // Remover regra de validação
  removeValidationRule(field) {
    delete this.validationRules[field];
  }
}

// Instância única
const criticalDataValidator = new CriticalDataValidator();

export default criticalDataValidator;
