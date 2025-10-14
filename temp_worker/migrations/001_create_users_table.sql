-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    
    -- Informações de localização
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'Brasil',
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    
    -- Informações de negócio
    business_type TEXT DEFAULT 'all' CHECK (business_type IN ('producer', 'buyer', 'transporter', 'all')),
    business_name TEXT,
    business_document TEXT,
    business_license TEXT,
    
    -- Documentos pessoais
    cpf TEXT,
    cnpj TEXT,
    rg TEXT,
    passport TEXT,
    
    -- Informações financeiras
    bank_account TEXT,
    credit_card TEXT,
    tax_id TEXT,
    business_id TEXT,
    
    -- Configurações de conta
    is_email_verified BOOLEAN DEFAULT 0,
    email_verification_token TEXT,
    email_verification_expires INTEGER,
    
    is_phone_verified BOOLEAN DEFAULT 0,
    phone_verification_code TEXT,
    phone_verification_expires INTEGER,
    
    -- 2FA
    two_factor_enabled BOOLEAN DEFAULT 0,
    two_factor_secret TEXT,
    two_factor_backup_codes TEXT,
    
    -- Plano e pagamentos
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    plan_active BOOLEAN DEFAULT 1,
    plan_expires_at INTEGER,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Permissões
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super-admin')),
    is_active BOOLEAN DEFAULT 1,
    is_blocked BOOLEAN DEFAULT 0,
    blocked_reason TEXT,
    blocked_at INTEGER,
    
    -- Preferências
    language TEXT DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'es', 'zh')),
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    email_notifications BOOLEAN DEFAULT 1,
    push_notifications BOOLEAN DEFAULT 1,
    sms_notifications BOOLEAN DEFAULT 0,
    marketing_notifications BOOLEAN DEFAULT 0,
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'contacts')),
    show_location BOOLEAN DEFAULT 1,
    show_business_info BOOLEAN DEFAULT 1,
    
    -- Estatísticas
    total_products INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    total_freights INTEGER DEFAULT 0,
    rating REAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    
    -- Carteira cripto
    wallet_address TEXT,
    wallet_balance REAL DEFAULT 0,
    
    -- Última atividade
    last_login_at INTEGER,
    last_activity_at INTEGER DEFAULT (strftime('%s', 'now')),
    
    -- Tokens de reset
    password_reset_token TEXT,
    password_reset_expires INTEGER,
    
    -- LGPD
    lgpd_consent BOOLEAN DEFAULT 0,
    lgpd_consent_date INTEGER,
    data_processing_consent BOOLEAN DEFAULT 0,
    marketing_consent BOOLEAN DEFAULT 0,
    
    -- Timestamps
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_business_document ON users(business_document);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_activity_at ON users(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_business_type ON users(business_type);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(latitude, longitude);
