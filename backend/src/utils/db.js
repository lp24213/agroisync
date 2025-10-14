// @ts-check

/**
 * Wrapper para consultas no D1
 * @param {D1Database} db - Instância do banco D1
 */
export class Database {
  constructor(db) {
    this.db = db;
  }

  /**
   * Executa uma consulta única
   * @param {string} query - Query SQL
   * @param {any[]} params - Parâmetros
   * @returns {Promise<any>} Resultado
   */
  async query(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      return await stmt.bind(...params).run();
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Busca um único registro
   * @param {string} query - Query SQL
   * @param {any[]} params - Parâmetros
   * @returns {Promise<any>} Registro encontrado ou null
   */
  async findOne(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      return await stmt.bind(...params).first();
    } catch (error) {
      console.error('Database findOne error:', error);
      throw error;
    }
  }

  /**
   * Busca múltiplos registros
   * @param {string} query - Query SQL
   * @param {any[]} params - Parâmetros
   * @returns {Promise<any[]>} Lista de registros
   */
  async findMany(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      return await stmt.bind(...params).all();
    } catch (error) {
      console.error('Database findMany error:', error);
      throw error;
    }
  }

  /**
   * Insere um registro
   * @param {string} table - Nome da tabela
   * @param {object} data - Dados a inserir
   * @returns {Promise<any>} Resultado da inserção
   */
  async insert(table, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `
      INSERT INTO ${table} (${fields.join(', ')})
      VALUES (${placeholders})
    `;

    return this.query(query, values);
  }

  /**
   * Atualiza registros
   * @param {string} table - Nome da tabela
   * @param {object} data - Dados a atualizar
   * @param {string} where - Condição WHERE
   * @param {any[]} params - Parâmetros do WHERE
   * @returns {Promise<any>} Resultado da atualização
   */
  async update(table, data, where, params = []) {
    const sets = Object.entries(data)
      .map(([field]) => `${field} = ?`)
      .join(', ');
    
    const values = [...Object.values(data), ...params];
    
    const query = `
      UPDATE ${table}
      SET ${sets}
      WHERE ${where}
    `;

    return this.query(query, values);
  }

  /**
   * Deleta registros
   * @param {string} table - Nome da tabela
   * @param {string} where - Condição WHERE
   * @param {any[]} params - Parâmetros do WHERE
   * @returns {Promise<any>} Resultado da deleção
   */
  async delete(table, where, params = []) {
    const query = `
      DELETE FROM ${table}
      WHERE ${where}
    `;

    return this.query(query, params);
  }
}

/**
 * Obtém instância configurada do banco
 * @param {object} env - Variáveis de ambiente do Worker
 * @returns {Database} Instância do banco
 */
export function getDb(env) {
  return new Database(env.DB);
}
