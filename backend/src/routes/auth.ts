import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../utils/logger';

const router = Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body;

    // Basic validation
    if (!email || !password || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        code: 'MISSING_FIELDS',
      });
    }

    // Mock user creation (in real app, save to database)
    // const _hashedPassword = await bcrypt.hash(password, 12);

    logger.info('User registration attempt', {
      email,
      walletAddress,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        email,
        walletAddress,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS',
      });
    }

    // Mock authentication (in real app, verify against database)
    const token = jwt.sign(
      { email, userId: 'mock-user-id' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' },
    );

    logger.info('User login attempt', {
      email,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          email,
          id: 'mock-user-id',
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        code: 'NO_TOKEN',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
    );

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: decoded,
      },
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }
});

export default router;
