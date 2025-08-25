import mongoose from 'mongoose';

// Payment schema for Stripe and Metamask
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    enum: ['brl', 'usd', 'eth', 'btc', 'sol'],
    default: 'brl'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'metamask'],
    default: 'stripe'
  },
  module: {
    type: String,
    required: true,
    enum: ['store', 'freight', 'crypto'],
    default: 'store'
  },
  tier: {
    type: String,
    required: true,
    enum: ['basic', 'pro', 'enterprise'],
    default: 'basic'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  metamaskTransactionHash: {
    type: String,
    sparse: true
  },
  metamaskWalletAddress: {
    type: String,
    sparse: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  errorMessage: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
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
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ module: 1, tier: 1 });

// Middleware para atualizar timestamp
paymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para marcar pagamento como completo
paymentSchema.methods.markAsCompleted = function () {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Método para marcar pagamento como falhado
paymentSchema.methods.markAsFailed = function (errorMessage) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  return this.save();
};

// Método para obter pagamentos de um usuário
paymentSchema.statics.findByUser = function (userId, module = null) {
  const query = { userId };

  if (module) {
    query.module = module;
  }

  return this.find(query).sort({ createdAt: -1 });
};

// Método para obter pagamentos por status
paymentSchema.statics.findByStatus = function (status, module = null) {
  const query = { status };

  if (module) {
    query.module = module;
  }

  return this.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
};

// Método para obter estatísticas de pagamentos
paymentSchema.statics.getPaymentStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

// Create Payment model
export const Payment = mongoose.model('Payment', paymentSchema);
