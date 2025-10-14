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

-- Trigger para atualizar updated_at
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