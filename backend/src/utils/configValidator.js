// Sistema de ValidaÃ§Ã£o de ConfiguraÃ§Ã£o - AGROISYNC
// ValidaÃ§Ã£o rigorosa de todas as configuraÃ§Ãµes crÃ­ticas

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

class ConfigurationValidator {
  constructor() {
    this.criticalConfigs = [
      'JWT_SECRET',
      'MONGODB_URI',
      // Stripe keys são opcionais a menos que ENABLED
      // 'STRIPE_SECRET_KEY',
      // 'STRIPE_WEBHOOK_SECRET',
      'SMTP_USER',
      'SMTP_PASS'
    ];
    this.warningConfigs = [
      'REDIS_URL',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'CLOUDINARY_CLOUD_NAME',
      'AWS_ACCESS_KEY_ID'
    ];
  }
  validateStripeKeys(env) {
    // Só validar se Stripe estiver explicitamente habilitado
    const stripeEnabled = (env.STRIPE_ENABLED || 'false').toLowerCase() === 'true';
    if (!stripeEnabled) return true;

    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      const msg = '✒ STRIPE_WEBHOOK_SECRET não configurado mas STRIPE_ENABLED=true';
      if (env.NODE_ENV === 'production') throw new Error(msg);
      logger.warn(msg);
      return false;
    }

    if (!webhookSecret.startsWith('whsec_')) {
      const msg = '✒ STRIPE_WEBHOOK_SECRET deve começar com whsec_';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
    return true;
  }

  validateEmailConfig(env) {
    const smtpUser = env.SMTP_USER;
    const smtpPass = env.SMTP_PASS;
    if (!smtpUser || this.isDefaultValue(smtpUser)) {
      const msg = '✒ SMTP_USER não configurado';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!smtpPass || this.isDefaultValue(smtpPass)) {
      const msg = '✒ SMTP_PASS não configurado';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    // Validar formato do email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser)) {
      const msg = '✒ SMTP_USER deve ser um email válido';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
  }

  isValidValue(config, value) {
    if (config === 'STRIPE_WEBHOOK_SECRET') {
      return value.startsWith('whsec_') && !this.isDefaultValue(value);
    }
    if (config === 'SMTP_USER') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return true;
  }

  validateJWTSecret(env) {
    const secret = env.JWT_SECRET;
    if (!secret || this.isDefaultValue(secret)) {
      const msg = '✒ JWT_SECRET não configurado ou usa valor padrão';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (secret.length < 32) {
      const msg = '✒ JWT_SECRET deve ter pelo menos 32 caracteres para segurança';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
    return true;
  }

  validateSecurityConfig(env) {
    // Verificar se está em produção
    if (env.NODE_ENV === 'production') {
      // Verificar HTTPS
      if (env.FRONTEND_URL && !env.FRONTEND_URL.startsWith('https://')) {
        logger.warn('⚠️ FRONTEND_URL deve usar HTTPS em produção');
      }

      // Verificar CORS
      if (env.CORS_ORIGIN && env.CORS_ORIGIN === '*') {
        throw new Error('✒ CORS_ORIGIN não pode ser * em produção');
      }

      // Verificar se não está usando localhost
      if (env.FRONTEND_URL && env.FRONTEND_URL.includes('localhost')) {
        throw new Error('✒ FRONTEND_URL não pode usar localhost em produção');
      }
    } else {
      // Em desenvolvimento, apenas avisar
      if (env.FRONTEND_URL && env.FRONTEND_URL.includes('localhost')) {
        logger.warn('FRONTEND_URL usa localhost (apenas para desenvolvimento)');
      }
    }
  }

    // ...existing code...

  // Validar MongoDB URI
  validateMongoURI(env) {
    const uri = env.MONGODB_URI;
    if (!uri || this.isDefaultValue(uri)) {
      const msg = '✒ MONGODB_URI não configurado';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      const msg = '✒ MONGODB_URI deve começar com mongodb:// ou mongodb+srv://';
      if (env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (env.NODE_ENV === 'production' && uri.includes('localhost')) {
      const msg = '✒ MONGODB_URI não pode usar localhost em produção';
      throw new Error(msg);
    }
  }

  // Validar chaves Stripe
  validateAll(env = {}) {
    const errors = [];
    const warnings = [];

    // Validar configurações críticas
    this.criticalConfigs.forEach(config => {
      const value = env[config];
      if (!value || this.isDefaultValue(value)) {
        errors.push(`✒ ${config} não configurado ou usando valor padrão`);
      } else if (!this.isValidValue(config, value)) {
        errors.push(`✒ ${config} tem formato inválido`);
      }
    });

    // Validar configurações de aviso
    this.warningConfigs.forEach(config => {
      const value = env[config];
      if (!value || this.isDefaultValue(value)) {
        warnings.push(`⚠️ ${config} não configurado - funcionalidade pode não funcionar`);
      }
    });

  // Validar configurações específicas
  this.validateJWTSecret(env);
  this.validateMongoURI(env);
  this.validateEmailConfig(env);
  this.validateSecurityConfig(env);

  // Validar Stripe apenas se habilitado
  this.validateStripeKeys(env);

    return { errors, warnings };
  }

  // Validar configuraÃ§Ãµes de seguranÃ§a
  validateSecurityConfig() {
    // Verificar se estÃ¡ em produÃ§Ã£o
    if (env.NODE_ENV === 'production') {
      // Verificar HTTPS
      if (env.FRONTEND_URL && !env.FRONTEND_URL.startsWith('https://')) {
        logger.warn('⚠️ FRONTEND_URL deve usar HTTPS em produção');
      }

      // Verificar CORS
      if (env.CORS_ORIGIN && env.CORS_ORIGIN === '*') {
        throw new Error('✒ CORS_ORIGIN não pode ser * em produção');
      }

      // Verificar se não está usando localhost
      if (env.FRONTEND_URL && env.FRONTEND_URL.includes('localhost')) {
        throw new Error('✒ FRONTEND_URL não pode usar localhost em produção');
      }
    } else {
      // Em desenvolvimento, apenas avisar
      if (env.FRONTEND_URL && env.FRONTEND_URL.includes('localhost')) {
        logger.warn('FRONTEND_URL usa localhost (apenas para desenvolvimento)');
      }
    }
  }

  // Gerar configuraÃ§Ãµes seguras
  generateSecureConfig() {
    return {
      JWT_SECRET: crypto.randomBytes(64).toString('hex'),
      SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
      ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
      API_KEY: crypto.randomBytes(32).toString('hex')
    };
  }

  // Validar arquivo .env
  validateEnvFile() {
    const envPath = path.join(process.cwd(), '.env');

    if (!fs.existsSync(envPath)) {
      if (process.env.NODE_ENV !== 'production') {
        logger.warn('âš ï¸ Arquivo .env nÃ£o encontrado');
      }
      return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    const issues = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Verificar se hÃ¡ comentÃ¡rios desnecessÃ¡rios
      if (line.includes('# TODO') || line.includes('# FIXME')) {
        issues.push(`Linha ${lineNum}: ComentÃ¡rio TODO/FIXME encontrado`);
      }

      // Verificar se hÃ¡ valores vazios
      if (line.includes('=') && line.split('=')[1].trim() === '') {
        issues.push(`Linha ${lineNum}: Valor vazio encontrado`);
      }

      // Verificar se hÃ¡ espaÃ§os em branco desnecessÃ¡rios
      if (line.trim() !== line && line.trim() !== '') {
        issues.push(`Linha ${lineNum}: EspaÃ§os em branco desnecessÃ¡rios`);
      }
    });

    return issues;
  }

  // Criar arquivo .env seguro
  createSecureEnvFile() {
    const secureConfig = this.generateSecureConfig();

    const envContent = `# ConfiguraÃ§Ãµes Seguras - AgroSync
# Gerado automaticamente em ${new Date().toISOString()}

# Servidor
NODE_ENV=production
PORT=5000
API_URL=https://api.agroisync.com
FRONTEND_URL=https://agroisync.com

# Banco de Dados
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agroisync

# JWT
JWT_SECRET=${secureConfig.JWT_SECRET}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${secureConfig.SESSION_SECRET}
JWT_REFRESH_EXPIRE=30d

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@agroisync.com
FROM_NAME=AgroSync

# SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=agroisync-storage

# SeguranÃ§a
BCRYPT_ROUNDS=12
SESSION_SECRET=${secureConfig.SESSION_SECRET}
CORS_ORIGIN=https://agroisync.com
ENCRYPTION_KEY=${secureConfig.ENCRYPTION_KEY}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Feature Flags
ENABLE_2FA=true
ENABLE_CRYPTO=true
ENABLE_STRIPE=true
ENABLE_EMAIL_VERIFICATION=true
`;

    return envContent;
  }
}

// InstÃ¢ncia Ãºnica
const configValidator = new ConfigurationValidator();

export default configValidator;
