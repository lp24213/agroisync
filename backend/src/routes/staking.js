const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock staking data
const mockStakingPools = [
  {
    id: 1,
    name: 'AGROTM Staking Pool',
    apy: 12.5,
    minStake: 100,
    maxStake: 100000,
    totalStaked: 500000,
    totalRewards: 25000,
    lockPeriod: 30, // days
    active: true
  },
  {
    id: 2,
    name: 'Premium Staking Pool',
    apy: 18.0,
    minStake: 1000,
    maxStake: 500000,
    totalStaked: 200000,
    totalRewards: 15000,
    lockPeriod: 90, // days
    active: true
  }
];

const mockUserStakes = [
  {
    userId: 1,
    poolId: 1,
    amount: 5000,
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    rewards: 625,
    status: 'active'
  },
  {
    userId: 2,
    poolId: 1,
    amount: 2000,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    rewards: 250,
    status: 'active'
  }
];

// @route   GET /api/staking/pools
// @desc    Get all staking pools
// @access  Private
router.get('/pools', (req, res) => {
  try {
    logger.info('Staking pools requested');

    res.json({
      success: true,
      pools: mockStakingPools.filter(pool => pool.active)
    });
  } catch (error) {
    logger.error('Get staking pools error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/staking/pools/:id
// @desc    Get specific staking pool
// @access  Private
router.get('/pools/:id', (req, res) => {
  try {
    const poolId = parseInt(req.params.id);
    const pool = mockStakingPools.find(p => p.id === poolId && p.active);

    if (!pool) {
      return res.status(404).json({
        success: false,
        error: 'Staking pool not found'
      });
    }

    logger.info(`Staking pool ${poolId} requested`);

    res.json({
      success: true,
      pool
    });
  } catch (error) {
    logger.error('Get staking pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/staking/stake
// @desc    Stake tokens
// @access  Private
router.post('/stake', (req, res) => {
  try {
    const { poolId, amount } = req.body;

    if (!poolId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Pool ID and amount are required'
      });
    }

    const pool = mockStakingPools.find(p => p.id === parseInt(poolId) && p.active);
    if (!pool) {
      return res.status(404).json({
        success: false,
        error: 'Staking pool not found'
      });
    }

    if (amount < pool.minStake) {
      return res.status(400).json({
        success: false,
        error: `Minimum stake amount is ${pool.minStake} AGROTM`
      });
    }

    if (amount > pool.maxStake) {
      return res.status(400).json({
        success: false,
        error: `Maximum stake amount is ${pool.maxStake} AGROTM`
      });
    }

    // Create new stake
    const newStake = {
      userId: req.user.id,
      poolId: parseInt(poolId),
      amount: parseFloat(amount),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + pool.lockPeriod * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rewards: 0,
      status: 'active'
    };

    mockUserStakes.push(newStake);

    // Update pool total staked
    pool.totalStaked += parseFloat(amount);

    logger.info(`User ${req.user.id} staked ${amount} AGROTM in pool ${poolId}`);

    res.status(201).json({
      success: true,
      stake: newStake,
      message: `Successfully staked ${amount} AGROTM`
    });
  } catch (error) {
    logger.error('Stake error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/staking/unstake
// @desc    Unstake tokens
// @access  Private
router.post('/unstake', (req, res) => {
  try {
    const { stakeId } = req.body;

    if (!stakeId) {
      return res.status(400).json({
        success: false,
        error: 'Stake ID is required'
      });
    }

    const stakeIndex = mockUserStakes.findIndex(s => 
      s.userId === req.user.id && s.id === parseInt(stakeId)
    );

    if (stakeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Stake not found'
      });
    }

    const stake = mockUserStakes[stakeIndex];
    const pool = mockStakingPools.find(p => p.id === stake.poolId);

    // Check if lock period has ended
    const lockEndDate = new Date(stake.startDate);
    lockEndDate.setDate(lockEndDate.getDate() + pool.lockPeriod);
    
    if (new Date() < lockEndDate) {
      return res.status(400).json({
        success: false,
        error: `Cannot unstake before lock period ends (${stake.endDate})`
      });
    }

    // Calculate rewards
    const daysStaked = Math.floor((new Date() - new Date(stake.startDate)) / (1000 * 60 * 60 * 24));
    const rewards = (stake.amount * pool.apy / 100) * (daysStaked / 365);

    // Update stake
    mockUserStakes[stakeIndex].status = 'completed';
    mockUserStakes[stakeIndex].rewards = rewards;

    // Update pool
    pool.totalStaked -= stake.amount;
    pool.totalRewards += rewards;

    logger.info(`User ${req.user.id} unstaked ${stake.amount} AGROTM with ${rewards} rewards`);

    res.json({
      success: true,
      unstake: {
        amount: stake.amount,
        rewards: rewards,
        totalReturn: stake.amount + rewards
      },
      message: `Successfully unstaked ${stake.amount} AGROTM with ${rewards} rewards`
    });
  } catch (error) {
    logger.error('Unstake error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/staking/rewards
// @desc    Get user staking rewards
// @access  Private
router.get('/rewards', (req, res) => {
  try {
    const userStakes = mockUserStakes.filter(s => s.userId === req.user.id);
    
    const totalStaked = userStakes.reduce((sum, stake) => sum + stake.amount, 0);
    const totalRewards = userStakes.reduce((sum, stake) => sum + stake.rewards, 0);
    const activeStakes = userStakes.filter(s => s.status === 'active');

    logger.info(`Rewards requested for user ${req.user.id}`);

    res.json({
      success: true,
      rewards: {
        totalStaked,
        totalRewards,
        activeStakes: activeStakes.length,
        stakes: userStakes
      }
    });
  } catch (error) {
    logger.error('Get rewards error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/staking/history
// @desc    Get user staking history
// @access  Private
router.get('/history', (req, res) => {
  try {
    const userStakes = mockUserStakes.filter(s => s.userId === req.user.id);

    logger.info(`Staking history requested for user ${req.user.id}`);

    res.json({
      success: true,
      history: userStakes
    });
  } catch (error) {
    logger.error('Get staking history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
