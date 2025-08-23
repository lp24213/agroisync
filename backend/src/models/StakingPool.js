import mongoose, { Document, Schema } from 'mongoose';

export interface IStakingPool extends Document {
  name: string;
  description?: string;
  apy: number;
  minStake: number;
  maxStake: number;
  totalStaked: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StakingPoolSchema = new Schema<IStakingPool>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    apy: { type: Number, required: true },
    minStake: { type: Number, required: true, default: 0 },
    maxStake: { type: Number, required: true, default: 1000000 },
    totalStaked: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

StakingPoolSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

export const StakingPool = mongoose.model<IStakingPool>('StakingPool', StakingPoolSchema);
