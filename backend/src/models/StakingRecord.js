import mongoose from 'mongoose';

// Staking Record schema for user staking activities
const stakingRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StakingPool',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  rewards: {
    type: Number,
    default: 0,
    min: 0
  },
  stakedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  unstakedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'unstaking', 'completed', 'cancelled'],
    default: 'active'
  },
  lockPeriod: {
    type: Number,
    default: 0
  },
  unlockDate: {
    type: Date
  },
  apyAtStake: {
    type: Number,
    required: true
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
stakingRecordSchema.index({ user: 1 });
stakingRecordSchema.index({ pool: 1 });
stakingRecordSchema.index({ isActive: 1 });
stakingRecordSchema.index({ stakedAt: -1 });
stakingRecordSchema.index({ status: 1 });

// Middleware para atualizar timestamp
stakingRecordSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para calcular recompensas
stakingRecordSchema.methods.calculateRewards = function () {
  if (!this.isActive || this.status !== 'active') {
    return 0;
  }
  
  const now = new Date();
  const stakedTime = (now - this.stakedAt) / (1000 * 60 * 60 * 24 * 365); // em anos
  const rewards = this.amount * (this.apyAtStake / 100) * stakedTime;
  
  this.rewards = Math.max(0, rewards);
  return this.rewards;
};

// Método para iniciar unstaking
stakingRecordSchema.methods.startUnstaking = function () {
  if (this.status !== 'active') {
    throw new Error('Staking não está ativo');
  }
  
  this.status = 'unstaking';
  this.unstakedAt = new Date();
  return this.save();
};

// Método para completar unstaking
stakingRecordSchema.methods.completeUnstaking = function () {
  if (this.status !== 'unstaking') {
    throw new Error('Unstaking não foi iniciado');
  }
  
  this.status = 'completed';
  this.isActive = false;
  return this.save();
};

// Método para obter registros de staking de um usuário
stakingRecordSchema.statics.findByUser = function (userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('pool', 'name apy token')
    .sort({ stakedAt: -1 });
};

// Método para obter registros ativos de um pool
stakingRecordSchema.statics.findActiveByPool = function (poolId) {
  return this.find({
    pool: poolId,
    isActive: true,
    status: 'active'
  }).populate('user', 'name email');
};

// Create StakingRecord model
const StakingRecord = mongoose.model('StakingRecord', stakingRecordSchema);

export default StakingRecord;
