import express, { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, city, state, search } = req.query;
    
    let filter = { isActive: true };
    
    // Filter by type
    if (type) {
      filter.type = type;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Filter by location
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }
    
    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos'
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto'
    });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      price,
      minimumQuantity,
      description,
      quality,
      seller,
      location,
      images,
      sellerId
    } = req.body;
    
    // Validate required fields
    if (!name || !type || !price || !minimumQuantity || !description || !seller || !location || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }
    
    // Validate seller info
    if (!seller.name || !seller.email || !seller.cpfCnpj) {
      return res.status(400).json({
        success: false,
        error: 'Informações do vendedor incompletas'
      });
    }
    
    // Validate location
    if (!location.city || !location.state) {
      return res.status(400).json({
        success: false,
        error: 'Localização incompleta'
      });
    }
    
    const product = new Product({
      name,
      type,
      price: parseFloat(price),
      minimumQuantity: parseInt(minimumQuantity),
      description,
      quality: quality || {},
      seller,
      location,
      images: images || [],
      sellerId
    });
    
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Produto cadastrado com sucesso'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cadastrar produto'
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar produto'
    });
  }
});

// DELETE /api/products/:id - Soft delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover produto'
    });
  }
});

export default router;
