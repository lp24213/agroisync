const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock NFT data
const mockNFTs = [
  {
    id: 1,
    name: 'AGROTM Farm #001',
    description: 'Premium agricultural land NFT',
    image: 'https://via.placeholder.com/400x400/00ff7f/000000?text=AGROTM+Farm+001',
    price: 1000,
    owner: '0x1234567890abcdef',
    creator: '0x1234567890abcdef',
    tokenId: '0x001',
    metadata: {
      location: 'Brazil',
      size: '100 hectares',
      crop: 'Soybeans',
      soilQuality: 'Premium'
    },
    mintedAt: '2024-01-01T00:00:00Z',
    status: 'minted'
  },
  {
    id: 2,
    name: 'AGROTM Equipment #001',
    description: 'Smart farming equipment NFT',
    image: 'https://via.placeholder.com/400x400/00ff7f/000000?text=AGROTM+Equipment+001',
    price: 500,
    owner: '0xabcdef1234567890',
    creator: '0x1234567890abcdef',
    tokenId: '0x002',
    metadata: {
      type: 'Tractor',
      model: 'SmartFarm Pro',
      year: 2024,
      condition: 'New'
    },
    mintedAt: '2024-01-15T00:00:00Z',
    status: 'minted'
  }
];

// @route   GET /api/nfts
// @desc    Get all NFTs
// @access  Private
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, owner, status } = req.query;
    
    let filteredNFTs = [...mockNFTs];
    
    // Filter by owner
    if (owner) {
      filteredNFTs = filteredNFTs.filter(nft => nft.owner === owner);
    }
    
    // Filter by status
    if (status) {
      filteredNFTs = filteredNFTs.filter(nft => nft.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);
    
    logger.info('NFTs requested');

    res.json({
      success: true,
      nfts: paginatedNFTs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredNFTs.length,
        pages: Math.ceil(filteredNFTs.length / limit)
      }
    });
  } catch (error) {
    logger.error('Get NFTs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/nfts/:id
// @desc    Get specific NFT
// @access  Private
router.get('/:id', (req, res) => {
  try {
    const nftId = parseInt(req.params.id);
    const nft = mockNFTs.find(n => n.id === nftId);

    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }

    logger.info(`NFT ${nftId} requested`);

    res.json({
      success: true,
      nft
    });
  } catch (error) {
    logger.error('Get NFT error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/nfts/mint
// @desc    Mint new NFT
// @access  Private
router.post('/mint', (req, res) => {
  try {
    const { name, description, image, price, metadata } = req.body;

    if (!name || !description || !image) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, and image are required'
      });
    }

    // Create new NFT
    const newNFT = {
      id: mockNFTs.length + 1,
      name,
      description,
      image,
      price: price || 0,
      owner: req.user.wallet || '0x0000000000000000',
      creator: req.user.wallet || '0x0000000000000000',
      tokenId: `0x${(mockNFTs.length + 1).toString().padStart(3, '0')}`,
      metadata: metadata || {},
      mintedAt: new Date().toISOString(),
      status: 'minted'
    };

    mockNFTs.push(newNFT);

    logger.info(`User ${req.user.id} minted NFT ${newNFT.id}`);

    res.status(201).json({
      success: true,
      nft: newNFT,
      message: 'NFT minted successfully'
    });
  } catch (error) {
    logger.error('Mint NFT error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/nfts/:id
// @desc    Update NFT
// @access  Private
router.put('/:id', (req, res) => {
  try {
    const nftId = parseInt(req.params.id);
    const { name, description, price, metadata } = req.body;

    const nftIndex = mockNFTs.findIndex(n => n.id === nftId);
    
    if (nftIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }

    const nft = mockNFTs[nftIndex];
    
    // Check ownership
    if (nft.owner !== req.user.wallet) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this NFT'
      });
    }

    // Update NFT
    if (name) mockNFTs[nftIndex].name = name;
    if (description) mockNFTs[nftIndex].description = description;
    if (price !== undefined) mockNFTs[nftIndex].price = price;
    if (metadata) mockNFTs[nftIndex].metadata = { ...nft.metadata, ...metadata };

    logger.info(`User ${req.user.id} updated NFT ${nftId}`);

    res.json({
      success: true,
      nft: mockNFTs[nftIndex],
      message: 'NFT updated successfully'
    });
  } catch (error) {
    logger.error('Update NFT error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/nfts/:id/transfer
// @desc    Transfer NFT ownership
// @access  Private
router.post('/:id/transfer', (req, res) => {
  try {
    const nftId = parseInt(req.params.id);
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Recipient address is required'
      });
    }

    const nftIndex = mockNFTs.findIndex(n => n.id === nftId);
    
    if (nftIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }

    const nft = mockNFTs[nftIndex];
    
    // Check ownership
    if (nft.owner !== req.user.wallet) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to transfer this NFT'
      });
    }

    // Transfer ownership
    mockNFTs[nftIndex].owner = to;

    logger.info(`User ${req.user.id} transferred NFT ${nftId} to ${to}`);

    res.json({
      success: true,
      nft: mockNFTs[nftIndex],
      message: 'NFT transferred successfully'
    });
  } catch (error) {
    logger.error('Transfer NFT error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/nfts/user/:wallet
// @desc    Get NFTs owned by specific wallet
// @access  Private
router.get('/user/:wallet', (req, res) => {
  try {
    const wallet = req.params.wallet;
    const userNFTs = mockNFTs.filter(nft => nft.owner === wallet);

    logger.info(`NFTs requested for wallet ${wallet}`);

    res.json({
      success: true,
      nfts: userNFTs,
      count: userNFTs.length
    });
  } catch (error) {
    logger.error('Get user NFTs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
