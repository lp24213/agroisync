const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema para cadastros de AgroConecta
const agroConectaSchema = new mongoose.Schema({
  // Dados básicos
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Dados da empresa
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ie: {
    type: String,
    trim: true
  },

  // Endereço
  address: {
    cep: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Dados do veículo
  vehicle: {
    plate: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['truck', 'tractor', 'van', 'pickup']
    },
    capacity: {
      type: Number,
      required: true,
      min: 0
    },
    license: {
      type: String,
      required: true,
      enum: ['B', 'C', 'D', 'E']
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    model: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    }
  },

  // Serviços oferecidos
  services: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: 'km',
      trim: true
    },
    isCustom: {
      type: Boolean,
      default: false
    }
  }],

  // Plano e configurações
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Dados de pagamento
  payment: {
    stripeCustomerId: {
      type: String,
      trim: true
    },
    subscriptionId: {
      type: String,
      trim: true
    },
    lastPayment: {
      type: Date
    },
    nextPayment: {
      type: Date
    }
  },

  // Estatísticas
  stats: {
    totalJobs: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },

  // Metadados
  autoFilled: {
    cpf: {
      type: Boolean,
      default: false
    },
    cnpj: {
      type: Boolean,
      default: false
    },
    address: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Schema para cadastros de Loja
const lojaSchema = new mongoose.Schema({
  // Dados básicos
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Dados da empresa
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ie: {
    type: String,
    trim: true
  },

  // Endereço
  address: {
    cep: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Produtos
  products: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],

  // Plano e configurações
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Dados de pagamento
  payment: {
    stripeCustomerId: {
      type: String,
      trim: true
    },
    subscriptionId: {
      type: String,
      trim: true
    },
    lastPayment: {
      type: Date
    },
    nextPayment: {
      type: Date
    }
  },

  // Estatísticas
  stats: {
    totalSales: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },

  // Metadados
  autoFilled: {
    cpf: {
      type: Boolean,
      default: false
    },
    cnpj: {
      type: Boolean,
      default: false
    },
    address: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Schema para cadastros de Marketplace
const marketplaceSchema = new mongoose.Schema({
  // Dados básicos
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Dados da empresa
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ie: {
    type: String,
    trim: true
  },

  // Endereço
  address: {
    cep: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Produtos/Serviços
  offerings: [{
    type: {
      type: String,
      required: true,
      enum: ['product', 'service']
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],

  // Plano e configurações
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Dados de pagamento
  payment: {
    stripeCustomerId: {
      type: String,
      trim: true
    },
    subscriptionId: {
      type: String,
      trim: true
    },
    lastPayment: {
      type: Date
    },
    nextPayment: {
      type: Date
    }
  },

  // Estatísticas
  stats: {
    totalTransactions: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },

  // Metadados
  autoFilled: {
    cpf: {
      type: Boolean,
      default: false
    },
    cnpj: {
      type: Boolean,
      default: false
    },
    address: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Schema para cadastros de Fazenda
const fazendaSchema = new mongoose.Schema({
  // Dados básicos
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Dados da fazenda
  farmName: {
    type: String,
    required: true,
    trim: true
  },
  farmSize: {
    type: Number,
    required: true,
    min: 0
  },
  farmType: {
    type: String,
    enum: ['agriculture', 'livestock', 'mixed'],
    default: 'agriculture'
  },

  // Endereço
  address: {
    cep: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Produtos da fazenda
  products: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    harvestDate: {
      type: Date
    },
    image: {
      type: String,
      trim: true
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],

  // Plano e configurações
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Dados de pagamento
  payment: {
    stripeCustomerId: {
      type: String,
      trim: true
    },
    subscriptionId: {
      type: String,
      trim: true
    },
    lastPayment: {
      type: Date
    },
    nextPayment: {
      type: Date
    }
  },

  // Estatísticas
  stats: {
    totalHarvests: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },

  // Metadados
  autoFilled: {
    cpf: {
      type: Boolean,
      default: false
    },
    address: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para validação de dados
agroConectaSchema.pre('save', function(next) {
  // Validar CPF
  if (this.cpf && !this.isValidCPF(this.cpf)) {
    return next(new Error('CPF inválido'));
  }
  
  // Validar CNPJ
  if (this.cnpj && !this.isValidCNPJ(this.cnpj)) {
    return next(new Error('CNPJ inválido'));
  }
  
  next();
});

lojaSchema.pre('save', function(next) {
  if (this.cpf && !this.isValidCPF(this.cpf)) {
    return next(new Error('CPF inválido'));
  }
  
  if (this.cnpj && !this.isValidCNPJ(this.cnpj)) {
    return next(new Error('CNPJ inválido'));
  }
  
  next();
});

marketplaceSchema.pre('save', function(next) {
  if (this.cpf && !this.isValidCPF(this.cpf)) {
    return next(new Error('CPF inválido'));
  }
  
  if (this.cnpj && !this.isValidCNPJ(this.cnpj)) {
    return next(new Error('CNPJ inválido'));
  }
  
  next();
});

fazendaSchema.pre('save', function(next) {
  if (this.cpf && !this.isValidCPF(this.cpf)) {
    return next(new Error('CPF inválido'));
  }
  
  next();
});

// Métodos de validação
agroConectaSchema.methods.isValidCPF = function(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

agroConectaSchema.methods.isValidCNPJ = function(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }
  
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return digit2 === parseInt(cnpj.charAt(13));
};

// Aplicar os mesmos métodos para os outros schemas
lojaSchema.methods.isValidCPF = agroConectaSchema.methods.isValidCPF;
lojaSchema.methods.isValidCNPJ = agroConectaSchema.methods.isValidCNPJ;
marketplaceSchema.methods.isValidCPF = agroConectaSchema.methods.isValidCPF;
marketplaceSchema.methods.isValidCNPJ = agroConectaSchema.methods.isValidCNPJ;
fazendaSchema.methods.isValidCPF = agroConectaSchema.methods.isValidCPF;

// Índices para otimização
agroConectaSchema.index({ email: 1 });
agroConectaSchema.index({ cpf: 1 });
agroConectaSchema.index({ cnpj: 1 });
agroConectaSchema.index({ 'address.city': 1, 'address.state': 1 });
agroConectaSchema.index({ 'vehicle.type': 1 });
agroConectaSchema.index({ plan: 1, isPublic: 1 });

lojaSchema.index({ email: 1 });
lojaSchema.index({ cpf: 1 });
lojaSchema.index({ cnpj: 1 });
lojaSchema.index({ 'address.city': 1, 'address.state': 1 });
lojaSchema.index({ plan: 1, isPublic: 1 });

marketplaceSchema.index({ email: 1 });
marketplaceSchema.index({ cpf: 1 });
marketplaceSchema.index({ cnpj: 1 });
marketplaceSchema.index({ 'address.city': 1, 'address.state': 1 });
marketplaceSchema.index({ plan: 1, isPublic: 1 });

fazendaSchema.index({ email: 1 });
fazendaSchema.index({ cpf: 1 });
fazendaSchema.index({ 'address.city': 1, 'address.state': 1 });
fazendaSchema.index({ plan: 1, isPublic: 1 });

const AgroConecta = mongoose.model('AgroConecta', agroConectaSchema);
const Loja = mongoose.model('Loja', lojaSchema);
const Marketplace = mongoose.model('Marketplace', marketplaceSchema);
const Fazenda = mongoose.model('Fazenda', fazendaSchema);

module.exports = {
  AgroConecta,
  Loja,
  Marketplace,
  Fazenda
};
