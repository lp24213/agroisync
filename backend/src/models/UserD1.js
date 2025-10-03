import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const toEpochSeconds = value => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? null : Math.floor(numeric);
  }

  return null;
};

const booleanToInt = value => {
  if (value === null || value === undefined) {
    return null;
  }
  return value ? 1 : 0;
};

const jsonOrNull = value => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

class User {
  constructor(row = {}, extras = {}) {
    this.id = row.id;
    this.email = row.email;
    this.password = row.password;
    this.name = row.name;
    this.phone = row.phone;
    this.avatar = row.avatar;
    this.bio = row.bio;

    this.address = row.address;
    this.city = row.city;
    this.state = row.state;
    this.country = row.country || 'Brasil';
    this.zipCode = row.zip_code;
    this.coordinates = row.json_coordinates ? JSON.parse(row.json_coordinates) : null;

    this.businessType = row.business_type || 'all';
    this.businessName = row.business_name;
    this.businessDocument = row.business_document;
    this.businessLicense = row.business_license;

    this.cpf = row.cpf;
    this.cnpj = row.cnpj;
    this.rg = row.rg;
    this.passport = row.passport;
    this.bankAccount = row.bank_account;
    this.creditCard = row.credit_card;
    this.taxId = row.tax_id;
    this.businessId = row.business_id;
    this.encryptionMetadata = row.json_encryption_metadata
      ? JSON.parse(row.json_encryption_metadata)
      : null;

    this.isEmailVerified = Boolean(row.is_email_verified);
    this.emailVerificationToken = row.email_verification_token;
    this.emailVerificationExpires = row.email_verification_expires;
    this.verificationCode = row.verification_code;
    this.codeExpires = row.code_expires;

    this.isPhoneVerified = Boolean(row.is_phone_verified);
    this.phoneVerificationCode = row.phone_verification_code;
    this.phoneVerificationExpires = row.phone_verification_expires;

    this.twoFactorEnabled = Boolean(row.two_factor_enabled);
    this.twoFactorSecret = row.two_factor_secret;
    this.twoFactorBackupCodes = extras.twoFactorBackupCodes || [];

    this.role = row.role || 'user';
    this.isAdmin = Boolean(row.is_admin);
    this.adminRole = row.admin_role;
    this.adminNotes = row.admin_notes;
    this.adminPermissions = extras.adminPermissions || [];

    this.plan = row.plan || 'free';
    this.planExpiresAt = row.plan_expires_at;
    this.subscriptionId = row.subscription_id;
    this.paymentMethod = row.payment_method;
    this.planActive = Boolean(row.plan_active);
    this.stripeCustomerId = row.stripe_customer_id;
    this.stripeSubscriptionId = row.stripe_subscription_id;

    this.privacySettings = row.json_privacy_settings ? JSON.parse(row.json_privacy_settings) : null;
    this.notificationSettings = row.json_notification_settings
      ? JSON.parse(row.json_notification_settings)
      : null;

    this.isActive = Boolean(row.is_active);
    this.isSuspended = Boolean(row.is_suspended);
    this.suspensionReason = row.suspension_reason;
    this.suspensionExpiresAt = row.suspension_expires_at;
    this.isBlocked = Boolean(row.is_blocked);
    this.blockedReason = row.blocked_reason;
    this.blockedAt = row.blocked_at;

    this.lgpdConsent = Boolean(row.lgpd_consent);
    this.lgpdConsentDate = row.lgpd_consent_date;
    this.dataProcessingConsent = Boolean(row.data_processing_consent);
    this.marketingConsent = Boolean(row.marketing_consent);

    this.lastLoginAt = row.last_login_at;
    this.lastLoginIp = row.last_login_ip;
    this.lastActivityAt = row.last_activity_at;
    this.loginAttempts = row.login_attempts || 0;
    this.lockUntil = row.lock_until;
    this.passwordChangedAt = row.password_changed_at;
    this.passwordResetToken = row.password_reset_token;
    this.passwordResetExpires = row.password_reset_expires;

    this.stats = row.json_stats ? JSON.parse(row.json_stats) : null;
    this.language = row.language || 'pt-BR';
    this.timezone = row.timezone || 'America/Sao_Paulo';
    this.metadata = row.json_metadata ? JSON.parse(row.json_metadata) : {};

    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  get isPaid() {
    return this.plan !== 'free' && this.planActive;
  }

  get isVerified() {
    return this.isEmailVerified && this.isPhoneVerified;
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  generateAuthToken() {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
        isAdmin: this.isAdmin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
        issuer: 'agroisync',
        audience: 'agroisync-users'
      }
    );
  }

  generateRefreshToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
      issuer: 'agroisync'
    });
  }

  toJSON() {
    const clone = { ...this };
    delete clone.password;
    delete clone.twoFactorSecret;
    delete clone.passwordResetToken;
    delete clone.phoneVerificationCode;
    delete clone.emailVerificationToken;
    return clone;
  }

  static async findByEmail(db, email) {
    const row = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();
    return this._hydrate(db, row);
  }

  static async findById(db, id) {
    const row = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return this._hydrate(db, row);
  }

  static async findAll(db, filters = {}) {
    let query = 'SELECT * FROM users';
    const conditions = [];
    const params = [];

    if (filters.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.businessType) {
      conditions.push('business_type = ?');
      params.push(filters.businessType);
    }

    if (filters.role) {
      conditions.push('role = ?');
      params.push(filters.role);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const result = await db
      .prepare(query)
      .bind(...params)
      .all();
    if (!result.results?.length) {
      return [];
    }

    const hydrated = await Promise.all(result.results.map(row => this._hydrate(db, row)));
    return hydrated.filter(Boolean);
  }

  static async count(db, filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM users';
    const conditions = [];
    const params = [];

    if (filters.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.businessType) {
      conditions.push('business_type = ?');
      params.push(filters.businessType);
    }

    if (filters.role) {
      conditions.push('role = ?');
      params.push(filters.role);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const row = await db
      .prepare(query)
      .bind(...params)
      .first();
    return row ? row.total : 0;
  }

  static async create(db, payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const timestamps = Math.floor(Date.now() / 1000);

    const columns = this._convertToColumns({
      ...payload,
      email: payload.email?.toLowerCase(),
      password: hashedPassword,
      createdAt: timestamps,
      updatedAt: timestamps
    });

    const columnNames = Object.keys(columns);
    const placeholders = columnNames.map(() => '?').join(', ');
    const values = Object.values(columns);

    await db
      .prepare(`INSERT INTO users (${columnNames.join(', ')}) VALUES (${placeholders})`)
      .bind(...values)
      .run();

    const user = await this.findByEmail(db, payload.email);

    if (payload.adminPermissions?.length) {
      await this.setAdminPermissions(db, user.id, payload.adminPermissions);
      user.adminPermissions = payload.adminPermissions;
    }

    if (payload.twoFactorBackupCodes?.length) {
      await this.setTwoFactorBackupCodes(db, user.id, payload.twoFactorBackupCodes);
      user.twoFactorBackupCodes = payload.twoFactorBackupCodes;
    }

    return user;
  }

  static async update(db, id, payload = {}) {
    const { adminPermissions, twoFactorBackupCodes, password, ...rest } = payload;
    const updateData = { ...rest };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
      updateData.passwordChangedAt = Math.floor(Date.now() / 1000);
    }

    const columns = this._convertToColumns({
      ...updateData,
      updatedAt: Math.floor(Date.now() / 1000)
    });

    if (Object.keys(columns).length) {
      const assignments = Object.keys(columns)
        .map(column => `${column} = ?`)
        .join(', ');
      const values = Object.values(columns);
      values.push(id);

      await db
        .prepare(`UPDATE users SET ${assignments} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    if (adminPermissions) {
      await this.setAdminPermissions(db, id, adminPermissions);
    }

    if (twoFactorBackupCodes) {
      await this.setTwoFactorBackupCodes(db, id, twoFactorBackupCodes);
    }

    return this.findById(db, id);
  }

  static async setAdminPermissions(db, userId, permissions = []) {
    await db.prepare('DELETE FROM user_admin_permissions WHERE user_id = ?').bind(userId).run();

    if (!permissions.length) {
      return;
    }

    for (const permission of permissions) {
      await db
        .prepare('INSERT INTO user_admin_permissions (user_id, permission) VALUES (?, ?)')
        .bind(userId, permission)
        .run();
    }
  }

  static async setTwoFactorBackupCodes(db, userId, codes = []) {
    await db
      .prepare('DELETE FROM user_twofactor_backup_codes WHERE user_id = ?')
      .bind(userId)
      .run();

    if (!codes.length) {
      return;
    }

    for (const codeHash of codes) {
      await db
        .prepare(
          'INSERT INTO user_twofactor_backup_codes (user_id, code_hash, created_at) VALUES (?, ?, ?)'
        )
        .bind(userId, codeHash, Math.floor(Date.now() / 1000))
        .run();
    }
  }

  static async _hydrate(db, row) {
    if (!row) {
      return null;
    }

    const [adminPermissions, twoFactorBackupCodes] = await Promise.all([
      this._fetchAdminPermissions(db, row.id),
      this._fetchTwoFactorBackupCodes(db, row.id)
    ]);

    return new User(row, { adminPermissions, twoFactorBackupCodes });
  }

  static async _fetchAdminPermissions(db, userId) {
    const result = await db
      .prepare('SELECT permission FROM user_admin_permissions WHERE user_id = ?')
      .bind(userId)
      .all();

    if (!result.results?.length) {
      return [];
    }

    return result.results.map(row => row.permission);
  }

  static async _fetchTwoFactorBackupCodes(db, userId) {
    const result = await db
      .prepare(
        'SELECT code_hash, used_at, created_at FROM user_twofactor_backup_codes WHERE user_id = ?'
      )
      .bind(userId)
      .all();

    if (!result.results?.length) {
      return [];
    }

    return result.results.map(row => ({
      codeHash: row.code_hash,
      usedAt: row.used_at,
      createdAt: row.created_at
    }));
  }

  static _convertToColumns(payload = {}) {
    const map = new Map();

    const assign = (column, value, transform = val => val) => {
      if (value === undefined) {
        return;
      }
      const transformed = transform(value);
      if (transformed !== undefined) {
        map.set(column, transformed);
      }
    };

    assign('email', payload.email);
    assign('password', payload.password);
    assign('name', payload.name);
    assign('phone', payload.phone);
    assign('avatar', payload.avatar);
    assign('bio', payload.bio);

    assign('address', payload.address);
    assign('city', payload.city);
    assign('state', payload.state);
    assign('country', payload.country);
    assign('zip_code', payload.zipCode);

    if (payload.coordinates) {
      assign('json_coordinates', payload.coordinates, jsonOrNull);
    } else if (payload.latitude !== undefined || payload.longitude !== undefined) {
      const coords = {
        lat: payload.latitude ?? null,
        lng: payload.longitude ?? null
      };
      assign('json_coordinates', coords, jsonOrNull);
    }

    assign('business_type', payload.businessType);
    assign('business_name', payload.businessName);
    assign('business_document', payload.businessDocument);
    assign('business_license', payload.businessLicense);

    assign('cpf', payload.cpf);
    assign('cnpj', payload.cnpj);
    assign('rg', payload.rg);
    assign('passport', payload.passport);
    assign('bank_account', payload.bankAccount);
    assign('credit_card', payload.creditCard);
    assign('tax_id', payload.taxId);
    assign('business_id', payload.businessId);
    assign('json_encryption_metadata', payload.encryptionMetadata, jsonOrNull);

    assign('is_email_verified', payload.isEmailVerified, booleanToInt);
    assign('email_verification_token', payload.emailVerificationToken);
    assign('email_verification_expires', payload.emailVerificationExpires, toEpochSeconds);
    assign('verification_code', payload.verificationCode);
    assign('code_expires', payload.codeExpires, toEpochSeconds);

    assign('is_phone_verified', payload.isPhoneVerified, booleanToInt);
    assign('phone_verification_code', payload.phoneVerificationCode);
    assign('phone_verification_expires', payload.phoneVerificationExpires, toEpochSeconds);

    assign('two_factor_enabled', payload.twoFactorEnabled, booleanToInt);
    assign('two_factor_secret', payload.twoFactorSecret);

    assign('role', payload.role);
    assign('is_admin', payload.isAdmin, booleanToInt);
    assign('admin_role', payload.adminRole);
    assign('admin_notes', payload.adminNotes);

    assign('plan', payload.plan);
    assign('plan_expires_at', payload.planExpiresAt, toEpochSeconds);
    assign('subscription_id', payload.subscriptionId);
    assign('payment_method', payload.paymentMethod);
    assign('plan_active', payload.planActive, booleanToInt);
    assign('stripe_customer_id', payload.stripeCustomerId);
    assign('stripe_subscription_id', payload.stripeSubscriptionId);

    assign('json_privacy_settings', payload.privacySettings, jsonOrNull);
    assign('json_notification_settings', payload.notificationSettings, jsonOrNull);

    assign('is_active', payload.isActive, booleanToInt);
    assign('is_suspended', payload.isSuspended, booleanToInt);
    assign('suspension_reason', payload.suspensionReason);
    assign('suspension_expires_at', payload.suspensionExpiresAt, toEpochSeconds);
    assign('is_blocked', payload.isBlocked, booleanToInt);
    assign('blocked_reason', payload.blockedReason);
    assign('blocked_at', payload.blockedAt, toEpochSeconds);

    assign('lgpd_consent', payload.lgpdConsent, booleanToInt);
    assign('lgpd_consent_date', payload.lgpdConsentDate, toEpochSeconds);
    assign('data_processing_consent', payload.dataProcessingConsent, booleanToInt);
    assign('marketing_consent', payload.marketingConsent, booleanToInt);

    assign('last_login_at', payload.lastLoginAt, toEpochSeconds);
    assign('last_login_ip', payload.lastLoginIp);
    assign('last_activity_at', payload.lastActivityAt, toEpochSeconds);
    assign('login_attempts', payload.loginAttempts);
    assign('lock_until', payload.lockUntil, toEpochSeconds);
    assign('password_changed_at', payload.passwordChangedAt, toEpochSeconds);
    assign('password_reset_token', payload.passwordResetToken);
    assign('password_reset_expires', payload.passwordResetExpires, toEpochSeconds);

    assign('json_stats', payload.stats, jsonOrNull);
    assign('language', payload.language);
    assign('timezone', payload.timezone);
    assign('json_metadata', payload.metadata, jsonOrNull);

    assign('created_at', payload.createdAt, toEpochSeconds);
    assign('updated_at', payload.updatedAt, toEpochSeconds);

    return Object.fromEntries(map.entries());
  }
}

export default User;
