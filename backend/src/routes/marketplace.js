const express = require('express');
const { body, query, param } = require('express-validator');
const { logger } = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Mock database - In production, replace with real database
let nfts = [
  {
    id: 1,
    title: 'AGROTM NFT #001',
    description: 'Primeira NFT oficial da AGROTM - Agricultura Digital',
    image: 'https://via.placeholder.com/400x400/00ff7f/000000?text=AGROTM+NFT+001',
    price: 0.5, // ETH
    priceUSD: 1500,
    creator: '0x1234567890123456789012345678901234567890',
    owner: null,
    tokenId: '1',
    contractAddress: '0xAGROTMNFTContractAddress',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Category', value: 'Agriculture' },
        { trait_type: 'Edition', value: 'Genesis' }
      ],
      external_url: 'https://agrotm.com/nft/1',
      animation_url: null
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    title: 'AGROTM NFT #002',
    description: 'NFT Especial - Tecnologia Blockchain na Agricultura',
    image: 'https://via.placeholder.com/400x400/0080ff/ffffff?text=AGROTM+NFT+002',
    price: 0.3, // ETH
    priceUSD: 900,
    creator: '0x1234567890123456789012345678901234567890',
    owner: null,
    tokenId: '2',
    contractAddress: '0xAGROTMNFTContractAddress',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Category', value: 'Technology' },
        { trait_type: 'Edition', value: 'Genesis' }
      ],
      external_url: 'https://agrotm.com/nft/2',
      animation_url: null
    },
    isAvailable: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 3,
    title: 'AGROTM NFT #003',
    description: 'NFT Premium - Sustentabilidade e Inovação',
    image: 'https://via.placeholder.com/400x400/ff0080/ffffff?text=AGROTM+NFT+003',
    price: 1.0, // ETH
    priceUSD: 3000,
    creator: '0x1234567890123456789012345678901234567890',
    owner: null,
    tokenId: '3',
    contractAddress: '0xAGROTMNFTContractAddress',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Category', value: 'Sustainability' },
        { trait_type: 'Edition', value: 'Genesis' }
      ],
      external_url: 'https://agrotm.com/nft/3',
      animation_url: null
    },
    isAvailable: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];

let cryptocurrencies = [
  {
    id: 1,
    name: 'AGROTM Token',
    symbol: 'AGROTM',
    logo: 'https://via.placeholder.com/64x64/00ff7f/000000?text=AGROTM',
    description: 'Token principal da plataforma AGROTM para agricultura digital',
    currentPrice: 0.85,
    priceChange24h: 5.2,
    priceChange7d: 12.8,
    marketCap: 85000000,
    volume24h: 2500000,
    circulatingSupply: 100000000,
    totalSupply: 100000000,
    maxSupply: 100000000,
    contractAddress: '0xAGROTMTokenContractAddress',
    blockchain: 'Ethereum',
    decimals: 18,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'AGROTM Staking Token',
    symbol: 'AGROST',
    logo: 'https://via.placeholder.com/64x64/0080ff/ffffff?text=AGROST',
    description: 'Token de staking da plataforma AGROTM',
    currentPrice: 1.25,
    priceChange24h: -2.1,
    priceChange7d: 8.5,
    marketCap: 125000000,
    volume24h: 1800000,
    circulatingSupply: 100000000,
    totalSupply: 100000000,
    maxSupply: 100000000,
    contractAddress: '0xAGROSTTokenContractAddress',
    blockchain: 'Ethereum',
    decimals: 18,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'AGROTM Governance Token',
    symbol: 'AGROG',
    logo: 'https://via.placeholder.com/64x64/ff0080/ffffff?text=AGROG',
    description: 'Token de governança da plataforma AGROTM',
    currentPrice: 2.15,
    priceChange24h: 3.8,
    priceChange7d: 15.2,
    marketCap: 215000000,
    volume24h: 3200000,
    circulatingSupply: 100000000,
    totalSupply: 100000000,
    maxSupply: 100000000,
    contractAddress: '0xAGROGTokenContractAddress',
    blockchain: 'Ethereum',
    decimals: 18,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

let transactions = [];

// Generate mock price data for charts
const generatePriceData = (basePrice, days = 30) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    currentPrice = currentPrice * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data;
};

// Get all NFTs
router.get('/nfts', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limite deve ser entre 1 e 50'),
  query('search').optional().trim().isLength({ min: 1 }).withMessage('Busca não pode estar vazia'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Preço mínimo deve ser um número positivo'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Preço máximo deve ser um número positivo'),
  query('rarity').optional().isIn(['Common', 'Rare', 'Epic', 'Legendary']).withMessage('Raridade inválida'),
  checkValidation
], async (req, res) => {
  try {
    const { page = 1, limit = 10, search, minPrice, maxPrice, rarity } = req.query;
    
    let filteredNfts = [...nfts];
    
    // Apply filters
    if (search) {
      filteredNfts = filteredNfts.filter(nft => 
        nft.title.toLowerCase().includes(search.toLowerCase()) ||
        nft.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (minPrice !== undefined) {
      filteredNfts = filteredNfts.filter(nft => nft.price >= parseFloat(minPrice));
    }
    
    if (maxPrice !== undefined) {
      filteredNfts = filteredNfts.filter(nft => nft.price <= parseFloat(maxPrice));
    }
    
    if (rarity) {
      filteredNfts = filteredNfts.filter(nft => 
        nft.metadata.attributes.some(attr => 
          attr.trait_type === 'Rarity' && attr.value === rarity
        )
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNfts = filteredNfts.slice(startIndex, endIndex);
    
    logger.info(`NFTs retrieved: ${paginatedNfts.length} items`);
    
    res.json({
      success: true,
      data: {
        nfts: paginatedNfts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredNfts.length,
          totalPages: Math.ceil(filteredNfts.length / limit)
        }
      }
    });
    
  } catch (error) {
    logger.error('Get NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get NFT by ID
router.get('/nfts/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo'),
  checkValidation
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const nft = nfts.find(n => n.id === parseInt(id));
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT não encontrada'
      });
    }
    
    logger.info(`NFT retrieved: ${nft.title}`);
    
    res.json({
      success: true,
      data: nft
    });
    
  } catch (error) {
    logger.error('Get NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buy NFT
router.post('/nfts/:id/buy', [
  authMiddleware,
  param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo'),
  body('walletAddress').isEthereumAddress().withMessage('Endereço de carteira inválido'),
  body('transactionHash').notEmpty().withMessage('Hash da transação obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress, transactionHash } = req.body;
    
    const nft = nfts.find(n => n.id === parseInt(id));
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT não encontrada'
      });
    }
    
    if (!nft.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'NFT não está disponível para compra'
      });
    }
    
    // In production, verify the transaction on blockchain
    // const isValidTransaction = await verifyTransaction(transactionHash, walletAddress, nft.price);
    // if (!isValidTransaction) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Transação inválida'
    //   });
    // }
    
    // Update NFT ownership
    nft.owner = walletAddress;
    nft.isAvailable = false;
    nft.updatedAt = new Date();
    
    // Record transaction
    const transaction = {
      id: transactions.length + 1,
      nftId: nft.id,
      buyer: walletAddress,
      seller: nft.creator,
      price: nft.price,
      priceUSD: nft.priceUSD,
      transactionHash,
      status: 'completed',
      createdAt: new Date()
    };
    
    transactions.push(transaction);
    
    logger.info(`NFT purchased: ${nft.title} by ${walletAddress}`);
    
    res.json({
      success: true,
      message: 'NFT comprada com sucesso',
      data: {
        nft,
        transaction
      }
    });
    
  } catch (error) {
    logger.error('Buy NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get all cryptocurrencies
router.get('/cryptocurrencies', async (req, res) => {
  try {
    // Update prices with some variation (simulate real-time data)
    cryptocurrencies.forEach(crypto => {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      crypto.currentPrice = parseFloat((crypto.currentPrice * (1 + variation)).toFixed(4));
      crypto.volume24h = Math.floor(crypto.volume24h * (1 + (Math.random() - 0.5) * 0.1));
      crypto.updatedAt = new Date();
    });
    
    logger.info(`Cryptocurrencies retrieved: ${cryptocurrencies.length} items`);
    
    res.json({
      success: true,
      data: cryptocurrencies
    });
    
  } catch (error) {
    logger.error('Get cryptocurrencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get cryptocurrency by ID
router.get('/cryptocurrencies/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo'),
  checkValidation
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const crypto = cryptocurrencies.find(c => c.id === parseInt(id));
    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoeda não encontrada'
      });
    }
    
    // Update price with variation
    const variation = (Math.random() - 0.5) * 0.02;
    crypto.currentPrice = parseFloat((crypto.currentPrice * (1 + variation)).toFixed(4));
    crypto.updatedAt = new Date();
    
    logger.info(`Cryptocurrency retrieved: ${crypto.name}`);
    
    res.json({
      success: true,
      data: crypto
    });
    
  } catch (error) {
    logger.error('Get cryptocurrency error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get cryptocurrency price chart data
router.get('/cryptocurrencies/:id/chart', [
  param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo'),
  query('period').optional().isIn(['1d', '7d', '30d', '1y']).withMessage('Período inválido'),
  checkValidation
], async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;
    
    const crypto = cryptocurrencies.find(c => c.id === parseInt(id));
    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoeda não encontrada'
      });
    }
    
    // Convert period to days
    const daysMap = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '1y': 365
    };
    
    const days = daysMap[period];
    const chartData = generatePriceData(crypto.currentPrice, days);
    
    logger.info(`Chart data retrieved for ${crypto.name} (${period})`);
    
    res.json({
      success: true,
      data: {
        cryptocurrency: crypto,
        chartData,
        period
      }
    });
    
  } catch (error) {
    logger.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buy cryptocurrency
router.post('/cryptocurrencies/:id/buy', [
  authMiddleware,
  param('id').isInt({ min: 1 }).withMessage('ID deve ser um número inteiro positivo'),
  body('walletAddress').isEthereumAddress().withMessage('Endereço de carteira inválido'),
  body('amount').isFloat({ min: 0.0001 }).withMessage('Quantidade deve ser maior que 0'),
  body('transactionHash').notEmpty().withMessage('Hash da transação obrigatória'),
  checkValidation
], async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress, amount, transactionHash } = req.body;
    
    const crypto = cryptocurrencies.find(c => c.id === parseInt(id));
    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoeda não encontrada'
      });
    }
    
    const totalValue = amount * crypto.currentPrice;
    
    // In production, verify the transaction on blockchain
    // const isValidTransaction = await verifyTokenTransaction(transactionHash, walletAddress, amount, crypto.contractAddress);
    // if (!isValidTransaction) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Transação inválida'
    //   });
    // }
    
    // Record transaction
    const transaction = {
      id: transactions.length + 1,
      cryptocurrencyId: crypto.id,
      buyer: walletAddress,
      amount,
      pricePerToken: crypto.currentPrice,
      totalValue,
      transactionHash,
      status: 'completed',
      createdAt: new Date()
    };
    
    transactions.push(transaction);
    
    logger.info(`Cryptocurrency purchased: ${amount} ${crypto.symbol} by ${walletAddress}`);
    
    res.json({
      success: true,
      message: 'Criptomoeda comprada com sucesso',
      data: {
        cryptocurrency: crypto,
        transaction
      }
    });
    
  } catch (error) {
    logger.error('Buy cryptocurrency error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get user's NFTs
router.get('/user/nfts', authMiddleware, async (req, res) => {
  try {
    const userNfts = nfts.filter(nft => nft.owner === req.user.walletAddress);
    
    logger.info(`User NFTs retrieved for: ${req.user.walletAddress}`);
    
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

// Get user's transactions
router.get('/user/transactions', authMiddleware, async (req, res) => {
  try {
    const userTransactions = transactions.filter(t => 
      t.buyer === req.user.walletAddress || 
      (t.seller && t.seller === req.user.walletAddress)
    );
    
    logger.info(`User transactions retrieved for: ${req.user.walletAddress}`);
    
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

// Get marketplace statistics
router.get('/stats', async (req, res) => {
  try {
    const totalNfts = nfts.length;
    const availableNfts = nfts.filter(n => n.isAvailable).length;
    const totalNftValue = nfts.reduce((sum, n) => sum + n.priceUSD, 0);
    
    const totalCryptoMarketCap = cryptocurrencies.reduce((sum, c) => sum + c.marketCap, 0);
    const totalCryptoVolume = cryptocurrencies.reduce((sum, c) => sum + c.volume24h, 0);
    
    const totalTransactions = transactions.length;
    const totalTransactionValue = transactions.reduce((sum, t) => sum + (t.priceUSD || t.totalValue || 0), 0);
    
    logger.info('Marketplace statistics retrieved');
    
    res.json({
      success: true,
      data: {
        nfts: {
          total: totalNfts,
          available: availableNfts,
          sold: totalNfts - availableNfts,
          totalValue: totalNftValue
        },
        cryptocurrencies: {
          total: cryptocurrencies.length,
          totalMarketCap: totalCryptoMarketCap,
          totalVolume24h: totalCryptoVolume
        },
        transactions: {
          total: totalTransactions,
          totalValue: totalTransactionValue
        }
      }
    });
    
  } catch (error) {
    logger.error('Get marketplace stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
