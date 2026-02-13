-- Sistema Completo de Cripto/Corretora - AgroSync

-- Carteiras de criptomoedas dos usuários
CREATE TABLE IF NOT EXISTS crypto_wallets (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT DEFAULT 'metamask',
  is_verified INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Saldos de criptomoedas dos usuários
CREATE TABLE IF NOT EXISTS crypto_balances (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  crypto_symbol TEXT NOT NULL,
  balance REAL DEFAULT 0,
  balance_usd REAL DEFAULT 0,
  last_updated INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transações de criptomoedas
CREATE TABLE IF NOT EXISTS crypto_transactions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  crypto_symbol TEXT NOT NULL,
  amount REAL NOT NULL,
  amount_usd REAL NOT NULL,
  price_at_time REAL NOT NULL,
  fee_percentage REAL DEFAULT 0,
  fee_amount REAL DEFAULT 0,
  wallet_address TEXT,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Pagamentos recebidos em cripto
CREATE TABLE IF NOT EXISTS crypto_payments (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  transaction_id TEXT,
  crypto_symbol TEXT NOT NULL,
  amount REAL NOT NULL,
  amount_brl REAL NOT NULL,
  commission_percentage REAL DEFAULT 10,
  commission_amount_brl REAL NOT NULL,
  net_amount_brl REAL NOT NULL,
  owner_wallet TEXT,
  user_wallet TEXT,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  payment_for TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (transaction_id) REFERENCES crypto_transactions(id)
);

-- Comissões acumuladas
CREATE TABLE IF NOT EXISTS crypto_commissions (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  amount_brl REAL NOT NULL,
  crypto_symbol TEXT,
  transferred_to_owner INTEGER DEFAULT 0,
  transfer_date INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (payment_id) REFERENCES crypto_payments(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_user ON crypto_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_address ON crypto_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_crypto_balances_user ON crypto_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_balances_symbol ON crypto_balances(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_user ON crypto_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_type ON crypto_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_status ON crypto_transactions(status);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_user ON crypto_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON crypto_payments(status);
CREATE INDEX IF NOT EXISTS idx_crypto_commissions_payment ON crypto_commissions(payment_id);

