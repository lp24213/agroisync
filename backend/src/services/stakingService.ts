import { Connection } from '@solana/web3.js';

import { web3Config } from '../config/web3';
import { dbOperationLog } from '../middleware/audit';
import { StakingPool } from '../models/StakingPool';
import { StakingRecord } from '../models/StakingRecord';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export interface StakingResult {
  success: boolean;
  data?: any;
  error?: string;
  code?: string;
  transactionHash?: string;
}

export interface StakeData {
  userId: string;
  poolId: string;
  walletAddress: string;
  amount: number;
}

export interface UnstakeData {
  stakeId: string;
  walletAddress: string;
}

export interface ClaimRewardsData {
  stakeId: string;
  walletAddress: string;
}

export class StakingService {
  private static instance: StakingService | null = null;
  private connection: Connection;

  private constructor() {
    this.connection = web3Config.getConnection();
  }

  public static getInstance(): StakingService {
    if (!StakingService.instance) {
      StakingService.instance = new StakingService();
    }
    return StakingService.instance;
  }

  // Get all staking pools
  public async getStakingPools(): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const pools = await StakingPool.findActive();

      dbOperationLog('find', 'StakingPool', Date.now() - startTime, true);

      return {
        success: true,
        data: pools,
      };
    } catch (error) {
      logger.error('Error fetching staking pools:', error);
      dbOperationLog(
        'find',
        'StakingPool',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to fetch staking pools',
        code: 'FETCH_ERROR',
      };
    }
  }

  // Get staking pool by ID
  public async getStakingPool(poolId: string): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const pool = await StakingPool.findById(poolId);

      if (!pool) {
        return {
          success: false,
          error: 'Staking pool not found',
          code: 'POOL_NOT_FOUND',
        };
      }

      dbOperationLog('findById', 'StakingPool', Date.now() - startTime, true);

      return {
        success: true,
        data: pool,
      };
    } catch (error) {
      logger.error('Error fetching staking pool:', error);
      dbOperationLog(
        'findById',
        'StakingPool',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to fetch staking pool',
        code: 'FETCH_ERROR',
      };
    }
  }

  // Stake tokens
  public async stake(data: StakeData): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      // Validate pool
      const pool = await StakingPool.findById(data.poolId);
      if (!pool) {
        return {
          success: false,
          error: 'Staking pool not found',
          code: 'POOL_NOT_FOUND',
        };
      }

      // Validate user
      const user = await User.findById(data.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      // Create staking record
      const stakingRecord = new StakingRecord({
        user: data.userId,
        pool: data.poolId,
        amount: data.amount,
        stakedAt: new Date(),
        isActive: true,
      });

      await stakingRecord.save();

      // Update pool total staked
      pool.totalStaked += data.amount;
      await pool.save();

      dbOperationLog('stake', 'StakingRecord', Date.now() - startTime, true);

      return {
        success: true,
        data: stakingRecord,
        transactionHash: 'mock-transaction-hash',
      };
    } catch (error) {
      logger.error('Error staking tokens:', error);
      dbOperationLog(
        'stake',
        'StakingRecord',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to stake tokens',
        code: 'STAKING_ERROR',
      };
    }
  }

  // Unstake tokens
  public async unstake(data: UnstakeData): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const stakingRecord = await StakingRecord.findById(data.stakeId);
      if (!stakingRecord) {
        return {
          success: false,
          error: 'Staking record not found',
          code: 'RECORD_NOT_FOUND',
        };
      }

      if (!stakingRecord.isActive) {
        return {
          success: false,
          error: 'Staking record is not active',
          code: 'RECORD_INACTIVE',
        };
      }

      // Update staking record
      stakingRecord.isActive = false;
      stakingRecord.unstakedAt = new Date();
      await stakingRecord.save();

      // Update pool total staked
      const pool = await StakingPool.findById(stakingRecord.pool);
      if (pool) {
        pool.totalStaked -= stakingRecord.amount;
        await pool.save();
      }

      dbOperationLog('unstake', 'StakingRecord', Date.now() - startTime, true);

      return {
        success: true,
        data: stakingRecord,
        transactionHash: 'mock-unstake-transaction-hash',
      };
    } catch (error) {
      logger.error('Error unstaking tokens:', error);
      dbOperationLog(
        'unstake',
        'StakingRecord',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to unstake tokens',
        code: 'UNSTAKING_ERROR',
      };
    }
  }

  // Claim rewards
  public async claimRewards(data: ClaimRewardsData): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const stakingRecord = await StakingRecord.findById(data.stakeId);
      if (!stakingRecord) {
        return {
          success: false,
          error: 'Staking record not found',
          code: 'RECORD_NOT_FOUND',
        };
      }

      if (!stakingRecord.isActive) {
        return {
          success: false,
          error: 'Staking record is not active',
          code: 'RECORD_INACTIVE',
        };
      }

      // Calculate rewards (simplified calculation)
      const daysStaked = Math.floor(
        (Date.now() - stakingRecord.stakedAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      const pool = await StakingPool.findById(stakingRecord.pool);
      const dailyReward = pool
        ? (stakingRecord.amount * pool.apy) / (100 * 365)
        : 0;
      const totalRewards = dailyReward * daysStaked;

      // Update staking record
      stakingRecord.rewards = totalRewards;
      await stakingRecord.save();

      dbOperationLog(
        'claimRewards',
        'StakingRecord',
        Date.now() - startTime,
        true,
      );

      return {
        success: true,
        data: {
          rewards: totalRewards,
          stakingRecord,
        },
        transactionHash: 'mock-rewards-transaction-hash',
      };
    } catch (error) {
      logger.error('Error claiming rewards:', error);
      dbOperationLog(
        'claimRewards',
        'StakingRecord',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to claim rewards',
        code: 'CLAIM_ERROR',
      };
    }
  }

  // Get user staking info
  public async getUserStakingInfo(
    walletAddress: string,
  ): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      const stakingRecords = await StakingRecord.find({
        user: user._id,
        isActive: true,
      }).populate('pool');

      dbOperationLog(
        'getUserStakingInfo',
        'StakingRecord',
        Date.now() - startTime,
        true,
      );

      return {
        success: true,
        data: stakingRecords,
      };
    } catch (error) {
      logger.error('Error fetching user staking info:', error);
      dbOperationLog(
        'getUserStakingInfo',
        'StakingRecord',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to fetch user staking info',
        code: 'FETCH_ERROR',
      };
    }
  }

  // Get staking stats
  public async getStakingStats(): Promise<StakingResult> {
    const startTime = Date.now();

    try {
      const totalStaked = await StakingRecord.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const totalStakers = await StakingRecord.distinct('user', {
        isActive: true,
      });

      const stats = {
        totalStaked: totalStaked[0]?.total || 0,
        totalStakers: totalStakers.length,
        totalPools: await StakingPool.countDocuments({ isActive: true }),
      };

      dbOperationLog(
        'getStakingStats',
        'StakingRecord',
        Date.now() - startTime,
        true,
      );

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      logger.error('Error fetching staking stats:', error);
      dbOperationLog(
        'getStakingStats',
        'StakingRecord',
        Date.now() - startTime,
        false,
        error,
      );

      return {
        success: false,
        error: 'Failed to fetch staking stats',
        code: 'FETCH_ERROR',
      };
    }
  }
}
