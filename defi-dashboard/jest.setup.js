// Add any global setup needed for Jest tests
import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_RPC_URL: 'https://mainnet.infura.io/v3/test-key',
  NEXT_PUBLIC_DEFI_POOL_ADDRESS: '0x1234567890123456789012345678901234567890',
};

// Suppress console errors during tests
console.error = jest.fn();
