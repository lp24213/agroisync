-- Migration simples para email_accounts
CREATE TABLE IF NOT EXISTS email_accounts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  encrypted_password TEXT NOT NULL,
  imap_host TEXT DEFAULT 'internal',
  imap_port INTEGER DEFAULT 993,
  smtp_host TEXT DEFAULT 'internal',
  smtp_port INTEGER DEFAULT 587,
  secure INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  last_sync_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_email ON email_accounts(email);
CREATE INDEX IF NOT EXISTS idx_email_accounts_active ON email_accounts(is_active);
