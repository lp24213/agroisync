-- =============================================================
-- AGROISYNC • Cloudflare D1 Schema (backend/schema.sql)
-- Este arquivo define a estrutura base do banco relacional
-- compatível com Cloudflare D1. Não inclua dados sensíveis aqui.
-- =============================================================

PRAGMA foreign_keys = ON;

-- =============================================================
-- Tabela: users
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  bio TEXT,

  -- Dados de localização
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  zip_code TEXT,
  json_coordinates TEXT, -- {"lat": number, "lng": number}

  -- Dados de negócio
  business_type TEXT CHECK (business_type IN ('producer','buyer','transporter','all')) DEFAULT 'all',
  business_name TEXT,
  business_document TEXT,
  business_license TEXT,

  -- Dados sensíveis (já criptografados na aplicação)
  cpf TEXT,
  cnpj TEXT,
  rg TEXT,
  passport TEXT,
  bank_account TEXT,
  credit_card TEXT,
  tax_id TEXT,
  business_id TEXT,
  json_encryption_metadata TEXT,

  -- Status/verificação
  is_email_verified INTEGER NOT NULL DEFAULT 0,
  email_verification_token TEXT,
  email_verification_expires INTEGER,
  verification_code TEXT,
  code_expires INTEGER,
  is_phone_verified INTEGER NOT NULL DEFAULT 0,
  phone_verification_code TEXT,
  phone_verification_expires INTEGER,

  -- Segurança / 2FA
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  two_factor_secret TEXT,

  -- Permissões / papéis
  role TEXT CHECK (role IN ('user','admin','super_admin','moderator','support')) DEFAULT 'user',
  is_admin INTEGER NOT NULL DEFAULT 0,
  admin_role TEXT,
  admin_notes TEXT,

  -- Plano / pagamentos
  plan TEXT CHECK (plan IN ('free','basic','pro','enterprise')) DEFAULT 'free',
  plan_expires_at INTEGER,
  subscription_id TEXT,
  payment_method TEXT,
  plan_active INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Privacidade / notificações (JSON)
  json_privacy_settings TEXT,
  json_notification_settings TEXT,

  -- Status da conta
  is_active INTEGER NOT NULL DEFAULT 1,
  is_suspended INTEGER NOT NULL DEFAULT 0,
  suspension_reason TEXT,
  suspension_expires_at INTEGER,
  is_blocked INTEGER NOT NULL DEFAULT 0,
  blocked_reason TEXT,
  blocked_at INTEGER,

  -- LGPD / consentimentos
  lgpd_consent INTEGER NOT NULL DEFAULT 0,
  lgpd_consent_date INTEGER,
  data_processing_consent INTEGER NOT NULL DEFAULT 0,
  marketing_consent INTEGER NOT NULL DEFAULT 0,

  -- Segurança adicional
  last_login_at INTEGER,
  last_login_ip TEXT,
  login_attempts INTEGER NOT NULL DEFAULT 0,
  lock_until INTEGER,
  password_changed_at INTEGER,
  password_reset_token TEXT,
  password_reset_expires INTEGER,

  -- Estatísticas / preferências
  json_stats TEXT,
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  json_metadata TEXT,

  -- Timestamps padrão
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- =============================================================
-- Tabela: user_admin_permissions
-- =============================================================
CREATE TABLE IF NOT EXISTS user_admin_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, permission)
);

CREATE INDEX IF NOT EXISTS idx_user_admin_permissions_user ON user_admin_permissions(user_id);

-- =============================================================
-- Tabela: user_twofactor_backup_codes
-- =============================================================
CREATE TABLE IF NOT EXISTS user_twofactor_backup_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  used_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_twofactor_codes_user ON user_twofactor_backup_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_twofactor_codes_used ON user_twofactor_backup_codes(used_at);

-- =============================================================
-- Tabela: password_resets
-- =============================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT CHECK (status IN ('pending', 'used', 'expired', 'revoked')) DEFAULT 'pending',
  used_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_status ON password_resets(status);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);

-- =============================================================
-- Tabela: partners
-- =============================================================
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  category TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  status TEXT CHECK (status IN ('active','inactive','pending')) DEFAULT 'active',
  featured INTEGER NOT NULL DEFAULT 0,
  partnership_level TEXT CHECK (partnership_level IN ('bronze','silver','gold','platinum')) DEFAULT 'bronze',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON partners(featured);

-- =============================================================
-- Tabela: freight_orders
-- =============================================================
CREATE TABLE IF NOT EXISTS freight_orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  customer_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  weight REAL,
  volume REAL,
  distance REAL,
  estimated_price REAL,
  final_price REAL,
  scheduled_date INTEGER,
  pickup_date INTEGER,
  delivery_date INTEGER,
  status TEXT CHECK (status IN ('pending','confirmed','in_transit','delivered','cancelled')) DEFAULT 'pending',
  driver_id TEXT,
  vehicle_plate TEXT,
  tracking_code TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_freight_orders_customer ON freight_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_freight_orders_status ON freight_orders(status);
CREATE INDEX IF NOT EXISTS idx_freight_orders_driver ON freight_orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_freight_orders_created_at ON freight_orders(created_at);

-- =============================================================
-- Tabela: products
-- =============================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  seller_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price REAL NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  origin TEXT,
  quality_grade TEXT,
  harvest_date INTEGER,
  certifications TEXT,
  images TEXT,
  status TEXT CHECK (status IN ('active','sold','inactive')) DEFAULT 'active',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

