// ===== D1 DATABASE HELPER =====
// Utilitários para trabalhar com Cloudflare D1 Database
// Substitui MongoDB com queries SQL otimizadas

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

/**
 * Gerar ID único para registros
 */
export const generateId = (prefix = '') => {
  const id = uuidv4();
  return prefix ? `${prefix}-${id}` : id;
};

/**
 * Timestamp Unix atual
 */
export const now = () => Math.floor(Date.now() / 1000);

/**
 * Executar query D1 com tratamento de erro
 */
export const executeD1Query = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).all();
    return {
      success: true,
      results: result.results || [],
      meta: result.meta || {}
    };
  } catch (error) {
    console.error('D1 Query Error:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
};

/**
 * Executar query e retornar primeiro resultado
 */
export const executeD1QueryFirst = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).first();
    return {
      success: true,
      result: result || null
    };
  } catch (error) {
    console.error('D1 Query Error:', error);
    return {
      success: false,
      error: error.message,
      result: null
    };
  }
};

/**
 * Executar query de escrita (INSERT, UPDATE, DELETE)
 */
export const executeD1Write = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).run();
    return {
      success: true,
      meta: result.meta || {},
      changes: result.meta?.changes || 0
    };
  } catch (error) {
    console.error('D1 Write Error:', error);
    return {
      success: false,
      error: error.message,
      changes: 0
    };
  }
};

/**
 * Criar usuário no D1
 */
export const createUser = async (db, userData) => {
  const {
    email,
    name,
    password,
    phone = null,
    businessType = 'user',
    role = 'user'
  } = userData;

  const id = generateId('user');
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpires = now() + 600; // 10 minutos

  const query = `
    INSERT INTO users (
      id, email, name, password, phone, businessType, role,
      verificationCode, codeExpires, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await executeD1Write(db, query, [
    id,
    email.toLowerCase(),
    name,
    hashedPassword,
    phone,
    businessType,
    role,
    verificationCode,
    codeExpires,
    now(),
    now()
  ]);

  if (result.success) {
    return {
      success: true,
      userId: id,
      verificationCode
    };
  }

  return result;
};

/**
 * Buscar usuário por email
 */
export const findUserByEmail = async (db, email) => {
  const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  return executeD1QueryFirst(db, query, [email.toLowerCase()]);
};

/**
 * Buscar usuário por ID
 */
export const findUserById = async (db, userId) => {
  const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
  return executeD1QueryFirst(db, query, [userId]);
};

/**
 * Atualizar usuário
 */
export const updateUser = async (db, userId, updates) => {
  const fields = [];
  const values = [];

  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  // Adicionar updatedAt
  fields.push('updatedAt = ?');
  values.push(now());

  // Adicionar userId no final
  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  return executeD1Write(db, query, values);
};

/**
 * Verificar senha
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Criar produto
 */
export const createProduct = async (db, userId, productData) => {
  const {
    title,
    description = '',
    category,
    price,
    stock = 0,
    images = [],
    city = '',
    state = ''
  } = productData;

  const id = generateId('prod');
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const query = `
    INSERT INTO products (
      id, userId, title, description, category, price, stock,
      images, city, state, slug, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await executeD1Write(db, query, [
    id,
    userId,
    title,
    description,
    category,
    price,
    stock,
    JSON.stringify(images),
    city,
    state,
    slug,
    'active',
    now(),
    now()
  ]);

  if (result.success) {
    return {
      success: true,
      productId: id
    };
  }

  return result;
};

/**
 * Buscar produtos com filtros
 */
export const findProducts = async (db, filters = {}) => {
  let query = `SELECT * FROM products WHERE status = 'active'`;
  const params = [];

  if (filters.category) {
    query += ` AND category = ?`;
    params.push(filters.category);
  }

  if (filters.state) {
    query += ` AND state = ?`;
    params.push(filters.state);
  }

  if (filters.search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ` ORDER BY createdAt DESC`;

  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(filters.limit));
  }

  return executeD1Query(db, query, params);
};

/**
 * Criar frete
 */
export const createFreight = async (db, userId, freightData) => {
  const {
    originCity,
    originState,
    destinationCity,
    destinationState,
    loadType,
    price
  } = freightData;

  const id = generateId('freight');
  const trackingCode = `AGR${Date.now().toString(36).toUpperCase()}`;

  const query = `
    INSERT INTO freights (
      id, userId, originCity, originState, destinationCity, destinationState,
      loadType, price, trackingCode, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await executeD1Write(db, query, [
    id,
    userId,
    originCity,
    originState,
    destinationCity,
    destinationState,
    loadType,
    price,
    trackingCode,
    'available',
    now(),
    now()
  ]);

  if (result.success) {
    return {
      success: true,
      freightId: id,
      trackingCode
    };
  }

  return result;
};

/**
 * Buscar fretes
 */
export const findFreights = async (db, filters = {}) => {
  let query = `SELECT * FROM freights WHERE status = 'available'`;
  const params = [];

  if (filters.originState) {
    query += ` AND originState = ?`;
    params.push(filters.originState);
  }

  if (filters.destinationState) {
    query += ` AND destinationState = ?`;
    params.push(filters.destinationState);
  }

  query += ` ORDER BY createdAt DESC`;

  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(filters.limit));
  }

  return executeD1Query(db, query, params);
};

/**
 * Criar mensagem
 */
export const createMessage = async (db, messageData) => {
  const { conversationId, senderId, receiverId, content, type = 'text' } = messageData;

  const id = generateId('msg');

  const query = `
    INSERT INTO messages (
      id, conversationId, senderId, receiverId, content, type, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return executeD1Write(db, query, [id, conversationId, senderId, receiverId, content, type, now()]);
};

/**
 * Buscar mensagens de uma conversa
 */
export const findMessages = async (db, conversationId, limit = 50) => {
  const query = `
    SELECT * FROM messages 
    WHERE conversationId = ? AND isDeleted = 0
    ORDER BY createdAt DESC
    LIMIT ?
  `;

  return executeD1Query(db, query, [conversationId, limit]);
};

/**
 * Criar transação
 */
export const createTransaction = async (db, transactionData) => {
  const { userId, type, amount, paymentMethod, description } = transactionData;

  const id = generateId('txn');

  const query = `
    INSERT INTO transactions (
      id, userId, type, amount, paymentMethod, paymentStatus, description, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return executeD1Write(db, query, [id, userId, type, amount, paymentMethod, 'pending', description, now()]);
};

/**
 * Criar log de auditoria
 */
export const createAuditLog = async (db, logData) => {
  const { userId, action, entity, entityId, ipAddress, userAgent } = logData;

  const id = generateId('log');

  const query = `
    INSERT INTO audit_logs (
      id, userId, action, entity, entityId, ipAddress, userAgent, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return executeD1Write(db, query, [id, userId, action, entity, entityId, ipAddress, userAgent, now()]);
};

/**
 * Sanitizar dados para JSON
 */
export const sanitizeForJSON = data => {
  if (!data) return null;

  const sanitized = { ...data };

  // Converter integers para boolean
  ['isAdmin', 'isActive', 'isBlocked', 'isEmailVerified', 'isPaid', 'twoFactorEnabled'].forEach(field => {
    if (field in sanitized) {
      sanitized[field] = Boolean(sanitized[field]);
    }
  });

  // Parsear JSON strings
  ['images', 'tags', 'certifications', 'dimensions'].forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      try {
        sanitized[field] = JSON.parse(sanitized[field]);
      } catch (e) {
        // Manter como string se não for JSON válido
      }
    }
  });

  // Remover senha
  delete sanitized.password;
  delete sanitized.twoFactorSecret;

  return sanitized;
};

export default {
  generateId,
  now,
  executeD1Query,
  executeD1QueryFirst,
  executeD1Write,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  verifyPassword,
  createProduct,
  findProducts,
  createFreight,
  findFreights,
  createMessage,
  findMessages,
  createTransaction,
  createAuditLog,
  sanitizeForJSON
};
