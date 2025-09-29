// Sistema de Validação de Configuração - AGROISYNC
// Validação rigorosa de todas as configurações críticas

import crypto from 'crypto';

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

  // Validar todas as configurações
  validateAll() {
    const errors = [];
    const warnings = [];

    // Validar configurações críticas
    this.criticalConfigs.forEach(config => {
      const value = process.env[config];
      if (!value || this.isDefaultValue(value)) {
        errors.push(`❌ ${config} não configurado ou usando valor padrão`);
      } else if (!this.isValidValue(config, value)) {
        errors.push(`❌ ${config} tem formato inválido`);
      }
    });

    // Validar configurações de aviso
    this.warningConfigs.forEach(config => {
      const value = process.env[config];
      if (!value || this.isDefaultValue(value)) {
        warnings.push(`⚠️ ${config} não configurado - funcionalidade pode não funcionar`);
      }
    });

    // Validar configurações específicas
    this.validateJWTSecret();
    this.validateMongoURI();
    this.validateStripeKeys();
    this.validateEmailConfig();
    this.validateSecurityConfig();

    return { errors, warnings };
  }

  // Verificar se é valor padrão
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

  // Validar valor específico
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
      throw new Error(
        '❌ JWT_SECRET é obrigatório e deve ser uma string segura de pelo menos 32 caracteres'
      );
    }

    if (secret.length < 32) {
      throw new Error('❌ JWT_SECRET deve ter pelo menos 32 caracteres para segurança');
    }

    // Verificar se não é uma string comum
    const commonSecrets = [
      'secret',
      'password',
      '123456',
      'admin',
      'test',
      'your-super-secret-jwt-key-change-in-production'
    ];

    if (commonSecrets.includes(secret.toLowerCase())) {
      throw new Error('❌ JWT_SECRET não pode ser uma string comum ou padrão');
    }
  }

  // Validar MongoDB URI
  validateMongoURI() {
    const uri = process.env.MONGODB_URI;
    if (!uri || this.isDefaultValue(uri)) {
      throw new Error('❌ MONGODB_URI é obrigatório');
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      throw new Error('❌ MONGODB_URI deve começar com mongodb:// ou mongodb+srv://');
    }

    // Verificar se não é localhost em produção
    if (process.env.NODE_ENV === 'production' && uri.includes('localhost')) {
      throw new Error('❌ MONGODB_URI não pode usar localhost em produção');
    }
  }

  // Validar chaves Stripe
  validateStripeKeys() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || this.isDefaultValue(secretKey)) {
      throw new Error('❌ STRIPE_SECRET_KEY é obrigatório');
    }

    if (!webhookSecret || this.isDefaultValue(webhookSecret)) {
      throw new Error('❌ STRIPE_WEBHOOK_SECRET é obrigatório');
    }

    // Verificar se as chaves são válidas
    if (!secretKey.startsWith('sk_')) {
      throw new Error('❌ STRIPE_SECRET_KEY deve começar com sk_');
    }

    if (!webhookSecret.startsWith('whsec_')) {
      throw new Error('❌ STRIPE_WEBHOOK_SECRET deve começar com whsec_');
    }
  }

  // Validar configuração de email
  validateEmailConfig() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || this.isDefaultValue(smtpUser)) {
      throw new Error('❌ SMTP_USER é obrigatório');
    }

    if (!smtpPass || this.isDefaultValue(smtpPass)) {
      throw new Error('❌ SMTP_PASS é obrigatório');
    }

    // Validar formato do email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser)) {
      throw new Error('❌ SMTP_USER deve ser um email válido');
    }
  }

  // Validar configurações de segurança
  validateSecurityConfig() {
    // Verificar se está em produção
    if (process.env.NODE_ENV === 'production') {
      // Verificar HTTPS
      if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
        console.warn('⚠️ FRONTEND_URL deve usar HTTPS em produção');
      }

      // Verificar CORS
      if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN === '*') {
        throw new Error('❌ CORS_ORIGIN não pode ser * em produção');
      }

      // Verificar se não está usando localhost
      if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('localhost')) {
        throw new Error('❌ FRONTEND_URL não pode usar localhost em produção');
      }
    }
  }

  // Gerar configurações seguras
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
    const fs = require('fs');
    const path = require('path');

    const envPath = path.join(process.cwd(), '.env');

    if (!fs.existsSync(envPath)) {
      console.warn('⚠️ Arquivo .env não encontrado');
      return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    const issues = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Verificar se há comentários desnecessários
      if (line.includes('# TODO') || line.includes('# FIXME')) {
        issues.push(`Linha ${lineNum}: Comentário TODO/FIXME encontrado`);
      }

      // Verificar se há valores vazios
      if (line.includes('=') && line.split('=')[1].trim() === '') {
        issues.push(`Linha ${lineNum}: Valor vazio encontrado`);
      }

      // Verificar se há espaços em branco desnecessários
      if (line.trim() !== line && line.trim() !== '') {
        issues.push(`Linha ${lineNum}: Espaços em branco desnecessários`);
      }
    });

    return issues;
  }

  // Criar arquivo .env seguro
  createSecureEnvFile() {
    const secureConfig = this.generateSecureConfig();

    const envContent = `# Configurações Seguras - AgroSync
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

# Segurança
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

// Instância única
const configValidator = new ConfigurationValidator();

export default configValidator;
