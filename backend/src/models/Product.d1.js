import { executeD1Query, executeD1QueryFirst, generateId } from '../utils/d1-helper.js';

// Classe Product para encapsular a lógica do modelo
export class Product {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.publicData = {
      title: data.title,
      description: data.short_description,
      price: data.price,
      currency: data.currency || 'BRL',
      category: data.category,
      images: JSON.parse(data.images || '[]'),
      city: data.city,
      state: data.state,
      stock: data.stock,
      unit: data.unit,
      isActive: data.is_active === 1,
      featured: data.featured === 1
    };
    
    this.privateData = {
      fullDescription: data.full_description,
      specifications: JSON.parse(data.specifications || '{}'),
      sellerInfo: JSON.parse(data.seller_info || '{}'),
      documents: JSON.parse(data.documents || '[]'),
      paymentTerms: data.payment_terms,
      deliveryInfo: JSON.parse(data.delivery_info || '{}')
    };

    this.status = data.status;
    this.views = data.views || 0;
    this.favorites = JSON.parse(data.favorites || '[]');
    this.expiresAt = data.expires_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Retorna dados públicos do produto
  getPublicData() {
    return {
      id: this.id,
      ...this.publicData,
      seller: {
        name: this.privateData.sellerInfo.name,
        city: this.publicData.city,
        state: this.publicData.state
      },
      createdAt: this.createdAt,
      expiresAt: this.expiresAt
    };
  }

  // Retorna dados privados (requer usuário pago)
  getPrivateData(userIsPaid) {
    if (!userIsPaid) {
      throw new Error('Acesso negado: usuário não possui plano ativo');
    }

    return {
      id: this.id,
      ...this.publicData,
      ...this.privateData,
      seller: this.privateData.sellerInfo,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      views: this.views,
      favorites: this.favorites.length
    };
  }

  // Verifica se o produto está ativo
  isActive() {
    return this.status === 'active' && 
           this.publicData.isActive && 
           new Date() < new Date(this.expiresAt);
  }
}

// CREATE
export async function createProduct(db, productData) {
  const id = generateId('prod');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90); // Expira em 90 dias

  const query = `
    INSERT INTO products (
      id,
      user_id,
      title,
      short_description,
      full_description,
      price,
      currency,
      category,
      images,
      specifications,
      seller_info,
      documents,
      payment_terms,
      delivery_info,
      city,
      state,
      stock,
      unit,
      is_active,
      featured,
      status,
      views,
      favorites,
      expires_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  const params = [
    id,
    productData.userId,
    productData.title,
    productData.shortDescription,
    productData.fullDescription,
    productData.price,
    productData.currency || 'BRL',
    productData.category,
    JSON.stringify(productData.images || []),
    JSON.stringify(productData.specifications || {}),
    JSON.stringify(productData.sellerInfo || {}),
    JSON.stringify(productData.documents || []),
    productData.paymentTerms,
    JSON.stringify(productData.deliveryInfo || {}),
    productData.city,
    productData.state,
    productData.stock,
    productData.unit,
    productData.isActive ? 1 : 0,
    productData.featured ? 1 : 0,
    'active',
    0,
    '[]',
    expiresAt.toISOString()
  ];

  const result = await executeD1Query(db, query, params);
  return result.success ? await getProduct(db, id) : null;
}

// READ
export async function getProduct(db, id) {
  const query = `
    SELECT p.*, u.name as seller_name, u.email as seller_email 
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ? 
    AND p.status = 'active'
    AND p.expires_at > datetime('now')
  `;

  const result = await executeD1QueryFirst(db, query, [id]);
  return result.success ? new Product(result.results[0]) : null;
}

// LIST
export async function listProducts(db, filters = {}, page = 1, limit = 20) {
  let query = `
    SELECT p.*, u.name as seller_name 
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'active'
    AND p.expires_at > datetime('now')
  `;

  const params = [];

  if (filters.category) {
    query += ` AND p.category = ?`;
    params.push(filters.category);
  }

  if (filters.minPrice) {
    query += ` AND p.price >= ?`;
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND p.price <= ?`;
    params.push(filters.maxPrice);
  }

  if (filters.city) {
    query += ` AND p.city LIKE ?`;
    params.push(`%${filters.city}%`);
  }

  if (filters.state) {
    query += ` AND p.state = ?`;
    params.push(filters.state);
  }

  query += ` ORDER BY p.featured DESC, p.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, (page - 1) * limit);

  const result = await executeD1Query(db, query, params);
  return result.success ? 
    result.results.map(row => new Product(row)) : [];
}

// UPDATE
export async function updateProduct(db, id, updates, userId) {
  // Primeiro verifica se o produto pertence ao usuário
  const product = await getProduct(db, id);
  if (!product || product.userId !== userId) {
    return false;
  }

  const allowedFields = {
    title: 'title',
    shortDescription: 'short_description',
    fullDescription: 'full_description',
    price: 'price',
    currency: 'currency',
    category: 'category',
    images: 'images',
    specifications: 'specifications',
    sellerInfo: 'seller_info',
    documents: 'documents',
    paymentTerms: 'payment_terms',
    deliveryInfo: 'delivery_info',
    city: 'city',
    state: 'state',
    stock: 'stock',
    unit: 'unit',
    isActive: 'is_active',
    featured: 'featured'
  };

  const updateFields = [];
  const params = [];

  for (const [key, value] of Object.entries(updates)) {
    const field = allowedFields[key];
    if (field) {
      updateFields.push(`${field} = ?`);
      
      // Converte objetos e arrays para JSON
      if (typeof value === 'object') {
        params.push(JSON.stringify(value));
      } 
      // Converte booleanos para 0/1
      else if (typeof value === 'boolean') {
        params.push(value ? 1 : 0);
      }
      // Outros valores são passados normalmente
      else {
        params.push(value);
      }
    }
  }

  if (updateFields.length === 0) {
    return false;
  }

  updateFields.push('updated_at = datetime("now")');
  
  const query = `
    UPDATE products 
    SET ${updateFields.join(', ')}
    WHERE id = ? 
    AND status != 'deleted'
  `;

  params.push(id);

  const result = await executeD1Query(db, query, params);
  return result.success;
}

// DELETE (soft delete)
export async function deleteProduct(db, id, userId) {
  const query = `
    UPDATE products 
    SET status = 'deleted', 
        updated_at = datetime('now')
    WHERE id = ?
    AND user_id = ?
  `;

  const result = await executeD1Query(db, query, [id, userId]);
  return result.success;
}

// SEARCH
export async function searchProducts(db, searchTerm, filters = {}, page = 1, limit = 20) {
  let query = `
    SELECT p.*, u.name as seller_name
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'active'
    AND p.expires_at > datetime('now')
    AND (
      p.title LIKE ? OR
      p.short_description LIKE ? OR
      p.full_description LIKE ? OR
      p.category LIKE ?
    )
  `;

  const params = [
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`
  ];

  // Aplicar filtros
  if (filters.category) {
    query += ` AND p.category = ?`;
    params.push(filters.category);
  }

  if (filters.minPrice) {
    query += ` AND p.price >= ?`;
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND p.price <= ?`;
    params.push(filters.maxPrice);
  }

  if (filters.city) {
    query += ` AND p.city LIKE ?`;
    params.push(`%${filters.city}%`);
  }

  if (filters.state) {
    query += ` AND p.state = ?`;
    params.push(filters.state);
  }

  // Ordenação por relevância e paginação
  query += ` 
    ORDER BY 
      p.featured DESC,
      CASE 
        WHEN p.title LIKE ? THEN 3
        WHEN p.short_description LIKE ? THEN 2
        ELSE 1
      END DESC,
      p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  params.push(
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    limit,
    (page - 1) * limit
  );

  const result = await executeD1Query(db, query, params);
  return result.success ? 
    result.results.map(row => new Product(row)) : [];
}

// Get user products
export async function getUserProducts(db, userId, page = 1, limit = 20) {
  const query = `
    SELECT p.*, u.name as seller_name
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    AND p.status != 'deleted'
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const result = await executeD1Query(db, query, [userId, limit, (page - 1) * limit]);
  return result.success ? 
    result.results.map(row => new Product(row)) : [];
}

// Incrementar visualizações
export async function incrementProductViews(db, productId, userId) {
  // Primeiro verifica se já visualizou hoje
  const viewCheck = await executeD1QueryFirst(db, `
    SELECT id FROM product_views
    WHERE product_id = ? 
    AND user_id = ?
    AND DATE(created_at) = DATE('now')
  `, [productId, userId]);

  if (viewCheck.success && viewCheck.results.length === 0) {
    // Registra a visualização
    await executeD1Query(db, `
      INSERT INTO product_views (product_id, user_id, created_at)
      VALUES (?, ?, datetime('now'))
    `, [productId, userId]);

    // Incrementa o contador no produto
    await executeD1Query(db, `
      UPDATE products 
      SET views = views + 1
      WHERE id = ?
    `, [productId]);

    return true;
  }

  return false;
}

// Toggle favorito
export async function toggleProductFavorite(db, productId, userId) {
  // Verifica se já é favorito
  const favoriteCheck = await executeD1QueryFirst(db, `
    SELECT id FROM product_favorites
    WHERE product_id = ? AND user_id = ?
  `, [productId, userId]);

  if (favoriteCheck.success) {
    if (favoriteCheck.results.length === 0) {
      // Adiciona aos favoritos
      await executeD1Query(db, `
        INSERT INTO product_favorites (product_id, user_id, created_at)
        VALUES (?, ?, datetime('now'))
      `, [productId, userId]);
      
      return true;
    } else {
      // Remove dos favoritos
      await executeD1Query(db, `
        DELETE FROM product_favorites
        WHERE product_id = ? AND user_id = ?
      `, [productId, userId]);
      
      return false;
    }
  }
  
  return false;
}

// Get product stats
export async function getProductStats(db, productId) {
  const query = `
    SELECT 
      p.*,
      COUNT(DISTINCT v.id) as total_views,
      COUNT(DISTINCT f.id) as total_favorites,
      COUNT(DISTINCT o.id) as total_orders,
      GROUP_CONCAT(DISTINCT u.name) as recent_viewers
    FROM products p
    LEFT JOIN product_views v ON p.id = v.product_id
    LEFT JOIN product_favorites f ON p.id = f.product_id
    LEFT JOIN orders o ON p.id = o.product_id
    LEFT JOIN users u ON v.user_id = u.id
    WHERE p.id = ? 
    AND p.status = 'active'
    GROUP BY p.id
  `;

  const result = await executeD1QueryFirst(db, query, [productId]);
  if (!result.success) return null;

  const stats = result.results[0];
  return {
    views: stats.total_views,
    favorites: stats.total_favorites,
    orders: stats.total_orders,
    recentViewers: stats.recent_viewers ? 
      stats.recent_viewers.split(',').slice(0, 5) : []
  };
}

// Get related products
export async function getRelatedProducts(db, productId, limit = 5) {
  const query = `
    WITH product_category AS (
      SELECT category FROM products WHERE id = ?
    )
    SELECT p.*, u.name as seller_name
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.category = (SELECT category FROM product_category)
    AND p.id != ?
    AND p.status = 'active'
    AND p.expires_at > datetime('now')
    ORDER BY p.featured DESC, p.views DESC
    LIMIT ?
  `;

  const result = await executeD1Query(db, query, [productId, productId, limit]);
  return result.success ? 
    result.results.map(row => new Product(row)) : [];
}