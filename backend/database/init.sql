-- Create database
CREATE DATABASE agrotm;

-- Connect to the database
\c agrotm;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    wallet_address VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create staking_pools table
CREATE TABLE staking_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    token_symbol VARCHAR(10) NOT NULL,
    token_address VARCHAR(255) NOT NULL,
    apr DECIMAL(10,4) NOT NULL,
    total_staked DECIMAL(20,8) DEFAULT 0,
    min_stake DECIMAL(20,8) DEFAULT 0,
    max_stake DECIMAL(20,8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_stakes table
CREATE TABLE user_stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    pool_id UUID REFERENCES staking_pools(id),
    amount DECIMAL(20,8) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    token_symbol VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    tx_hash VARCHAR(255),
    block_number BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create liquidity_pools table
CREATE TABLE liquidity_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    token0_symbol VARCHAR(10) NOT NULL,
    token0_address VARCHAR(255) NOT NULL,
    token1_symbol VARCHAR(10) NOT NULL,
    token1_address VARCHAR(255) NOT NULL,
    total_liquidity DECIMAL(20,8) DEFAULT 0,
    volume_24h DECIMAL(20,8) DEFAULT 0,
    fee_rate DECIMAL(5,4) DEFAULT 0.003,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_stakes_user ON user_stakes(user_id);
CREATE INDEX idx_stakes_pool ON user_stakes(pool_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_hash ON transactions(tx_hash);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staking_pools_updated_at BEFORE UPDATE ON staking_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stakes_updated_at BEFORE UPDATE ON user_stakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liquidity_pools_updated_at BEFORE UPDATE ON liquidity_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO staking_pools (name, token_symbol, token_address, apr, min_stake) VALUES
('SOL Staking Pool', 'SOL', 'So11111111111111111111111111111111111111112', 12.5, 1.0),
('AGROTM Staking Pool', 'AGROTM', 'AgroTM111111111111111111111111111111111111111', 18.2, 100.0);

INSERT INTO liquidity_pools (name, token0_symbol, token0_address, token1_symbol, token1_address, fee_rate) VALUES
('SOL-USDC Pool', 'SOL', 'So11111111111111111111111111111111111111112', 'USDC', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 0.003),
('AGROTM-SOL Pool', 'AGROTM', 'AgroTM111111111111111111111111111111111111111', 'SOL', 'So11111111111111111111111111111111111111112', 0.003); 