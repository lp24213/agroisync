-- ===== AGROISYNC D1 DATABASE SCHEMA =====
-- Cloudflare D1 Database Schema
-- Database: agroisync-db
-- ID: a3eb1069-9c36-4689-9ee9-971245cb2d12

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  
  -- Role & Permissions
  role TEXT DEFAULT 'user', -- user, admin, super-admin
  isAdmin INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  isBlocked INTEGER DEFAULT 0,
  isEmailVerified INTEGER DEFAULT 0,
  isPhoneVerified INTEGER DEFAULT 0,
  
  -- Business Info
  businessType TEXT, -- buyer, seller, freight, general
  company TEXT,
  cpf TEXT,
  cnpj TEXT,
  ie TEXT,
  
  -- Address
  cep TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'BR',
  
  -- Verification
  verificationCode TEXT,
  codeExpires INTEGER,
  phoneVerificationCode TEXT,
  phoneCodeExpires INTEGER,
  
  -- 2FA
  twoFactorEnabled INTEGER DEFAULT 0,
  twoFactorSecret TEXT,
  
  -- LGPD
  lgpdConsent INTEGER DEFAULT 0,
  lgpdConsentDate INTEGER,
  dataProcessingConsent INTEGER DEFAULT 0,
  marketingConsent INTEGER DEFAULT 0,
  
  -- Subscription
  isPaid INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free', -- free, pro, enterprise
  planExpires INTEGER,
  stripeCustomerId TEXT,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
  lastLogin INTEGER
);

-- Index para buscas comuns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_businessType ON users(businessType);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users(isActive);

-- ===== PRODUCTS TABLE =====
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  
  -- Product Info
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  
  -- Pricing
  price REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  unit TEXT DEFAULT 'un',
  
  -- Stock
  stock INTEGER DEFAULT 0,
  minOrder INTEGER DEFAULT 1,
  maxOrder INTEGER,
  
  -- Physical Info
  weight REAL,
  dimensions TEXT, -- JSON: {width, height, length}
  
  -- Images
  images TEXT, -- JSON array of URLs
  mainImage TEXT,
  
  -- Location
  origin TEXT,
  city TEXT,
  state TEXT,
  
  -- Quality
  quality TEXT,
  certifications TEXT, -- JSON array
  
  -- Status
  status TEXT DEFAULT 'active', -- active, inactive, sold
  featured INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  
  -- SEO
  slug TEXT UNIQUE,
  tags TEXT, -- JSON array
  
  -- Stats
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_userId ON products(userId);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);
CREATE INDEX IF NOT EXISTS idx_products_state ON products(state);

-- ===== FREIGHTS TABLE =====
CREATE TABLE IF NOT EXISTS freights (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  
  -- Route Info
  originCity TEXT NOT NULL,
  originState TEXT NOT NULL,
  destinationCity TEXT NOT NULL,
  destinationState TEXT NOT NULL,
  distance REAL,
  
  -- Load Info
  loadType TEXT,
  weight REAL,
  volume REAL,
  description TEXT,
  
  -- Vehicle
  vehicleType TEXT,
  vehicleCapacity REAL,
  
  -- Pricing
  price REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  priceType TEXT DEFAULT 'fixed', -- fixed, per_km, negotiable
  
  -- Schedule
  pickupDate INTEGER,
  deliveryDate INTEGER,
  flexible INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'available', -- available, in_transit, completed, cancelled
  
  -- Driver Info
  driverName TEXT,
  driverPhone TEXT,
  driverLicense TEXT,
  vehiclePlate TEXT,
  
  -- Tracking
  currentLocation TEXT, -- JSON: {lat, lng}
  trackingCode TEXT UNIQUE,
  
  -- Stats
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_freights_userId ON freights(userId);
CREATE INDEX IF NOT EXISTS idx_freights_status ON freights(status);
CREATE INDEX IF NOT EXISTS idx_freights_originState ON freights(originState);
CREATE INDEX IF NOT EXISTS idx_freights_destinationState ON freights(destinationState);
CREATE INDEX IF NOT EXISTS idx_freights_trackingCode ON freights(trackingCode);

-- ===== MESSAGES TABLE =====
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  senderId TEXT NOT NULL,
  receiverId TEXT NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text', -- text, image, file, system
  
  -- Attachments
  attachments TEXT, -- JSON array
  
  -- Status
  isRead INTEGER DEFAULT 0,
  readAt INTEGER,
  isDeleted INTEGER DEFAULT 0,
  deletedBy TEXT, -- JSON array of user IDs
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversationId ON messages(conversationId);
CREATE INDEX IF NOT EXISTS idx_messages_senderId ON messages(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_receiverId ON messages(receiverId);
CREATE INDEX IF NOT EXISTS idx_messages_isRead ON messages(isRead);

-- ===== TRANSACTIONS TABLE =====
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  
  -- Transaction Info
  type TEXT NOT NULL, -- subscription, purchase, refund
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  
  -- Payment
  paymentMethod TEXT, -- stripe, pix, boleto
  paymentStatus TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  
  -- Stripe
  stripeSessionId TEXT,
  stripePaymentIntentId TEXT,
  
  -- Related
  relatedType TEXT, -- product, freight, subscription
  relatedId TEXT,
  
  -- Description
  description TEXT,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  completedAt INTEGER,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions(userId);
CREATE INDEX IF NOT EXISTS idx_transactions_paymentStatus ON transactions(paymentStatus);
CREATE INDEX IF NOT EXISTS idx_transactions_stripeSessionId ON transactions(stripeSessionId);

-- ===== NOTIFICATIONS TABLE =====
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  
  -- Link
  link TEXT,
  
  -- Status
  isRead INTEGER DEFAULT 0,
  readAt INTEGER,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_isRead ON notifications(isRead);

-- ===== SESSIONS TABLE =====
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  
  -- Session Info
  token TEXT UNIQUE NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  
  -- Status
  isActive INTEGER DEFAULT 1,
  expiresAt INTEGER NOT NULL,
  
  -- Timestamps
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  lastActivity INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_isActive ON sessions(isActive);

-- ===== AUDIT_LOGS TABLE =====
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  userId TEXT,
  
  -- Action Info
  action TEXT NOT NULL,
  entity TEXT NOT NULL, -- user, product, freight, etc
  entityId TEXT,
  
  -- Request Info
  ipAddress TEXT,
  userAgent TEXT,
  method TEXT,
  endpoint TEXT,
  
  -- Details
  oldValue TEXT, -- JSON
  newValue TEXT, -- JSON
  
  -- Timestamp
  createdAt INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_userId ON audit_logs(userId);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity);

-- ===== ADMIN USER =====
-- Criar usuário admin padrão (senha: AgroSync2024!@#SecureAdmin)
INSERT OR IGNORE INTO users (
  id, 
  email, 
  name, 
  password,
  role,
  isAdmin,
  isActive,
  isEmailVerified,
  lgpdConsent,
  lgpdConsentDate
) VALUES (
  'admin-' || hex(randomblob(16)),
  'admin@agroisync.com',
  'Administrador AgroSync',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIjKrYxK6u', -- Hash de AgroSync2024!@#SecureAdmin
  'super-admin',
  1,
  1,
  1,
  1,
  strftime('%s', 'now')
);

-- ===== SAMPLE DATA (OPCIONAL - COMENTADO) =====
-- Descomentar para criar dados de exemplo

-- INSERT INTO products (id, userId, title, description, category, price, stock, city, state, status) VALUES
-- ('prod-1', (SELECT id FROM users WHERE email = 'admin@agroisync.com'), 'Soja Grão', 'Soja de alta qualidade', 'graos', 150.00, 1000, 'Sorriso', 'MT', 'active'),
-- ('prod-2', (SELECT id FROM users WHERE email = 'admin@agroisync.com'), 'Milho', 'Milho seco para ração', 'graos', 80.00, 500, 'Lucas do Rio Verde', 'MT', 'active');

-- INSERT INTO freights (id, userId, originCity, originState, destinationCity, destinationState, loadType, price, status) VALUES
-- ('freight-1', (SELECT id FROM users WHERE email = 'admin@agroisync.com'), 'Cuiabá', 'MT', 'São Paulo', 'SP', 'Grãos', 5000.00, 'available'),
-- ('freight-2', (SELECT id FROM users WHERE email = 'admin@agroisync.com'), 'Sorriso', 'MT', 'Santos', 'SP', 'Soja', 7000.00, 'available');
