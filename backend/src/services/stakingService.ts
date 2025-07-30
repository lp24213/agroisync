import { StakingPool, IStakingPool } from '../models/StakingPool';
import { StakingRecord, IStakingRecord } from '../models/StakingRecord';
import { User } from '../models/User';
import { web3Config } from '../config/web3';
import { logger } from '../../utils/logger';
import { web3TransactionLog, dbOperationLog } from '../middleware/audit';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

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
  private static instance: StakingService;
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
        data: pools
      };
    } catch (error) {
      logger.error('Error fetching staking pools:', error);
      dbOperationLog('find', 'StakingPool', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Failed to fetch staking pools',
        code: 'FETCH_ERROR'
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
          code: 'POOL_NOT_FOUND'
        };
      }
      
      dbOperationLog('findById', 'StakingPool', Date.now() - startTime, true);
      
      return {
        success: true,
        data: pool
      };
    } catch (error) {
      logger.error('Error fetching staking pool:', error);
      dbOperationLog('findById', 'StakingPool', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Failed to fetch staking pool',
        code: 'FETCH_ERROR'
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
          code: 'POOL_NOT_FOUND'
        };
      }

      // Validate user
      const user = await User.findById(data.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      // Check if pool can accept stake
      if (!pool.canStake(data.amount)) {
        return {
          success: false,
          error: `Cannot stake ${data.amount} tokens. Pool requirements: min ${pool.minStake}, max ${pool.maxStake}`,
          code: 'INVALID_STAKE_AMOUNT'
        };
      }

      // Check wallet balance (mock for now)
      const balance = await this.getWalletBalance(data.walletAddress);
      if (balance < data.amount) {
        return {
          success: false,
          error: 'Insufficient wallet balance',
          code: 'INSUFFICIENT_BALANCE'
        };
      }

      // Create blockchain transaction (mock for now)
      const transactionHash = await this.createStakeTransaction(data);
      
      // Create staking record
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + pool.lockPeriod);

      const stakingRecord = new StakingRecord({
        userId: data.userId,
        poolId: data.poolId,
        walletAddress: data.walletAddress,
        amount: data.amount,
        startDate: new Date(),
        unlockDate,
        isActive: true,
        isUnlocked: false,
        transactionHash,
        apyAtStake: pool.apy,
        status: 'active'
      });

      await stakingRecord.save();

      // Update pool statistics
      pool.totalStaked += data.amount;
      pool.currentCapacity += data.amount;
      pool.stakersCount += 1;
      await pool.save();

      // Log transaction
      web3TransactionLog(transactionHash, 'stake', data.walletAddress, true);
      dbOperationLog('create', 'StakingRecord', Date.now() - startTime, true);

      logger.info('Staking successful', {
        userId: data.userId,
        poolId: data.poolId,
        amount: data.amount,
        transactionHash
      });

      return {
        success: true,
        data: {
          stakeId: stakingRecord._id,
          poolId: data.poolId,
          amount: data.amount,
          startDate: stakingRecord.startDate,
          unlockDate: stakingRecord.unlockDate,
          estimatedRewards: (data.amount * pool.apy) / 100,
          transactionHash
        }
      };
    } catch (error) {
      logger.error('Staking error:', error);
      dbOperationLog('create', 'StakingRecord', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Staking failed',
        code: 'STAKING_ERROR'
      };
    }
  }

  // Unstake tokens
  public async unstake(data: UnstakeData): Promise<StakingResult> {
    const startTime = Date.now();
    
    try {
      // Find staking record
      const stakingRecord = await StakingRecord.findById(data.stakeId)
        .populate('poolId');

      if (!stakingRecord) {
        return {
          success: false,
          error: 'Staking record not found',
          code: 'STAKE_NOT_FOUND'
        };
      }

      // Check ownership
      if (stakingRecord.walletAddress !== data.walletAddress) {
        return {
          success: false,
          error: 'Access denied to this stake',
          code: 'ACCESS_DENIED'
        };
      }

      // Check if can unstake
      if (!stakingRecord.canUnstake) {
        return {
          success: false,
          error: 'Cannot unstake at this time. Lock period not completed.',
          code: 'LOCK_PERIOD_NOT_COMPLETED'
        };
      }

      // Create blockchain transaction (mock for now)
      const transactionHash = await this.createUnstakeTransaction(data);
      
      // Update staking record
      await stakingRecord.unstake(transactionHash);

      // Update pool statistics
      const pool = stakingRecord.poolId as IStakingPool;
      pool.totalStaked -= stakingRecord.amount;
      pool.currentCapacity -= stakingRecord.amount;
      pool.stakersCount = Math.max(0, pool.stakersCount - 1);
      await pool.save();

      // Log transaction
      web3TransactionLog(transactionHash, 'unstake', data.walletAddress, true);
      dbOperationLog('update', 'StakingRecord', Date.now() - startTime, true);

      logger.info('Unstaking successful', {
        stakeId: data.stakeId,
        walletAddress: data.walletAddress,
        amount: stakingRecord.amount,
        transactionHash
      });

      return {
        success: true,
        data: {
          stakeId: data.stakeId,
          amount: stakingRecord.amount,
          rewards: stakingRecord.rewards,
          transactionHash
        }
      };
    } catch (error) {
      logger.error('Unstaking error:', error);
      dbOperationLog('update', 'StakingRecord', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Unstaking failed',
        code: 'UNSTAKING_ERROR'
      };
    }
  }

  // Claim rewards
  public async claimRewards(data: ClaimRewardsData): Promise<StakingResult> {
    const startTime = Date.now();
    
    try {
      // Find staking record
      const stakingRecord = await StakingRecord.findById(data.stakeId)
        .populate('poolId');

      if (!stakingRecord) {
        return {
          success: false,
          error: 'Staking record not found',
          code: 'STAKE_NOT_FOUND'
        };
      }

      // Check ownership
      if (stakingRecord.walletAddress !== data.walletAddress) {
        return {
          success: false,
          error: 'Access denied to this stake',
          code: 'ACCESS_DENIED'
        };
      }

      // Calculate rewards
      const rewards = stakingRecord.calculateRewards();
      
      if (rewards <= 0) {
        return {
          success: false,
          error: 'No rewards available to claim',
          code: 'NO_REWARDS'
        };
      }

      // Create blockchain transaction (mock for now)
      const transactionHash = await this.createClaimRewardsTransaction(data, rewards);
      
      // Update staking record
      await stakingRecord.claimRewards(rewards);

      // Log transaction
      web3TransactionLog(transactionHash, 'claim_rewards', data.walletAddress, true);
      dbOperationLog('update', 'StakingRecord', Date.now() - startTime, true);

      logger.info('Rewards claimed successfully', {
        stakeId: data.stakeId,
        walletAddress: data.walletAddress,
        rewards,
        transactionHash
      });

      return {
        success: true,
        data: {
          stakeId: data.stakeId,
          rewards,
          transactionHash
        }
      };
    } catch (error) {
      logger.error('Claim rewards error:', error);
      dbOperationLog('update', 'StakingRecord', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Claim rewards failed',
        code: 'CLAIM_ERROR'
      };
    }
  }

  // Get user staking info
  public async getUserStakingInfo(walletAddress: string): Promise<StakingResult> {
    const startTime = Date.now();
    
    try {
      const stakes = await StakingRecord.findActiveByWallet(walletAddress);
      
      const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
      const totalRewards = stakes.reduce((sum, stake) => sum + stake.calculateRewards(), 0);
      
      dbOperationLog('find', 'StakingRecord', Date.now() - startTime, true);
      
      return {
        success: true,
        data: {
          walletAddress,
          stakes,
          totalStaked,
          totalRewards,
          activeStakes: stakes.length
        }
      };
    } catch (error) {
      logger.error('Error fetching user staking info:', error);
      dbOperationLog('find', 'StakingRecord', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Failed to fetch staking info',
        code: 'FETCH_ERROR'
      };
    }
  }

  // Get staking statistics
  public async getStakingStats(): Promise<StakingResult> {
    const startTime = Date.now();
    
    try {
      const pools = await StakingPool.findActive();
      const totalStaked = pools.reduce((sum, pool) => sum + pool.totalStaked, 0);
      const totalRewards = pools.reduce((sum, pool) => sum + pool.totalRewards, 0);
      const averageApy = pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length;
      
      dbOperationLog('find', 'StakingPool', Date.now() - startTime, true);
      
      return {
        success: true,
        data: {
          totalStaked,
          totalRewards,
          averageApy,
          activePools: pools.filter(p => p.isActive).length,
          totalPools: pools.length
        }
      };
    } catch (error) {
      logger.error('Error fetching staking stats:', error);
      dbOperationLog('find', 'StakingPool', Date.now() - startTime, false, error);
      
      return {
        success: false,
        error: 'Failed to fetch staking stats',
        code: 'FETCH_ERROR'
      };
    }
  }

  // Mock blockchain transaction methods
  private async getWalletBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      logger.error('Error getting wallet balance:', error);
      return 0;
    }
  }

  private async createStakeTransaction(data: StakeData): Promise<string> {
    // Mock transaction creation
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    logger.info('Mock stake transaction created:', { txHash, data });
    return txHash;
  }

  private async createUnstakeTransaction(data: UnstakeData): Promise<string> {
    // Mock transaction creation
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    logger.info('Mock unstake transaction created:', { txHash, data });
    return txHash;
  }

  private async createClaimRewardsTransaction(data: ClaimRewardsData, rewards: number): Promise<string> {
    // Mock transaction creation
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    logger.info('Mock claim rewards transaction created:', { txHash, data, rewards });
    return txHash;
  }
}

export const stakingService = StakingService.getInstance(); 