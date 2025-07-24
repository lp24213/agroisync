/**
 * Validation Utilities
 * Funções de validação para AGROTM
 */

import { PublicKey } from '@solana/web3.js';
import { logger } from './logger';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valida se todas as variáveis de ambiente obrigatórias estão definidas
 */
export function validateEnvironment(): void {
  const requiredEnvVars = [
    'SOLANA_RPC_URL',
    'PROGRAM_ID',
    'JWT_SECRET'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new ValidationError(
      `Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`
    );
  }

  logger.info('✅ Validação de ambiente concluída');
}

/**
 * Valida se uma string é um endereço Solana válido
 */
export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida e normaliza um endereço Solana
 */
export function validateAndNormalizeSolanaAddress(address: string): string {
  if (!validateSolanaAddress(address)) {
    throw new ValidationError(`Endereço Solana inválido: ${address}`, 'address');
  }
  return new PublicKey(address).toString();
}

/**
 * Valida um valor monetário
 */
export function validateAmount(amount: string | number): number {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount < 0) {
    throw new ValidationError(`Valor inválido: ${amount}`, 'amount');
  }
  
  if (numAmount > Number.MAX_SAFE_INTEGER) {
    throw new ValidationError(`Valor muito grande: ${amount}`, 'amount');
  }
  
  return numAmount;
}

/**
 * Valida um email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida uma senha
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Valida parâmetros de paginação
 */
export function validatePagination(page?: string | number, limit?: string | number): {
  page: number;
  limit: number;
} {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : (page || 1);
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : (limit || 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new ValidationError('Página deve ser um número maior que 0', 'page');
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new ValidationError('Limite deve ser um número entre 1 e 100', 'limit');
  }
  
  return { page: pageNum, limit: limitNum };
}

/**
 * Valida um objeto contra um schema simples
 */
export function validateSchema<T>(
  data: any,
  schema: Record<keyof T, (value: any) => boolean>
): T {
  const errors: string[] = [];
  const result: any = {};
  
  for (const [key, validator] of Object.entries(schema)) {
    const value = data[key];
    
    if (!validator(value)) {
      errors.push(`Campo inválido: ${key}`);
    } else {
      result[key] = value;
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError(`Validação falhou: ${errors.join(', ')}`);
  }
  
  return result as T;
}

export default {
  validateEnvironment,
  validateSolanaAddress,
  validateAndNormalizeSolanaAddress,
  validateAmount,
  validateEmail,
  validatePassword,
  sanitizeString,
  validatePagination,
  validateSchema,
  ValidationError
};
