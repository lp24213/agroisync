-- ============================================
-- SISTEMA DE EMAIL CORPORATIVO COMPLETO
-- Agroisync Corporate Email System
-- ============================================

-- Tabela de contas de email corporativas
CREATE TABLE IF NOT EXISTS corporate_emails (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT,
  created_by INTEGER,
  is_active INTEGER DEFAULT 1,
  storage_used_mb REAL DEFAULT 0,
  storage_limit_mb REAL DEFAULT 5000,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de pastas de email
CREATE TABLE IF NOT EXISTS email_folders (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  folder_name TEXT NOT NULL,
  folder_type TEXT NOT NULL,
  unread_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de mensagens de email
CREATE TABLE IF NOT EXISTS email_messages (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  folder_id TEXT NOT NULL,
  message_id TEXT UNIQUE,
  thread_id TEXT,
  from_address TEXT NOT NULL,
  from_name TEXT,
  to_addresses TEXT NOT NULL,
  cc_addresses TEXT,
  bcc_addresses TEXT,
  reply_to TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  is_read INTEGER DEFAULT 0,
  is_starred INTEGER DEFAULT 0,
  is_spam INTEGER DEFAULT 0,
  spam_score REAL DEFAULT 0,
  has_attachments INTEGER DEFAULT 0,
  size_bytes INTEGER DEFAULT 0,
  received_at TEXT DEFAULT (datetime('now')),
  sent_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de anexos
CREATE TABLE IF NOT EXISTS email_attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_url TEXT,
  r2_key TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de rascunhos
CREATE TABLE IF NOT EXISTS email_drafts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  to_addresses TEXT,
  cc_addresses TEXT,
  bcc_addresses TEXT,
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  reply_to_message_id TEXT,
  forward_message_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de configurações de email
CREATE TABLE IF NOT EXISTS email_settings (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  signature_html TEXT,
  auto_reply_enabled INTEGER DEFAULT 0,
  auto_reply_message TEXT,
  forward_to TEXT,
  spam_filter_level INTEGER DEFAULT 5,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de logs de atividade
CREATE TABLE IF NOT EXISTS email_activity_log (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de webhooks recebidos
CREATE TABLE IF NOT EXISTS email_webhooks (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  processed INTEGER DEFAULT 0,
  error_message TEXT,
  received_at TEXT DEFAULT (datetime('now')),
  processed_at TEXT
);

-- Tabela de filtros de spam e regras
CREATE TABLE IF NOT EXISTS email_filters (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  filter_name TEXT NOT NULL,
  filter_type TEXT NOT NULL,
  conditions TEXT NOT NULL,
  actions TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de contatos (para autocomplete)
CREATE TABLE IF NOT EXISTS email_contacts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  email_address TEXT NOT NULL,
  display_name TEXT,
  frequency INTEGER DEFAULT 1,
  last_contacted TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(account_id, email_address)
);
