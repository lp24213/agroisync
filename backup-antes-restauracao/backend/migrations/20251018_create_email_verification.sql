-- Sistema de Verificação de Email

-- Códigos de verificação de email
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  is_used INTEGER DEFAULT 0,
  verified_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Adicionar coluna email_verified na tabela users se não existir
-- ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;
-- Nota: comentado pois pode já existir

-- Índices
CREATE INDEX IF NOT EXISTS idx_email_codes_user ON email_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_email_codes_code ON email_verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_verification_codes(email);

