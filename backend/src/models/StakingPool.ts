import mongoose, { Document, Schema } from 'mongoose';

export interface IStakingPool extends Document {
  name: string;
  token: string;
  tokenAddress: string;
  totalStaked: number;
  totalRewards: number;
  apy: number;
  minStake: number;
  maxStake: number;
  lockPeriod: number; // in days
  isActive: boolean;
  isPaused: boolean;
  rewardToken: string;
  rewardTokenAddress: string;
  rewardRate: number; // rewards per day
  maxCapacity: number;
  currentCapacity: number;
  stakersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const stakingPoolSchema = new Schema<IStakingPool>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  token: {
    type: String,
    required: true,
    trim: true
  },
  tokenAddress: {
    type: String,
    required: true,
    length: 44,
    match: [/^[A-Za-z0-9]{44}$/, 'Invalid Solana token address']
  },
  totalStaked: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRewards: {
    type: Number,
    default: 0,
    min: 0
  },
  apy: {
    type: Number,
    required: true,
    min: 0,
    max: 1000 // Max 1000% APY
  },
  minStake: {
    type: Number,
    required: true,
    min: 0
  },
  maxStake: {
    type: Number,
    required: true,
    min: 0
  },
  lockPeriod: {
    type: Number,
    required: true,
    min: 0,
    max: 3650 // Max 10 years
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  rewardToken: {
    type: String,
    required: true,
    trim: true
  },
  rewardTokenAddress: {
    type: String,
    required: true,
    length: 44,
    match: [/^[A-Za-z0-9]{44}$/, 'Invalid Solana reward token address']
  },
  rewardRate: {
    type: Number,
    required: true,
    min: 0
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 0
  },
  currentCapacity: {
    type: Number,
    default: 0,
    min: 0
  },
  stakersCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
stakingPoolSchema.index({ isActive: 1, isPaused: 1 });
stakingPoolSchema.index({ token: 1 });
stakingPoolSchema.index({ apy: -1 });
stakingPoolSchema.index({ totalStaked: -1 });
stakingPoolSchema.index({ createdAt: -1 });

// Virtual for capacity percentage
stakingPoolSchema.virtual('capacityPercentage').get(function() {
  return this.maxCapacity > 0 ? (this.currentCapacity / this.maxCapacity) * 100 : 0;
});

// Virtual for available capacity
stakingPoolSchema.virtual('availableCapacity').get(function() {
  return Math.max(0, this.maxCapacity - this.currentCapacity);
});

// Static method to find active pools
stakingPoolSchema.statics.findActive = function() {
  return this.find({ isActive: true, isPaused: false });
};

// Static method to find by token
stakingPoolSchema.statics.findByToken = function(token: string) {
  return this.find({ token, isActive: true });
};

// Static method to find pools with highest APY
stakingPoolSchema.statics.findTopAPY = function(limit: number = 10) {
  return this.find({ isActive: true, isPaused: false })
    .sort({ apy: -1 })
    .limit(limit);
};

// Method to update pool statistics
stakingPoolSchema.methods.updateStats = async function() {
  // This would typically aggregate from staking records
  // For now, we'll keep it simple
  return this.save();
};

// Method to check if pool is full
stakingPoolSchema.methods.isFull = function(): boolean {
  return this.currentCapacity >= this.maxCapacity;
};

// Method to check if amount can be staked
stakingPoolSchema.methods.canStake = function(amount: number): boolean {
  return this.isActive && 
         !this.isPaused && 
         !this.isFull() && 
         amount >= this.minStake && 
         amount <= this.maxStake &&
         (this.currentCapacity + amount) <= this.maxCapacity;
};

export const StakingPool = mongoose.model<IStakingPool>('StakingPool', stakingPoolSchema); 