-- 💰 SISTEMA DE MONETIZAÇÃO AGROISYNC
-- Criado: 2025-10-21
-- Descrição: Tabelas para anúncios, patrocínios, taxas e comissões

-- ================================================================
-- 1. TABELA DE ANÚNCIOS/BANNERS
-- ================================================================
CREATE TABLE IF NOT EXISTS advertisements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  
  -- Tipo de anúncio
  ad_type TEXT NOT NULL CHECK(ad_type IN ('banner', 'native', 'sponsored_listing', 'featured')),
  
  -- Localização do anúncio
  placement TEXT NOT NULL CHECK(placement IN ('header', 'sidebar', 'footer', 'home_hero', 'marketplace', 'freight', 'product_detail')),
  
  -- Dados do anunciante
  advertiser_id TEXT,
  advertiser_name TEXT,
  advertiser_email TEXT,
  
  -- Período de exibição
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  
  -- Métricas
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0.0, -- Click-through rate
  
  -- Financeiro
  price REAL NOT NULL, -- Valor cobrado pelo anúncio
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'expired', 'pending')),
  
  -- Prioridade (maior = aparece primeiro)
  priority INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (advertiser_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_ads_status ON advertisements(status);
CREATE INDEX IF NOT EXISTS idx_ads_placement ON advertisements(placement);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON advertisements(start_date, end_date);

-- ================================================================
-- 2. TABELA DE ITENS PATROCINADOS (Produtos/Fretes em destaque)
-- ================================================================
CREATE TABLE IF NOT EXISTS sponsored_items (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL, -- ID do produto ou frete
  item_type TEXT NOT NULL CHECK(item_type IN ('product', 'freight')),
  user_id TEXT NOT NULL,
  
  -- Tipo de patrocínio
  sponsorship_type TEXT NOT NULL CHECK(sponsorship_type IN ('featured', 'top_listing', 'premium_badge', 'highlighted')),
  
  -- Período
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  
  -- Financeiro
  price REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
  payment_id TEXT,
  
  -- Métricas
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0, -- Vendas/negociações geradas
  
  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'expired')),
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sponsored_items_type ON sponsored_items(item_type);
CREATE INDEX IF NOT EXISTS idx_sponsored_items_status ON sponsored_items(status);
CREATE INDEX IF NOT EXISTS idx_sponsored_items_dates ON sponsored_items(start_date, end_date);

-- ================================================================
-- 3. TABELA DE TRANSAÇÕES E COMISSÕES
-- ================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  
  -- Tipo de transação
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('subscription', 'advertisement', 'commission', 'sponsorship', 'fee')),
  
  -- Dados da transação
  user_id TEXT NOT NULL,
  item_id TEXT, -- ID do produto/frete/anúncio relacionado
  item_type TEXT CHECK(item_type IN ('product', 'freight', 'ad', 'subscription')),
  
  -- Financeiro
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  
  -- Comissão (se aplicável)
  commission_rate REAL DEFAULT 0.0, -- Percentual (0.5 = 0.5%)
  commission_amount REAL DEFAULT 0.0,
  net_amount REAL, -- Valor líquido após comissão
  
  -- Pagamento
  payment_method TEXT CHECK(payment_method IN ('pix', 'credit_card', 'boleto', 'asaas')),
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_gateway TEXT DEFAULT 'asaas',
  payment_gateway_id TEXT, -- ID da transação no gateway (Asaas, Stripe, etc)
  payment_link TEXT,
  
  -- Descrição
  description TEXT,
  metadata TEXT, -- JSON com dados adicionais
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  paid_at TEXT,
  refunded_at TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);

-- ================================================================
-- 4. TABELA DE CONFIGURAÇÕES DE MONETIZAÇÃO
-- ================================================================
CREATE TABLE IF NOT EXISTS monetization_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  updated_by TEXT
);

-- Configurações padrão
INSERT OR IGNORE INTO monetization_settings (key, value, description) VALUES
  ('commission_rate_default', '0.5', 'Taxa de comissão padrão (%)'),
  ('commission_rate_freight', '1.0', 'Taxa de comissão em fretes (%)'),
  ('commission_rate_product', '0.5', 'Taxa de comissão em produtos (%)'),
  ('featured_product_price', '49.90', 'Preço para destacar produto por 30 dias'),
  ('featured_freight_price', '39.90', 'Preço para destacar frete por 30 dias'),
  ('banner_header_price', '199.90', 'Preço banner header por mês'),
  ('banner_sidebar_price', '99.90', 'Preço banner sidebar por mês'),
  ('native_ad_price', '29.90', 'Preço anúncio nativo por semana'),
  ('enable_commissions', 'true', 'Ativar sistema de comissões'),
  ('enable_advertisements', 'true', 'Ativar sistema de anúncios'),
  ('enable_sponsorships', 'true', 'Ativar patrocínios');

-- ================================================================
-- 5. TABELA DE MÉTRICAS DE ANÚNCIOS (por dia)
-- ================================================================
CREATE TABLE IF NOT EXISTS ad_metrics_daily (
  id TEXT PRIMARY KEY,
  ad_id TEXT NOT NULL,
  date TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0.0,
  revenue REAL DEFAULT 0.0,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (ad_id) REFERENCES advertisements(id),
  UNIQUE(ad_id, date)
);

CREATE INDEX IF NOT EXISTS idx_ad_metrics_date ON ad_metrics_daily(date);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_ad ON ad_metrics_daily(ad_id);

-- ================================================================
-- 6. TABELA DE RECEITA TOTAL (consolidado)
-- ================================================================
CREATE TABLE IF NOT EXISTS revenue_summary (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  
  -- Receitas por categoria
  subscription_revenue REAL DEFAULT 0.0,
  advertisement_revenue REAL DEFAULT 0.0,
  commission_revenue REAL DEFAULT 0.0,
  sponsorship_revenue REAL DEFAULT 0.0,
  
  -- Total
  total_revenue REAL DEFAULT 0.0,
  
  -- Estatísticas
  total_transactions INTEGER DEFAULT 0,
  total_users_paid INTEGER DEFAULT 0,
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue_summary(date);

-- ================================================================
-- 7. ADICIONAR CAMPOS EM USERS (se ainda não existem)
-- ================================================================
-- ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0;
-- ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0;
-- ALTER TABLE users ADD COLUMN total_spent REAL DEFAULT 0.0;
-- ALTER TABLE users ADD COLUMN commission_balance REAL DEFAULT 0.0; -- Saldo de comissões a receber

-- ================================================================
-- 8. ADICIONAR CAMPOS EM PRODUCTS (se ainda não existem)
-- ================================================================
-- ALTER TABLE products ADD COLUMN is_sponsored INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN is_featured INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN featured_until TEXT;

-- ================================================================
-- 9. ADICIONAR CAMPOS EM FREIGHTS (se ainda não existem)
-- ================================================================
-- ALTER TABLE freights ADD COLUMN is_sponsored INTEGER DEFAULT 0;
-- ALTER TABLE freights ADD COLUMN is_featured INTEGER DEFAULT 0;
-- ALTER TABLE freights ADD COLUMN featured_until TEXT;

