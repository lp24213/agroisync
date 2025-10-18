-- Migration: adicionar payment_method e metadata
ALTER TABLE payments ADD COLUMN payment_method TEXT;
ALTER TABLE payments ADD COLUMN metadata TEXT;
-- Aplicar com:
-- npx wrangler d1 execute DB --remote --file ./migrations/20251018_add_payment_method_metadata.sql --config ./wrangler.toml -y
