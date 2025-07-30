import express from 'express';
import { verifyToken } from './auth';
import { logger } from '../../utils/logger';

const router = express.Router();

// Mock DeFi data
const liquidityPools = [
  {
    id: 1,
    name: 'SOL-USDC Pool',
    token0: 'SOL',
    token1: 'USDC',
    token0Address: 'So11111111111111111111111111111111111111112',
    token1Address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    totalLiquidity: 2500000,
    volume24h: 125000,
    feeRate: 0.003,
    apy: 45.2,
    isActive: true,
  },
  {
    id: 2,
    name: 'AGROTM-SOL Pool',
    token0: 'AGROTM',
    token1: 'SOL',
    token0Address: 'AgroTM111111111111111111111111111111111111111',
    token1Address: 'So11111111111111111111111111111111111111112',
    totalLiquidity: 850000,
    volume24h: 45000,
    feeRate: 0.003,
    apy: 38.7,
    isActive: true,
  },
  {
    id: 3,
    name: 'RAY-USDC Pool',
    token0: 'RAY',
    token1: 'USDC',
    token0Address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    token1Address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    totalLiquidity: 1200000,
    volume24h: 89000,
    feeRate: 0.003,
    apy: 42.1,
    isActive: true,
  },
];

const yieldFarms = [
  {
    id: 1,
    name: 'SOL-USDC Farm',
    poolId: 1,
    rewardToken: 'AGROTM',
    rewardRate: 100,
    totalStaked: 1800000,
    apy: 65.3,
    isActive: true,
  },
  {
    id: 2,
    name: 'AGROTM-SOL Farm',
    poolId: 2,
    rewardToken: 'AGROTM',
    rewardRate: 150,
    totalStaked: 650000,
    apy: 78.9,
    isActive: true,
  },
];

// Get all liquidity pools
router.get('/pools', (req, res) => {
  try {
    logger.info('Fetching liquidity pools');
    res.json({
      success: true,
      data: liquidityPools,
    });
  } catch (error) {
    logger.error('Error fetching liquidity pools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific liquidity pool
router.get('/pools/:id', (req, res) => {
  try {
    const poolId = parseInt(req.params.id);
    const pool = liquidityPools.find(p => p.id === poolId);

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    logger.info(`Fetching liquidity pool: ${poolId}`);
    res.json({
      success: true,
      data: pool,
    });
  } catch (error) {
    logger.error('Error fetching liquidity pool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get yield farms
router.get('/farms', (req, res) => {
  try {
    logger.info('Fetching yield farms');
    res.json({
      success: true,
      data: yieldFarms,
    });
  } catch (error) {
    logger.error('Error fetching yield farms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add liquidity
router.post('/add-liquidity', verifyToken, (req, res) => {
  try {
    const { poolId, token0Amount, token1Amount } = req.body;
    const userId = req.user.userId;

    const pool = liquidityPools.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Simulate liquidity addition
    const liquidityTokens = Math.sqrt(token0Amount * token1Amount);

    logger.info(`User ${userId} added liquidity to pool ${poolId}`);

    res.status(201).json({
      success: true,
      message: 'Liquidity added successfully',
      data: {
        liquidityTokens,
        poolId,
        token0Amount,
        token1Amount,
      },
    });
  } catch (error) {
    logger.error('Error adding liquidity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove liquidity
router.post('/remove-liquidity', verifyToken, (req, res) => {
  try {
    const { poolId, liquidityTokens } = req.body;
    const userId = req.user.userId;

    const pool = liquidityPools.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Simulate liquidity removal
    const token0Amount = liquidityTokens * 0.5; // Simplified calculation
    const token1Amount = liquidityTokens * 0.5;

    logger.info(`User ${userId} removed liquidity from pool ${poolId}`);

    res.json({
      success: true,
      message: 'Liquidity removed successfully',
      data: {
        token0Amount,
        token1Amount,
        poolId,
      },
    });
  } catch (error) {
    logger.error('Error removing liquidity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Swap tokens
router.post('/swap', verifyToken, (req, res) => {
  try {
    const { tokenIn, tokenOut, amountIn, slippage } = req.body;
    const userId = req.user.userId;

    // Simulate swap calculation
    const amountOut = amountIn * 0.997; // Simplified calculation with 0.3% fee

    logger.info(`User ${userId} swapped ${amountIn} ${tokenIn} for ${amountOut} ${tokenOut}`);

    res.json({
      success: true,
      message: 'Swap successful',
      data: {
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        slippage,
      },
    });
  } catch (error) {
    logger.error('Error swapping tokens:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get DeFi statistics
router.get('/stats', (req, res) => {
  try {
    const totalValueLocked = liquidityPools.reduce((sum, pool) => sum + pool.totalLiquidity, 0);
    const totalVolume24h = liquidityPools.reduce((sum, pool) => sum + pool.volume24h, 0);
    const averageApy = yieldFarms.reduce((sum, farm) => sum + farm.apy, 0) / yieldFarms.length;

    logger.info('Fetching DeFi statistics');

    res.json({
      success: true,
      data: {
        totalValueLocked,
        totalVolume24h,
        averageApy,
        totalPools: liquidityPools.length,
        totalFarms: yieldFarms.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching DeFi statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get token prices
router.get('/prices', (req, res) => {
  try {
    const prices = {
      SOL: 98.45,
      USDC: 1.00,
      AGROTM: 0.25,
      RAY: 2.34,
    };

    logger.info('Fetching token prices');

    res.json({
      success: true,
      data: prices,
    });
  } catch (error) {
    logger.error('Error fetching token prices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 