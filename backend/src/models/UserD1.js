// Modelo User para Cloudflare D1
class User {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.bio = data.bio;
    
    // Localização
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.country = data.country || 'Brasil';
    this.zipCode = data.zip_code;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    
    // Negócio
    this.businessType = data.business_type || 'all';
    this.businessName = data.business_name;
    this.businessDocument = data.business_document;
    this.businessLicense = data.business_license;
    
    // Documentos
    this.cpf = data.cpf;
    this.cnpj = data.cnpj;
    this.rg = data.rg;
    this.passport = data.passport;
    
    // Financeiro
    this.bankAccount = data.bank_account;
    this.creditCard = data.credit_card;
    this.taxId = data.tax_id;
    this.businessId = data.business_id;
    
    // Verificações
    this.isEmailVerified = Boolean(data.is_email_verified);
    this.emailVerificationToken = data.email_verification_token;
    this.emailVerificationExpires = data.email_verification_expires;
    
    this.isPhoneVerified = Boolean(data.is_phone_verified);
    this.phoneVerificationCode = data.phone_verification_code;
    this.phoneVerificationExpires = data.phone_verification_expires;
    
    // 2FA
    this.twoFactorEnabled = Boolean(data.two_factor_enabled);
    this.twoFactorSecret = data.two_factor_secret;
    this.twoFactorBackupCodes = data.two_factor_backup_codes;
    
    // Plano
    this.plan = data.plan || 'free';
    this.planActive = Boolean(data.plan_active);
    this.planExpiresAt = data.plan_expires_at;
    this.stripeCustomerId = data.stripe_customer_id;
    this.stripeSubscriptionId = data.stripe_subscription_id;
    
    // Permissões
    this.role = data.role || 'user';
    this.isActive = Boolean(data.is_active);
    this.isBlocked = Boolean(data.is_blocked);
    this.blockedReason = data.blocked_reason;
    this.blockedAt = data.blocked_at;
    
    // Preferências
    this.language = data.language || 'pt';
    this.timezone = data.timezone || 'America/Sao_Paulo';
    this.emailNotifications = Boolean(data.email_notifications);
    this.pushNotifications = Boolean(data.push_notifications);
    this.smsNotifications = Boolean(data.sms_notifications);
    this.marketingNotifications = Boolean(data.marketing_notifications);
    this.profileVisibility = data.profile_visibility || 'public';
    this.showLocation = Boolean(data.show_location);
    this.showBusinessInfo = Boolean(data.show_business_info);
    
    // Estatísticas
    this.totalProducts = data.total_products || 0;
    this.totalSales = data.total_sales || 0;
    this.totalPurchases = data.total_purchases || 0;
    this.totalFreights = data.total_freights || 0;
    this.rating = data.rating || 0;
    this.reviewsCount = data.reviews_count || 0;
    
    // Carteira
    this.walletAddress = data.wallet_address;
    this.walletBalance = data.wallet_balance || 0;
    
    // Atividade
    this.lastLoginAt = data.last_login_at;
    this.lastActivityAt = data.last_activity_at;
    
    // Reset
    this.passwordResetToken = data.password_reset_token;
    this.passwordResetExpires = data.password_reset_expires;
    
    // LGPD
    this.lgpdConsent = Boolean(data.lgpd_consent);
    this.lgpdConsentDate = data.lgpd_consent_date;
    this.dataProcessingConsent = Boolean(data.data_processing_consent);
    this.marketingConsent = Boolean(data.marketing_consent);
    
    // Timestamps
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Getters virtuais
  get isAdmin() {
    return this.role === 'admin' || this.role === 'super-admin';
  }

  get isPaid() {
    return this.plan !== 'free' && this.planActive;
  }

  get isVerified() {
    return this.isEmailVerified && this.isPhoneVerified;
  }

  // Métodos de instância
  async comparePassword(candidatePassword) {
    const bcrypt = await import('bcryptjs');
    return await bcrypt.compare(candidatePassword, this.password);
  }

  generateAuthToken() {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
        isAdmin: this.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  generateRefreshToken() {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
  }

  generateEmailVerificationToken() {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    this.emailVerificationToken = token;
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    return token;
  }

  generatePasswordResetToken() {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    this.passwordResetToken = token;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
    return token;
  }

  generatePhoneVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.phoneVerificationCode = code;
    this.phoneVerificationExpires = Date.now() + 5 * 60 * 1000; // 5 minutos
    return code;
  }

  toJSON() {
    const user = { ...this };
    delete user.password;
    delete user.twoFactorSecret;
    delete user.twoFactorBackupCodes;
    delete user.emailVerificationToken;
    delete user.passwordResetToken;
    delete user.phoneVerificationCode;
    return user;
  }

  // Métodos estáticos para D1
  static async findByEmail(db, email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const result = await stmt.bind(email.toLowerCase()).first();
    return result ? new User(result) : null;
  }

  static async findById(db, id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const result = await stmt.bind(id).first();
    return result ? new User(result) : null;
  }

  static async create(db, userData) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const stmt = db.prepare(`
      INSERT INTO users (
        name, email, password, phone, avatar, bio,
        address, city, state, country, zip_code, latitude, longitude,
        business_type, business_name, business_document, business_license,
        cpf, cnpj, rg, passport,
        bank_account, credit_card, tax_id, business_id,
        is_email_verified, email_verification_token, email_verification_expires,
        is_phone_verified, phone_verification_code, phone_verification_expires,
        two_factor_enabled, two_factor_secret, two_factor_backup_codes,
        plan, plan_active, plan_expires_at, stripe_customer_id, stripe_subscription_id,
        role, is_active, is_blocked, blocked_reason, blocked_at,
        language, timezone, email_notifications, push_notifications, sms_notifications, marketing_notifications,
        profile_visibility, show_location, show_business_info,
        total_products, total_sales, total_purchases, total_freights, rating, reviews_count,
        wallet_address, wallet_balance,
        last_login_at, last_activity_at,
        password_reset_token, password_reset_expires,
        lgpd_consent, lgpd_consent_date, data_processing_consent, marketing_consent,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
    `);
    
    const now = Math.floor(Date.now() / 1000);
    
    const result = await stmt.bind(
      userData.name,
      userData.email.toLowerCase(),
      hashedPassword,
      userData.phone || null,
      userData.avatar || null,
      userData.bio || null,
      
      userData.address || null,
      userData.city || null,
      userData.state || null,
      userData.country || 'Brasil',
      userData.zipCode || null,
      userData.latitude || null,
      userData.longitude || null,
      
      userData.businessType || 'all',
      userData.businessName || null,
      userData.businessDocument || null,
      userData.businessLicense || null,
      
      userData.cpf || null,
      userData.cnpj || null,
      userData.rg || null,
      userData.passport || null,
      
      userData.bankAccount || null,
      userData.creditCard || null,
      userData.taxId || null,
      userData.businessId || null,
      
      userData.isEmailVerified ? 1 : 0,
      userData.emailVerificationToken || null,
      userData.emailVerificationExpires || null,
      
      userData.isPhoneVerified ? 1 : 0,
      userData.phoneVerificationCode || null,
      userData.phoneVerificationExpires || null,
      
      userData.twoFactorEnabled ? 1 : 0,
      userData.twoFactorSecret || null,
      userData.twoFactorBackupCodes || null,
      
      userData.plan || 'free',
      userData.planActive ? 1 : 0,
      userData.planExpiresAt || null,
      userData.stripeCustomerId || null,
      userData.stripeSubscriptionId || null,
      
      userData.role || 'user',
      userData.isActive ? 1 : 0,
      userData.isBlocked ? 1 : 0,
      userData.blockedReason || null,
      userData.blockedAt || null,
      
      userData.language || 'pt',
      userData.timezone || 'America/Sao_Paulo',
      userData.emailNotifications ? 1 : 0,
      userData.pushNotifications ? 1 : 0,
      userData.smsNotifications ? 1 : 0,
      userData.marketingNotifications ? 1 : 0,
      
      userData.profileVisibility || 'public',
      userData.showLocation ? 1 : 0,
      userData.showBusinessInfo ? 1 : 0,
      
      userData.totalProducts || 0,
      userData.totalSales || 0,
      userData.totalPurchases || 0,
      userData.totalFreights || 0,
      userData.rating || 0,
      userData.reviewsCount || 0,
      
      userData.walletAddress || null,
      userData.walletBalance || 0,
      
      userData.lastLoginAt || null,
      userData.lastActivityAt || now,
      
      userData.passwordResetToken || null,
      userData.passwordResetExpires || null,
      
      userData.lgpdConsent ? 1 : 0,
      userData.lgpdConsentDate || null,
      userData.dataProcessingConsent ? 1 : 0,
      userData.marketingConsent ? 1 : 0,
      
      now,
      now
    ).run();
    
    return result.meta.last_row_id;
  }

  static async update(db, id, updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (fields.length === 0) return;
    
    fields.push('updated_at = ?');
    values.push(Math.floor(Date.now() / 1000));
    values.push(id);
    
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    await stmt.bind(...values).run();
  }

  static async findAll(db, options = {}) {
    let query = 'SELECT * FROM users';
    const conditions = [];
    const params = [];
    
    if (options.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(options.isActive ? 1 : 0);
    }
    
    if (options.businessType) {
      conditions.push('business_type = ?');
      params.push(options.businessType);
    }
    
    if (options.role) {
      conditions.push('role = ?');
      params.push(options.role);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }
    
    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
    
    const stmt = db.prepare(query);
    const results = await stmt.bind(...params).all();
    
    return results.results.map(row => new User(row));
  }

  static async count(db, options = {}) {
    let query = 'SELECT COUNT(*) as count FROM users';
    const conditions = [];
    const params = [];
    
    if (options.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(options.isActive ? 1 : 0);
    }
    
    if (options.businessType) {
      conditions.push('business_type = ?');
      params.push(options.businessType);
    }
    
    if (options.role) {
      conditions.push('role = ?');
      params.push(options.role);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).first();
    
    return result.count;
  }
}

export default User;
