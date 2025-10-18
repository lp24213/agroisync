-- Migration: ensure products.id is INTEGER PRIMARY KEY AUTOINCREMENT
-- NOTE: Cloudflare D1 (SQLite variant) may not allow ALTER PRIMARY KEY directly. This migration creates a new table and copies data.

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS products_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  description TEXT,
  category TEXT,
  price REAL,
  quantity REAL,
  unit TEXT,
  images TEXT,
  status TEXT,
  origin TEXT,
  quality_grade TEXT,
  harvest_date TEXT,
  certifications TEXT,
  created_at TEXT
);

INSERT INTO products_new (id, user_id, name, description, category, price, quantity, unit, images, status, origin, quality_grade, harvest_date, certifications, created_at)
SELECT id, user_id, name, description, category, price, quantity, unit, images, status, origin, quality_grade, harvest_date, certifications, created_at FROM products;

DROP TABLE products;
ALTER TABLE products_new RENAME TO products;

COMMIT;
