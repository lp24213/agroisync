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
    enum: ['PENDING', 'NEGOTIATING', 'AGREED', 'CANCELLED', 'COMPLETED', 'ESCROW_PENDING', 'ESCROW_FUNDED', 'ESCROW_RELEASED'],
    default: 'PENDING',
    index: true
  },

  // Flag para indicar se a transação usa escrow
  usesEscrow: {
    type: Boolean,
    default: false,
    index: true
  },

  // ID da transação de escrow relacionada (se aplicável)
  escrowTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EscrowTransaction',
    index: true
  },

  // Status do escrow (se aplicável)
  escrowStatus: {
    type: String,
    enum: ['NONE', 'PENDING', 'FUNDED', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'DISPUTED', 'RELEASED', 'REFUNDED', 'CANCELLED', 'EXPIRED'],
    default: 'NONE',
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

  // Opções de entrega
  deliveryOptions: [{
    type: String,
    enum: ['Retirada no local', 'Entrega local', 'Frete para todo Brasil', 'Frete internacional']
  }],

  // Detalhes da entrega
  deliveryDetails: {
    address: {
      street: String,
      number: String,
      complement: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Brasil'
      }
    },
    contactPerson: String,
    phone: String,
    instructions: String,
    preferredTime: String
  },

  // Rastreamento de frete
  shipping: {
    cost: {
      type: Number,
      default: 0
    },
    method: String,
    estimatedDays: Number,
    trackingCode: String,
    carrier: String,
    shippedAt: Date,
    deliveredAt: Date,
    trackingUpdates: [{
      status: String,
      location: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      description: String
    }]
  },

  // Métodos de pagamento aceitos
  paymentMethods: [{
    type: String,
    enum: ['PIX', 'Boleto', 'Cartão de Crédito', 'Cartão de Débito', 'Transferência', 'Dinheiro', 'Escrow']
  }],

  // Status do pagamento
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PARTIAL', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    index: true
  },

  // Histórico de pagamentos
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      required: true
    },
    transactionId: String,
    paidAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],

  // Status da entrega
  deliveryStatus: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CONFIRMED', 'RETURNED'],
    default: 'PENDING',
    index: true
  },

  // Notas e observações
  notes: {
    buyer: String,
    seller: String,
    admin: String
  },

  // Datas importantes
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Histórico de mudanças de status
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: String,
    notes: String
  }],

  // Data de cada status
  pendingAt: Date,
  negotiatingAt: Date,
  agreedAt: Date,
  cancelledAt: Date,
  completedAt: Date,
  escrowPendingAt: Date,
  escrowFundedAt: Date,
  escrowReleasedAt: Date,

  // Configurações de prazo
  deadline: {
    type: Date,
    required: true
  },

  // Configurações de escrow
  escrowSettings: {
    enabled: {
      type: Boolean,
      default: false
    },
    autoReleaseDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 30
    },
    requiresConfirmation: {
      type: Boolean,
      default: true
    },
    allowDisputes: {
      type: Boolean,
      default: true
    },
    maxDisputeDays: {
      type: Number,
      default: 3,
      min: 1,
      max: 7
    }
  },

  // Configurações de segurança
  securitySettings: {
    requireVerification: {
      type: Boolean,
      default: false
    },
    allowCancellation: {
      type: Boolean,
      default: true
    },
    cancellationDeadline: {
      type: Date
    },
    refundPolicy: {
      type: String,
      enum: ['NO_REFUND', 'PARTIAL_REFUND', 'FULL_REFUND'],
      default: 'PARTIAL_REFUND'
    }
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Usuário que fez a última atualização
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Disputas e resoluções
  disputes: [{
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: true,
      enum: ['ITEM_NOT_RECEIVED', 'ITEM_DAMAGED', 'ITEM_NOT_AS_DESCRIBED', 'LATE_DELIVERY', 'PAYMENT_ISSUE', 'OTHER']
    },
    description: {
      type: String,
      required: true
    },
    evidence: [{
      type: String, // URLs de imagens/documentos
      description: String
    }],
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'],
      default: 'OPEN'
    },
    resolution: {
      type: String,
      enum: ['REFUND', 'REPLACEMENT', 'PARTIAL_REFUND', 'NO_ACTION', 'OTHER']
    },
    resolutionNotes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Avaliações e feedback
  ratings: {
    buyerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    sellerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos para consultas eficientes
transactionSchema.index(
  { 
    // Índices para consultas por usuário e status
    buyerId: 1, 
    status: 1 
  },
  { 
    sellerId: 1, 
    status: 1 
  },
  { 
    type: 1, 
    status: 1 
  },
  { 
    usesEscrow: 1, 
    escrowStatus: 1 
  },
  { 
    paymentStatus: 1, 
    deliveryStatus: 1 
  },
  { 
    createdAt: -1 
  },
  { 
    updatedAt: -1 
  }
);

// Middleware para atualizar updatedAt automaticamente
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para atualizar updatedAt em operações de update
transactionSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Método para adicionar entrada no histórico de status
transactionSchema.methods.addStatusHistory = function(status, changedBy, reason = '', notes = '') {
  this.statusHistory.push({
    status,
    changedBy,
    reason,
    notes,
    changedAt: new Date()
  });
  
  // Atualizar data específica do status
  const statusDateField = `${status.toLowerCase()}At`;
  if (this.schema.paths[statusDateField]) {
    this[statusDateField] = new Date();
  }
  
  return this.save();
};

// Método para verificar se pode mudar para um status específico
transactionSchema.methods.canChangeToStatus = function(newStatus) {
  const validTransitions = {
    'PENDING': ['NEGOTIATING', 'CANCELLED', 'ESCROW_PENDING'],
    'NEGOTIATING': ['AGREED', 'CANCELLED', 'ESCROW_PENDING'],
    'AGREED': ['ESCROW_PENDING', 'COMPLETED', 'CANCELLED'],
    'ESCROW_PENDING': ['ESCROW_FUNDED', 'CANCELLED'],
    'ESCROW_FUNDED': ['ESCROW_RELEASED', 'CANCELLED'],
    'ESCROW_RELEASED': ['COMPLETED', 'CANCELLED'],
    'COMPLETED': [],
    'CANCELLED': []
  };
  
  return validTransitions[this.status]?.includes(newStatus) || false;
};

// Método para calcular tempo restante para deadline
transactionSchema.methods.getTimeRemaining = function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, days, hours, minutes };
};

// Método para verificar se a transação está atrasada
transactionSchema.methods.isOverdue = function() {
  return new Date() > new Date(this.deadline);
};

// Método para obter status de escrow legível
transactionSchema.methods.getEscrowStatusText = function() {
  const statusTexts = {
    'NONE': 'Não aplicável',
    'PENDING': 'Aguardando depósito',
    'FUNDED': 'Valor depositado',
    'IN_TRANSIT': 'Em trânsito',
    'DELIVERED': 'Entregue',
    'CONFIRMED': 'Confirmado',
    'DISPUTED': 'Em disputa',
    'RELEASED': 'Liberado',
    'REFUNDED': 'Reembolsado',
    'CANCELLED': 'Cancelado',
    'EXPIRED': 'Expirado'
  };
  
  return statusTexts[this.escrowStatus] || 'Desconhecido';
};

// Método para obter badge de escrow
transactionSchema.methods.getEscrowBadge = function() {
  if (!this.usesEscrow) {
    return null;
  }
  
  const badges = {
    'PENDING': { text: 'Escrow Pendente', color: 'warning' },
    'FUNDED': { text: 'Escrow Fundado', color: 'info' },
    'IN_TRANSIT': { text: 'Escrow Em Trânsito', color: 'primary' },
    'DELIVERED': { text: 'Escrow Entregue', color: 'success' },
    'CONFIRMED': { text: 'Escrow Confirmado', color: 'success' },
    'DISPUTED': { text: 'Escrow Em Disputa', color: 'danger' },
    'RELEASED': { text: 'Escrow Liberado', color: 'success' },
    'REFUNDED': { text: 'Escrow Reembolsado', color: 'info' },
    'CANCELLED': { text: 'Escrow Cancelado', color: 'secondary' },
    'EXPIRED': { text: 'Escrow Expirado', color: 'secondary' }
  };
  
  return badges[this.escrowStatus] || { text: 'Escrow (em breve)', color: 'secondary' };
};

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
