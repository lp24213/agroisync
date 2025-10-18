-- Sistema de Rastreamento em Tempo Real

-- Tabela de localizações GPS do frete
CREATE TABLE IF NOT EXISTS freight_tracking_locations (
  id TEXT PRIMARY KEY,
  freight_order_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  timestamp INTEGER NOT NULL,
  speed REAL,
  heading REAL,
  accuracy REAL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (freight_order_id) REFERENCES freight_orders(id)
);

-- Tabela de atualizações de status do frete
CREATE TABLE IF NOT EXISTS freight_tracking_updates (
  id TEXT PRIMARY KEY,
  freight_order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  location_id TEXT,
  timestamp INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (freight_order_id) REFERENCES freight_orders(id),
  FOREIGN KEY (location_id) REFERENCES freight_tracking_locations(id)
);

-- Tabela de notificações de rastreamento enviadas
CREATE TABLE IF NOT EXISTS freight_tracking_notifications (
  id TEXT PRIMARY KEY,
  freight_order_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at INTEGER,
  error_message TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (freight_order_id) REFERENCES freight_orders(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tracking_locations_order ON freight_tracking_locations(freight_order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_locations_timestamp ON freight_tracking_locations(timestamp);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_order ON freight_tracking_updates(freight_order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_timestamp ON freight_tracking_updates(timestamp);
CREATE INDEX IF NOT EXISTS idx_tracking_notifications_order ON freight_tracking_notifications(freight_order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_notifications_status ON freight_tracking_notifications(status);

