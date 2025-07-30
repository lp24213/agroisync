# AGROTM API Reference v1.0

## Overview

The AGROTM API provides comprehensive access to all platform features including DeFi operations, NFT management, staking, and analytics. This RESTful API is designed for high performance, security, and ease of integration.

## Base URL

```
Production: https://api.agrotm.com/v1
Staging: https://api-staging.agrotm.com/v1
Development: https://api-dev.agrotm.com/v1
```

## Authentication

### API Keys
All API requests require authentication using API keys.

```bash
# Header format
Authorization: Bearer YOUR_API_KEY
```

### Rate Limits
- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: 100,000 requests/hour

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "wallet_address": "optional_wallet_address"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "wallet_address": "0x1234...",
      "kyc_status": "verified"
    }
  }
}
```

#### POST /auth/register
Register new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "wallet_address": "0x1234...",
  "referral_code": "optional_referral"
}
```

#### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

### User Management

#### GET /user/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "wallet_address": "0x1234...",
    "kyc_status": "verified",
    "created_at": "2024-01-01T00:00:00Z",
    "preferences": {
      "notifications": true,
      "language": "en"
    }
  }
}
```

#### PUT /user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "preferences": {
    "notifications": true,
    "language": "pt"
  }
}
```

#### POST /user/kyc
Submit KYC documentation.

**Request Body:**
```json
{
  "document_type": "passport",
  "document_number": "123456789",
  "document_front": "base64_encoded_image",
  "document_back": "base64_encoded_image",
  "selfie": "base64_encoded_image"
}
```

### DeFi Operations

#### GET /defi/pools
Get all available liquidity pools.

**Query Parameters:**
- `chain` (optional): Filter by blockchain (solana, ethereum, polygon)
- `category` (optional): Filter by category (stable, volatile, farming)

**Response:**
```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "id": "pool_123",
        "name": "AGRO-USDC",
        "chain": "solana",
        "tokens": [
          {
            "symbol": "AGRO",
            "address": "0x1234...",
            "decimals": 9
          },
          {
            "symbol": "USDC",
            "address": "0x5678...",
            "decimals": 6
          }
        ],
        "tvl": 1000000,
        "apr": 12.5,
        "volume_24h": 500000
      }
    ]
  }
}
```

#### POST /defi/pools/{pool_id}/add-liquidity
Add liquidity to a pool.

**Request Body:**
```json
{
  "token_a_amount": "1000",
  "token_b_amount": "1000",
  "slippage_tolerance": 0.5
}
```

#### POST /defi/pools/{pool_id}/remove-liquidity
Remove liquidity from a pool.

**Request Body:**
```json
{
  "lp_token_amount": "100",
  "slippage_tolerance": 0.5
}
```

#### GET /defi/staking
Get staking information.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_staked": 50000000,
    "user_staked": 10000,
    "rewards_earned": 500,
    "apy": 12.5,
    "lock_periods": [
      {
        "days": 30,
        "apy": 8.0
      },
      {
        "days": 90,
        "apy": 10.0
      },
      {
        "days": 180,
        "apy": 12.0
      },
      {
        "days": 365,
        "apy": 15.0
      }
    ]
  }
}
```

#### POST /defi/staking/stake
Stake AGRO tokens.

**Request Body:**
```json
{
  "amount": "10000",
  "lock_period": 90
}
```

#### POST /defi/staking/unstake
Unstake AGRO tokens.

**Request Body:**
```json
{
  "amount": "5000"
}
```

#### POST /defi/staking/claim-rewards
Claim staking rewards.

**Request Body:**
```json
{
  "stake_id": "stake_123"
}
```

### NFT Operations

#### GET /nfts
Get user's NFTs.

**Query Parameters:**
- `chain` (optional): Filter by blockchain
- `category` (optional): Filter by category (farm, equipment, crop)
- `status` (optional): Filter by status (minted, listed, sold)

**Response:**
```json
{
  "success": true,
  "data": {
    "nfts": [
      {
        "id": "nft_123",
        "token_id": "123",
        "name": "Farm Plot #123",
        "description": "Premium agricultural land",
        "image_url": "https://api.agrotm.com/nfts/123/image",
        "metadata_url": "https://api.agrotm.com/nfts/123/metadata",
        "chain": "solana",
        "contract_address": "0x1234...",
        "owner": "0x5678...",
        "attributes": {
          "location": "Brazil",
          "size": "100 hectares",
          "soil_type": "fertile",
          "crop_type": "soybeans"
        },
        "market_data": {
          "floor_price": 1000,
          "last_sale": 1200,
          "volume_24h": 50000
        }
      }
    ]
  }
}
```

#### POST /nfts/mint
Mint new NFT.

**Request Body:**
```json
{
  "name": "Farm Plot #124",
  "description": "Premium agricultural land",
  "image": "base64_encoded_image",
  "attributes": {
    "location": "Brazil",
    "size": "100 hectares",
    "soil_type": "fertile",
    "crop_type": "soybeans"
  },
  "chain": "solana"
}
```

#### POST /nfts/{nft_id}/list
List NFT for sale.

**Request Body:**
```json
{
  "price": 1000,
  "currency": "USDC",
  "duration": 30
}
```

#### POST /nfts/{nft_id}/buy
Buy listed NFT.

**Request Body:**
```json
{
  "payment_method": "wallet"
}
```

### Lending Operations

#### GET /lending/markets
Get lending markets.

**Response:**
```json
{
  "success": true,
  "data": {
    "markets": [
      {
        "id": "market_123",
        "asset": "AGRO",
        "total_supply": 1000000,
        "total_borrow": 500000,
        "supply_apy": 8.5,
        "borrow_apy": 12.0,
        "utilization_rate": 0.5
      }
    ]
  }
}
```

#### POST /lending/supply
Supply assets to lending market.

**Request Body:**
```json
{
  "market_id": "market_123",
  "amount": "10000"
}
```

#### POST /lending/borrow
Borrow assets from lending market.

**Request Body:**
```json
{
  "market_id": "market_123",
  "amount": "5000"
}
```

#### POST /lending/repay
Repay borrowed assets.

**Request Body:**
```json
{
  "market_id": "market_123",
  "amount": "5000"
}
```

### Analytics

#### GET /analytics/portfolio
Get user portfolio analytics.

**Query Parameters:**
- `timeframe` (optional): 1d, 7d, 30d, 90d, 1y

**Response:**
```json
{
  "success": true,
  "data": {
    "total_value": 50000,
    "total_pnl": 5000,
    "total_pnl_percentage": 11.11,
    "assets": [
      {
        "symbol": "AGRO",
        "amount": 10000,
        "value": 10000,
        "pnl": 1000,
        "pnl_percentage": 11.11
      }
    ],
    "performance": {
      "daily": 0.5,
      "weekly": 3.2,
      "monthly": 12.1,
      "yearly": 45.6
    }
  }
}
```

#### GET /analytics/market
Get market analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "tvl": 10000000,
    "volume_24h": 500000,
    "active_users": 10000,
    "transactions_24h": 50000,
    "top_pools": [
      {
        "name": "AGRO-USDC",
        "tvl": 2000000,
        "volume_24h": 100000
      }
    ]
  }
}
```

### Oracle Data

#### GET /oracles/weather
Get weather data for specific location.

**Query Parameters:**
- `latitude`: Location latitude
- `longitude`: Location longitude
- `days` (optional): Number of days (default: 7)

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "city": "São Paulo"
    },
    "forecast": [
      {
        "date": "2024-01-01",
        "temperature": 25,
        "humidity": 70,
        "precipitation": 0,
        "wind_speed": 10
      }
    ]
  }
}
```

#### GET /oracles/prices
Get commodity prices.

**Query Parameters:**
- `commodity` (optional): Filter by commodity (soybeans, corn, wheat)

**Response:**
```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "commodity": "soybeans",
        "price": 500,
        "currency": "USD",
        "unit": "bushel",
        "change_24h": 2.5,
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### AI Predictions

#### GET /ai/yield-prediction
Get AI-powered yield predictions.

**Query Parameters:**
- `location`: Location coordinates
- `crop_type`: Type of crop
- `planting_date`: Planting date

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "expected_yield": 150,
      "confidence": 0.85,
      "unit": "bushels_per_acre",
      "factors": [
        {
          "factor": "weather",
          "impact": "positive",
          "confidence": 0.9
        },
        {
          "factor": "soil_quality",
          "impact": "neutral",
          "confidence": 0.8
        }
      ]
    }
  }
}
```

### Governance

#### GET /governance/proposals
Get governance proposals.

**Query Parameters:**
- `status` (optional): Filter by status (active, passed, failed)

**Response:**
```json
{
  "success": true,
  "data": {
    "proposals": [
      {
        "id": "proposal_123",
        "title": "Increase Staking Rewards",
        "description": "Proposal to increase staking APY by 2%",
        "status": "active",
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-01-08T00:00:00Z",
        "votes": {
          "for": 1000000,
          "against": 200000,
          "abstain": 50000
        }
      }
    ]
  }
}
```

#### POST /governance/proposals/{proposal_id}/vote
Vote on governance proposal.

**Request Body:**
```json
{
  "vote": "for",
  "amount": "10000"
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input parameters",
    "details": {
      "field": "amount",
      "issue": "Amount must be greater than 0"
    }
  }
}
```

### Common Error Codes
- `INVALID_API_KEY`: Invalid or missing API key
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `INVALID_INPUT`: Invalid input parameters
- `INSUFFICIENT_BALANCE`: Insufficient balance for operation
- `TRANSACTION_FAILED`: Blockchain transaction failed
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.agrotm.com/v1/ws');
```

### Subscribe to Updates
```json
{
  "action": "subscribe",
  "channel": "price_updates",
  "symbols": ["AGRO", "USDC"]
}
```

### Message Format
```json
{
  "channel": "price_updates",
  "data": {
    "AGRO": {
      "price": 0.15,
      "change_24h": 5.2,
      "timestamp": "2024-01-01T00:00:00Z"
    }
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @agrotm/sdk
```

```javascript
import { AgrotmAPI } from '@agrotm/sdk';

const api = new AgrotmAPI({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Get user profile
const profile = await api.user.getProfile();

// Stake tokens
const stake = await api.defi.stake({
  amount: '10000',
  lockPeriod: 90
});
```

### Python
```bash
pip install agrotm-sdk
```

```python
from agrotm import AgrotmAPI

api = AgrotmAPI(
    api_key='your_api_key',
    environment='production'
)

# Get pools
pools = api.defi.get_pools()

# Mint NFT
nft = api.nfts.mint({
    'name': 'Farm Plot #125',
    'description': 'Premium land',
    'attributes': {
        'location': 'Brazil',
        'size': '100 hectares'
    }
})
```

## Rate Limits

| Endpoint Category | Free Tier | Pro Tier | Enterprise |
|------------------|-----------|----------|------------|
| Authentication | 100/hour | 1,000/hour | 10,000/hour |
| User Management | 500/hour | 5,000/hour | 50,000/hour |
| DeFi Operations | 1,000/hour | 10,000/hour | 100,000/hour |
| NFT Operations | 500/hour | 5,000/hour | 50,000/hour |
| Analytics | 200/hour | 2,000/hour | 20,000/hour |

## Support

- **Documentation**: https://docs.agrotm.com
- **API Status**: https://status.agrotm.com
- **Support Email**: api-support@agrotm.com
- **Discord**: https://discord.gg/agrotm

---

**Version**: 1.0  
**Last Updated**: January 2024  
**Contact**: api@agrotm.com 