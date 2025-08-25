import mongoose from 'mongoose';

// User schema with complete registration and subscription management
const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Company Information
  company: {
    name: {
      type: String,
      trim: true
    },
    cnpj: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Brasil'
      }
    }
  },

  // User Type and Status
  userType: {
    type: String,
    required: true,
    enum: ['buyer', 'seller', 'freight', 'admin'],
    default: 'buyer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Subscription Plans
  subscriptions: {
    store: {
      plan: {
        type: String,
        enum: ['none', 'basic', 'pro', 'enterprise'],
        default: 'none'
      },
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired', 'cancelled'],
        default: 'inactive'
      },
      startDate: Date,
      endDate: Date,
      maxAds: {
        type: Number,
        default: 0
      },
      currentAds: {
        type: Number,
        default: 0
      }
    },
    freight: {
      plan: {
        type: String,
        enum: ['none', 'basic', 'pro', 'enterprise'],
        default: 'none'
      },
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired', 'cancelled'],
        default: 'inactive'
      },
      startDate: Date,
      endDate: Date,
      maxFreights: {
        type: Number,
        default: 0
      },
      currentFreights: {
        type: Number,
        default: 0
      }
    }
  },

  // Products (for sellers)
  products: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      specifications: {
        type: Map,
        of: String
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'BRL'
      },
      images: [
        {
          type: String,
          trim: true
        }
      ],
      category: {
        type: String,
        required: true,
        trim: true
      },
      isActive: {
        type: Boolean,
        default: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Freight Details (for freight providers)
  freightDetails: {
    vehicleType: {
      type: String,
      enum: ['truck', 'pickup', 'van', 'tractor', 'other']
    },
    capacity: {
      weight: Number, // in kg
      volume: Number, // in m³
      unit: String
    },
    coverage: {
      states: [String],
      cities: [String]
    },
    documents: {
      hasLicense: Boolean,
      hasInsurance: Boolean,
      hasDocumentation: Boolean
    },
    rates: {
      basePrice: Number,
      pricePerKm: Number,
      currency: {
        type: String,
        default: 'BRL'
      }
    }
  },

  // AWS Cognito Integration
  cognitoId: {
    type: String,
    sparse: true
  },

  // Security and Logs
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  securityLogs: [
    {
      action: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      ipAddress: String,
      userAgent: String
    }
  ],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
userSchema.index({ email: 1 });
userSchema.index({ 'company.cnpj': 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'subscriptions.store.status': 1 });
userSchema.index({ 'subscriptions.freight.status': 1 });
userSchema.index({ createdAt: -1 });

// Middleware para atualizar timestamp
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar se usuário tem plano ativo
userSchema.methods.hasActivePlan = function (module) {
  const subscription = this.subscriptions[module];
  if (!subscription) return false;

  return subscription.status === 'active' && subscription.endDate > new Date();
};

// Método para verificar se pode criar mais anúncios
userSchema.methods.canCreateAd = function () {
  if (!this.hasActivePlan('store')) return false;

  const subscription = this.subscriptions.store;
  return subscription.currentAds < subscription.maxAds;
};

// Método para verificar se pode criar mais fretes
userSchema.methods.canCreateFreight = function () {
  if (!this.hasActivePlan('freight')) return false;

  const subscription = this.subscriptions.freight;
  return subscription.currentFreights < subscription.maxFreights;
};

// Método para incrementar contador de anúncios
userSchema.methods.incrementAdCount = function () {
  if (this.subscriptions.store.currentAds < this.subscriptions.store.maxAds) {
    this.subscriptions.store.currentAds += 1;
    return this.save();
  }
  throw new Error('Limite de anúncios atingido');
};

// Método para incrementar contador de fretes
userSchema.methods.incrementFreightCount = function () {
  if (this.subscriptions.freight.currentFreights < this.subscriptions.freight.maxFreights) {
    this.subscriptions.freight.currentFreights += 1;
    return this.save();
  }
  throw new Error('Limite de fretes atingido');
};

// Método para verificar se conta está bloqueada
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Método para incrementar tentativas de login
userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Método para resetar tentativas de login
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Método para adicionar log de segurança
userSchema.methods.addSecurityLog = function (action, ipAddress, userAgent) {
  this.securityLogs.push({
    action,
    ipAddress,
    userAgent
  });

  // Manter apenas os últimos 100 logs
  if (this.securityLogs.length > 100) {
    this.securityLogs = this.securityLogs.slice(-100);
  }

  return this.save();
};

// Create User model
export const User = mongoose.model('User', userSchema);
