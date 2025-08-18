#!/usr/bin/env ts-node

import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import { Redis } from 'ioredis';
// Removed unused imports
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  postgres: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  mongodb: {
    url: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

interface SeedData {
  users: any[];
  pools: any[];
  farms: any[];
  nfts: any[];
  proposals: any[];
  markets: any[];
}

class DatabaseSeeder {
  private config: DatabaseConfig;
  private postgres: Pool;
  private mongodb: MongoClient;
  private redis: Redis;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.postgres = new Pool(config.postgres);
    this.mongodb = new MongoClient(config.mongodb.url);
    this.redis = new Redis(config.redis);
  }

  async connect(): Promise<void> {
    try {
      console.log('🔌 Connecting to databases...');
      
      // Test PostgreSQL connection
      await this.postgres.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected');
      
      // Test MongoDB connection
      await this.mongodb.connect();
      console.log('✅ MongoDB connected');
      
      // Test Redis connection
      await this.redis.ping();
      console.log('✅ Redis connected');
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.postgres.end();
    await this.mongodb.close();
    await this.redis.disconnect();
    console.log('🔌 Database connections closed');
  }

  private generateSeedData(): SeedData {
    return {
      users: [
        {
          id: 'user_1',
          email: 'admin@agrotm.com',
          wallet_address: '0x1234567890123456789012345678901234567890',
          name: 'Admin User',
          role: 'admin',
          kyc_status: 'verified',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'user_2',
          email: 'farmer@agrotm.com',
          wallet_address: '0x2345678901234567890123456789012345678901',
          name: 'John Farmer',
          role: 'farmer',
          kyc_status: 'verified',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'user_3',
          email: 'investor@agrotm.com',
          wallet_address: '0x3456789012345678901234567890123456789012',
          name: 'Jane Investor',
          role: 'investor',
          kyc_status: 'verified',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      pools: [
        {
          id: 'pool_1',
          name: 'AGRO-USDC',
          chain: 'solana',
          token_a: 'AGRO',
          token_b: 'USDC',
          token_a_address: '0x1234567890123456789012345678901234567890',
          token_b_address: '0x2345678901234567890123456789012345678901',
          tvl: 1000000,
          apr: 12.5,
          volume_24h: 500000,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'pool_2',
          name: 'AGRO-SOL',
          chain: 'solana',
          token_a: 'AGRO',
          token_b: 'SOL',
          token_a_address: '0x1234567890123456789012345678901234567890',
          token_b_address: '0x3456789012345678901234567890123456789012',
          tvl: 750000,
          apr: 15.2,
          volume_24h: 300000,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      farms: [
        {
          id: 'farm_1',
          name: 'AGRO-USDC Farm',
          pool_id: 'pool_1',
          chain: 'solana',
          rewards_token: 'AGRO',
          rewards_per_day: 10000,
          total_staked: 500000,
          apr: 25.5,
          start_date: new Date(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'farm_2',
          name: 'AGRO-SOL Farm',
          pool_id: 'pool_2',
          chain: 'solana',
          rewards_token: 'AGRO',
          rewards_per_day: 7500,
          total_staked: 300000,
          apr: 30.2,
          start_date: new Date(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      nfts: [
        {
          id: 'nft_1',
          token_id: '1',
          name: 'Farm Plot #1',
          description: 'Premium agricultural land in Brazil',
          image_url: 'https://api.agrotm.com/nfts/1/image',
          metadata_url: 'https://api.agrotm.com/nfts/1/metadata',
          chain: 'solana',
          contract_address: '0x1234567890123456789012345678901234567890',
          owner: '0x2345678901234567890123456789012345678901',
          creator: '0x1234567890123456789012345678901234567890',
          category: 'farm',
          attributes: {
            location: 'Brazil',
            size: '100 hectares',
            soil_type: 'fertile',
            crop_type: 'soybeans'
          },
          price: 1000,
          is_listed: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'nft_2',
          token_id: '2',
          name: 'Tractor Equipment #1',
          description: 'Modern farming equipment',
          image_url: 'https://api.agrotm.com/nfts/2/image',
          metadata_url: 'https://api.agrotm.com/nfts/2/metadata',
          chain: 'solana',
          contract_address: '0x1234567890123456789012345678901234567890',
          owner: '0x3456789012345678901234567890123456789012',
          creator: '0x1234567890123456789012345678901234567890',
          category: 'equipment',
          attributes: {
            type: 'tractor',
            brand: 'John Deere',
            model: '8R 410',
            year: 2023
          },
          price: 500,
          is_listed: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      proposals: [
        {
          id: 'proposal_1',
          title: 'Increase Staking Rewards',
          description: 'Proposal to increase staking APY by 2% to attract more users',
          proposer: '0x1234567890123456789012345678901234567890',
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'active',
          votes_for: 1000000,
          votes_against: 200000,
          votes_abstain: 50000,
          quorum: 500000,
          threshold: 0.6,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'proposal_2',
          title: 'Add New Farming Pool',
          description: 'Proposal to add AGRO-ETH farming pool',
          proposer: '0x2345678901234567890123456789012345678901',
          start_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
          end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days
          status: 'pending',
          votes_for: 0,
          votes_against: 0,
          votes_abstain: 0,
          quorum: 500000,
          threshold: 0.6,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      markets: [
        {
          id: 'market_1',
          asset: 'AGRO',
          chain: 'solana',
          total_supply: 1000000,
          total_borrow: 500000,
          supply_apy: 8.5,
          borrow_apy: 12.0,
          utilization_rate: 0.5,
          collateral_factor: 0.8,
          borrow_cap: 2000000,
          supply_cap: 5000000,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'market_2',
          asset: 'USDC',
          chain: 'solana',
          total_supply: 2000000,
          total_borrow: 800000,
          supply_apy: 5.2,
          borrow_apy: 8.5,
          utilization_rate: 0.4,
          collateral_factor: 0.9,
          borrow_cap: 3000000,
          supply_cap: 10000000,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };
  }

  async seedPostgreSQL(): Promise<void> {
    console.log('🌱 Seeding PostgreSQL...');
    
    const seedData = this.generateSeedData();
    
    try {
      // Create tables if they don't exist
      await this.createTables();
      
      // Seed users
      console.log('👥 Seeding users...');
      for (const user of seedData.users) {
        await this.postgres.query(
          `INSERT INTO users (id, email, wallet_address, name, role, kyc_status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [user.id, user.email, user.wallet_address, user.name, user.role, user.kyc_status, user.created_at, user.updated_at]
        );
      }
      
      // Seed pools
      console.log('🏊 Seeding pools...');
      for (const pool of seedData.pools) {
        await this.postgres.query(
          `INSERT INTO pools (id, name, chain, token_a, token_b, token_a_address, token_b_address, tvl, apr, volume_24h, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          [pool.id, pool.name, pool.chain, pool.token_a, pool.token_b, pool.token_a_address, pool.token_b_address, pool.tvl, pool.apr, pool.volume_24h, pool.created_at, pool.updated_at]
        );
      }
      
      // Seed farms
      console.log('🌾 Seeding farms...');
      for (const farm of seedData.farms) {
        await this.postgres.query(
          `INSERT INTO farms (id, name, pool_id, chain, rewards_token, rewards_per_day, total_staked, apr, start_date, end_date, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [farm.id, farm.name, farm.pool_id, farm.chain, farm.rewards_token, farm.rewards_per_day, farm.total_staked, farm.apr, farm.start_date, farm.end_date, farm.is_active, farm.created_at, farm.updated_at]
        );
      }
      
      // Seed NFTs
      console.log('🖼️ Seeding NFTs...');
      for (const nft of seedData.nfts) {
        await this.postgres.query(
          `INSERT INTO nfts (id, token_id, name, description, image_url, metadata_url, chain, contract_address, owner, creator, category, attributes, price, is_listed, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [nft.id, nft.token_id, nft.name, nft.description, nft.image_url, nft.metadata_url, nft.chain, nft.contract_address, nft.owner, nft.creator, nft.category, JSON.stringify(nft.attributes), nft.price, nft.is_listed, nft.created_at, nft.updated_at]
        );
      }
      
      // Seed proposals
      console.log('🗳️ Seeding proposals...');
      for (const proposal of seedData.proposals) {
        await this.postgres.query(
          `INSERT INTO proposals (id, title, description, proposer, start_date, end_date, status, votes_for, votes_against, votes_abstain, quorum, threshold, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [proposal.id, proposal.title, proposal.description, proposal.proposer, proposal.start_date, proposal.end_date, proposal.status, proposal.votes_for, proposal.votes_against, proposal.votes_abstain, proposal.quorum, proposal.threshold, proposal.created_at, proposal.updated_at]
        );
      }
      
      // Seed markets
      console.log('🏪 Seeding markets...');
      for (const market of seedData.markets) {
        await this.postgres.query(
          `INSERT INTO markets (id, asset, chain, total_supply, total_borrow, supply_apy, borrow_apy, utilization_rate, collateral_factor, borrow_cap, supply_cap, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [market.id, market.asset, market.chain, market.total_supply, market.total_borrow, market.supply_apy, market.borrow_apy, market.utilization_rate, market.collateral_factor, market.borrow_cap, market.supply_cap, market.is_active, market.created_at, market.updated_at]
        );
      }
      
      console.log('✅ PostgreSQL seeding completed');
      
    } catch (error) {
      console.error('❌ PostgreSQL seeding failed:', error);
      throw error;
    }
  }

  async seedMongoDB(): Promise<void> {
    console.log('🌱 Seeding MongoDB...');
    
    try {
      const db = this.mongodb.db(this.config.mongodb.database);
      
      // Seed analytics data
      console.log('📊 Seeding analytics data...');
      const analyticsData = [
        {
          date: new Date(),
          tvl: 10000000,
          volume_24h: 500000,
          active_users: 10000,
          transactions_24h: 50000,
          new_users: 500,
          total_users: 50000
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
          tvl: 9500000,
          volume_24h: 450000,
          active_users: 9500,
          transactions_24h: 45000,
          new_users: 450,
          total_users: 49500
        }
      ];
      
      await db.collection('analytics').insertMany(analyticsData);
      
      // Seed price history
      console.log('💰 Seeding price history...');
      const priceHistory = [
        {
          symbol: 'AGRO',
          price: 0.15,
          timestamp: new Date(),
          volume: 1000000,
          market_cap: 150000000
        },
        {
          symbol: 'AGRO',
          price: 0.14,
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          volume: 950000,
          market_cap: 140000000
        }
      ];
      
      await db.collection('price_history').insertMany(priceHistory);
      
      // Seed transaction logs
      console.log('📝 Seeding transaction logs...');
      const transactionLogs = [
        {
          tx_hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
          user_id: 'user_1',
          type: 'stake',
          amount: 10000,
          token: 'AGRO',
          status: 'confirmed',
          timestamp: new Date(),
          gas_used: 150000,
          gas_price: '20000000000'
        },
        {
          tx_hash: '0x2345678901234567890123456789012345678901234567890123456789012345',
          user_id: 'user_2',
          type: 'add_liquidity',
          amount: 5000,
          token: 'AGRO',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          gas_used: 200000,
          gas_price: '25000000000'
        }
      ];
      
      await db.collection('transaction_logs').insertMany(transactionLogs);
      
      console.log('✅ MongoDB seeding completed');
      
    } catch (error) {
      console.error('❌ MongoDB seeding failed:', error);
      throw error;
    }
  }

  async seedRedis(): Promise<void> {
    console.log('🌱 Seeding Redis...');
    
    try {
      // Seed cache data
      console.log('💾 Seeding cache data...');
      
      // Market data cache
      await this.redis.setex('market:agro:price', 300, '0.15'); // 5 minutes
      await this.redis.setex('market:agro:volume_24h', 300, '1000000');
      await this.redis.setex('market:agro:market_cap', 300, '150000000');
      
      // Pool data cache
      await this.redis.setex('pool:agro-usdc:tvl', 300, '1000000');
      await this.redis.setex('pool:agro-usdc:apr', 300, '12.5');
      await this.redis.setex('pool:agro-sol:tvl', 300, '750000');
      await this.redis.setex('pool:agro-sol:apr', 300, '15.2');
      
      // User session cache
      await this.redis.setex('session:user_1', 3600, JSON.stringify({
        user_id: 'user_1',
        email: 'admin@agrotm.com',
        role: 'admin',
        last_activity: new Date().toISOString()
      }));
      
      // Rate limiting cache
      await this.redis.setex('rate_limit:api:user_1', 3600, '0');
      
      console.log('✅ Redis seeding completed');
      
    } catch (error) {
      console.error('❌ Redis seeding failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    console.log('🏗️ Creating tables...');
    
    const createTablesSQL = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        kyc_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Pools table
      CREATE TABLE IF NOT EXISTS pools (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        chain VARCHAR(50) NOT NULL,
        token_a VARCHAR(50) NOT NULL,
        token_b VARCHAR(50) NOT NULL,
        token_a_address VARCHAR(42) NOT NULL,
        token_b_address VARCHAR(42) NOT NULL,
        tvl DECIMAL(20, 8) DEFAULT 0,
        apr DECIMAL(10, 4) DEFAULT 0,
        volume_24h DECIMAL(20, 8) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Farms table
      CREATE TABLE IF NOT EXISTS farms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        pool_id VARCHAR(50) REFERENCES pools(id),
        chain VARCHAR(50) NOT NULL,
        rewards_token VARCHAR(50) NOT NULL,
        rewards_per_day DECIMAL(20, 8) DEFAULT 0,
        total_staked DECIMAL(20, 8) DEFAULT 0,
        apr DECIMAL(10, 4) DEFAULT 0,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- NFTs table
      CREATE TABLE IF NOT EXISTS nfts (
        id VARCHAR(50) PRIMARY KEY,
        token_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        metadata_url TEXT,
        chain VARCHAR(50) NOT NULL,
        contract_address VARCHAR(42) NOT NULL,
        owner VARCHAR(42) NOT NULL,
        creator VARCHAR(42) NOT NULL,
        category VARCHAR(50) NOT NULL,
        attributes JSONB,
        price DECIMAL(20, 8) DEFAULT 0,
        is_listed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Proposals table
      CREATE TABLE IF NOT EXISTS proposals (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        proposer VARCHAR(42) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        votes_for DECIMAL(20, 8) DEFAULT 0,
        votes_against DECIMAL(20, 8) DEFAULT 0,
        votes_abstain DECIMAL(20, 8) DEFAULT 0,
        quorum DECIMAL(20, 8) NOT NULL,
        threshold DECIMAL(5, 4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Markets table
      CREATE TABLE IF NOT EXISTS markets (
        id VARCHAR(50) PRIMARY KEY,
        asset VARCHAR(50) NOT NULL,
        chain VARCHAR(50) NOT NULL,
        total_supply DECIMAL(20, 8) DEFAULT 0,
        total_borrow DECIMAL(20, 8) DEFAULT 0,
        supply_apy DECIMAL(10, 4) DEFAULT 0,
        borrow_apy DECIMAL(10, 4) DEFAULT 0,
        utilization_rate DECIMAL(5, 4) DEFAULT 0,
        collateral_factor DECIMAL(5, 4) DEFAULT 0,
        borrow_cap DECIMAL(20, 8) DEFAULT 0,
        supply_cap DECIMAL(20, 8) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await this.postgres.query(createTablesSQL);
    console.log('✅ Tables created successfully');
  }

  async run(): Promise<void> {
    try {
      console.log('🌱 AGROTM Database Seeding Script');
      console.log('==================================');
      
      await this.connect();
      
      // Seed all databases
      await this.seedPostgreSQL();
      await this.seedMongoDB();
      await this.seedRedis();
      
      console.log('🎉 Database seeding completed successfully!');
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// CLI interface
async function main() {
  const config: DatabaseConfig = {
    postgres: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'agrotm',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || ''
    },
    mongodb: {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
      database: process.env.MONGODB_DB || 'agrotm'
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined
    }
  };

  const seeder = new DatabaseSeeder(config);
  await seeder.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseSeeder, DatabaseConfig, SeedData }; 