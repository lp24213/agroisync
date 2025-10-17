-- Criar tabela de planos
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_6months DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    freight_limit INTEGER NOT NULL,
    product_limit INTEGER NOT NULL,
    store_products_limit INTEGER,
    features TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
);

-- Inserir planos
INSERT OR REPLACE INTO plans (id, name, slug, price_monthly, price_6months, price_annual, freight_limit, product_limit, store_products_limit, features) VALUES
('plan_inicial', 'Inicial', 'inicial', 9.90, 9.40, 8.90, 2, 2, 0, '["2 fretes/mês", "2 anúncios", "Suporte email", "Dashboard básico"]'),
('plan_profissional', 'Profissional', 'profissional', 19.90, 18.90, 17.90, 10, 10, 0, '["10 fretes/mês", "10 anúncios", "Suporte 2h", "Dashboard avançado", "Prioridade buscas"]'),
('plan_empresarial', 'Empresarial', 'empresarial', 79.90, 75.90, 71.90, 50, 50, 0, '["50 fretes/mês", "50 anúncios", "Suporte 24h", "API integração", "Destaque Premium"]'),
('plan_premium', 'Premium', 'premium', 249.90, 237.40, 224.90, -1, -1, 20, '["Ilimitado", "Loja 20 produtos", "IA", "API completa", "Gerente conta"]'),
('plan_loja', 'Loja Ilimitada', 'loja', 499.90, 474.90, 449.90, -1, -1, -1, '["Produtos ilimitados", "API corporativa", "Suporte 24/7", "Consultoria", "Selo PRO"]');

-- Criar tabela de uso mensal
CREATE TABLE IF NOT EXISTS user_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    month TEXT NOT NULL,
    freights_used INTEGER DEFAULT 0,
    products_used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_usage_user_month ON user_usage(user_id, month);

-- Criar tabela freights (se não existir)
CREATE TABLE IF NOT EXISTS freights (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    origin_state TEXT,
    destination_city TEXT NOT NULL,
    destination_state TEXT,
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
