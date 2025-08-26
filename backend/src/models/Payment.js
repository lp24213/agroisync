const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Usuário que fez o pagamento
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },

  // Detalhes do pagamento
  amount: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  },
  currency: {
    type: String,
    required: [true, 'Moeda é obrigatória'],
    default: 'BRL',
    enum: ['BRL', 'USD', 'EUR']
  },

  // Método de pagamento
  method: {
    type: String,
    required: [true, 'Método de pagamento é obrigatório'],
    enum: ['stripe', 'crypto', 'pix', 'bank_transfer']
  },

  // Status do pagamento
  status: {
    type: String,
    required: [true, 'Status é obrigatório'],
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Plano adquirido
  plan: {
    planId: {
      type: String,
      required: [true, 'ID do plano é obrigatório'],
      enum: ['comprador-basic', 'anunciante-premium', 'freteiro-premium', 'admin-full']
    },
    name: {
      type: String,
      required: [true, 'Nome do plano é obrigatório']
    },
    description: String,
    duration: {
      type: Number, // em dias
      required: [true, 'Duração do plano é obrigatória']
    },
    features: [String]
  },

  // Detalhes específicos por método de pagamento
  paymentDetails: {
    // Stripe
    stripe: {
      sessionId: String,
      paymentIntentId: String,
      customerId: String,
      subscriptionId: String
    },
    // Crypto
    crypto: {
      transactionHash: {
        type: String,
        required: function() { return this.method === 'crypto'; }
      },
      network: {
        type: String,
        enum: ['ethereum', 'polygon', 'bsc', 'other'],
        required: function() { return this.method === 'crypto'; }
      },
      fromAddress: String,
      toAddress: String,
      gasUsed: Number,
      gasPrice: Number,
      blockNumber: Number,
      confirmations: Number
    },
    // PIX
    pix: {
      qrCode: String,
      qrCodeText: String,
      expiresAt: Date
    }
  },

  // Metadados e auditoria
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String
  },

  // Notificações e webhooks
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    webhookReceived: {
      type: Boolean,
      default: false
    },
    webhookPayload: mongoose.Schema.Types.Mixed
  },

  // Timestamps
  expiresAt: {
    type: Date,
    required: function() {
      return this.status === 'pending' && this.method === 'pix';
    }
  },
  completedAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  refundedAt: Date
}, {
  timestamps: true
});

// Índices para performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ 'plan.planId': 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ expiresAt: 1 });

// Middleware para definir data de expiração para PIX
paymentSchema.pre('save', function(next) {
  if (this.method === 'pix' && this.status === 'pending' && !this.expiresAt) {
    // PIX expira em 30 minutos
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  }
  next();
});

// Método para marcar como processando
paymentSchema.methods.markAsProcessing = function() {
  this.status = 'processing';
  return this.save();
};

// Método para marcar como completo
paymentSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Método para marcar como falhou
paymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  this.failedAt = new Date();
  return this.save();
};

// Método para marcar como cancelado
paymentSchema.methods.markAsCancelled = function() {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  return this.save();
};

// Método para marcar como reembolsado
paymentSchema.methods.markAsRefunded = function() {
  this.status = 'refunded';
  this.refundedAt = new Date();
  return this.save();
};

// Método para verificar se pagamento está ativo
paymentSchema.methods.isActive = function() {
  return this.status === 'completed';
};

// Método para obter dados do pagamento para exibição
paymentSchema.methods.getDisplayData = function() {
  return {
    _id: this._id,
    amount: this.amount,
    currency: this.currency,
    method: this.method,
    status: this.status,
    plan: this.plan,
    createdAt: this.createdAt,
    completedAt: this.completedAt,
    isActive: this.isActive()
  };
};

// Método estático para buscar pagamentos de um usuário
paymentSchema.statics.getUserPayments = function(userId, limit = 20, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email');
};

// Método estático para buscar pagamentos por status
paymentSchema.statics.getPaymentsByStatus = function(status, limit = 50) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email');
};

// Método estático para buscar pagamentos por método
paymentSchema.statics.getPaymentsByMethod = function(method, limit = 50) {
  return this.find({ method })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email');
};

// Método estático para buscar pagamentos por plano
paymentSchema.statics.getPaymentsByPlan = function(planId, limit = 50) {
  return this.find({ 'plan.planId': planId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email');
};

// Método estático para buscar pagamentos pendentes expirados
paymentSchema.statics.getExpiredPendingPayments = function() {
  return this.find({
    status: 'pending',
    expiresAt: { $lt: new Date() }
  });
};

// Método estático para estatísticas de pagamento
paymentSchema.statics.getPaymentStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Método estático para estatísticas por método de pagamento
paymentSchema.statics.getPaymentStatsByMethod = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$method',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Método estático para estatísticas por plano
paymentSchema.statics.getPaymentStatsByPlan = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$plan.planId',
        planName: { $first: '$plan.name' },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);
