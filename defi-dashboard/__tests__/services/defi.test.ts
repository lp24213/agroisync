import { getDeFiPools, getTVL, getTokenDetails } from '../../services/defi';
import { ethers } from 'ethers';

// Mock ethers
jest.mock('ethers', () => {
  // Mock contract class
  const mockContract = {
    totalValueLocked: jest.fn().mockResolvedValue('1000000000000000000000'),
    name: jest.fn().mockResolvedValue('Test Token'),
    symbol: jest.fn().mockResolvedValue('TEST'),
    decimals: jest.fn().mockResolvedValue(18),
  };

  return {
    Contract: jest.fn().mockImplementation(() => mockContract),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
    formatEther: jest.fn().mockImplementation((value) => '1000.0'),
  };
});

describe('DeFi Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock environment variables
    process.env.NEXT_PUBLIC_RPC_URL = 'https://mainnet.infura.io/v3/test-key';
    process.env.NEXT_PUBLIC_DEFI_POOL_ADDRESS = '0x1234567890123456789012345678901234567890';
    process.env.NODE_ENV = 'test';
  });

  describe('getDeFiPools', () => {
    it('returns mock data when in development or test environment', async () => {
      const pools = await getDeFiPools();

      // Should return mock data
      expect(pools.length).toBe(3);
      expect(pools[0].name).toBe('Ethereum Staking Pool');
      expect(pools[1].token).toBe('BTC');
      expect(pools[2].tvl).toBe(5670000);
    });
  });

  describe('getTVL', () => {
    it('throws an error when provider or contract address is not available', async () => {
      // Mock window to simulate browser environment
      global.window = Object.create(window);

      // Clear environment variables
      delete process.env.NEXT_PUBLIC_RPC_URL;

      await expect(getTVL('0x1234567890123456789012345678901234567890')).rejects.toThrow(
        'Provider or contract address not available',
      );
    });
  });

  describe('getTokenDetails', () => {
    it('returns token details when contract is available', async () => {
      // Mock window to simulate browser environment
      global.window = Object.create(window);

      // Set environment variables
      process.env.NEXT_PUBLIC_RPC_URL = 'https://mainnet.infura.io/v3/test-key';

      const tokenAddress = '0x1234567890123456789012345678901234567890';
      const details = await getTokenDetails(tokenAddress);

      expect(details.name).toBe('Test Token');
      expect(details.symbol).toBe('TEST');
      expect(details.decimals).toBe(18);
    });
  });
});
