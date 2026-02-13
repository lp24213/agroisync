-- Migration: add avatar_url and cpf to users, add payment columns type, payment_method, metadata
-- This migration uses ALTER TABLE which is supported by Cloudflare D1

PRAGMA foreign_keys=OFF;

ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN cpf TEXT;
ALTER TABLE users ADD COLUMN cnpj TEXT;
ALTER TABLE users ADD COLUMN payment_method TEXT;

-- Add metadata column to payments
ALTER TABLE payments ADD COLUMN payment_method TEXT;
ALTER TABLE payments ADD COLUMN metadata TEXT;
ALTER TABLE payments ADD COLUMN type TEXT;

PRAGMA foreign_keys=ON;
