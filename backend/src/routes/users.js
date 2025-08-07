const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'admin@agrotm.com',
    name: 'Admin AGROTM',
    role: 'admin',
    wallet: '0x1234567890abcdef',
    balance: 10000,
    staked: 5000
  },
  {
    id: 2,
    email: 'user@agrotm.com',
    name: 'User AGROTM',
    role: 'user',
    wallet: '0xabcdef1234567890',
    balance: 5000,
    staked: 2000
  }
];

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`Profile requested for user ${user.id}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', (req, res) => {
  try {
    const { name, email } = req.body;
    
    const userIndex = mockUsers.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user data
    if (name) mockUsers[userIndex].name = name;
    if (email) mockUsers[userIndex].email = email;

    logger.info(`Profile updated for user ${req.user.id}`);

    res.json({
      success: true,
      user: {
        id: mockUsers[userIndex].id,
        email: mockUsers[userIndex].email,
        name: mockUsers[userIndex].name,
        role: mockUsers[userIndex].role
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/wallet
// @desc    Get user wallet info
// @access  Private
router.get('/wallet', (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`Wallet info requested for user ${user.id}`);

    res.json({
      success: true,
      wallet: {
        address: user.wallet,
        balance: user.balance,
        staked: user.staked,
        available: user.balance - user.staked
      }
    });
  } catch (error) {
    logger.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
