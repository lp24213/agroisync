-- ============================================
-- AGROISYNC DATABASE SCHEMA
-- ============================================

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    businessType TEXT DEFAULT 'all', -- 'produto', 'frete', 'loja', 'all'
    plan TEXT DEFAULT 'inicial', -- 'inicial', 'profissional', 'empresarial', 'premium', 'loja'
    plan_expires_at DATETIME,
    email_verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_business_type ON users(businessType);

-- Table: plans (Planos e limites)
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- 'inicial', 'profissional', etc
    price_monthly DECIMAL(10,2) NOT NULL,
    price_6months DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    freight_limit INTEGER NOT NULL, -- -1 = ilimitado
    product_limit INTEGER NOT NULL, -- -1 = ilimitado
    store_products_limit INTEGER, -- Para plano loja
    features TEXT, -- JSON com features
    created_at DATETIME DEFAULT (datetime('now'))
);

-- Inserir planos iniciais
INSERT OR REPLACE INTO plans (id, name, slug, price_monthly, price_6months, price_annual, freight_limit, product_limit, store_products_limit, features) VALUES
('plan_inicial', 'Inicial', 'inicial', 9.90, 9.40, 8.90, 2, 2, 0, '["2 fretes/mês", "2 anúncios", "Suporte email", "Dashboard básico"]'),
('plan_profissional', 'Profissional', 'profissional', 19.90, 18.90, 17.90, 10, 10, 0, '["10 fretes/mês", "10 anúncios", "Suporte 2h", "Dashboard avançado", "Prioridade buscas"]'),
('plan_empresarial', 'Empresarial', 'empresarial', 79.90, 75.90, 71.90, 50, 50, 0, '["50 fretes/mês", "50 anúncios", "Suporte 24h", "API integração", "Destaque Premium"]'),
('plan_premium', 'Premium', 'premium', 249.90, 237.40, 224.90, -1, -1, 20, '["Ilimitado", "Loja 20 produtos", "IA", "API completa", "Gerente conta"]'),
('plan_loja', 'Loja Ilimitada', 'loja', 499.90, 474.90, 449.90, -1, -1, -1, '["Produtos ilimitados", "API corporativa", "Suporte 24/7", "Consultoria", "Selo PRO"]');

-- Table: user_usage (Controle de uso mensal)
CREATE TABLE IF NOT EXISTS user_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    month TEXT NOT NULL, -- formato: YYYY-MM
    freights_used INTEGER DEFAULT 0,
    products_used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_usage_user_month ON user_usage(user_id, month);

-- Table: email_logs
CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  type TEXT NOT NULL, -- 'verification' or 'password-reset'
  code TEXT NOT NULL,
  token TEXT, -- For password reset
  sent_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  status TEXT DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_code ON email_logs(code);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    category TEXT NOT NULL,
    images TEXT, -- JSON array
    specifications TEXT, -- JSON object
    seller_info TEXT, -- JSON object
    documents TEXT, -- JSON array
    payment_terms TEXT,
    delivery_info TEXT, -- JSON object
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    featured INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    views INTEGER NOT NULL DEFAULT 0,
    favorites TEXT DEFAULT '[]', -- JSON array
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_city_state ON products(city, state);
CREATE INDEX IF NOT EXISTS idx_products_expires ON products(expires_at);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Table: freights (Tabela de fretes)
CREATE TABLE IF NOT EXISTS freights (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    origin_state TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_state TEXT NOT NULL,
    cargo_type TEXT NOT NULL,
    weight DECIMAL(10,2),
    volume DECIMAL(10,2),
    price DECIMAL(10,2),
    description TEXT,
    pickup_date TEXT,
    delivery_date TEXT,
    status TEXT DEFAULT 'active',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_freights_user ON freights(user_id);
CREATE INDEX IF NOT EXISTS idx_freights_status ON freights(status);
CREATE INDEX IF NOT EXISTS idx_freights_origin ON freights(origin_city, origin_state);
CREATE INDEX IF NOT EXISTS idx_freights_destination ON freights(destination_city, destination_state);

-- Table: product_views
CREATE TABLE IF NOT EXISTS product_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_views_product ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_views_user ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_views_created ON product_views(created_at DESC);

-- Table: product_favorites
CREATE TABLE IF NOT EXISTS product_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_product ON product_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON product_favorites(user_id);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    delivery_status TEXT NOT NULL DEFAULT 'pending',
    delivery_info TEXT, -- JSON object
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT (datetime('now')),
    updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- Triggers para atualizar updated_at
CREATE TRIGGER IF NOT EXISTS users_updated_at 
AFTER UPDATE ON users
BEGIN
    UPDATE users 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS products_updated_at 
AFTER UPDATE ON products
BEGIN
    UPDATE products 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS orders_updated_at 
AFTER UPDATE ON orders
BEGIN
    UPDATE orders 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS freights_updated_at 
AFTER UPDATE ON freights
BEGIN
    UPDATE freights 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS user_usage_updated_at 
AFTER UPDATE ON user_usage
BEGIN
    UPDATE user_usage 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;
