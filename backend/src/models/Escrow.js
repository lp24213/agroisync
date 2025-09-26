import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType'
  },
  itemType: {
    type: String,
    required: true,
    enum: ['product', 'freight']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'funded', 'released', 'disputed', 'cancelled', 'expired'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'metamask'],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  fundedAt: {
    type: Date,
    required: false
  },
  releasedAt: {
    type: Date,
    required: false
  },
  disputedAt: {
    type: Date,
    required: false
  },
  releasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  disputedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  releaseReason: {
    type: String,
    maxlength: 500,
    required: false
  },
  disputeReason: {
    type: String,
    maxlength: 500,
    required: false
  },
  adminResolution: {
    type: String,
    enum: ['release_to_seller', 'refund_to_buyer', 'split'],
    required: false
  },
  adminNotes: {
    type: String,
    maxlength: 1000,
    required: false
  },
  resolvedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Índices para performance
escrowSchema.index({ buyerId: 1, status: 1 });
escrowSchema.index({ sellerId: 1, status: 1 });
escrowSchema.index({ itemId: 1, itemType: 1 });
escrowSchema.index({ expiresAt: 1 });
escrowSchema.index({ createdAt: -1 });

// Middleware para verificar expiração
escrowSchema.pre('save', function(next) {
  if (this.isModified('expiresAt') && this.expiresAt < new Date() && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

// Métodos de instância
escrowSchema.methods.canBeReleasedBy = function(userId) {
  return this.buyerId.toString() === userId && this.status === 'funded';
};

escrowSchema.methods.canBeDisputedBy = function(userId) {
  return (this.buyerId.toString() === userId || this.sellerId.toString() === userId) && 
         this.status === 'funded';
};

escrowSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

// Métodos estáticos
escrowSchema.statics.findByUser = function(userId, status = null) {
  const query = {
    $or: [{ buyerId: userId }, { sellerId: userId }]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('sellerId', 'name email company')
    .populate('buyerId', 'name email company')
    .sort({ createdAt: -1 });
};

escrowSchema.statics.findExpired = function() {
  return this.find({
    status: 'pending',
    expiresAt: { $lt: new Date() }
  });
};

escrowSchema.statics.findDisputed = function() {
  return this.find({
    status: 'disputed'
  })
  .populate('sellerId', 'name email company')
  .populate('buyerId', 'name email company')
  .populate('disputedBy', 'name email')
  .sort({ disputedAt: -1 });
};

// Virtual para tempo restante
escrowSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'pending') return null;
  
  const now = new Date();
  const remaining = this.expiresAt.getTime() - now.getTime();
  
  if (remaining <= 0) return 'Expirado';
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Configurar JSON
escrowSchema.set('toJSON', { virtuals: true });
escrowSchema.set('toObject', { virtuals: true });

const Escrow = mongoose.model('Escrow', escrowSchema);

export default Escrow;
