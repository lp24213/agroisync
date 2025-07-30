import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { logger } from '../utils/logger';

// Import routes
import authRoutes from './routes/auth';
import stakingRoutes from './routes/staking';
import defiRoutes from './routes/defi';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/defi', defiRoutes);

// Mock endpoints for backward compatibility
app.get('/api/defi/pools', async (req, res) => {
  try {
    const mockPools = [
      {
        id: 1,
        name: 'SOL-USDC Pool',
        token0: 'SOL',
        token1: 'USDC',
        totalLiquidity: 2500000,
        volume24h: 125000,
        apy: 45.2,
      },
      {
        id: 2,
        name: 'AGROTM-SOL Pool',
        token0: 'AGROTM',
        token1: 'SOL',
        totalLiquidity: 850000,
        volume24h: 45000,
        apy: 38.7,
      },
    ];
    
    res.json({
      success: true,
      data: mockPools,
    });
  } catch (error) {
    logger.error('Error fetching DeFi pools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats/overview', async (req, res) => {
  try {
    const mockStats = {
      totalValueLocked: 3500000,
      totalUsers: 50000,
      averageApy: 15.3,
      totalTransactions: 1200000,
      securityScore: 9.8,
      supportedTokens: 150,
    };
    
    res.json({
      success: true,
      data: mockStats,
    });
  } catch (error) {
    logger.error('Error fetching stats overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 