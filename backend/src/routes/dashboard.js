const express = require('express');
const { body, param } = require('express-validator');
const { logger } = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Mock database - In production, replace with real database
let users = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@agrotm.com',
    phone: '+5511999999999',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    isEmailVerified: true,
    isPhoneVerified: true,
    walletAddress: '0x1234567890123456789012345678901234567890',
    twoFactorEnabled: false,
    twoFactorSecret: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let userPortfolios = [
  {
    userId: 1,
    nfts: [
      {
        id: 1,
        title: 'AGROTM NFT #001',
        image: 'https://via.placeholder.com/400x400/00ff7f/000000?text=AGROTM+NFT+001',
        purchasePrice: 0.5,
        purchasePriceUSD: 1500,
        purchaseDate: new Date('2024-01-15'),
        currentValue: 0.6,
        currentValueUSD: 1800,
        profitLoss: 300,
        profitLossPercentage: 20
      }
    ],
    cryptocurrencies: [
      {
        id: 1,
        symbol: 'AGROTM',
        name: 'AGROTM Token',
        logo: 'https://via.placeholder.com/64x64/00ff7f/000000?text=AGROTM',
        amount: 1000,
        purchasePrice: 0.8,
        purchasePriceUSD: 800,
        purchaseDate: new Date('2024-01-10'),
        currentPrice: 0.85,
        currentValue: 850,
        profitLoss: 50,
        profitLossPercentage: 6.25
      },
      {
        id: 2,
        symbol: 'AGROST',
        name: 'AGROTM Staking Token',
        logo: 'https://via.placeholder.com/64x64/0080ff/ffffff?text=AGROST',
        amount: 500,
        purchasePrice: 1.2,
        purchasePriceUSD: 600,
        purchaseDate: new Date('2024-01-12'),
        currentPrice: 1.25,
        currentValue: 625,
        profitLoss: 25,
        profitLossPercentage: 4.17
      }
    ],
    staking: [
      {
        id: 1,
        symbol: 'AGROTM',
        name: 'AGROTM Token',
        stakedAmount: 500,
        rewardRate: 12.5, // APY
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        totalRewards: 62.5,
        status: 'active'
      }
    ],
    transactions: [
      {
        id: 1,
        type: 'purchase',
        asset: 'NFT',
        assetName: 'AGROTM NFT #001',
        amount: 0.5,
        amountUSD: 1500,
        date: new Date('2024-01-15'),
        status: 'completed',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      },
      {
        id: 2,
        type: 'purchase',
        asset: 'Token',
        assetName: 'AGROTM Token',
        amount: 1000,
        amountUSD: 800,
        date: new Date('2024-01-10'),
        status: 'completed',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      }
    ]
  }
];

// Get user dashboard overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id) || {
      nfts: [],
      cryptocurrencies: [],
      staking: [],
      transactions: []
    };

    // Calculate portfolio totals
    const totalNftValue = portfolio.nfts.reduce((sum, nft) => sum + nft.currentValueUSD, 0);
    const totalCryptoValue = portfolio.cryptocurrencies.reduce((sum, crypto) => sum + crypto.currentValue, 0);
    const totalStakingValue = portfolio.staking.reduce((sum, stake) => sum + (stake.stakedAmount * 0.85), 0); // Current AGROTM price
    const totalPortfolioValue = totalNftValue + totalCryptoValue + totalStakingValue;

    const totalProfitLoss = portfolio.nfts.reduce((sum, nft) => sum + nft.profitLoss, 0) +
                           portfolio.cryptocurrencies.reduce((sum, crypto) => sum + crypto.profitLoss, 0);

    // Recent activity
    const recentTransactions = portfolio.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    logger.info(`Dashboard overview retrieved for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          walletAddress: user.walletAddress,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          lastLogin: user.lastLogin
        },
        portfolio: {
          totalValue: totalPortfolioValue,
          totalProfitLoss,
          totalProfitLossPercentage: totalPortfolioValue > 0 ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100 : 0,
          nftValue: totalNftValue,
          cryptoValue: totalCryptoValue,
          stakingValue: totalStakingValue,
          nftCount: portfolio.nfts.length,
          cryptoCount: portfolio.cryptocurrencies.length,
          stakingCount: portfolio.staking.length
        },
        recentActivity: recentTransactions,
        quickStats: {
          totalTransactions: portfolio.transactions.length,
          activeStaking: portfolio.staking.filter(s => s.status === 'active').length,
          totalRewards: portfolio.staking.reduce((sum, s) => sum + s.totalRewards, 0)
        }
      }
    });

  } catch (error) {
    logger.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user portfolio details
router.get('/portfolio', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id) || {
      nfts: [],
      cryptocurrencies: [],
      staking: [],
      transactions: []
    };

    logger.info(`Portfolio details retrieved for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user NFTs
router.get('/nfts', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);
    const userNfts = portfolio ? portfolio.nfts : [];

    logger.info(`User NFTs retrieved: ${userNfts.length} items`);

    res.json({
      success: true,
      data: userNfts
    });

  } catch (error) {
    logger.error('Get user NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user cryptocurrencies
router.get('/cryptocurrencies', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);
    const userCryptos = portfolio ? portfolio.cryptocurrencies : [];

    logger.info(`User cryptocurrencies retrieved: ${userCryptos.length} items`);

    res.json({
      success: true,
      data: userCryptos
    });

  } catch (error) {
    logger.error('Get user cryptocurrencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user staking
router.get('/staking', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);
    const userStaking = portfolio ? portfolio.staking : [];

    logger.info(`User staking retrieved: ${userStaking.length} items`);

    res.json({
      success: true,
      data: userStaking
    });

  } catch (error) {
    logger.error('Get user staking error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);
    const userTransactions = portfolio ? portfolio.transactions : [];

    logger.info(`User transactions retrieved: ${userTransactions.length} items`);

    res.json({
      success: true,
      data: userTransactions
    });

  } catch (error) {
    logger.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get wallet information
router.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Mock wallet data - In production, fetch from blockchain
    const walletInfo = {
      address: user.walletAddress,
      balance: {
        eth: 2.5,
        agrotm: 1000,
        agrost: 500,
        agrog: 200
      },
      balanceUSD: {
        eth: 7500, // Assuming ETH = $3000
        agrotm: 850,
        agrost: 625,
        agrog: 430
      },
      totalBalanceUSD: 9405,
      isConnected: true,
      network: 'Ethereum Mainnet',
      lastSync: new Date()
    };

    logger.info(`Wallet information retrieved for: ${user.walletAddress}`);

    res.json({
      success: true,
      data: walletInfo
    });

  } catch (error) {
    logger.error('Get wallet info error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Disconnect wallet
router.post('/wallet/disconnect', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // In production, handle wallet disconnection properly
    user.walletAddress = null;
    user.updatedAt = new Date();

    logger.info(`Wallet disconnected for user: ${user.email || user.id}`);

    res.json({
      success: true,
      message: 'Carteira desconectada com sucesso'
    });

  } catch (error) {
    logger.error('Disconnect wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get security settings
router.get('/security', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const securityInfo = {
      emailVerified: user.isEmailVerified,
      phoneVerified: user.isPhoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      walletConnected: !!user.walletAddress,
      lastPasswordChange: user.updatedAt,
      lastLogin: user.lastLogin,
      loginHistory: [
        {
          date: new Date('2024-01-15T10:30:00Z'),
          ip: '192.168.1.1',
          location: 'São Paulo, Brazil',
          device: 'Chrome on Windows'
        },
        {
          date: new Date('2024-01-14T15:45:00Z'),
          ip: '192.168.1.1',
          location: 'São Paulo, Brazil',
          device: 'Chrome on Windows'
        }
      ]
    };

    logger.info(`Security settings retrieved for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: securityInfo
    });

  } catch (error) {
    logger.error('Get security settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Enable 2FA
router.post('/security/2fa/enable', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA já está habilitado'
      });
    }

    // Generate 2FA secret (in production, use a proper 2FA library)
    const twoFactorSecret = require('crypto').randomBytes(20).toString('hex');
    
    user.twoFactorSecret = twoFactorSecret;
    user.twoFactorEnabled = true;
    user.updatedAt = new Date();

    logger.info(`2FA enabled for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      message: '2FA habilitado com sucesso',
      data: {
        secret: twoFactorSecret,
        qrCode: `otpauth://totp/AGROTM:${user.email}?secret=${twoFactorSecret}&issuer=AGROTM`
      }
    });

  } catch (error) {
    logger.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Disable 2FA
router.post('/security/2fa/disable', [
  authMiddleware,
  body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos'),
  checkValidation
], async (req, res) => {
  try {
    const { code } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA não está habilitado'
      });
    }

    // In production, verify the 2FA code
    // const isValidCode = verify2FACode(user.twoFactorSecret, code);
    // if (!isValidCode) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Código 2FA inválido'
    //   });
    // }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.updatedAt = new Date();

    logger.info(`2FA disabled for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      message: '2FA desabilitado com sucesso'
    });

  } catch (error) {
    logger.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Change password
router.post('/security/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Senha atual obrigatória'),
  body('newPassword').isLength({ min: 8 }).withMessage('Nova senha deve ter pelo menos 8 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Confirmação de senha não confere');
    }
    return true;
  }),
  checkValidation
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    logger.info(`Password changed for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get account activity
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);
    const transactions = portfolio ? portfolio.transactions : [];

    // Mock activity log
    const activityLog = [
      {
        id: 1,
        type: 'login',
        description: 'Login realizado com sucesso',
        date: new Date('2024-01-15T10:30:00Z'),
        ip: '192.168.1.1',
        location: 'São Paulo, Brazil'
      },
      {
        id: 2,
        type: 'purchase',
        description: 'Compra de AGROTM NFT #001',
        date: new Date('2024-01-15T09:15:00Z'),
        amount: 0.5,
        amountUSD: 1500
      },
      {
        id: 3,
        type: 'wallet_connect',
        description: 'Carteira Metamask conectada',
        date: new Date('2024-01-14T16:20:00Z'),
        walletAddress: user.walletAddress
      }
    ];

    logger.info(`Account activity retrieved for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: {
        transactions,
        activityLog
      }
    });

  } catch (error) {
    logger.error('Get account activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Export account data
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const portfolio = userPortfolios.find(p => p.userId === user.id);

    const exportData = {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt
      },
      portfolio: portfolio || {
        nfts: [],
        cryptocurrencies: [],
        staking: [],
        transactions: []
      },
      exportDate: new Date()
    };

    logger.info(`Account data exported for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    logger.error('Export account data error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Delete account
router.delete('/account', [
  authMiddleware,
  body('password').notEmpty().withMessage('Senha obrigatória para confirmar exclusão'),
  checkValidation
], async (req, res) => {
  try {
    const { password } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // In production, implement proper account deletion
    // For now, just mark as deleted
    user.deletedAt = new Date();
    user.updatedAt = new Date();

    logger.info(`Account deletion requested for user: ${user.email || user.walletAddress}`);

    res.json({
      success: true,
      message: 'Conta marcada para exclusão. A exclusão será processada em 30 dias.'
    });

  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
