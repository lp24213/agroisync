import crypto from 'crypto';

class PasswordReset {
  constructor(row = {}) {
    this.id = row.id;
    this.userId = row.user_id;
    this.token = row.token;
    this.expiresAt = row.expires_at;
    this.attempts = row.attempts || 0;
    this.maxAttempts = row.max_attempts || 3;
    this.ipAddress = row.ip_address;
    this.userAgent = row.user_agent;
    this.status = row.status || 'pending'; // pending, used, expired, revoked
    this.usedAt = row.used_at;
    this.createdAt = row.created_at;
  }

  static async createToken(db, userId, options = {}) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Math.floor((Date.now() + 60 * 60 * 1000) / 1000); // 1 hora
    const now = Math.floor(Date.now() / 1000);

    // Limpar tokens antigos do usuÃ¡rio
    await db
      .prepare('UPDATE password_resets SET status = ? WHERE user_id = ? AND status = ?')
      .bind('revoked', userId, 'pending')
      .run();

    // Criar novo token
    await db
      .prepare(
        `
      INSERT INTO password_resets (
        user_id, token, expires_at, attempts, max_attempts, 
        ip_address, user_agent, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .bind(
        userId,
        token,
        expiresAt,
        0,
        3,
        options.ip || null,
        options.userAgent || null,
        'pending',
        now
      )
      .run();

    const resetRecord = new PasswordReset({
      user_id: userId,
      token,
      expires_at: expiresAt,
      attempts: 0,
      max_attempts: 3,
      ip_address: options.ip || null,
      user_agent: options.userAgent || null,
      status: 'pending',
      created_at: now
    });

    return { token, resetRecord };
  }

  static async validateToken(db, token) {
    const row = await db
      .prepare(
        `
      SELECT * FROM password_resets 
      WHERE token = ? AND status = 'pending' AND expires_at > ?
    `
      )
      .bind(token, Math.floor(Date.now() / 1000))
      .first();

    if (!row) {
      return null;
    }

    return new PasswordReset(row);
  }

  static async incrementAttempt(db, token) {
    const row = await db
      .prepare(
        `
      SELECT * FROM password_resets WHERE token = ?
    `
      )
      .bind(token)
      .first();

    if (!row) {
      return false;
    }

    const newAttempts = (row.attempts || 0) + 1;
    const status = newAttempts >= (row.max_attempts || 3) ? 'expired' : 'pending';

    await db
      .prepare(
        `
      UPDATE password_resets 
      SET attempts = ?, status = ? 
      WHERE token = ?
    `
      )
      .bind(newAttempts, status, token)
      .run();

    return true;
  }

  static async markAsUsed(db, token, options = {}) {
    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `
      UPDATE password_resets 
      SET status = ?, used_at = ?, ip_address = ?, user_agent = ?
      WHERE token = ?
    `
      )
      .bind('used', now, options.ip || null, options.userAgent || null, token)
      .run();

    return true;
  }

  static async updateMany(db, conditions = {}, updateData = {}) {
    // ImplementaÃ§Ã£o bÃ¡sica para compatibilidade
    // Em um cenÃ¡rio real, vocÃª implementaria lÃ³gica mais sofisticada
    const { userId, status } = conditions;
    const { status: newStatus } = updateData;

    if (userId && status && newStatus) {
      await db
        .prepare(
          `
        UPDATE password_resets 
        SET status = ? 
        WHERE user_id = ? AND status = ?
      `
        )
        .bind(newStatus, userId, status)
        .run();
    }

    return true;
  }

  static async findByToken(db, token) {
    const row = await db
      .prepare(
        `
      SELECT * FROM password_resets WHERE token = ?
    `
      )
      .bind(token)
      .first();

    return row ? new PasswordReset(row) : null;
  }

  static async findByUserId(db, userId) {
    const result = await db
      .prepare(
        `
      SELECT * FROM password_resets 
      WHERE user_id = ? AND status = 'pending' 
      ORDER BY created_at DESC
    `
      )
      .bind(userId)
      .all();

    return result.results.map(row => new PasswordReset(row));
  }

  static async cleanupExpired(db) {
    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `
      UPDATE password_resets 
      SET status = 'expired' 
      WHERE expires_at < ? AND status = 'pending'
    `
      )
      .bind(now)
      .run();

    return true;
  }

  isExpired() {
    return this.expiresAt < Math.floor(Date.now() / 1000);
  }

  isMaxAttemptsReached() {
    return this.attempts >= this.maxAttempts;
  }

  isValid() {
    return this.status === 'pending' && !this.isExpired() && !this.isMaxAttemptsReached();
  }
}

export default PasswordReset;
