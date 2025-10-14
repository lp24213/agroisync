export function withDb(handler) {
  return async (request, env, ctx) => {
    if (!env.DB) {
      return Response.json({
        error: 'Database not configured'
      }, { status: 500 });
    }

    try {
      // Começar transação
      await env.DB.prepare('BEGIN TRANSACTION').run();

      // Executar handler
      const response = await handler(request, env, env.DB);

      // Commit se tudo ok
      await env.DB.prepare('COMMIT').run();

      return response;
    } catch (error) {
      // Rollback em caso de erro
      await env.DB.prepare('ROLLBACK').run();
      throw error;
    }
  };
}

export async function initializeDb(db) {
  // Tabela de usuários
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      status TEXT DEFAULT 'active'
    )
  `).run();

  // Tabela de códigos de recuperação
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS recovery_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Tabela de tokens de refresh
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Índices
  await db.batch([
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_recovery_codes_user ON recovery_codes(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_recovery_codes_code ON recovery_codes(code)`,
    `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)`
  ]);
}