import express, { Router } from 'express';
import productRoutes from './products.js';
import freightRoutes from './freights.js';

const router: Router = express.Router();

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'AGROISYNC API',
    version: '2.3.1',
    endpoints: {
      health: '/health',
      api: '/api',
      products: '/api/products',
      freights: '/api/freights',
      blockchain: '/api/blockchain',
      agriculture: '/api/agriculture'
    }
  });
});

// Product routes
router.use('/products', productRoutes);

// Freight routes
router.use('/freights', freightRoutes);

// Blockchain endpoint
router.get('/blockchain', (_req, res) => {
  res.json({
    message: 'Blockchain services available',
    networks: ['solana', 'ethereum', 'polygon'],
    status: 'operational'
  });
});

// Agriculture endpoint
router.get('/agriculture', (_req, res) => {
  res.json({
    message: 'Agriculture services available',
    services: ['crop-monitoring', 'weather-data', 'market-prices'],
    status: 'operational'
  });
});

export default router;
