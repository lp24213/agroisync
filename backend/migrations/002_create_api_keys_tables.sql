-- 🔑 TABELAS PARA SISTEMA DE API KEYS
-- Sistema de venda de acesso à API Agroisync

-- ================================================================
-- TABELA DE API KEYS
-- ================================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  api_key_hash TEXT NOT NULL UNIQUE, -- SHA256 hash da chave
  api_key_prefix TEXT NOT NULL, -- Primeiros 20 chars para identificação
  
  -- Cliente
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  
  -- Plano e limites
  plan_type TEXT DEFAULT 'basic' CHECK(plan_type IN ('basic', 'pro', 'enterprise', 'custom')),
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Permissões
  allowed_endpoints TEXT DEFAULT '["all"]', -- JSON array
  allowed_methods TEXT DEFAULT '["GET", "POST"]', -- JSON array
  
  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'revoked', 'expired')),
  
  -- Uso
  total_requests INTEGER DEFAULT 0,
  last_used_at TEXT,
  
  -- Financeiro
  monthly_price REAL DEFAULT 0.0,
  
  -- Revogação
  revoked_at TEXT,
  revoked_reason TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);

-- ================================================================
-- TABELA DE LOGS DE USO DA API
-- ================================================================
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id TEXT PRIMARY KEY,
  api_key_id TEXT NOT NULL,
  
  -- Request
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Response
  status_code INTEGER,
  response_time_ms INTEGER,
  
  -- Timestamp
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
);

CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage_logs(endpoint);

-- ================================================================
-- PLANOS DE API (Tabela de referência)
-- ================================================================
CREATE TABLE IF NOT EXISTS api_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Limites
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  rate_limit_per_month INTEGER DEFAULT 300000,
  
  -- Recursos
  allowed_endpoints TEXT DEFAULT '["all"]',
  has_webhooks INTEGER DEFAULT 0,
  has_priority_support INTEGER DEFAULT 0,
  has_sla INTEGER DEFAULT 0,
  
  -- Preço
  monthly_price REAL NOT NULL,
  annual_price REAL,
  annual_discount_percent REAL DEFAULT 0.0,
  
  -- Status
  is_active INTEGER DEFAULT 1,
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Planos padrão de API
INSERT OR IGNORE INTO api_plans (id, name, slug, description, rate_limit_per_minute, rate_limit_per_day, monthly_price, annual_price) VALUES
  ('api_basic', 'API Basic', 'basic', 'Ideal para pequenos projetos e testes', 60, 10000, 49.90, 499.00),
  ('api_pro', 'API Pro', 'pro', 'Para aplicações profissionais', 300, 100000, 149.90, 1499.00),
  ('api_enterprise', 'API Enterprise', 'enterprise', 'Ilimitado com SLA e suporte dedicado', 1000, 1000000, 499.90, 4999.00);

