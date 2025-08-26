const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  passwordHash: {
    type: String,
    required: [true, 'Senha é obrigatória']
  },
  role: {
    type: String,
    enum: ['comprador', 'anunciante', 'freteiro', 'admin'],
    required: [true, 'Tipo de usuário é obrigatório'],
    default: 'comprador'
  },
  cpfCnpj: {
    type: String,
    required: [true, 'CPF/CNPJ é obrigatório'],
    unique: true,
    trim: true
  },
  ie: {
    type: String,
    trim: true,
    required: function() { return this.role === 'anunciante'; }
  },
  phone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true
  },
  address: {
    cep: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Logradouro é obrigatório'],
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['cpf', 'cnpj', 'rg', 'ie', 'outro'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  cryptoAddress: {
    type: String,
    trim: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidPlan: {
    planId: {
      type: String,
      enum: ['comprador-basic', 'anunciante-premium', 'freteiro-premium', 'admin-full']
    },
    expiresAt: Date,
    amount: Number,
    currency: {
      type: String,
      default: 'BRL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ cpfCnpj: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isPaid: 1 });
userSchema.index({ 'paidPlan.expiresAt': 1 });

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Método para verificar se plano está ativo
userSchema.methods.isPlanActive = function() {
  if (!this.isPaid || !this.paidPlan.expiresAt) return false;
  return new Date() < this.paidPlan.expiresAt;
};

// Método para obter dados públicos
userSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    name: this.name,
    role: this.role,
    city: this.address.city,
    state: this.address.state,
    isPaid: this.isPaid,
    planActive: this.isPlanActive()
  };
};

// Método para obter dados privados (apenas se pago)
userSchema.methods.getPrivateData = function() {
  if (!this.isPaid || !this.isPlanActive()) {
    throw new Error('Acesso negado: usuário não possui plano ativo');
  }
  
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    cpfCnpj: this.cpfCnpj,
    ie: this.ie,
    phone: this.phone,
    address: this.address,
    documents: this.documents,
    cryptoAddress: this.cryptoAddress,
    paidPlan: this.paidPlan,
    lastLogin: this.lastLogin
  };
};

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
