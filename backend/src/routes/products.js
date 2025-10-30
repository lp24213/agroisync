import express from 'express';
import * as Product from '../models/Product.d1.js';
import { validateProduct } from '../middleware/validation.js';
import { default as auth } from '../middleware/auth.js';

const router = express.Router();

// Listar produtos com filtros e paginação
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    
    // Construir filtros da query string
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice, 
      maxPrice: req.query.maxPrice,
      city: req.query.city,
      state: req.query.state
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const products = await Product.listProducts(req.env.DB, filters, page, limit);
    
    res.json({
      success: true,
      products: products.map(p => p.getPublicData())
    });

  } catch (error) {
    res.status(500).json({
      success: false, 
      error: error.message
    });
  }
});

// Buscar meus produtos (autenticado)
router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    // Buscar produtos do usuário
    const filters = { sellerId: userId };
    const products = await Product.listProducts(req.env.DB, filters, 1, 100);
    
    res.json({
      success: true,
      products: products.map(p => p.getPublicData()),
      count: products.length
    });

  } catch (error) {
    res.status(500).json({
      success: false, 
      error: error.message
    });
  }
});

// Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.getProduct(req.env.DB, id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    // Incrementar visualizações se usuário estiver autenticado
    const user = request.user;
    if (user) {
      await Product.incrementProductViews(env.DB, id, user.id);
    }

    return new Response(JSON.stringify({
      success: true,
      product: product.getPublicData()
    }), {
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Dados privados do produto (requer plano pago)
router.get('/products/:id/private', authenticateToken, requirePaidPlan, async (request, env) => {
  try {
    const id = request.params.id;
    const product = await Product.getProduct(env.DB, id);
    
    if (!product) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Produto não encontrado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      product: product.getPrivateData(true) // true = userIsPaid
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false, 
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Criar produto
router.post('/products', authenticateToken, validateProduct, async (request, env) => {
  try {
    const user = request.user;
    const productData = request.body;

    productData.userId = user.id;
    const product = await Product.createProduct(env.DB, productData);

    return new Response(JSON.stringify({
      success: true,
      product: product.getPublicData()
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Atualizar produto
router.put('/products/:id', authenticateToken, validateProduct, async (request, env) => {
  try {
    const id = request.params.id;
    const user = request.user;
    const updates = request.body;

    const success = await Product.updateProduct(env.DB, id, updates, user.id);
    
    if (!success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Produto não encontrado ou acesso negado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const product = await Product.getProduct(env.DB, id);

    return new Response(JSON.stringify({
      success: true,
      product: product.getPublicData()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Deletar produto
router.delete('/products/:id', authenticateToken, async (request, env) => {
  try {
    const id = request.params.id;
    const user = request.user;

    const success = await Product.deleteProduct(env.DB, id, user.id);
    
    if (!success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Produto não encontrado ou acesso negado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Produto deletado com sucesso'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Buscar produtos por texto
router.get('/products/search', async (request, env) => {
  try {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    
    const filters = {
      category: url.searchParams.get('category'),
      minPrice: url.searchParams.get('minPrice'),
      maxPrice: url.searchParams.get('maxPrice'),
      city: url.searchParams.get('city'),
      state: url.searchParams.get('state')
    };

    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const products = await Product.searchProducts(
      env.DB,
      searchTerm, 
      filters,
      page,
      limit
    );

    return new Response(JSON.stringify({
      success: true,
      products: products.map(p => p.getPublicData())
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Toggle favorito 
router.post('/products/:id/favorite', authenticateToken, async (request, env) => {
  try {
    const id = request.params.id;
    const user = request.user;

    const isFavorited = await Product.toggleProductFavorite(
      env.DB,
      id,
      user.id
    );

    return new Response(JSON.stringify({
      success: true,
      isFavorited
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Estatísticas do produto
router.get('/products/:id/stats', authenticateToken, async (request, env) => {
  try {
    const id = request.params.id;
    const product = await Product.getProduct(env.DB, id);
    
    if (!product) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Produto não encontrado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se é o dono do produto
    if (product.userId !== request.user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Acesso negado'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stats = await Product.getProductStats(env.DB, id);

    return new Response(JSON.stringify({
      success: true,
      stats
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Produtos relacionados
router.get('/products/:id/related', async (request, env) => {
  try {
    const id = request.params.id;
    const limit = parseInt(request.query.limit || '5', 10);

    const relatedProducts = await Product.getRelatedProducts(env.DB, id, limit);

    return new Response(JSON.stringify({
      success: true,
      products: relatedProducts.map(p => p.getPublicData())
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Produtos do usuário
router.get('/users/:userId/products', async (request, env) => {
  try {
    const userId = request.params.userId;
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '20', 10);

    const products = await Product.getUserProducts(env.DB, userId, page, limit);

    return new Response(JSON.stringify({
      success: true,
      products: products.map(p => p.getPublicData())
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export default router;
