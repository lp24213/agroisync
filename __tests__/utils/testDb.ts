import { Pool } from 'pg';

let testPool: Pool;

export async function connectTestDB(): Promise<void> {
  testPool = new Pool({
    host: process.env.TEST_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.TEST_DATABASE_PORT || '5432'),
    database: process.env.TEST_DATABASE_NAME || 'agrotm_test',
    user: process.env.TEST_DATABASE_USER || 'test_user',
    password: process.env.TEST_DATABASE_PASSWORD || 'test_password',
  });

  try {
    await testPool.query('SELECT 1');
    console.log('Test database connected successfully');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
}

export async function disconnectTestDB(): Promise<void> {
  if (testPool) {
    await testPool.end();
    console.log('Test database disconnected');
  }
}

export async function clearTestDB(): Promise<void> {
  if (!testPool) {
    throw new Error('Test database not connected');
  }

  try {
    // Clear all tables
    await testPool.query('TRUNCATE TABLE users, nfts, transactions, staking_positions, kyc_verifications CASCADE');
    console.log('Test database cleared');
  } catch (error) {
    console.error('Failed to clear test database:', error);
    throw error;
  }
}

export function getTestPool(): Pool {
  if (!testPool) {
    throw new Error('Test database not connected');
  }
  return testPool;
} 