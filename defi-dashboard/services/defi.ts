import { ethers } from 'ethers';
import { abi as poolABI } from '../contracts/DeFiPool.json';
import { DeFiPool } from '../types';

// Create provider only on client-side
const getProvider = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RPC_URL) {
    return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  }
  return null;
};

// Function to get the total value locked (TVL) in the DeFi pool
export const getTVL = async (contractAddress: string): Promise<string> => {
  try {
    const provider = getProvider();
    if (!provider || !contractAddress) {
      throw new Error('Provider or contract address not available');
    }

    const contract = new ethers.Contract(contractAddress, poolABI, provider);
    const tvl = await contract.totalValueLocked?.();
    return ethers.formatEther(tvl);
  } catch (error) {
    console.error('Error getting TVL:', error);
    throw new Error('Failed to fetch TVL data');
  }
};

// Mock data for development if needed
const mockPools: DeFiPool[] = [
  { id: '1', name: 'Ethereum Staking Pool', token: 'ETH', tvl: 1250000 },
  { id: '2', name: 'Bitcoin Yield Pool', token: 'BTC', tvl: 3450000 },
  { id: '3', name: 'USDC Lending Pool', token: 'USDC', tvl: 5670000 },
];

// Function to get the list of DeFi pools
export const getDeFiPools = async (): Promise<DeFiPool[]> => {
  try {
    // For development, use mock data if no provider or contract address
    if (!process.env.NEXT_PUBLIC_DEFI_POOL_ADDRESS || process.env.NODE_ENV === 'development') {
      console.log('Using mock data for DeFi pools');
      return mockPools;
    }

    const provider = getProvider();
    if (!provider) {
      throw new Error('Provider not available');
    }

    const contractAddress = process.env.NEXT_PUBLIC_DEFI_POOL_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not available');
    }

    const contract = new ethers.Contract(contractAddress, poolABI, provider);

    // This would need to be adjusted based on the actual contract implementation
    // For now, we'll return mock data
    return mockPools;

    // Uncomment and adjust when contract is properly implemented
    /*
    const poolCount = await contract.poolCount();
    const pools: DeFiPool[] = [];

    for (let i = 0; i < poolCount.toNumber(); i++) {
      const pool = await contract.pools(i);
      const tvl = await getTVL(pool.address);
      
      pools.push({
        id: i.toString(),
        name: pool.name,
        token: pool.token,
        tvl: parseFloat(tvl),
      });
    }

    return pools;
    */
  } catch (error) {
    console.error('Error fetching DeFi pools:', error);
    throw new Error('Failed to fetch DeFi pools data');
  }
};

// Function to get token details
export const getTokenDetails = async (
  tokenAddress: string,
): Promise<{ name: string; symbol: string; decimals: number }> => {
  try {
    const provider = getProvider();
    if (!provider || !tokenAddress) {
      throw new Error('Provider or token address not available');
    }

    // ERC20 ABI for name, symbol, decimals
    const erc20ABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
    ];

    const contract = new ethers.Contract(tokenAddress, erc20ABI, provider);
    const name = await contract.name?.();
    const symbol = await contract.symbol?.();
    const decimals = await contract.decimals?.();

    return { name, symbol, decimals };
  } catch (error) {
    console.error('Error getting token details:', error);
    throw new Error('Failed to fetch token details');
  }
};
