import express from 'express';
import { verifyToken } from './auth';
import { logger } from '../../utils/logger';

const router = express.Router();

// Mock staking data
const stakingPools = [
  {
    id: 1,
    name: 'SOL Staking Pool',
    token: 'SOL',
    apy: 12.5,
    totalStaked: 1250000,
    participants: 15420,
    minStake: 1,
    maxStake: 10000,
    lockPeriod: '30 days',
    risk: 'Low',
    color: '#9945FF',
  },
  {
    id: 2,
    name: 'AGROTM Staking Pool',
    token: 'AGROTM',
    apy: 18.2,
    totalStaked: 850000,
    participants: 8920,
    minStake: 100,
    maxStake: 50000,
    lockPeriod: '90 days',
    risk: 'Medium',
    color: '#22C55E',
  },
  {
    id: 3,
    name: 'RAY Staking Pool',
    token: 'RAY',
    apy: 15.8,
    totalStaked: 450000,
    participants: 5670,
    minStake: 10,
    maxStake: 25000,
    lockPeriod: '60 days',
    risk: 'Medium',
    color: '#FF6B6B',
  },
];

const userStakes = [
  {
    id: 1,
    userId: 1,
    poolId: 1,
    amount: 45.67,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-01'),
    isActive: true,
    earned: 2.34,
  },
  {
    id: 2,
    userId: 1,
    poolId: 2,
    amount: 1234.56,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    isActive: true,
    earned: 45.67,
  },
];

// Get all staking pools
router.get('/pools', (req, res) => {
  try {
    logger.info('Fetching staking pools');
    res.json({
      success: true,
      data: stakingPools,
    });
  } catch (error) {
    logger.error('Error fetching staking pools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific staking pool
router.get('/pools/:id', (req, res) => {
  try {
    const poolId = parseInt(req.params.id);
    const pool = stakingPools.find(p => p.id === poolId);

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    logger.info(`Fetching staking pool: ${poolId}`);
    res.json({
      success: true,
      data: pool,
    });
  } catch (error) {
    logger.error('Error fetching staking pool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stakes
router.get('/user-stakes', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userStakeData = userStakes.filter(stake => stake.userId === userId);

    logger.info(`Fetching user stakes for user: ${userId}`);
    res.json({
      success: true,
      data: userStakeData,
    });
  } catch (error) {
    logger.error('Error fetching user stakes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stake tokens
router.post('/stake', verifyToken, (req, res) => {
  try {
    const { poolId, amount } = req.body;
    const userId = req.user.userId;

    // Validate pool exists
    const pool = stakingPools.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Validate amount
    if (amount < pool.minStake || amount > pool.maxStake) {
      return res.status(400).json({ 
        error: `Amount must be between ${pool.minStake} and ${pool.maxStake} ${pool.token}` 
      });
    }

    // Create new stake
    const newStake = {
      id: userStakes.length + 1,
      userId,
      poolId,
      amount: parseFloat(amount),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
      earned: 0,
    };

    userStakes.push(newStake);

    logger.info(`User ${userId} staked ${amount} ${pool.token} in pool ${poolId}`);

    res.status(201).json({
      success: true,
      message: 'Staking successful',
      data: newStake,
    });
  } catch (error) {
    logger.error('Error staking tokens:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unstake tokens
router.post('/unstake', verifyToken, (req, res) => {
  try {
    const { stakeId } = req.body;
    const userId = req.user.userId;

    const stakeIndex = userStakes.findIndex(s => s.id === stakeId && s.userId === userId);
    
    if (stakeIndex === -1) {
      return res.status(404).json({ error: 'Stake not found' });
    }

    const stake = userStakes[stakeIndex];
    
    // Check if lock period has passed
    if (new Date() < stake.endDate) {
      return res.status(400).json({ error: 'Lock period has not ended yet' });
    }

    // Mark stake as inactive
    userStakes[stakeIndex].isActive = false;

    logger.info(`User ${userId} unstaked ${stake.amount} tokens from stake ${stakeId}`);

    res.json({
      success: true,
      message: 'Unstaking successful',
      data: {
        amount: stake.amount,
        earned: stake.earned,
      },
    });
  } catch (error) {
    logger.error('Error unstaking tokens:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim rewards
router.post('/claim-rewards', verifyToken, (req, res) => {
  try {
    const { stakeId } = req.body;
    const userId = req.user.userId;

    const stake = userStakes.find(s => s.id === stakeId && s.userId === userId);
    
    if (!stake) {
      return res.status(404).json({ error: 'Stake not found' });
    }

    if (stake.earned <= 0) {
      return res.status(400).json({ error: 'No rewards to claim' });
    }

    const earnedAmount = stake.earned;
    stake.earned = 0;

    logger.info(`User ${userId} claimed ${earnedAmount} rewards from stake ${stakeId}`);

    res.json({
      success: true,
      message: 'Rewards claimed successfully',
      data: {
        claimed: earnedAmount,
      },
    });
  } catch (error) {
    logger.error('Error claiming rewards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get staking statistics
router.get('/stats', (req, res) => {
  try {
    const totalValueLocked = stakingPools.reduce((sum, pool) => sum + pool.totalStaked, 0);
    const averageApy = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;
    const totalParticipants = stakingPools.reduce((sum, pool) => sum + pool.participants, 0);

    logger.info('Fetching staking statistics');

    res.json({
      success: true,
      data: {
        totalValueLocked,
        averageApy,
        totalParticipants,
        totalPools: stakingPools.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching staking statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 