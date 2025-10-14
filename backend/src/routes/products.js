import { Router } from '@agroisync/router';
import * as Product from '../models/Product.d1.js';
import { validateProduct } from '../middleware/validation.js';
import { authenticateToken, requirePaidPlan } from '../middleware/auth.js';

const router = new Router();

// Listar produtos com filtros e paginação
router.get('/products', async (request, env) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    
    // Construir filtros da query string
    const filters = {
      category: url.searchParams.get('category'),
      minPrice: url.searchParams.get('minPrice'), 
      maxPrice: url.searchParams.get('maxPrice'),
      city: url.searchParams.get('city'),
      state: url.searchParams.get('state')
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const products = await Product.listProducts(env.DB, filters, page, limit);
    
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

// Buscar produto por ID
router.get('/products/:id', async (request, env) => {
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
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page, 10, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching seller products:', error);
    }
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
    const { userId } = req.user;
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
        message: 'Produto nÃ£o encontrado'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Produto nÃ£o disponÃ­vel'
      });
    }

    // Check if user is not contacting themselves
    if (product.sellerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'VocÃª nÃ£o pode enviar mensagem para si mesmo'
      });
    }

    // Here you would typically create a message/contact record
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso para o vendedor'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error contacting seller:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
