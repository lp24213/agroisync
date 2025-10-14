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
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
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

  // Validar todas as configuraÃ§Ãµes
  validateAll() {
    const errors = [];
    const warnings = [];

    // Validar configuraÃ§Ãµes crÃ­ticas
    this.criticalConfigs.forEach(config => {
      const value = process.env[config];
      if (!value || this.isDefaultValue(value)) {
        errors.push(`âŒ ${config} nÃ£o configurado ou usando valor padrÃ£o`);
      } else if (!this.isValidValue(config, value)) {
        errors.push(`âŒ ${config} tem formato invÃ¡lido`);
      }
    });

    // Validar configuraÃ§Ãµes de aviso
    this.warningConfigs.forEach(config => {
      const value = process.env[config];
      if (!value || this.isDefaultValue(value)) {
        warnings.push(`âš ï¸ ${config} nÃ£o configurado - funcionalidade pode nÃ£o funcionar`);
      }
    });

    // Validar configuraÃ§Ãµes especÃ­ficas
    this.validateJWTSecret();
    this.validateMongoURI();
    this.validateStripeKeys();
    this.validateEmailConfig();
    this.validateSecurityConfig();

    return { errors, warnings };
  }

  // Verificar se Ã© valor padrÃ£o
  isDefaultValue(value) {
    const defaultValues = [
      'your-super-secret-jwt-key-change-in-production',
      'mongodb://localhost:27017/agrosync',
      'sk_test_DEFAULT_KEY_NOT_SET',
      'pk_test_DEFAULT_KEY_NOT_SET',
      'whsec_DEFAULT_WEBHOOK_SECRET_NOT_SET',
      'noreply@agrosync.com',
      'your-email@gmail.com',
      'your-app-password'
    ];

    return defaultValues.includes(value);
  }

  // Validar valor especÃ­fico
  isValidValue(config, value) {
    switch (config) {
      case 'JWT_SECRET':
        return value.length >= 32 && !this.isDefaultValue(value);

      case 'MONGODB_URI':
        return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');

      case 'STRIPE_SECRET_KEY':
        return value.startsWith('sk_') && !this.isDefaultValue(value);

      case 'STRIPE_WEBHOOK_SECRET':
        return value.startsWith('whsec_') && !this.isDefaultValue(value);

      case 'SMTP_USER':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      default:
        return true;
    }
  }

  // Validar JWT Secret
  validateJWTSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || this.isDefaultValue(secret)) {
      const msg = 'âŒ JWT_SECRET nÃ£o configurado ou usa valor padrÃ£o';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (secret.length < 32) {
      const msg = 'âŒ JWT_SECRET deve ter pelo menos 32 caracteres para seguranÃ§a';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    // Verificar se nÃ£o Ã© uma string comum
    const commonSecrets = [
      'secret',
      'password',
      '123456',
      'admin',
      'test',
      'your-super-secret-jwt-key-change-in-production'
    ];

    if (commonSecrets.includes(secret.toLowerCase())) {
      const msg = 'âŒ JWT_SECRET nÃ£o pode ser uma string comum ou padrÃ£o';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
  }

  // Validar MongoDB URI
  validateMongoURI() {
    const uri = process.env.MONGODB_URI;
    if (!uri || this.isDefaultValue(uri)) {
      const msg = 'âŒ MONGODB_URI nÃ£o configurado';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      const msg = 'âŒ MONGODB_URI deve comeÃ§ar com mongodb:// ou mongodb+srv://';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    // Verificar se nÃ£o Ã© localhost em produÃ§Ã£o
    if (process.env.NODE_ENV === 'production' && uri.includes('localhost')) {
      const msg = 'âŒ MONGODB_URI nÃ£o pode usar localhost em produÃ§Ã£o';
      throw new Error(msg);
    }
  }

  // Validar chaves Stripe
  validateStripeKeys() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secretKey || this.isDefaultValue(secretKey)) {
      const msg = 'âŒ STRIPE_SECRET_KEY nÃ£o configurado';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!webhookSecret || this.isDefaultValue(webhookSecret)) {
      const msg = 'âŒ STRIPE_WEBHOOK_SECRET nÃ£o configurado';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    // Verificar se as chaves sÃ£o vÃ¡lidas
    if (!secretKey.startsWith('sk_')) {
      const msg = 'âŒ STRIPE_SECRET_KEY deve comeÃ§ar com sk_';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!webhookSecret.startsWith('whsec_')) {
      const msg = 'âŒ STRIPE_WEBHOOK_SECRET deve comeÃ§ar com whsec_';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
  }

  // Validar configuraÃ§Ã£o de email
  validateEmailConfig() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || this.isDefaultValue(smtpUser)) {
      const msg = 'âŒ SMTP_USER nÃ£o configurado';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    if (!smtpPass || this.isDefaultValue(smtpPass)) {
      const msg = 'âŒ SMTP_PASS nÃ£o configurado';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }

    // Validar formato do email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser)) {
      const msg = 'âŒ SMTP_USER deve ser um email vÃ¡lido';
      if (process.env.NODE_ENV === 'production') {
        throw new Error(msg);
      }
      logger.warn(msg);
      return false;
    }
  }

  // Validar configuraÃ§Ãµes de seguranÃ§a
  validateSecurityConfig() {
    // Verificar se estÃ¡ em produÃ§Ã£o
    if (process.env.NODE_ENV === 'production') {
      // Verificar HTTPS
      if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
        logger.warn('âš ï¸ FRONTEND_URL deve usar HTTPS em produÃ§Ã£o');
      }

      // Verificar CORS
      if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN === '*') {
        throw new Error('âŒ CORS_ORIGIN nÃ£o pode ser * em produÃ§Ã£o');
      }

      // Verificar se nÃ£o estÃ¡ usando localhost
      if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('localhost')) {
        throw new Error('âŒ FRONTEND_URL nÃ£o pode usar localhost em produÃ§Ã£o');
      }
    } else {
      // Em desenvolvimento, apenas avisar
      if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('localhost')) {
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
