const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Telefone inválido']
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

  // Configurações de conta
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
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

  // Plano e pagamentos
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  },
  planActive: {
    type: Boolean,
    default: true
  },
  planExpiresAt: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String,

  // Permissões
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'super-admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  blockedAt: Date,

  // Preferências
  preferences: {
    language: {
      type: String,
      enum: ['pt', 'en', 'es', 'zh'],
      default: 'pt'
    },
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts'],
        default: 'public'
      },
      showLocation: {
        type: Boolean,
        default: true
      },
      showBusinessInfo: {
        type: Boolean,
        default: true
      }
    }
  },

  // Estatísticas
  stats: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalFreights: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },

  // Carteira cripto
  wallet: {
    address: String,
    balance: {
      type: Number,
      default: 0
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CryptoTransaction'
    }]
  },

  // Última atividade
  lastLoginAt: Date,
  lastActivityAt: {
    type: Date,
    default: Date.now
  },

  // Tokens de reset
  passwordResetToken: String,
  passwordResetExpires: Date,

  // LGPD
  lgpdConsent: {
    type: Boolean,
    default: false
  },
  lgpdConsentDate: Date,
  dataProcessingConsent: {
    type: Boolean,
    default: false
  },
  marketingConsent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ businessDocument: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActivityAt: -1 });

// Virtuals
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin' || this.role === 'super-admin';
});

userSchema.virtual('isPaid').get(function() {
  return this.plan !== 'free' && this.planActive;
});

userSchema.virtual('isVerified').get(function() {
  return this.isEmailVerified && this.isPhoneVerified;
});

// Middleware pre-save
userSchema.pre('save', async function(next) {
  // Hash da senha
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Atualizar lastActivityAt
  if (this.isModified() && !this.isNew) {
    this.lastActivityAt = new Date();
  }

  next();
});

// Métodos de instância
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      isAdmin: this.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

userSchema.methods.generateEmailVerificationToken = function() {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  
  return token;
};

userSchema.methods.generatePasswordResetToken = function() {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = token;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  
  return token;
};

userSchema.methods.generatePhoneVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.phoneVerificationCode = code;
  this.phoneVerificationExpires = Date.now() + 5 * 60 * 1000; // 5 minutos
  
  return code;
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.twoFactorSecret;
  delete user.twoFactorBackupCodes;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.phoneVerificationCode;
  return user;
};

// Métodos estáticos
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true, isBlocked: false });
};

userSchema.statics.findByLocation = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  });
};

module.exports = mongoose.model('User', userSchema);