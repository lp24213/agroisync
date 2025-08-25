import mongoose from 'mongoose';

// Staking Pool schema for cryptocurrency staking
const stakingPoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  apy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minStake: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxStake: {
    type: Number,
    required: true,
    min: 0,
    default: 1000000
  },
  totalStaked: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    required: true,
    enum: ['ETH', 'BTC', 'SOL', 'USDT', 'USDC'],
    default: 'ETH'
  },
  lockPeriod: {
    type: Number,
    required: true,
    min: 0,
    default: 0 // 0 = no lock period
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
stakingPoolSchema.index({ name: 1 });
stakingPoolSchema.index({ isActive: 1 });
stakingPoolSchema.index({ token: 1 });
stakingPoolSchema.index({ apy: -1 });

// Middleware para atualizar timestamp
stakingPoolSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para encontrar pools ativos
stakingPoolSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ apy: -1 });
};

// Método para encontrar pools por token
stakingPoolSchema.statics.findByToken = function (token) {
  return this.find({ token, isActive: true }).sort({ apy: -1 });
};

// Método para atualizar total staked
stakingPoolSchema.methods.updateTotalStaked = function (amount) {
  this.totalStaked = Math.max(0, this.totalStaked + amount);
  return this.save();
};

// Create StakingPool model
export const StakingPool = mongoose.model('StakingPool', stakingPoolSchema);
