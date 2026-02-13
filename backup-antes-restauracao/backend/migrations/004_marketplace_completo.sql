-- ============================================
-- MIGRATION 004: MARKETPLACE COMPLETO
-- Adiciona tabelas para cotações, alertas e favoritos
-- ============================================

-- COTAÇÕES DE MERCADO (Cache local)
CREATE TABLE IF NOT EXISTS market_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_type TEXT NOT NULL,
  price REAL NOT NULL,
  variation REAL DEFAULT 0,
  source TEXT DEFAULT 'cepea',
  region TEXT DEFAULT 'nacional',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_prices_type_date 
ON market_prices(product_type, timestamp DESC);

-- ALERTAS DE PREÇO
CREATE TABLE IF NOT EXISTS price_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_type TEXT NOT NULL,
  target_price REAL NOT NULL,
  condition TEXT DEFAULT 'below',
  is_active BOOLEAN DEFAULT 1,
  triggered_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user 
ON price_alerts(user_id, is_active);

-- FAVORITOS
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user 
ON favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_product 
ON favorites(product_id);

-- HISTÓRICO DE VISUALIZAÇÕES
CREATE TABLE IF NOT EXISTS product_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER NOT NULL,
  session_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_views_product 
ON product_views(product_id, created_at DESC);

-- Atualizar tabela PRODUCTS com novos campos
ALTER TABLE products ADD COLUMN subcategory TEXT;
ALTER TABLE products ADD COLUMN quality_grade TEXT;
ALTER TABLE products ADD COLUMN harvest_season TEXT;
ALTER TABLE products ADD COLUMN humidity REAL;
ALTER TABLE products ADD COLUMN impurities REAL;
ALTER TABLE products ADD COLUMN certifications TEXT;
ALTER TABLE products ADD COLUMN min_order REAL DEFAULT 1;
ALTER TABLE products ADD COLUMN max_order REAL;
ALTER TABLE products ADD COLUMN delivery_radius INTEGER DEFAULT 500;
ALTER TABLE products ADD COLUMN has_freight BOOLEAN DEFAULT 0;
ALTER TABLE products ADD COLUMN estimated_freight REAL;
ALTER TABLE products ADD COLUMN delivery_time INTEGER;
ALTER TABLE products ADD COLUMN is_opportunity BOOLEAN DEFAULT 0;
ALTER TABLE products ADD COLUMN views INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN favorites INTEGER DEFAULT 0;

-- Inserir dados iniciais de cotações (últimos 30 dias)
INSERT INTO market_prices (product_type, price, variation, source) VALUES
  ('soja', 120.50, 2.5, 'cepea'),
  ('milho', 85.30, -1.2, 'cepea'),
  ('cafe', 1200.00, 5.3, 'cepea'),
  ('trigo', 95.20, 1.8, 'cepea'),
  ('boi-gordo', 320.00, 3.2, 'cepea'),
  ('leite', 2.45, -0.5, 'cepea');

-- Trigger para atualizar contador de favoritos
CREATE TRIGGER IF NOT EXISTS update_product_favorites_count
AFTER INSERT ON favorites
BEGIN
  UPDATE products SET favorites = favorites + 1 WHERE id = NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS decrease_product_favorites_count
AFTER DELETE ON favorites
BEGIN
  UPDATE products SET favorites = favorites - 1 WHERE id = OLD.product_id;
END;

-- Trigger para atualizar contador de visualizações
CREATE TRIGGER IF NOT EXISTS update_product_views_count
AFTER INSERT ON product_views
BEGIN
  UPDATE products SET views = views + 1 WHERE id = NEW.product_id;
END;

