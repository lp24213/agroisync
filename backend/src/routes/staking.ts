import { Router } from 'express';

import { logger } from '../utils/logger';

const router = Router();

// Get staking pools
router.get('/pools', async (req, res) => {
  try {
    const mockPools = [
      {
        id: 1,
        name: 'AGROTM Staking Pool',
        token: 'AGROTM',
        totalStaked: 1000000,
        apy: 12.5,
        minStake: 100,
        maxStake: 100000,
        lockPeriod: 30,
        rewards: 125000,
      },
      {
        id: 2,
        name: 'SOL Staking Pool',
        token: 'SOL',
        totalStaked: 500000,
        apy: 8.2,
        minStake: 1,
        maxStake: 50000,
        lockPeriod: 7,
        rewards: 41000,
      },
    ];

    res.json({
      success: true,
      data: mockPools,
    });
  } catch (error) {
    logger.error('Error fetching staking pools:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Get user staking positions
router.get('/positions', async (req, res) => {
  try {
    const { walletAddress } = req.query;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required',
        code: 'MISSING_WALLET_ADDRESS',
      });
    }

    const mockPositions = [
      {
        id: 1,
        poolId: 1,
        poolName: 'AGROTM Staking Pool',
        stakedAmount: 5000,
        rewardsEarned: 625,
        startDate: '2024-01-15T10:30:00Z',
        endDate: '2024-02-15T10:30:00Z',
        status: 'active',
      },
    ];

    res.json({
      success: true,
      data: mockPositions,
    });
  } catch (error) {
    logger.error('Error fetching staking positions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Stake tokens
router.post('/stake', async (req, res) => {
  try {
    const { poolId, amount, walletAddress } = req.body;

    if (!poolId || !amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Pool ID, amount, and wallet address are required',
        code: 'MISSING_FIELDS',
      });
    }

    logger.info('Staking attempt', {
      poolId,
      amount,
      walletAddress,
      timestamp: new Date().toISOString(),
    });

    // Mock staking transaction
    const mockTransaction = {
      txHash: 'mock-transaction-hash-' + Date.now(),
      status: 'pending',
      poolId,
      amount,
      walletAddress,
    };

    res.status(201).json({
      success: true,
      message: 'Staking transaction initiated',
      data: mockTransaction,
    });
  } catch (error) {
    logger.error('Staking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Unstake tokens
router.post('/unstake', async (req, res) => {
  try {
    const { positionId, walletAddress } = req.body;

    if (!positionId || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Position ID and wallet address are required',
        code: 'MISSING_FIELDS',
      });
    }

    logger.info('Unstaking attempt', {
      positionId,
      walletAddress,
      timestamp: new Date().toISOString(),
    });

    // Mock unstaking transaction
    const mockTransaction = {
      txHash: 'mock-unstake-hash-' + Date.now(),
      status: 'pending',
      positionId,
      walletAddress,
    };

    res.json({
      success: true,
      message: 'Unstaking transaction initiated',
      data: mockTransaction,
    });
  } catch (error) {
    logger.error('Unstaking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Claim rewards
router.post('/claim-rewards', async (req, res) => {
  try {
    const { positionId, walletAddress } = req.body;

    if (!positionId || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Position ID and wallet address are required',
        code: 'MISSING_FIELDS',
      });
    }

    logger.info('Reward claim attempt', {
      positionId,
      walletAddress,
      timestamp: new Date().toISOString(),
    });

    // Mock reward claim transaction
    const mockTransaction = {
      txHash: 'mock-claim-hash-' + Date.now(),
      status: 'pending',
      positionId,
      walletAddress,
      claimedAmount: 125.5,
    };

    res.json({
      success: true,
      message: 'Reward claim transaction initiated',
      data: mockTransaction,
    });
  } catch (error) {
    logger.error('Reward claim error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
