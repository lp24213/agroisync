// Helpers mínimos para workers (jsonResponse, getDb)
export const jsonResponse = (data, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers)
  });
};

export class Database {
  constructor(db) {
    this.db = db;
  }

  async prepare(query) {
    return this.db.prepare(query);
  }
}

export function getDb(env) {
  // fallback para binding alternativo
  const db = env.DB || env.AGROISYNC_DB || env.AGROISYNC_D1 || null;
  if (!db) throw new Error('D1 binding not found in env');
  return new Database(db);
}
