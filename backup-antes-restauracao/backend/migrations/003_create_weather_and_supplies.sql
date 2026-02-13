-- ============================================
-- AGROISYNC - Tabelas de Clima e Insumos
-- Criado em: 2025-10-21
-- ============================================

-- Tabela de dados climáticos
CREATE TABLE IF NOT EXISTS weather_data (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  description TEXT,
  forecast TEXT,
  wind_speed REAL DEFAULT 0,
  precipitation REAL DEFAULT 0,
  pressure REAL DEFAULT 1013,
  uv_index INTEGER DEFAULT 0,
  sunrise TEXT,
  sunset TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(city, state)
);

-- Tabela de previsões climáticas (próximos 7 dias)
CREATE TABLE IF NOT EXISTS weather_forecast (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  forecast_date TEXT NOT NULL,
  min_temp REAL NOT NULL,
  max_temp REAL NOT NULL,
  humidity REAL,
  precipitation_chance REAL,
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(city, state, forecast_date)
);

-- Tabela de insumos agrícolas
CREATE TABLE IF NOT EXISTS supplies (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'kg',
  avg_price REAL,
  price_variation REAL DEFAULT 0,
  availability TEXT DEFAULT 'disponivel',
  manufacturer TEXT,
  specifications TEXT,
  usage_recommendations TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de histórico de preços de insumos
CREATE TABLE IF NOT EXISTS supplies_price_history (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  supply_id TEXT NOT NULL,
  price REAL NOT NULL,
  date TEXT NOT NULL,
  market TEXT,
  FOREIGN KEY (supply_id) REFERENCES supplies(id)
);

-- Inserir dados iniciais de insumos
INSERT OR IGNORE INTO supplies (name, category, description, unit, avg_price) VALUES
('Ureia', 'fertilizante', 'Fertilizante nitrogenado de alta concentração', 'kg', 2.80),
('NPK 10-10-10', 'fertilizante', 'Fertilizante completo equilibrado', 'kg', 2.50),
('Sulfato de Amônio', 'fertilizante', 'Fertilizante nitrogenado com enxofre', 'kg', 1.80),
('Superfosfato Simples', 'fertilizante', 'Fonte de fósforo para solo', 'kg', 1.90),
('Cloreto de Potássio', 'fertilizante', 'Fonte de potássio', 'kg', 2.20),
('Glifosato', 'defensivo', 'Herbicida não seletivo', 'litro', 25.00),
('2,4-D', 'defensivo', 'Herbicida seletivo', 'litro', 18.00),
('Atrazina', 'defensivo', 'Herbicida pré e pós emergente', 'litro', 22.00),
('Imidacloprido', 'defensivo', 'Inseticida sistêmico', 'litro', 85.00),
('Mancozebe', 'defensivo', 'Fungicida protetor', 'kg', 15.00),
('Semente Soja Transgênica', 'semente', 'Semente certificada RR', 'saca', 450.00),
('Semente Milho Híbrido', 'semente', 'Semente certificada alto rendimento', 'saca', 380.00),
('Calcário Dolomítico', 'corretivo', 'Correção de acidez do solo', 'tonelada', 120.00),
('Gesso Agrícola', 'corretivo', 'Condicionador de solo', 'tonelada', 180.00);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_weather_city ON weather_data(city, state);
CREATE INDEX IF NOT EXISTS idx_forecast_date ON weather_forecast(forecast_date);
CREATE INDEX IF NOT EXISTS idx_supplies_category ON supplies(category);
CREATE INDEX IF NOT EXISTS idx_supplies_name ON supplies(name);

