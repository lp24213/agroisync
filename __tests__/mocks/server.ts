import { setupServer } from 'msw/node';
import { rest } from 'msw';

// API base URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Mock handlers
export const handlers = [
  // Health check
  rest.get(`${API_BASE_URL}/health`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      })
    );
  }),

  // Authentication endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          wallet: 'test-wallet-address',
        },
      })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          wallet: 'test-wallet-address',
        },
      })
    );
  }),

  // User endpoints
  rest.get(`${API_BASE_URL}/user/profile`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        wallet: 'test-wallet-address',
        avatar: 'https://example.com/avatar.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  // Staking endpoints
  rest.get(`${API_BASE_URL}/staking/pools`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'AGROTM Staking Pool',
          apy: 12.5,
          totalStaked: 1000000,
          minStake: 100,
          maxStake: 100000,
          lockPeriod: 30,
          rewards: 50000,
        },
      ])
    );
  }),

  rest.post(`${API_BASE_URL}/staking/stake`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        amount: 1000,
        poolId: '1',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: 50,
      })
    );
  }),

  // NFT endpoints
  rest.get(`${API_BASE_URL}/nfts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'AGROTM NFT #1',
          description: 'A unique agricultural NFT',
          image: 'https://example.com/nft1.jpg',
          price: 100,
          owner: 'test-wallet-address',
          metadata: {
            rarity: 'rare',
            attributes: [
              { trait_type: 'Type', value: 'Crop' },
              { trait_type: 'Yield', value: 'High' },
            ],
          },
        },
      ])
    );
  }),

  // DeFi endpoints
  rest.get(`${API_BASE_URL}/defi/pools`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'AGROTM-ETH LP',
          token0: 'AGROTM',
          token1: 'ETH',
          liquidity: 1000000,
          volume24h: 50000,
          apy: 25.5,
        },
      ])
    );
  }),

  rest.get(`${API_BASE_URL}/defi/apr`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        staking: 12.5,
        liquidity: 25.5,
        farming: 35.2,
      })
    );
  }),

  // Analytics endpoints
  rest.get(`${API_BASE_URL}/analytics/dashboard`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalUsers: 10000,
        totalVolume: 5000000,
        totalStaked: 2000000,
        activePools: 5,
        dailyTransactions: 1500,
        weeklyGrowth: 15.5,
      })
    );
  }),

  // Solana RPC endpoints
  rest.post(SOLANA_RPC_URL, (req, res, ctx) => {
    const { method } = req.body as any;

    switch (method) {
      case 'getBalance':
        return res(
          ctx.status(200),
          ctx.json({
            jsonrpc: '2.0',
            result: {
              context: { slot: 123456789 },
              value: 1000000000, // 1 SOL in lamports
            },
            id: 1,
          })
        );

      case 'getLatestBlockhash':
        return res(
          ctx.status(200),
          ctx.json({
            jsonrpc: '2.0',
            result: {
              context: { slot: 123456789 },
              value: {
                blockhash: 'test-blockhash',
                lastValidBlockHeight: 123456789,
              },
            },
            id: 1,
          })
        );

      case 'sendTransaction':
        return res(
          ctx.status(200),
          ctx.json({
            jsonrpc: '2.0',
            result: 'test-signature',
            id: 1,
          })
        );

      default:
        return res(
          ctx.status(200),
          ctx.json({
            jsonrpc: '2.0',
            result: null,
            id: 1,
          })
        );
    }
  }),

  // External APIs
  rest.get('https://api.coingecko.com/api/v3/simple/price', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        agrotm: {
          usd: 0.25,
          eur: 0.22,
          btc: 0.00001234,
        },
        ethereum: {
          usd: 2000,
          eur: 1800,
          btc: 0.1,
        },
        solana: {
          usd: 100,
          eur: 90,
          btc: 0.005,
        },
      })
    );
  }),

  rest.get('https://api.openweathermap.org/data/2.5/weather', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        main: {
          temp: 25,
          feels_like: 26,
          temp_min: 20,
          temp_max: 30,
          pressure: 1013,
          humidity: 60,
        },
        wind: {
          speed: 5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: Math.floor(Date.now() / 1000),
        sys: {
          type: 2,
          id: 2000,
          country: 'US',
          sunrise: Math.floor(Date.now() / 1000) - 21600,
          sunset: Math.floor(Date.now() / 1000) + 21600,
        },
        timezone: -18000,
        id: 1234567,
        name: 'Test City',
        cod: 200,
      })
    );
  }),

  // File upload
  rest.post(`${API_BASE_URL}/upload`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url: 'https://example.com/uploaded-file.jpg',
        filename: 'uploaded-file.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
      })
    );
  }),

  // Error handlers
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json({
        error: 'Not found',
        message: `No handler found for ${req.method} ${req.url}`,
      })
    );
  }),
];

// Create MSW server
export const server = setupServer(...handlers); 