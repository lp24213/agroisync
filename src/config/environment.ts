/**
 * Environment Configuration
 * Configuração de variáveis de ambiente para AGROTM
 */

import { logger } from '../utils/logger';

export interface Config {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  
  // Solana Configuration
  SOLANA_NETWORK: 'devnet' | 'testnet' | 'mainnet-beta';
  SOLANA_RPC_URL: string;
  PROGRAM_ID: string;
  
  // Database
  DATABASE_URL?: string;
  REDIS_URL?: string;
  
  // API Keys
  COINGECKO_API_KEY?: string;
  CHAINLINK_API_KEY?: string;
  
  // Security
  JWT_SECRET: string;
  CORS_ORIGIN: string[];
  
  // Firebase
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_PRIVATE_KEY?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  
  // Monitoring
  SENTRY_DSN?: string;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value;
}

function getEnvVarOptional(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Variável de ambiente ${key} deve ser um número válido`);
  }
  return parsed;
}

function getEnvVarArray(key: string, defaultValue: string[] = []): string[] {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

// Configuração baseada no ambiente
export const config: Config = {
  NODE_ENV: (process.env.NODE_ENV as Config['NODE_ENV']) || 'development',
  PORT: getEnvVarNumber('PORT', 3000),
  
  // Solana
  SOLANA_NETWORK: (process.env.SOLANA_NETWORK as Config['SOLANA_NETWORK']) || 'devnet',
  SOLANA_RPC_URL: getEnvVar('SOLANA_RPC_URL', 'https://api.devnet.solana.com'),
  PROGRAM_ID: getEnvVar('PROGRAM_ID', '11111111111111111111111111111111'),
  
  // Database
  DATABASE_URL: getEnvVarOptional('DATABASE_URL'),
  REDIS_URL: getEnvVarOptional('REDIS_URL'),
  
  // API Keys
  COINGECKO_API_KEY: getEnvVarOptional('COINGECKO_API_KEY'),
  CHAINLINK_API_KEY: getEnvVarOptional('CHAINLINK_API_KEY'),
  
  // Security
  JWT_SECRET: getEnvVar('JWT_SECRET', 'dev-secret-key-change-in-production'),
  CORS_ORIGIN: getEnvVarArray('CORS_ORIGIN', ['http://localhost:3000']),
  
  // Firebase
  FIREBASE_PROJECT_ID: getEnvVarOptional('FIREBASE_PROJECT_ID'),
  FIREBASE_PRIVATE_KEY: getEnvVarOptional('FIREBASE_PRIVATE_KEY'),
  FIREBASE_CLIENT_EMAIL: getEnvVarOptional('FIREBASE_CLIENT_EMAIL'),
  
  // Monitoring
  SENTRY_DSN: getEnvVarOptional('SENTRY_DSN'),
  LOG_LEVEL: (process.env.LOG_LEVEL as Config['LOG_LEVEL']) || 'info'
};

// Validação de configuração específica por ambiente
if (config.NODE_ENV === 'production') {
  if (config.JWT_SECRET === 'dev-secret-key-change-in-production') {
    throw new Error('JWT_SECRET deve ser definido em produção');
  }
  
  if (config.SOLANA_NETWORK === 'devnet') {
    logger.warn('⚠️  Usando devnet em produção - verifique se isso é intencional');
  }
}

// Log da configuração (sem dados sensíveis)
logger.info('📋 Configuração carregada:', {
  NODE_ENV: config.NODE_ENV,
  PORT: config.PORT,
  SOLANA_NETWORK: config.SOLANA_NETWORK,
  LOG_LEVEL: config.LOG_LEVEL
});

export default config;
