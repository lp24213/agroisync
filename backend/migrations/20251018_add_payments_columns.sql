-- Migration: 2025-10-18
-- Adiciona colunas usadas pelo código do worker à tabela `payments` no D1 (SQLite)
-- IMPORTANT: Faça backup do banco antes de executar esta migration em produção.

-- Nota: O comando 'wrangler d1 execute' remoto não permite BEGIN/COMMIT nem PRAGMA; por isso
-- mantemos apenas as instruções ALTER TABLE necessárias.

ALTER TABLE payments ADD COLUMN payment_method TEXT;
ALTER TABLE payments ADD COLUMN plan_slug TEXT;
ALTER TABLE payments ADD COLUMN billing_cycle TEXT;
ALTER TABLE payments ADD COLUMN external_id TEXT;
ALTER TABLE payments ADD COLUMN paid_at TEXT;
ALTER TABLE payments ADD COLUMN metadata TEXT;

-- Instruções:
-- 1) Faça backup do banco (exportar dump) antes de aplicar.
-- 2) Aplique com wrangler (no diretório `backend`) utilizando:
--    npx wrangler d1 execute DB --remote --file ./migrations/20251018_add_payments_columns.sql --config ./wrangler.toml -y
-- 3) Para verificar colunas existentes antes de rodar (opcional):
--    npx wrangler d1 execute DB --remote --command "PRAGMA table_info('payments');" --config ./wrangler.toml

-- Nota: Se alguma coluna já existir, ALTER TABLE ADD COLUMN vai falhar. Verifique antes.
