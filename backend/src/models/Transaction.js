import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Identificação da transação
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // Tipo de transação (PRODUCT, FREIGHT, SERVICE)
  type: {
    type: String,
    required: true,
    enum: ['PRODUCT', 'FREIGHT', 'SERVICE'],
    index: true
  },

  // Status da transação
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'NEGOTIATING', 'AGREED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING',
    index: true
  },

  // IDs dos usuários envolvidos
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Item relacionado (produto, frete, serviço)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel',
    required: true
  },

  // Modelo do item (Product, Freight, etc.)
  itemModel: {
    type: String,
    required: true,
    enum: ['Product', 'Freight', 'Service']
  },

  // Detalhes do item
  itemDetails: {
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    unit: String,
    category: String,
    location: String
  },

  // Valores da transação
  total: {
    type: Number,
    required: true,
    min: 0
  },

  // Frete (se aplicável)
  shipping: {
    cost: {
      type: Number,
      default: 0
    },
    method: String,
    estimatedDays: Number,
    trackingCode: String
  },

  // Métodos de pagamento aceitos
  paymentMethods: [{
    type: String,
    enum: ['PIX', 'Boleto', 'Cartão de Crédito', 'Cartão de Débito', 'Transferência', 'Dinheiro']
  }],

  // Opções de entrega
  deliveryOptions: [{
    type: String,
    enum: ['Retirada no local', 'Entrega local', 'Frete para todo Brasil', 'Frete internacional']
  }],

  // Notas e observações
  notes: {
    buyer: String,
    seller: String,
    admin: String
  },

  // Histórico de status
  statusHistory: [{
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'NEGOTIATING', 'AGREED', 'CANCELLED', 'COMPLETED']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Configurações de prazo
  negotiationDeadline: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  },

  // Metadados
  metadata: {
    source: {
      type: String,
      enum: ['marketplace', 'agroconecta', 'direct', 'admin'],
      default: 'marketplace'
    },
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  },

  // Auditoria
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Usuário que criou a transação
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Usuário que fez a última atualização
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
transactionSchema.index({ buyerId: 1, status: 1, createdAt: -1 });
transactionSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1, createdAt: -1 });
transactionSchema.index({ itemId: 1, itemModel: 1 });
transactionSchema.index({ negotiationDeadline: 1, status: 1 });

// Middleware para atualizar updatedAt
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para adicionar ao histórico de status
transactionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      notes: this.notes?.admin || this.notes?.buyer || this.notes?.seller || '',
      updatedBy: this.updatedBy || this.createdBy
    });
  }
  next();
});

// Virtual para verificar se a transação expirou
transactionSchema.virtual('isExpired').get(function() {
  return this.status === 'PENDING' && new Date() > this.negotiationDeadline;
});

// Virtual para calcular dias restantes
transactionSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'PENDING') return 0;
  const remaining = this.negotiationDeadline - new Date();
  return Math.ceil(remaining / (1000 * 60 * 60 * 24));
});

// Virtual para status legível
transactionSchema.virtual('statusText').get(function() {
  const statusMap = {
    'PENDING': 'Aguardando Negociação',
    'NEGOTIATING': 'Em Negociação',
    'AGREED': 'Acordo Alcançado',
    'CANCELLED': 'Cancelada',
    'COMPLETED': 'Concluída'
  };
  return statusMap[this.status] || this.status;
});

// Método estático para buscar transações expiradas
transactionSchema.statics.findExpired = function() {
  return this.find({
    status: 'PENDING',
    negotiationDeadline: { $lt: new Date() }
  });
};

// Método para cancelar transação expirada
transactionSchema.methods.cancelExpired = function(reason = 'Prazo de negociação expirou') {
  this.status = 'CANCELLED';
  this.notes = { ...this.notes, admin: reason };
  this.updatedBy = this.createdBy; // Ou admin ID se disponível
  return this.save();
};

// Método para iniciar negociação
transactionSchema.methods.startNegotiation = function(userId, notes = '') {
  if (this.status !== 'PENDING') {
    throw new Error('Apenas transações pendentes podem iniciar negociação');
  }
  
  this.status = 'NEGOTIATING';
  this.notes = { ...this.notes, buyer: notes };
  this.updatedBy = userId;
  return this.save();
};

// Método para finalizar acordo
transactionSchema.methods.reachAgreement = function(userId, notes = '') {
  if (this.status !== 'NEGOTIATING') {
    throw new Error('Apenas transações em negociação podem chegar a acordo');
  }
  
  this.status = 'AGREED';
  this.notes = { ...this.notes, seller: notes };
  this.updatedBy = userId;
  return this.save();
};

// Método para completar transação
transactionSchema.methods.complete = function(userId, notes = '') {
  if (this.status !== 'AGREED') {
    throw new Error('Apenas transações com acordo podem ser completadas');
  }
  
  this.status = 'COMPLETED';
  this.notes = { ...this.notes, admin: notes };
  this.updatedBy = userId;
  return this.save();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
