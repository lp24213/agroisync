// Validações de input para todo o sistema

export const validationRules = {
  // Email
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  
  // CPF
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    message: 'CPF inválido (formato: 000.000.000-00)'
  },
  
  // CNPJ
  cnpj: {
    pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    message: 'CNPJ inválido (formato: 00.000.000/0000-00)'
  },
  
  // Telefone
  phone: {
    pattern: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/,
    message: 'Telefone inválido (formato: (00) 00000-0000)'
  },
  
  // CEP
  cep: {
    pattern: /^\d{5}-\d{3}$/,
    message: 'CEP inválido (formato: 00000-000)'
  },
  
  // Senha forte
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    message: 'Senha deve ter: 8+ caracteres, maiúscula, minúscula, número e caractere especial'
  },
  
  // Nome completo
  fullName: {
    pattern: /^[A-Za-zÀ-ÿ\s]{3,}$/,
    message: 'Nome deve ter pelo menos 3 caracteres'
  },
  
  // Apenas números
  numbersOnly: {
    pattern: /^\d+$/,
    message: 'Apenas números são permitidos'
  },
  
  // Preço
  price: {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Preço inválido (use formato: 100 ou 100.50)'
  },
  
  // URL
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'URL inválida'
  }
};

/**
 * Adiciona validação HTML5 nativa aos inputs
 * @param {string} type - Tipo de validação
 * @returns {object} - Atributos HTML5 para validação
 */
export function getValidationProps(type) {
  const rule = validationRules[type];
  
  if (!rule) return {};
  
  return {
    pattern: rule.pattern.source,
    title: rule.message,
    required: true
  };
}

/**
 * Valida um valor contra uma regra
 * @param {string} value - Valor a validar
 * @param {string} type - Tipo de validação
 * @returns {boolean} - True se válido
 */
export function validate(value, type) {
  const rule = validationRules[type];
  
  if (!rule) return true;
  
  return rule.pattern.test(value);
}

/**
 * Valida um valor e retorna mensagem de erro
 * @param {string} value - Valor a validar
 * @param {string} type - Tipo de validação
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
export function validateWithMessage(value, type) {
  const rule = validationRules[type];
  
  if (!rule) return null;
  
  return rule.pattern.test(value) ? null : rule.message;
}

/**
 * Sanitiza input para prevenir XSS
 * @param {string} value - Valor a sanitizar
 * @returns {string} - Valor sanitizado
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a validar
 * @returns {boolean} - True se válido
 */
export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a validar
 * @returns {boolean} - True se válido
 */
export function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

export default {
  validationRules,
  getValidationProps,
  validate,
  validateWithMessage,
  sanitizeInput,
  validateCPF,
  validateCNPJ
};

