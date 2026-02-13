import mongoose from 'mongoose';

import logger from '../utils/logger.js';
const escrowTransactionSchema = new mongoose.Schema(
  {
    // IdentificaÃ§Ã£o Ãºnica
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `ESCROW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    // TransaÃ§Ã£o relacionada
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      index: true
    },

    // UsuÃ¡rios envolvidos
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Valores e moeda
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Valor deve ser maior que zero']
    },

    currency: {
      type: String,
      required: true,
      enum: ['BRL', 'USD', 'EUR'],
      default: 'BRL'
    },

    // Taxas e custos
    fee: {
      type: Number,
      required: true,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Status da transaÃ§Ã£o
    status: {
      type: String,
      required: true,
      enum: [
        'PENDING', // Aguardando depÃ³sito
        'FUNDED', // Valor depositado
        'IN_TRANSIT', // Em trÃ¢nsito
        'DELIVERED', // Entregue ao comprador
        'CONFIRMED', // Confirmado pelo comprador
        'DISPUTED', // Em disputa
        'RELEASED', // Liberado para vendedor
        'REFUNDED', // Reembolsado
        'CANCELLED', // Cancelado
        'EXPIRED' // Expirado
      ],
      default: 'PENDING',
      index: true
    },

    // Datas importantes
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    fundedAt: Date, // Quando foi depositado
    deliveredAt: Date, // Quando foi entregue
    confirmedAt: Date, // Quando foi confirmado
    releasedAt: Date, // Quando foi liberado
    refundedAt: Date, // Quando foi reembolsado
    cancelledAt: Date, // Quando foi cancelado
    expiredAt: Date, // Quando expirou

    // ConfiguraÃ§Ãµes de tempo
    autoReleaseDays: {
      type: Number,
      default: 7, // LiberaÃ§Ã£o automÃ¡tica em 7 dias
      min: 1,
      max: 30
    },

    disputePeriod: {
      type: Number,
      default: 3, // PerÃ­odo de disputa em 3 dias
      min: 1,
      max: 14
    },

    // Detalhes do pagamento
    paymentDetails: {
      method: {
        type: String,
        enum: ['PIX', 'Boleto', 'CartÃ£o', 'TransferÃªncia', 'Cripto'],
        required: true
      },
      transactionHash: String, // Hash da transaÃ§Ã£o (para cripto)
      paymentId: String, // ID do pagamento
      gateway: String, // Gateway de pagamento
      metadata: mongoose.Schema.Types.Mixed
    },

    // InformaÃ§Ãµes de entrega
    deliveryInfo: {
      trackingCode: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      deliveryAddress: {
        street: String,
        number: String,
        complement: String,
        neighborhood: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },

    // Disputas
    disputes: [
      {
        id: {
          type: String,
          required: true,
          default: () => `DISPUTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        raisedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        reason: {
          type: String,
          required: true,
          enum: [
            'ITEM_NOT_RECEIVED',
            'ITEM_NOT_AS_DESCRIBED',
            'DAMAGED_ITEM',
            'WRONG_ITEM',
            'LATE_DELIVERY',
            'OTHER'
          ]
        },
        description: {
          type: String,
          required: true,
          maxlength: [1000, 'DescriÃ§Ã£o nÃ£o pode ter mais de 1000 caracteres']
        },
        evidence: [
          {
            type: String, // URLs de evidÃªncias
            description: String
          }
        ],
        status: {
          type: String,
          enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'],
          default: 'OPEN'
        },
        resolution: {
          type: String,
          enum: ['RELEASE_TO_SELLER', 'REFUND_TO_BUYER', 'PARTIAL_REFUND', 'OTHER'],
          default: null
        },
        adminNotes: String,
        createdAt: {
          type: Date,
          default: Date.now
        },
        resolvedAt: Date,
        resolvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],

    // HistÃ³rico de mudanÃ§as de status
    statusHistory: [
      {
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
          ref: 'User'
        },
        reason: String,
        notes: String
      }
    ],

    // ConfiguraÃ§Ãµes de notificaÃ§Ã£o
    notifications: {
      emailEnabled: { type: Boolean, default: true },
      smsEnabled: { type: Boolean, default: false },
      pushEnabled: { type: Boolean, default: true }
    },

    // Metadados adicionais
    metadata: {
      source: String, // Sistema que criou o escrow
      tags: [String], // Tags para categorizaÃ§Ã£o
      priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
        default: 'NORMAL'
      },
      category: String, // Categoria da transaÃ§Ã£o
      notes: String // Notas adicionais
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ãndices para performance
escrowTransactionSchema.index({ transactionId: 1, status: 1 });
escrowTransactionSchema.index({ payerId: 1, status: 1 });
escrowTransactionSchema.index({ payeeId: 1, status: 1 });
escrowTransactionSchema.index({ status: 1, createdAt: 1 });
escrowTransactionSchema.index({ 'disputes.status': 1, createdAt: 1 });

// Virtual para calcular se pode ser liberado automaticamente
escrowTransactionSchema.virtual('canAutoRelease').get(function () {
  if (this.status !== 'CONFIRMED') {
    return false;
  }

  const daysSinceConfirmation = (Date.now() - this.confirmedAt) / (1000 * 60 * 60 * 24);
  return daysSinceConfirmation >= this.autoReleaseDays;
});

// Virtual para calcular se pode ser disputado
escrowTransactionSchema.virtual('canBeDisputed').get(function () {
  if (this.status !== 'DELIVERED') {
    return false;
  }

  const daysSinceDelivery = (Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= this.disputePeriod;
});

// Virtual para calcular tempo restante para liberaÃ§Ã£o automÃ¡tica
escrowTransactionSchema.virtual('timeToAutoRelease').get(function () {
  if (this.status !== 'CONFIRMED') {
    return null;
  }

  const daysSinceConfirmation = (Date.now() - this.confirmedAt) / (1000 * 60 * 60 * 24);
  const remainingDays = this.autoReleaseDays - daysSinceConfirmation;

  return Math.max(0, remainingDays);
});

// Virtual para calcular tempo restante para disputa
escrowTransactionSchema.virtual('timeToDispute').get(function () {
  if (this.status !== 'DELIVERED') {
    return null;
  }

  const daysSinceDelivery = (Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24);
  const remainingDays = this.disputePeriod - daysSinceDelivery;

  return Math.max(0, remainingDays);
});

// MÃ©todos de instÃ¢ncia
escrowTransactionSchema.methods.fund = function () {
  this.status = 'FUNDED';
  this.fundedAt = new Date();
  this.addStatusHistory('FUNDED', 'Valor depositado com sucesso');
  return this.save();
};

escrowTransactionSchema.methods.deliver = function (trackingCode, carrier) {
  this.status = 'DELIVERED';
  this.deliveredAt = new Date();
  this.deliveryInfo.trackingCode = trackingCode;
  this.deliveryInfo.carrier = carrier;
  this.addStatusHistory('DELIVERED', 'Item entregue ao comprador');
  return this.save();
};

escrowTransactionSchema.methods.confirm = function () {
  this.status = 'CONFIRMED';
  this.confirmedAt = new Date();
  this.addStatusHistory('CONFIRMED', 'Entrega confirmada pelo comprador');
  return this.save();
};

escrowTransactionSchema.methods.release = function (reason = 'LiberaÃ§Ã£o automÃ¡tica') {
  this.status = 'RELEASED';
  this.releasedAt = new Date();
  this.addStatusHistory('RELEASED', reason);
  return this.save();
};

escrowTransactionSchema.methods.refund = function (reason = 'Reembolso solicitado') {
  this.status = 'REFUNDED';
  this.refundedAt = new Date();
  this.addStatusHistory('REFUNDED', reason);
  return this.save();
};

escrowTransactionSchema.methods.cancel = function (reason = 'TransaÃ§Ã£o cancelada') {
  this.status = 'CANCELLED';
  this.cancelledAt = new Date();
  this.addStatusHistory('CANCELLED', reason);
  return this.save();
};

escrowTransactionSchema.methods.addDispute = function (disputeData) {
  const dispute = {
    ...disputeData,
    id: `DISPUTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };

  this.disputes.push(dispute);
  this.status = 'DISPUTED';
  this.addStatusHistory('DISPUTED', `Disputa criada: ${disputeData.reason}`);

  return this.save();
};

escrowTransactionSchema.methods.resolveDispute = function (
  disputeId,
  resolution,
  adminNotes,
  resolvedBy
) {
  const dispute = this.disputes.id(disputeId);
  if (!dispute) {
    throw new Error('Disputa nÃ£o encontrada');
  }

  dispute.status = 'RESOLVED';
  dispute.resolution = resolution;
  dispute.adminNotes = adminNotes;
  dispute.resolvedBy = resolvedBy;
  dispute.resolvedAt = new Date();

  // Aplicar resoluÃ§Ã£o
  if (resolution === 'RELEASE_TO_SELLER') {
    this.status = 'RELEASED';
    this.releasedAt = new Date();
    this.addStatusHistory('RELEASED', 'Disputa resolvida: valor liberado para vendedor');
  } else if (resolution === 'REFUND_TO_BUYER') {
    this.status = 'REFUNDED';
    this.refundedAt = new Date();
    this.addStatusHistory('REFUNDED', 'Disputa resolvida: valor reembolsado para comprador');
  }

  return this.save();
};

escrowTransactionSchema.methods.addStatusHistory = function (
  status,
  reason,
  changedBy = null,
  notes = ''
) {
  this.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy,
    reason,
    notes
  });
};

// MÃ©todos estÃ¡ticos
escrowTransactionSchema.statics.findByTransaction = function (transactionId) {
  return this.findOne({ transactionId }).populate('payerId payeeId');
};

escrowTransactionSchema.statics.findByUser = function (userId, status = null) {
  const query = {
    $or: [{ payerId: userId }, { payeeId: userId }]
  };

  if (status) {
    query.status = status;
  }

  return this.find(query).populate('payerId payeeId transactionId').sort({ createdAt: -1 });
};

escrowTransactionSchema.statics.findPendingAutoRelease = function () {
  const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 dias atrÃ¡s

  return this.find({
    status: 'CONFIRMED',
    confirmedAt: { $lt: cutoffDate }
  });
};

escrowTransactionSchema.statics.findExpiredDisputes = function () {
  const cutoffDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 dias atrÃ¡s

  return this.find({
    'disputes.status': 'OPEN',
    'disputes.createdAt': { $lt: cutoffDate }
  });
};

// Middleware para validaÃ§Ãµes
escrowTransactionSchema.pre('save', function (next) {
  // Calcular total com taxa
  if (this.amount && this.fee) {
    this.totalAmount = this.amount + this.fee;
  }

  // Validar datas
  if (this.status === 'FUNDED' && !this.fundedAt) {
    this.fundedAt = new Date();
  }

  if (this.status === 'DELIVERED' && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  if (this.status === 'CONFIRMED' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }

  next();
});

// Middleware para notificaÃ§Ãµes
escrowTransactionSchema.post('save', function () {
  // Em produÃ§Ã£o, disparar notificaÃ§Ãµes aqui
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`Escrow ${this.id} salvo com status ${this.status}`);
  }
});

export default mongoose.model('EscrowTransaction', escrowTransactionSchema);
