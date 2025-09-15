import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Usuário que fez o pagamento
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Dados do plano
    planId: {
      type: String,
      required: true,
      enum: ['loja-basic', 'loja-pro', 'agroconecta-basic', 'agroconecta-pro']
    },
    planName: {
      type: String,
      required: true
    },

    // Informações financeiras
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      enum: ['BRL', 'USD', 'EUR', 'ETH', 'BTC'],
      default: 'BRL'
    },

    // Método de pagamento
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'crypto', 'pix', 'boleto']
    },

    // Status do pagamento
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },

    // Tipo de pagamento
    type: {
      type: String,
      required: true,
      enum: ['plan', 'individual', 'subscription'],
      default: 'plan'
    },

    // ID do anúncio (para pagamentos individuais)
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: function() {
        return this.type === 'individual';
      }
    },

    // Controle de liberação de dados
    dataUnlocked: {
      type: Boolean,
      default: false
    },
    unlockedAt: {
      type: Date
    },

    // Dados específicos do Stripe
    stripe: {
      sessionId: String,
      customerId: String,
      subscriptionId: String,
      paymentIntentId: String,
      chargeId: String
    },

    // Dados específicos de crypto
    crypto: {
      transactionHash: String,
      walletAddress: String,
      network: {
        type: String,
        enum: ['ethereum', 'polygon', 'bsc', 'arbitrum']
      },
      gasUsed: Number,
      gasPrice: Number
    },

    // Dados específicos de PIX/Boleto
    brazilian: {
      pixKey: String,
      boletoCode: String,
      boletoUrl: String,
      expirationDate: Date
    },

    // Metadados adicionais
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },

    // Timestamps
    processedAt: Date,
    failedAt: Date,
    refundedAt: Date,
    cancelledAt: Date,

    // Informações de auditoria
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },

    // Notas e comentários
    notes: String,
    adminNotes: String,

    // Soft delete
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices para performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ planId: 1, status: 1 });
paymentSchema.index({ paymentMethod: 1, status: 1 });
paymentSchema.index({ 'stripe.sessionId': 1 });
paymentSchema.index({ 'crypto.transactionHash': 1 });

// Virtual para verificar se pagamento foi bem-sucedido
paymentSchema.virtual('isSuccessful').get(function () {
  return this.status === 'succeeded';
});

// Virtual para verificar se pagamento está pendente
paymentSchema.virtual('isPending').get(function () {
  return ['pending', 'processing'].includes(this.status);
});

// Virtual para verificar se pagamento falhou
paymentSchema.virtual('isFailed').get(function () {
  return ['failed', 'cancelled'].includes(this.status);
});

// Virtual para verificar se pagamento foi reembolsado
paymentSchema.virtual('isRefunded').get(function () {
  return this.status === 'refunded';
});

// Virtual para duração do processamento
paymentSchema.virtual('processingDuration').get(function () {
  if (!this.processedAt || !this.createdAt) {
    return null;
  }
  return this.processedAt - this.createdAt;
});

// Middleware para atualizar timestamps baseado no status
paymentSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    const now = new Date();

    switch (this.status) {
      case 'succeeded':
        this.processedAt = now;
        break;
      case 'failed':
        this.failedAt = now;
        break;
      case 'refunded':
        this.refundedAt = now;
        break;
      case 'cancelled':
        this.cancelledAt = now;
        break;
    }
  }
  next();
});

// Método para marcar como processado
paymentSchema.methods.markAsCompleted = function () {
  this.status = 'succeeded';
  this.processedAt = new Date();
  return this.save();
};

// Método para marcar como falhou
paymentSchema.methods.markAsFailed = function (reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.notes = reason;
  return this.save();
};

// Método para marcar como reembolsado
paymentSchema.methods.markAsRefunded = function (reason) {
  this.status = 'refunded';
  this.refundedAt = new Date();
  this.notes = reason;
  return this.save();
};

// Método para marcar como cancelado
paymentSchema.methods.markAsCancelled = function (reason) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.notes = reason;
  return this.save();
};

// Método para obter dados públicos (sem informações sensíveis)
paymentSchema.methods.getPublicData = function () {
  return {
    id: this._id,
    planId: this.planId,
    planName: this.planName,
    amount: this.amount,
    currency: this.currency,
    paymentMethod: this.paymentMethod,
    status: this.status,
    createdAt: this.createdAt,
    processedAt: this.processedAt
  };
};

// Método para obter dados completos (apenas para usuário dono ou admin)
paymentSchema.methods.getFullData = function (userId, isAdmin) {
  if (this.userId.toString() !== userId && !isAdmin) {
    throw new Error('Acesso negado');
  }

  return {
    ...this.getPublicData(),
    userId: this.userId,
    stripe: this.stripe,
    crypto: this.crypto,
    brazilian: this.brazilian,
    metadata: this.metadata,
    ipAddress: this.ipAddress,
    userAgent: this.userAgent,
    source: this.source,
    notes: this.notes,
    adminNotes: this.adminNotes,
    updatedAt: this.updatedAt
  };
};

// Método estático para buscar pagamentos de um usuário
paymentSchema.statics.findByUser = function (userId, options = {}) {
  const query = { userId, deletedAt: { $exists: false } };

  if (options.status) {
    query.status = options.status;
  }

  if (options.planId) {
    query.planId = options.planId;
  }

  if (options.paymentMethod) {
    query.paymentMethod = options.paymentMethod;
  }

  const sort = options.sort || { createdAt: -1 };
  const limit = options.limit || 50;
  const skip = options.skip || 0;

  return this.find(query).sort(sort).limit(limit).skip(skip);
};

// Método estático para estatísticas de pagamentos
paymentSchema.statics.getStats = async function (userId = null) {
  const match = { deletedAt: { $exists: false } };
  if (userId) {
    match.userId = userId;
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, 1, 0] }
        },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, '$amount', 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $in: ['$status', ['pending', 'processing']] }, 1, 0] }
        },
        failedPayments: {
          $sum: { $cond: [{ $in: ['$status', ['failed', 'cancelled']] }, 1, 0] }
        }
      }
    }
  ]);

  return (
    stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      completedPayments: 0,
      completedAmount: 0,
      pendingPayments: 0,
      failedPayments: 0
    }
  );
};

// Método estático para buscar pagamentos por período
paymentSchema.statics.findByPeriod = function (startDate, endDate, userId = null) {
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    },
    deletedAt: { $exists: false }
  };

  if (userId) {
    query.userId = userId;
  }

  return this.find(query).sort({ createdAt: -1 });
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
