-- Migration: Create EmailAccounts table
-- Version: 1.0.0
-- Created: 2025-01-10

CREATE TABLE IF NOT EXISTS email_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  imap_host TEXT DEFAULT 'imap.hostinger.com',
  imap_port INTEGER DEFAULT 993,
  smtp_host TEXT DEFAULT 'smtp.hostinger.com',
  smtp_port INTEGER DEFAULT 465,
  secure INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  last_sync_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_email ON email_accounts(email);
CREATE INDEX IF NOT EXISTS idx_email_accounts_active ON email_accounts(is_active);

-- Tabela para cache de mensagens
CREATE TABLE IF NOT EXISTS email_messages (
  id TEXT PRIMARY KEY,
  email_account_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  uid INTEGER,
  folder TEXT DEFAULT 'INBOX',
  from_address TEXT,
  to_address TEXT,
  cc_address TEXT,
  bcc_address TEXT,
  subject TEXT,
  html_content TEXT,
  text_content TEXT,
  date TEXT,
  is_read INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  has_attachments INTEGER DEFAULT 0,
  raw_data TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (email_account_id) REFERENCES email_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_messages_account ON email_messages(email_account_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_folder ON email_messages(folder);
CREATE INDEX IF NOT EXISTS idx_email_messages_read ON email_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_email_messages_date ON email_messages(date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_messages_unique ON email_messages(email_account_id, message_id, folder);

-- Tabela para anexos
CREATE TABLE IF NOT EXISTS email_attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  content_id TEXT,
  file_path TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (message_id) REFERENCES email_messages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_attachments_message ON email_attachments(message_id);

-- Tabela para eventos de webhook
CREATE TABLE IF NOT EXISTS email_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  response_code INTEGER,
  response_body TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  processed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON email_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON email_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON email_webhook_events(created_at);

