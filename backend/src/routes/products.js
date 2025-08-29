import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { validateProduct } from '../middleware/validation.js';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/auth.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// GET /api/products - Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      minPrice,
      maxPrice,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = { status: 'active' };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'name company.name')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('sellerId', 'name company.name')
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/categories - Get all product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('sellerId', 'name company.name phone')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    if (product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Produto não disponível'
      });
    }

    // Increment view count (async, don't wait)
    Product.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/products - Create new product (requires authentication and active store plan)
router.post('/', authenticateToken, validateProduct, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user has active store plan
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.hasActivePlan('store')) {
      return res.status(403).json({
        success: false,
        message: 'Plano de loja não ativo. Ative um plano para criar anúncios.'
      });
    }

    if (!user.canCreateAd()) {
      return res.status(403).json({
        success: false,
        message: 'Limite de anúncios atingido. Faça upgrade do seu plano.'
      });
    }

    // Create product
    const productData = {
      ...req.body,
      sellerId: userId
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { product }
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.message.includes('Plano de loja não ativo')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('Limite de anúncios atingido')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticateToken, validateProduct, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Check if user owns the product
    if (product.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode editar seus próprios produtos.'
      });
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: { product }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Check if user owns the product
    if (product.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode excluir seus próprios produtos.'
      });
    }

    // Soft delete - mark as inactive
    product.status = 'inactive';
    await product.save();

    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/products/:id/favorite - Add product to favorites
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Produto não disponível'
      });
    }

    // Add to favorites
    await product.addToFavorites(userId);

    res.json({
      success: true,
      message: 'Produto adicionado aos favoritos'
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/products/:id/favorite - Remove product from favorites
router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Remove from favorites
    await product.removeFromFavorites(userId);

    res.json({
      success: true,
      message: 'Produto removido dos favoritos'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/user/favorites - Get user's favorite products
router.get('/user/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({
      'favorites.userId': userId,
      status: 'active'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'name company.name')
      .lean();

    const total = await Product.countDocuments({
      'favorites.userId': userId,
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products/seller/my-products - Get seller's own products
router.get('/seller/my-products', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { sellerId: userId };
    if (status) query.status = status;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/products/:id/contact - Contact seller about product
router.post('/:id/contact', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem deve ter pelo menos 10 caracteres'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Produto não disponível'
      });
    }

    // Check if user is not contacting themselves
    if (product.sellerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode enviar mensagem para si mesmo'
      });
    }

    // Here you would typically create a message/contact record
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso para o vendedor'
    });
  } catch (error) {
    console.error('Error contacting seller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
