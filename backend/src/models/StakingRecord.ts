import mongoose, { Document, Schema } from 'mongoose';

export interface IStakingRecord extends Document {
  userId: string;
  poolId: string;
  walletAddress: string;
  amount: number;
  rewards: number;
  startDate: Date;
  endDate?: Date;
  unlockDate: Date;
  isActive: boolean;
  isUnlocked: boolean;
  transactionHash: string;
  rewardTransactionHash?: string;
  unstakeTransactionHash?: string;
  lastRewardClaim: Date;
  totalRewardsClaimed: number;
  apyAtStake: number;
  status: 'active' | 'unstaked' | 'claimed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const stakingRecordSchema = new Schema<IStakingRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poolId: {
    type: Schema.Types.ObjectId,
    ref: 'StakingPool',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    length: 44,
    match: [/^[A-Za-z0-9]{44}$/, 'Invalid Solana wallet address']
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
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  unlockDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  rewardTransactionHash: {
    type: String
  },
  unstakeTransactionHash: {
    type: String
  },
  lastRewardClaim: {
    type: Date,
    default: Date.now
  },
  totalRewardsClaimed: {
    type: Number,
    default: 0,
    min: 0
  },
  apyAtStake: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'unstaked', 'claimed', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for performance
stakingRecordSchema.index({ userId: 1 });
stakingRecordSchema.index({ poolId: 1 });
stakingRecordSchema.index({ walletAddress: 1 });
stakingRecordSchema.index({ isActive: 1 });
stakingRecordSchema.index({ status: 1 });
stakingRecordSchema.index({ startDate: -1 });
stakingRecordSchema.index({ unlockDate: 1 });
stakingRecordSchema.index({ transactionHash: 1 });

// Compound indexes
stakingRecordSchema.index({ userId: 1, isActive: 1 });
stakingRecordSchema.index({ poolId: 1, isActive: 1 });
stakingRecordSchema.index({ walletAddress: 1, status: 1 });

// Virtual for staking duration in days
stakingRecordSchema.virtual('duration').get(function() {
  const end = this.endDate || new Date();
  return Math.floor((end.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for time until unlock
stakingRecordSchema.virtual('timeUntilUnlock').get(function() {
  if (this.isUnlocked) return 0;
  const now = new Date();
  const timeLeft = this.unlockDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
});

// Virtual for current rewards (calculated)
stakingRecordSchema.virtual('currentRewards').get(function() {
  if (!this.isActive || this.isUnlocked) return 0;
  
  const now = new Date();
  const daysStaked = Math.floor((now.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyReward = (this.amount * this.apyAtStake) / (100 * 365);
  
  return Math.max(0, (dailyReward * daysStaked) - this.totalRewardsClaimed);
});

// Virtual for can unstake
stakingRecordSchema.virtual('canUnstake').get(function() {
  return this.isActive && this.isUnlocked && this.status === 'active';
});

// Virtual for can claim rewards
stakingRecordSchema.virtual('canClaimRewards').get(function() {
  return this.isActive && this.currentRewards > 0;
});

// Static method to find active stakes by user
stakingRecordSchema.statics.findActiveByUser = function(userId: string) {
  return this.find({ userId, isActive: true, status: 'active' })
    .populate('poolId')
    .sort({ startDate: -1 });
};

// Static method to find active stakes by wallet
stakingRecordSchema.statics.findActiveByWallet = function(walletAddress: string) {
  return this.find({ walletAddress, isActive: true, status: 'active' })
    .populate('poolId')
    .sort({ startDate: -1 });
};

// Static method to find stakes ready for unlock
stakingRecordSchema.statics.findReadyForUnlock = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    isUnlocked: false,
    unlockDate: { $lte: now },
    status: 'active'
  });
};

// Static method to find stakes with pending rewards
stakingRecordSchema.statics.findWithPendingRewards = function() {
  return this.find({
    isActive: true,
    status: 'active'
  }).populate('poolId');
};

// Method to calculate rewards
stakingRecordSchema.methods.calculateRewards = function(): number {
  if (!this.isActive || this.isUnlocked) return 0;
  
  const now = new Date();
  const daysStaked = Math.floor((now.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyReward = (this.amount * this.apyAtStake) / (100 * 365);
  
  return Math.max(0, (dailyReward * daysStaked) - this.totalRewardsClaimed);
};

// Method to mark as unlocked
stakingRecordSchema.methods.markAsUnlocked = async function() {
  this.isUnlocked = true;
  this.endDate = new Date();
  return this.save();
};

// Method to claim rewards
stakingRecordSchema.methods.claimRewards = async function(amount: number) {
  if (amount > this.currentRewards) {
    throw new Error('Cannot claim more rewards than available');
  }
  
  this.totalRewardsClaimed += amount;
  this.lastRewardClaim = new Date();
  
  if (this.totalRewardsClaimed >= this.calculateRewards()) {
    this.status = 'claimed';
  }
  
  return this.save();
};

// Method to unstake
stakingRecordSchema.methods.unstake = async function(transactionHash: string) {
  if (!this.canUnstake) {
    throw new Error('Cannot unstake at this time');
  }
  
  this.isActive = false;
  this.endDate = new Date();
  this.status = 'unstaked';
  this.unstakeTransactionHash = transactionHash;
  
  return this.save();
};

export const StakingRecord = mongoose.model<IStakingRecord>('StakingRecord', stakingRecordSchema); 