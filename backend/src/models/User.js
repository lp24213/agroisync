import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    // Informações básicas
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'E-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'E-mail inválido']
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
      select: false,
      validate: {
        validator(password) {
          // Validação de senha forte
          const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return strongPasswordRegex.test(password);
        },
        message:
          'Senha deve conter pelo menos: 8 caracteres, 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
      }
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]+$/, 'Telefone inválido']
    },

    // Informações de perfil
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Biografia não pode ter mais de 500 caracteres']
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: 'Brasil'
      },
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },

    // Informações de negócio
    businessType: {
      type: String,
      enum: ['producer', 'buyer', 'transporter', 'all'],
      default: 'all'
    },
    businessName: String,
    businessDocument: String, // CPF/CNPJ
    businessLicense: String,

    // Dados PII criptografados
    piiData: {
      // Documentos pessoais
      cpf: {
        type: String,
        default: null
      },
      cnpj: {
        type: String,
        default: null
      },
      rg: {
        type: String,
        default: null
      },
      passport: {
        type: String,
        default: null
      },

      // Informações financeiras
      bankAccount: {
        type: String,
        default: null
      },
      creditCard: {
        type: String,
        default: null
      },

      // Informações fiscais
      taxId: {
        type: String,
        default: null
      },
      businessId: {
        type: String,
        default: null
      },

      // Metadados de criptografia
      encryptionMetadata: {
        algorithm: {
          type: String,
          default: 'aes-256-gcm'
        },
        keyVersion: {
          type: String,
          default: '1.0'
        },
        lastEncrypted: {
          type: Date,
          default: null
        }
      }
    },

    // Configurações de conta
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    verificationCode: String,
    codeExpires: Date,

    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    phoneVerificationCode: String,
    phoneVerificationExpires: Date,

    // 2FA
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String,
    twoFactorBackupCodes: [String],

    // Permissões de administrador
    isAdmin: {
      type: Boolean,
      default: false
    },
    adminPermissions: [
      {
        type: String,
        enum: [
          'users_read',
          'users_write',
          'users_delete',
          'products_read',
          'products_write',
          'products_delete',
          'payments_read',
          'payments_write',
          'payments_refund',
          'registrations_read',
          'registrations_write',
          'registrations_approve',
          'system_settings',
          'system_backup',
          'system_logs',
          'system_maintenance',
          'audit_logs',
          'admin_users',
          'admin_roles',
          '*' // Super admin
        ]
      }
    ],
    adminRole: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator', 'support'],
      default: null
    },
    adminNotes: {
      type: String,
      maxlength: [1000, 'Notas administrativas não podem ter mais de 1000 caracteres']
    },

    // Plano e pagamentos
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    planExpiresAt: Date,
    subscriptionId: String,
    paymentMethod: String,

    // Configurações de privacidade
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      },
      showLocation: {
        type: Boolean,
        default: true
      },
      allowMessages: {
        type: Boolean,
        default: true
      },
      allowNotifications: {
        type: Boolean,
        default: true
      }
    },

    // Configurações de notificação
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },

    // Status da conta
    isActive: {
      type: Boolean,
      default: true
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspensionReason: String,
    suspensionExpiresAt: Date,

    // LGPD e consentimentos
    lgpdConsent: {
      type: Boolean,
      default: false
    },
    lgpdConsentDate: Number,
    dataProcessingConsent: {
      type: Boolean,
      default: false
    },
    marketingConsent: {
      type: Boolean,
      default: false
    },

    // Metadados de segurança
    lastLoginAt: Date,
    lastLoginIp: String,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Estatísticas
    stats: {
      totalProducts: {
        type: Number,
        default: 0
      },
      totalTransactions: {
        type: Number,
        default: 0
      },
      totalRevenue: {
        type: Number,
        default: 0
      },
      reputation: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        default: 0
      }
    },

    // Configurações de idioma
    language: {
      type: String,
      default: 'pt-BR',
      enum: ['pt-BR', 'en-US', 'es-ES', 'zh-CN']
    },
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    },

    // Metadados
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Remover campos sensíveis do JSON
        delete ret.password;
        delete ret.twoFactorSecret;
        delete ret.twoFactorBackupCodes;
        delete ret.passwordResetToken;
        delete ret.emailVerificationToken;
        delete ret.phoneVerificationCode;
        delete ret.piiData;
        delete ret.adminNotes;
        delete ret.metadata;
        return ret;
      }
    }
  }
);

// Índices para performance e segurança
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ plan: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  // Só hash se a senha foi modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash da senha com salt rounds alto para segurança
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordChangedAt = new Date();
    return next();
  } catch (error) {
    return next(error);
  }
});

// Middleware para atualizar timestamp de mudança de senha
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

// Método para verificar senha
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para gerar token JWT
userSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    email: this.email,
    isAdmin: this.isAdmin,
    adminRole: this.adminRole,
    plan: this.plan
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'agroisync',
    audience: 'agroisync-users'
  });
};

// Método para gerar token de verificação de email
userSchema.methods.generateEmailVerificationToken = function () {
  const token = jwt.sign({ userId: this._id, type: 'email_verification' }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });

  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return token;
};

// Método para gerar código de verificação de telefone
userSchema.methods.generatePhoneVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneVerificationCode = code;
  this.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
  return code;
};

// Método para gerar token de reset de senha
userSchema.methods.generatePasswordResetToken = function () {
  const token = jwt.sign({ userId: this._id, type: 'password_reset' }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  return token;
};

// Método para verificar se a conta está bloqueada
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Método para incrementar tentativas de login
userSchema.methods.incLoginAttempts = function () {
  // Se temos tentativas anteriores e não está bloqueado, incrementar
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Bloquear conta após 5 tentativas por 2 horas
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
  }

  return this.updateOne(updates);
};

// Método para resetar tentativas de login
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Método para verificar se mudou senha após o token JWT
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Métodos para criptografia de dados PII
userSchema.methods.encryptPIIData = function (data) {
  const algorithm = 'aes-256-gcm';
  const key = process.env.PII_ENCRYPTION_KEY || 'default-pii-key-change-in-production';

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('pii-data', 'utf8'));

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm,
      keyVersion: '1.0'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro ao criptografar dados PII:', error);
    throw error;
  }
};

userSchema.methods.decryptPIIData = function (encryptedData) {
  const key = process.env.PII_ENCRYPTION_KEY || 'default-pii-key-change-in-production';

  try {
    const decipher = crypto.createDecipher(encryptedData.algorithm, key);
    decipher.setAAD(Buffer.from('pii-data', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro ao descriptografar dados PII:', error);
    throw error;
  }
};

userSchema.methods.setPIIData = function (field, value) {
  if (!this.piiData) {
    this.piiData = {};
  }

  if (value) {
    const encrypted = this.encryptPIIData(value);
    this.piiData[field] = encrypted;
    this.piiData.encryptionMetadata.lastEncrypted = new Date();
  } else {
    this.piiData[field] = null;
  }

  return this;
};

userSchema.methods.getPIIData = function (field) {
  if (!this.piiData || !this.piiData[field]) {
    return null;
  }

  try {
    return this.decryptPIIData(this.piiData[field]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Erro ao descriptografar campo PII ${field}:`, error);
    return null;
  }
};

userSchema.methods.hasPIIData = function (field) {
  return !!(this.piiData && this.piiData[field]);
};

// Método estático para buscar usuário por email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Método estático para buscar usuários ativos
userSchema.statics.findActive = function () {
  return this.find({ isActive: true, isSuspended: false });
};

// Método estático para buscar administradores
userSchema.statics.findAdmins = function () {
  return this.find({ isAdmin: true, isActive: true });
};

// Método para sanitizar dados antes de retornar
userSchema.methods.sanitize = function () {
  const user = this.toObject();
  delete user.password;
  delete user.twoFactorSecret;
  delete user.twoFactorBackupCodes;
  delete user.passwordResetToken;
  delete user.emailVerificationToken;
  delete user.phoneVerificationCode;
  delete user.piiData;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
