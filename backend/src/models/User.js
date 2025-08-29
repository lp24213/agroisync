import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Dados básicos
  name: { type: String, required: [true, 'Nome é obrigatório'], trim: true },
  email: { type: String, required: [true, 'Email é obrigatório'], unique: true, lowercase: true, trim: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'] },
  password: { type: String, required: [true, 'Senha é obrigatória'], minlength: [6, 'Senha deve ter pelo menos 6 caracteres'] },
  phone: { type: String, required: [true, 'Telefone é obrigatório'], trim: true },

  // Documentos
  documentType: { type: String, enum: ['CPF', 'CNPJ'], required: [true, 'Tipo de documento é obrigatório'] },
  document: { type: String, required: [true, 'Documento é obrigatório'], unique: true, trim: true },
  ie: { type: String, trim: true, required: function() { return this.documentType === 'CNPJ'; } },

  // Endereço
  cep: { type: String, required: [true, 'CEP é obrigatório'], trim: true },
  address: {
    street: String, number: String, complement: String, neighborhood: String,
    city: String, state: String, country: { type: String, default: 'Brasil' }
  },

  // Perfil e permissões
  userType: { type: String, enum: ['loja', 'agroconecta', 'both'], default: 'loja' },
  userCategory: { type: String, enum: ['anunciante', 'comprador', 'freteiro', 'ambos'], default: 'anunciante' },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // Status de pagamento
  isPaid: { type: Boolean, default: false },
  planActive: { type: String, enum: ['loja-basic', 'loja-pro', 'agroconecta-basic', 'agroconecta-pro', null], default: null },
  planType: { type: String, default: null },
  planExpiry: { type: Date, default: null },
  lastPayment: { type: Date, default: null },
  paymentMethod: { type: String, enum: ['stripe', 'crypto', null], default: null },

  // IDs de serviços externos
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },

  // Metadados
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: [500, 'Bio não pode ter mais de 500 caracteres'] },
  website: { type: String, trim: true },
  socialMedia: { linkedin: String, instagram: String, facebook: String, twitter: String },

  // Configurações
  preferences: {
    language: { type: String, default: 'pt' },
    timezone: { type: String, default: 'America/Sao_Paulo' },
    notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true }, sms: { type: Boolean, default: false } }
  },

  // 2FA e Segurança
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },
  twoFactorBackupCodes: [{ type: String }],
  lastTwoFactorAttempt: { type: Date, default: null },
  failedTwoFactorAttempts: { type: Number, default: 0 },
  twoFactorLockoutUntil: { type: Date, default: null },

  // Recuperação de senha
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  passwordResetAttempts: { type: Number, default: 0 },
  passwordResetLockoutUntil: { type: Date, default: null },

  // Verificação de conta
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },
  phoneVerificationToken: { type: String, default: null },
  phoneVerificationExpires: { type: Date, default: null },

  // Timestamps
  emailVerifiedAt: Date, phoneVerifiedAt: Date, lastLoginAt: Date, cancellationDate: Date, deletedAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ document: 1 });
userSchema.index({ isPaid: 1 });
userSchema.index({ planActive: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ phoneVerificationToken: 1 });

// Virtuals
userSchema.virtual('hasActivePlan').get(function() {
  return this.planActive && this.planExpiry && this.planExpiry > new Date();
});

userSchema.virtual('planExpiresSoon').get(function() {
  if (!this.planExpiry) return false;
  const daysUntilExpiry = Math.ceil((this.planExpiry - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 7;
});

userSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.planExpiry) return null;
  return Math.ceil((this.planExpiry - new Date()) / (1000 * 60 * 60 * 24));
});

userSchema.virtual('isTwoFactorLocked').get(function() {
  return this.twoFactorLockoutUntil && this.twoFactorLockoutUntil > new Date();
});

userSchema.virtual('isPasswordResetLocked').get(function() {
  return this.passwordResetLockoutUntil && this.passwordResetLockoutUntil > new Date();
});

// Middleware para hash da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Métodos
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.canAccessPrivateData = function() {
  return this.isPaid && this.hasActivePlan;
};

userSchema.methods.canUseMessaging = function() {
  return this.isPaid && this.hasActivePlan;
};

userSchema.methods.canAdvertiseProducts = function() {
  return this.isPaid && this.hasActivePlan && (this.userType === 'loja' || this.userType === 'both');
};

userSchema.methods.canAdvertiseFreights = function() {
  return this.isPaid && this.hasActivePlan && (this.userType === 'agroconecta' || this.userType === 'both');
};

userSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    name: this.name,
    userType: this.userType,
    userCategory: this.userCategory,
    city: this.address?.city,
    state: this.address?.state,
    isVerified: this.isVerified,
    isPaid: this.isPaid,
    planActive: this.planActive,
    createdAt: this.createdAt
  };
};

userSchema.methods.getPrivateData = function() {
  if (!this.canAccessPrivateData()) {
    throw new Error('Acesso negado: usuário não possui plano ativo');
  }
  
  return {
    ...this.getPublicData(),
    phone: this.phone,
    email: this.email,
    document: this.document,
    documentType: this.documentType,
    ie: this.ie,
    address: this.address,
    bio: this.bio,
    website: this.website,
    socialMedia: this.socialMedia,
    preferences: this.preferences
  };
};

userSchema.methods.updatePlan = function(planData) {
  this.planActive = planData.planId;
  this.planType = planData.planType;
  this.planExpiry = planData.expiryDate;
  this.lastPayment = new Date();
  this.isPaid = true;
  return this.save();
};

userSchema.methods.cancelPlan = function() {
  this.planActive = null;
  this.planType = null;
  this.planExpiry = null;
  this.isPaid = false;
  this.cancellationDate = new Date();
  return this.save();
};

// Métodos de 2FA
userSchema.methods.generateTwoFactorSecret = function() {
  const crypto = require('crypto');
  this.twoFactorSecret = crypto.randomBytes(20).toString('hex');
  this.twoFactorBackupCodes = Array.from({ length: 10 }, () => 
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
  return this.save();
};

userSchema.methods.verifyTwoFactorCode = function(code) {
  if (this.isTwoFactorLocked) {
    throw new Error('Conta temporariamente bloqueada devido a tentativas falhadas');
  }
  
  // Verificar se é um código de backup
  if (this.twoFactorBackupCodes.includes(code)) {
    // Remover código usado
    this.twoFactorBackupCodes = this.twoFactorBackupCodes.filter(c => c !== code);
    this.failedTwoFactorAttempts = 0;
    this.lastTwoFactorAttempt = new Date();
    return this.save().then(() => true);
  }
  
  // Verificar código TOTP (implementar se necessário)
  // Por enquanto, aceitar qualquer código de 6 dígitos para demonstração
  if (/^\d{6}$/.test(code)) {
    this.failedTwoFactorAttempts = 0;
    this.lastTwoFactorAttempt = new Date();
    return this.save().then(() => true);
  }
  
  // Código inválido
  this.failedTwoFactorAttempts += 1;
  this.lastTwoFactorAttempt = new Date();
  
  // Bloquear após 5 tentativas falhadas
  if (this.failedTwoFactorAttempts >= 5) {
    this.twoFactorLockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
  }
  
  return this.save().then(() => false);
};

// Métodos de recuperação de senha
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  this.passwordResetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
  return this.save();
};

userSchema.methods.clearPasswordResetToken = function() {
  this.passwordResetToken = null;
  this.passwordResetExpires = null;
  return this.save();
};

userSchema.methods.isPasswordResetTokenValid = function() {
  return this.passwordResetToken && this.passwordResetExpires > new Date();
};

// Métodos de verificação
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  return this.save();
};

userSchema.methods.generatePhoneVerificationToken = function() {
  const crypto = require('crypto');
  this.phoneVerificationToken = crypto.randomBytes(4).toString('hex').toUpperCase();
  this.phoneVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
