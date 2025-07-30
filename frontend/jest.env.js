// Jest environment configuration
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NEXT_PUBLIC_INFURA_URL = 'https://mainnet.infura.io/v3/test';
process.env.NEXT_PUBLIC_CHAIN_ID = '1';
process.env.NEXT_PUBLIC_APP_NAME = 'AGROTM Test';
process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Mock environment variables for testing
process.env.TEST_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CYPRESS_BASE_URL = 'http://localhost:3000';
process.env.STAGING_URL = 'http://localhost:3001';
process.env.PRODUCTION_URL = 'http://localhost:3002';

// Web3 test environment
process.env.NEXT_PUBLIC_WEB3_PROVIDER = 'http://localhost:8545';
process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
process.env.NEXT_PUBLIC_NETWORK_ID = '1337';

// Analytics and monitoring (disabled for tests)
process.env.NEXT_PUBLIC_ANALYTICS_ID = '';
// process.env.NEXT_PUBLIC_SENTRY_DSN = ''; // Removed - using console logging instead
process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = '';

// Feature flags for testing
process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'false';
process.env.NEXT_PUBLIC_ENABLE_MONITORING = 'false';
process.env.NEXT_PUBLIC_ENABLE_DEBUG = 'true'; 