import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

/**
 * Funções auxiliares para D1
 */

// Função para gerar IDs únicos
export const generateId = (prefix = '') => {
  return `${prefix}_${nanoid()}`;
};

// Função para executar queries no D1 com retry
export const executeD1Query = async (db, query, params = []) => {
  try {
    const stmt = db.prepare(query);
    if (params.length > 0) {
      return await stmt.bind(...params).all();
    }
    return await stmt.all();
  } catch (error) {
    console.error('Erro ao executar query D1:', error);
    throw error;
  }
};

// Função para executar writes no D1 com retry
export const executeD1Write = async (db, query, params = []) => {
  try {
    const stmt = db.prepare(query);
    if (params.length > 0) {
      return await stmt.bind(...params).run();
    }
    return await stmt.run();
  } catch (error) {
    console.error('Erro ao executar write D1:', error);
    throw error;
  }
};

// Função para pegar timestamp atual
export const now = () => Math.floor(Date.now() / 1000);

/**
 * Funções de usuário
 */

// Criar usuário
export const createUser = async (db, userData) => {
  const { email, name, password, phone = null, businessType = 'user', role = 'user' } = userData;

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

  const timestamp = now();

  await executeD1Write(db, query, [
    id,
    email,
    name,
    hashedPassword,
    phone,
    businessType,
    role,
    verificationCode,
    codeExpires,
    timestamp,
    timestamp
  ]);

  return {
    id,
    email,
    name,
    phone,
    businessType,
    role,
    verificationCode
  };
};

// Encontrar usuário por email
export const findUserByEmail = async (db, email) => {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const results = await executeD1Query(db, query, [email]);
  return results.length > 0 ? results[0] : null;
};

// Encontrar usuário por ID
export const findUserById = async (db, userId) => {
  const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
  const results = await executeD1Query(db, query, [userId]);
  return results.length > 0 ? results[0] : null;
};

// Atualizar usuário
export const updateUser = async (db, userId, updates) => {
  const allowedFields = ['name', 'phone', 'businessType', 'verificationCode', 'codeExpires', 'verified', 'password'];
  const fields = Object.keys(updates).filter(field => allowedFields.includes(field));
  
  if (fields.length === 0) return false;

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updates[field]);
  
  const query = `
    UPDATE users 
    SET ${setClause}, updatedAt = ?
    WHERE id = ?
  `;

  values.push(now(), userId);
  await executeD1Write(db, query, values);
  return true;
};

// Verificar senha
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Funções de produto
 */

// Criar produto
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

  const timestamp = now();

  await executeD1Write(db, query, [
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
    timestamp,
    timestamp
  ]);

  return { id, slug };
};

// Encontrar produtos
export const findProducts = async (db, filters = {}) => {
  const {
    userId,
    category,
    city,
    state,
    status = 'active',
    minPrice,
    maxPrice,
    search,
    limit = 50,
    offset = 0
  } = filters;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (userId) {
    query += ' AND userId = ?';
    params.push(userId);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (city) {
    query += ' AND city = ?';
    params.push(city);
  }

  if (state) {
    query += ' AND state = ?';
    params.push(state);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (minPrice !== undefined) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return await executeD1Query(db, query, params);
};

/**
 * Funções de frete
 */

// Criar frete
export const createFreight = async (db, userId, freightData) => {
  const {
    title,
    description,
    originCity,
    originState,
    destinationCity,
    destinationState,
    cargoType,
    price,
    availableDate,
    capacity = null
  } = freightData;

  const id = generateId('frt');
  const timestamp = now();

  const query = `
    INSERT INTO freights (
      id, userId, title, description, originCity, originState,
      destinationCity, destinationState, cargoType, price,
      availableDate, capacity, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeD1Write(db, query, [
    id,
    userId,
    title,
    description,
    originCity,
    originState,
    destinationCity,
    destinationState,
    cargoType,
    price,
    availableDate,
    capacity,
    'active',
    timestamp,
    timestamp
  ]);

  return { id };
};

// Encontrar fretes
export const findFreights = async (db, filters = {}) => {
  const {
    userId,
    cargoType,
    originState,
    destinationState,
    status = 'active',
    minPrice,
    maxPrice,
    search,
    limit = 50,
    offset = 0
  } = filters;

  let query = 'SELECT * FROM freights WHERE 1=1';
  const params = [];

  if (userId) {
    query += ' AND userId = ?';
    params.push(userId);
  }

  if (cargoType) {
    query += ' AND cargoType = ?';
    params.push(cargoType);
  }

  if (originState) {
    query += ' AND originState = ?';
    params.push(originState);
  }

  if (destinationState) {
    query += ' AND destinationState = ?';
    params.push(destinationState);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (minPrice !== undefined) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return await executeD1Query(db, query, params);
};

/**
 * Funções de mensagem
 */

// Criar mensagem
export const createMessage = async (db, messageData) => {
  const {
    senderId,
    receiverId,
    subject,
    content,
    messageType = 'general',
    relatedItemId = null,
    relatedItemType = null
  } = messageData;

  const id = generateId('msg');
  const conversationId = generateId('conv');
  const timestamp = now();

  const query = `
    INSERT INTO messages (
      id, conversationId, senderId, receiverId, subject,
      content, messageType, relatedItemId, relatedItemType,
      status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeD1Write(db, query, [
    id,
    conversationId,
    senderId,
    receiverId,
    subject,
    content,
    messageType,
    relatedItemId,
    relatedItemType,
    'unread',
    timestamp,
    timestamp
  ]);

  return { id, conversationId };
};

// Encontrar mensagens
export const findMessages = async (db, conversationId, limit = 50) => {
  const query = `
    SELECT * FROM messages
    WHERE conversationId = ?
    ORDER BY createdAt DESC
    LIMIT ?
  `;

  return await executeD1Query(db, query, [conversationId, limit]);
};

/**
 * Funções de transação
 */

// Criar transação
export const createTransaction = async (db, transactionData) => {
  const {
    buyerId,
    sellerId,
    itemId,
    itemType,
    amount,
    status = 'pending',
    paymentMethod,
    paymentDetails = {}
  } = transactionData;

  const id = generateId('txn');
  const timestamp = now();

  const query = `
    INSERT INTO transactions (
      id, buyerId, sellerId, itemId, itemType, amount,
      status, paymentMethod, paymentDetails, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeD1Write(db, query, [
    id,
    buyerId,
    sellerId,
    itemId,
    itemType,
    amount,
    status,
    paymentMethod,
    JSON.stringify(paymentDetails),
    timestamp,
    timestamp
  ]);

  return { id };
};

/**
 * Funções de auditoria
 */

// Criar log de auditoria
export const createAuditLog = async (db, logData) => {
  const {
    userId,
    action,
    resourceType,
    resourceId,
    details = {},
    ipAddress = null
  } = logData;

  const id = generateId('log');
  const timestamp = now();

  const query = `
    INSERT INTO audit_logs (
      id, userId, action, resourceType, resourceId,
      details, ipAddress, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeD1Write(db, query, [
    id,
    userId,
    action,
    resourceType,
    resourceId,
    JSON.stringify(details),
    ipAddress,
    timestamp
  ]);

  return { id };
};