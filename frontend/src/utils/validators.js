/**
 * AGROISYNC - Form Validators
 *
 * Validadores reutilizáveis para formulários.
 * Integra com react-hook-form e validações customizadas.
 */

import { VALIDATION_CONFIG } from '../config/constants.js';

/**
 * Valida email
 *
 * @param {string} email - Email a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateEmail = email => {
  if (!email) {
    return 'Email é obrigatório';
  }

  if (email.length > VALIDATION_CONFIG.email.maxLength) {
    return `Email deve ter no máximo ${VALIDATION_CONFIG.email.maxLength} caracteres`;
  }

  if (!VALIDATION_CONFIG.email.regex.test(email)) {
    return 'Email inválido';
  }

  return true;
};

/**
 * Valida senha
 *
 * @param {string} password - Senha a ser validada
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validatePassword = password => {
  if (!password) {
    return 'Senha é obrigatória';
  }

  const config = VALIDATION_CONFIG.password;

  if (password.length < config.minLength) {
    return `Senha deve ter no mínimo ${config.minLength} caracteres`;
  }

  if (password.length > config.maxLength) {
    return `Senha deve ter no máximo ${config.maxLength} caracteres`;
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra maiúscula';
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra minúscula';
  }

  if (config.requireNumbers && !/\d/.test(password)) {
    return 'Senha deve conter pelo menos um número';
  }

  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Senha deve conter pelo menos um caractere especial';
  }

  return true;
};

/**
 * Valida confirmação de senha
 *
 * @param {string} password - Senha original
 * @param {string} confirmPassword - Confirmação de senha
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Confirmação de senha é obrigatória';
  }

  if (password !== confirmPassword) {
    return 'As senhas não coincidem';
  }

  return true;
};

/**
 * Valida telefone
 *
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validatePhone = phone => {
  if (!phone) {
    return true; // Telefone é opcional
  }

  // Remover caracteres não numéricos para validação
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < VALIDATION_CONFIG.phone.minLength) {
    return `Telefone deve ter no mínimo ${VALIDATION_CONFIG.phone.minLength} dígitos`;
  }

  if (cleanPhone.length > VALIDATION_CONFIG.phone.maxLength) {
    return `Telefone deve ter no máximo ${VALIDATION_CONFIG.phone.maxLength} dígitos`;
  }

  if (!VALIDATION_CONFIG.phone.regex.test(phone)) {
    return 'Telefone inválido';
  }

  return true;
};

/**
 * Valida CPF
 *
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateCPF = cpf => {
  if (!cpf) {
    return 'CPF é obrigatório';
  }

  // Remover caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return 'CPF deve ter 11 dígitos';
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) {
    return 'CPF inválido';
  }

  // Validar dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return 'CPF inválido';
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return 'CPF inválido';
  }

  return true;
};

/**
 * Valida CNPJ
 *
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateCNPJ = cnpj => {
  if (!cnpj) {
    return 'CNPJ é obrigatório';
  }

  // Remover caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) {
    return 'CNPJ deve ter 14 dígitos';
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return 'CNPJ inválido';
  }

  // Validar dígitos verificadores
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return 'CNPJ inválido';
  }

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return 'CNPJ inválido';
  }

  return true;
};

/**
 * Valida CEP
 *
 * @param {string} cep - CEP a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateCEP = cep => {
  if (!cep) {
    return 'CEP é obrigatório';
  }

  // Remover caracteres não numéricos
  cep = cep.replace(/\D/g, '');

  if (cep.length !== 8) {
    return 'CEP deve ter 8 dígitos';
  }

  return true;
};

/**
 * Valida URL
 *
 * @param {string} url - URL a ser validada
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateURL = url => {
  if (!url) {
    return true; // URL é opcional
  }

  try {
    new URL(url);
    return true;
  } catch {
    return 'URL inválida';
  }
};

/**
 * Valida número
 *
 * @param {string|number} value - Valor a ser validado
 * @param {Object} options - Opções de validação
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, positive = false } = options;

  if (value === '' || value === null || value === undefined) {
    return 'Número é obrigatório';
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return 'Valor deve ser um número';
  }

  if (integer && !Number.isInteger(num)) {
    return 'Valor deve ser um número inteiro';
  }

  if (positive && num <= 0) {
    return 'Valor deve ser positivo';
  }

  if (typeof min === 'number' && num < min) {
    return `Valor deve ser no mínimo ${min}`;
  }

  if (typeof max === 'number' && num > max) {
    return `Valor deve ser no máximo ${max}`;
  }

  return true;
};

/**
 * Valida arquivo
 *
 * @param {File} file - Arquivo a ser validado
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateFile = file => {
  if (!file) {
    return 'Arquivo é obrigatório';
  }

  const config = VALIDATION_CONFIG.upload;

  // Validar tamanho
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / 1024 / 1024).toFixed(2);
    return `Arquivo deve ter no máximo ${maxSizeMB}MB`;
  }

  // Validar tipo
  if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
    return `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(', ')}`;
  }

  // Validar extensão
  if (config.allowedExtensions) {
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!config.allowedExtensions.includes(extension)) {
      return `Extensão de arquivo não permitida. Extensões aceitas: ${config.allowedExtensions.join(', ')}`;
    }
  }

  return true;
};

/**
 * Valida data
 *
 * @param {string|Date} date - Data a ser validada
 * @param {Object} options - Opções de validação
 * @returns {boolean|string} true se válido, mensagem de erro se inválido
 */
export const validateDate = (date, options = {}) => {
  const { min, max, future = false, past = false } = options;

  if (!date) {
    return 'Data é obrigatória';
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();

  if (future && dateObj <= now) {
    return 'Data deve ser no futuro';
  }

  if (past && dateObj >= now) {
    return 'Data deve ser no passado';
  }

  if (min && dateObj < new Date(min)) {
    return `Data deve ser após ${new Date(min).toLocaleDateString()}`;
  }

  if (max && dateObj > new Date(max)) {
    return `Data deve ser antes de ${new Date(max).toLocaleDateString()}`;
  }

  return true;
};

/**
 * Cria regras de validação para react-hook-form
 *
 * @param {string} fieldType - Tipo do campo
 * @param {Object} options - Opções adicionais
 * @returns {Object} Regras de validação
 *
 * Exemplo:
 * <input {...register('email', getValidationRules('email'))} />
 */
export const getValidationRules = (fieldType, options = {}) => {
  const rules = {};

  switch (fieldType) {
    case 'email':
      rules.validate = validateEmail;
      break;

    case 'password':
      rules.validate = validatePassword;
      break;

    case 'phone':
      rules.validate = validatePhone;
      break;

    case 'cpf':
      rules.validate = validateCPF;
      break;

    case 'cnpj':
      rules.validate = validateCNPJ;
      break;

    case 'cep':
      rules.validate = validateCEP;
      break;

    case 'url':
      rules.validate = validateURL;
      break;

    case 'number':
      rules.validate = value => validateNumber(value, options);
      break;

    case 'file':
      rules.validate = validateFile;
      break;

    case 'date':
      rules.validate = value => validateDate(value, options);
      break;

    default:
      // Campo genérico required
      if (options.required) {
        rules.required = options.message || 'Campo obrigatório';
      }
  }

  return rules;
};

/**
 * Formatadores de campos
 */
export const formatters = {
  /**
   * Formata CPF: 000.000.000-00
   */
  cpf: value => {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  },

  /**
   * Formata CNPJ: 00.000.000/0000-00
   */
  cnpj: value => {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    return value;
  },

  /**
   * Formata CEP: 00000-000
   */
  cep: value => {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    return value;
  },

  /**
   * Formata telefone: (00) 00000-0000
   */
  phone: value => {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value;
  },

  /**
   * Formata moeda: R$ 1.000,00
   */
  currency: value => {
    if (!value) return 'R$ 0,00';
    value = parseFloat(value).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${value}`;
  }
};

// Exportar tudo como default também
export default {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
  validateCPF,
  validateCNPJ,
  validateCEP,
  validateURL,
  validateNumber,
  validateFile,
  validateDate,
  getValidationRules,
  formatters
};
