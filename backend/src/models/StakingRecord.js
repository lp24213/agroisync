import mongoose, { Document, Schema } from 'mongoose';

export interface IStakingRecord extends Document {
  user: mongoose.Types.ObjectId;
  pool: mongoose.Types.ObjectId;
  amount: number;
  rewards: number;
  stakedAt: Date;
  unstakedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StakingRecordSchema = new Schema<IStakingRecord>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pool: { type: Schema.Types.ObjectId, ref: 'StakingPool', required: true },
    amount: { type: Number, required: true },
    rewards: { type: Number, default: 0 },
    stakedAt: { type: Date, required: true, default: Date.now },
    unstakedAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const StakingRecord = mongoose.model<IStakingRecord>('StakingRecord', StakingRecordSchema);
