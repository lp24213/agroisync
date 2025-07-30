import { getTestPool } from './testDb';
import jwt from 'jsonwebtoken';

export interface TestUser {
  id: string;
  email: string;
  walletAddress: string;
  userType: 'farmer' | 'investor' | 'enterprise' | 'developer';
  firstName?: string;
  lastName?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export async function createTestUser(overrides: Partial<TestUser> = {}): Promise<TestUser> {
  const pool = getTestPool();
  
  const defaultUser: Partial<TestUser> = {
    email: `test-${Date.now()}@example.com`,
    walletAddress: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
    userType: 'farmer',
    firstName: 'Test',
    lastName: 'User',
    kycStatus: 'pending',
    ...overrides
  };

  const query = `
    INSERT INTO users (email, wallet_address, user_type, first_name, last_name, kyc_status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *
  `;

  const values = [
    defaultUser.email,
    defaultUser.walletAddress,
    defaultUser.userType,
    defaultUser.firstName,
    defaultUser.lastName,
    defaultUser.kycStatus
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export function generateTestToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}

export function generateTestWalletAddress(): string {
  return `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
}

export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(2)}@example.com`;
}

export function generateTestNFTData(overrides: any = {}) {
  return {
    name: `Test NFT ${Date.now()}`,
    description: 'A test NFT for testing purposes',
    image: 'ipfs://test-image-hash',
    category: 'Farm Land',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Soil Type', value: 'Loam' },
      { trait_type: 'Size', value: '100 acres' }
    ],
    ...overrides
  };
}

export function generateTestTransactionData(overrides: any = {}) {
  return {
    type: 'mint',
    amount: '100',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    txHash: `0x${Math.random().toString(16).substring(2)}`,
    blockNumber: Math.floor(Math.random() * 1000000),
    ...overrides
  };
}

export function generateTestStakingData(overrides: any = {}) {
  return {
    poolId: 'pool_123',
    amount: '1000',
    apy: '12.5',
    lockPeriod: 30,
    ...overrides
  };
}

export async function createTestNFT(userId: string, overrides: any = {}) {
  const pool = getTestPool();
  
  const nftData = generateTestNFTData(overrides);
  
  const query = `
    INSERT INTO nfts (token_id, contract_address, metadata_uri, owner_id, creator_id, category, rarity, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING *
  `;

  const values = [
    `AGROTM-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    '0xabcdef1234567890abcdef1234567890abcdef12',
    JSON.stringify(nftData),
    userId,
    userId,
    nftData.category,
    nftData.rarity
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function createTestTransaction(userId: string, overrides: any = {}) {
  const pool = getTestPool();
  
  const txData = generateTestTransactionData(overrides);
  
  const query = `
    INSERT INTO transactions (user_id, type, amount, token_address, tx_hash, block_number, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;

  const values = [
    userId,
    txData.type,
    txData.amount,
    txData.tokenAddress,
    txData.txHash,
    txData.blockNumber
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function createTestStakingPosition(userId: string, overrides: any = {}) {
  const pool = getTestPool();
  
  const stakingData = generateTestStakingData(overrides);
  
  const query = `
    INSERT INTO staking_positions (user_id, pool_id, amount, apy, start_date, end_date)
    VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '30 days')
    RETURNING *
  `;

  const values = [
    userId,
    stakingData.poolId,
    stakingData.amount,
    stakingData.apy
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export function mockWeb3Provider() {
  return {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true,
    selectedAddress: '0x1234567890abcdef1234567890abcdef12345678',
    networkVersion: '1'
  };
}

export function mockEthers() {
  return {
    providers: {
      Web3Provider: jest.fn().mockImplementation(() => ({
        getSigner: jest.fn().mockReturnValue({
          getAddress: jest.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678'),
          signMessage: jest.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678')
        }),
        getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
        getBalance: jest.fn().mockResolvedValue('1000000000000000000')
      }))
    },
    utils: {
      parseEther: jest.fn().mockReturnValue('1000000000000000000'),
      formatEther: jest.fn().mockReturnValue('1.0'),
      verifyMessage: jest.fn().mockReturnValue('0x1234567890abcdef1234567890abcdef12345678')
    }
  };
}

export function mockSolanaConnection() {
  return {
    getAccountInfo: jest.fn().mockResolvedValue({
      data: Buffer.from('test data'),
      lamports: 1000000000,
      owner: '11111111111111111111111111111111',
      executable: false,
      rentEpoch: 0
    }),
    getBalance: jest.fn().mockResolvedValue(1000000000),
    getRecentBlockhash: jest.fn().mockResolvedValue({
      blockhash: 'test-blockhash',
      feeCalculator: { lamportsPerSignature: 5000 }
    }),
    sendTransaction: jest.fn().mockResolvedValue('test-signature'),
    confirmTransaction: jest.fn().mockResolvedValue({ value: { err: null } })
  };
}

export function setupTestEnvironment() {
  // Mock environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.DATABASE_URL = 'postgresql://test_user:test_password@localhost:5432/agrotm_test';
  
  // Mock console methods to reduce noise in tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
}

export function teardownTestEnvironment() {
  jest.restoreAllMocks();
}

export function expectValidationError(response: any, field: string) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('errors');
  expect(response.body.errors).toHaveProperty(field);
}

export function expectUnauthorizedError(response: any) {
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
}

export function expectForbiddenError(response: any) {
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
}

export function expectNotFoundError(response: any) {
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
}

export function expectRateLimitError(response: any) {
  expect(response.status).toBe(429);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toContain('rate limit');
} 