-- Sistema de Chatbot IA com OpenAI

-- Histórico de conversas do chatbot
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_content TEXT NOT NULL,
  intent TEXT,
  is_public INTEGER DEFAULT 1,
  tokens_used INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Limites de uso do chatbot
CREATE TABLE IF NOT EXISTS ai_chat_limits (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  session_id TEXT NOT NULL,
  messages_today INTEGER DEFAULT 0,
  tokens_today INTEGER DEFAULT 0,
  last_reset INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON ai_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_limits_user ON ai_chat_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_limits_session ON ai_chat_limits(session_id);

