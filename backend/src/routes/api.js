import express, { Router } from 'express';
import productRoutes from './products.js';
import freightRoutes from './freights.js';
import authRoutes from './auth.js';
import paymentRoutes from './payments.js';
import messagingRoutes from './messaging.js';

const router = Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'AGROISYNC API',
    version: '2.3.1',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      products: '/api/products',
      freights: '/api/freights',
      payments: '/api/payments',
      messaging: '/api/messaging',
      blockchain: '/api/blockchain',
      agriculture: '/api/agriculture'
    }
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Product routes
router.use('/products', productRoutes);

// Freight routes
router.use('/freights', freightRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Messaging routes
router.use('/messaging', messagingRoutes);

// Blockchain endpoint
router.get('/blockchain', (req, res) => {
  res.json({
    message: 'Blockchain services available',
    networks: ['solana', 'ethereum', 'polygon'],
    status: 'operational'
  });
});

// Agriculture endpoint
router.get('/agriculture', (req, res) => {
  res.json({
    message: 'Agriculture services available',
    services: ['crop-monitoring', 'weather-data', 'market-prices'],
    status: 'operational'
  });
});

export default router;
