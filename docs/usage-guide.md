# AGROTM Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Registration](#user-registration)
3. [Wallet Connection](#wallet-connection)
4. [KYC Verification](#kyc-verification)
5. [NFT Operations](#nft-operations)
6. [Staking & Yield Farming](#staking--yield-farming)
7. [DeFi Operations](#defi-operations)
8. [Governance](#governance)
9. [Analytics & Reporting](#analytics--reporting)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A cryptocurrency wallet (MetaMask, Phantom, WalletConnect)
- Stable internet connection
- Valid government-issued ID for KYC verification

### Supported Networks
- **Primary**: Solana (Mainnet)
- **Secondary**: Ethereum, Polygon, BSC

### Minimum Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS 14+, Android 10+
- **Wallet**: MetaMask 10+, Phantom 1.0+

## User Registration

### Step 1: Access the Platform
1. Visit [https://agrotm.com](https://agrotm.com)
2. Click "Get Started" or "Connect Wallet"
3. Choose your preferred language (EN, PT, ES, ZH)

### Step 2: Connect Your Wallet
1. Click "Connect Wallet" button
2. Select your wallet provider:
   - **MetaMask** (Ethereum/Polygon/BSC)
   - **Phantom** (Solana)
   - **WalletConnect** (Multi-chain)
3. Approve the connection in your wallet
4. Sign the message to verify ownership

### Step 3: Complete Profile
1. Enter your email address
2. Choose your user type:
   - **Farmer**: Agricultural producers
   - **Investor**: Financial backers
   - **Enterprise**: Large organizations
   - **Developer**: Technical users
3. Set your preferences:
   - Language
   - Timezone
   - Notification settings
4. Accept terms of service and privacy policy

## Wallet Connection

### Supported Wallets

#### Ethereum-Compatible Wallets
- **MetaMask**: Most popular Ethereum wallet
- **WalletConnect**: Multi-wallet support
- **Coinbase Wallet**: User-friendly interface
- **Trust Wallet**: Mobile-first experience

#### Solana Wallets
- **Phantom**: Leading Solana wallet
- **Solflare**: Advanced features
- **Slope**: Mobile wallet
- **Backpack**: Multi-chain support

### Connection Process

#### For MetaMask Users
1. Install MetaMask extension
2. Create or import wallet
3. Switch to desired network:
   - Ethereum Mainnet
   - Polygon
   - BSC
4. Click "Connect Wallet" on AGROTM
5. Approve connection request
6. Sign verification message

#### For Phantom Users
1. Install Phantom extension
2. Create or import wallet
3. Ensure you're on Solana Mainnet
4. Click "Connect Wallet" on AGROTM
5. Approve connection request
6. Sign verification message

### Network Configuration

#### Adding Custom Networks
```javascript
// Ethereum Configuration
{
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.infura.io/v3/YOUR_KEY'],
  blockExplorerUrls: ['https://etherscan.io']
}

// Polygon Configuration
{
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com']
}
```

## KYC Verification

### Why KYC is Required
- **Regulatory Compliance**: Meet legal requirements
- **Fraud Prevention**: Protect against malicious actors
- **Platform Security**: Ensure legitimate users
- **Feature Access**: Unlock advanced features

### KYC Process

#### Step 1: Start Verification
1. Navigate to "Profile" → "KYC Verification"
2. Choose verification level:
   - **Basic**: Email + phone verification
   - **Verified**: Government ID + address
   - **Enterprise**: Business documentation

#### Step 2: Personal Information
1. Enter personal details:
   - Full legal name
   - Date of birth
   - Nationality
   - Residential address
2. Verify information accuracy

#### Step 3: Document Upload
1. **Government ID**: Passport, driver's license, or national ID
2. **Proof of Address**: Utility bill or bank statement
3. **Selfie**: Photo with ID for verification
4. **Business Documents** (Enterprise only):
   - Certificate of incorporation
   - Business license
   - Tax identification

#### Step 4: Verification Review
1. Submit for review
2. Wait for approval (24-48 hours)
3. Receive notification of status
4. Appeal if rejected

### KYC Levels and Benefits

#### Basic Level
- **Requirements**: Email + phone verification
- **Limits**: $1,000 daily, $10,000 monthly
- **Features**: Basic NFT minting, staking

#### Verified Level
- **Requirements**: Government ID + address
- **Limits**: $10,000 daily, $100,000 monthly
- **Features**: Full platform access, higher limits

#### Enterprise Level
- **Requirements**: Business documentation
- **Limits**: Custom limits based on business
- **Features**: API access, custom integrations

## NFT Operations

### Understanding NFTs on AGROTM

#### NFT Categories
- **Farm Land**: Agricultural land parcels
- **Crop Token**: Tokenized crop yields
- **Equipment**: Farming machinery and tools
- **Harvest**: Harvested crops and produce
- **Certificate**: Quality and compliance certificates
- **Insurance**: Crop and farm insurance policies
- **Yield Bond**: Yield-based financial instruments
- **Carbon Credit**: Carbon sequestration credits

#### NFT Rarity Levels
- **Common**: 50% probability
- **Uncommon**: 25% probability
- **Rare**: 15% probability
- **Epic**: 7% probability
- **Legendary**: 2.5% probability
- **Mythic**: 0.5% probability

### Minting NFTs

#### Step 1: Prepare Assets
1. **Image**: High-quality image (PNG, JPG, GIF)
   - Minimum: 512x512 pixels
   - Maximum: 10MB
   - Format: PNG, JPG, GIF, MP4
2. **Metadata**: NFT information
   - Name and description
   - Attributes and traits
   - Category and rarity
3. **Farm Data** (for agricultural NFTs):
   - Location and coordinates
   - Crop type and variety
   - Expected yield and harvest date
   - Quality metrics

#### Step 2: Create NFT
1. Navigate to "Create" → "Mint NFT"
2. Upload image or video
3. Fill in metadata:
   ```json
   {
     "name": "Premium Corn Field #001",
     "description": "High-yield corn field in Iowa",
     "category": "Farm Land",
     "rarity": "Rare",
     "attributes": [
       {"trait_type": "Soil Type", "value": "Loam"},
       {"trait_type": "Irrigation", "value": "Drip"},
       {"trait_type": "Organic", "value": "Yes"}
     ],
     "farmData": {
       "location": "Iowa, USA",
       "cropType": "Corn",
       "harvestDate": "2024-10-15",
       "yield": "150 tons"
     }
   }
   ```
4. Set supply (1 for unique, >1 for collection)
5. Set initial price (optional)

#### Step 3: Mint on Blockchain
1. Review all information
2. Calculate gas fees
3. Approve transaction in wallet
4. Wait for blockchain confirmation
5. Receive NFT in your wallet

### NFT Management

#### Viewing Your NFTs
1. Navigate to "My NFTs"
2. Filter by:
   - Category
   - Rarity
   - Status (owned, listed, staked)
3. View detailed information
4. Access NFT actions

#### Listing for Sale
1. Select NFT from collection
2. Click "List for Sale"
3. Set price in ETH/MATIC/SOL
4. Choose listing duration
5. Pay listing fee
6. Confirm transaction

#### Transferring NFTs
1. Select NFT
2. Click "Transfer"
3. Enter recipient address
4. Confirm transfer
5. Pay gas fees

### NFT Marketplace

#### Browsing NFTs
1. Navigate to "Marketplace"
2. Use filters:
   - Category
   - Price range
   - Rarity
   - Creator
   - Collection
3. Sort by:
   - Price (low to high)
   - Price (high to low)
   - Recently listed
   - Most popular

#### Buying NFTs
1. Select desired NFT
2. Review details and price
3. Click "Buy Now"
4. Approve transaction
5. Wait for confirmation
6. NFT transferred to your wallet

#### Bidding on NFTs
1. Select NFT with auction
2. Enter bid amount
3. Set bid duration
4. Approve transaction
5. Monitor auction status
6. Win or lose auction

## Staking & Yield Farming

### Understanding Staking

#### Staking Pools
- **AGROTM Token Pool**: Stake AGROTM tokens
- **LP Token Pools**: Stake liquidity provider tokens
- **NFT Staking**: Stake NFTs for rewards
- **Yield Farming**: Earn additional tokens

#### APY Rates
- **AGROTM Pool**: 8-15% APY
- **LP Pools**: 12-25% APY
- **NFT Staking**: 5-20% APY
- **Yield Farming**: 15-40% APY

### Staking Process

#### Step 1: Choose Pool
1. Navigate to "Staking"
2. Browse available pools
3. Compare APY rates
4. Check lock periods
5. Review pool details

#### Step 2: Stake Tokens
1. Select desired pool
2. Enter amount to stake
3. Review terms:
   - Lock period
   - Early withdrawal fee
   - Reward distribution
4. Approve token spending
5. Confirm stake transaction

#### Step 3: Monitor Rewards
1. View staking dashboard
2. Track earned rewards
3. Monitor APY changes
4. Check lock period status

### Yield Farming

#### Liquidity Provision
1. Navigate to "DeFi" → "Liquidity"
2. Select token pair
3. Add equal value of both tokens
4. Receive LP tokens
5. Stake LP tokens for farming rewards

#### Farming Strategies
- **Stable Pairs**: Lower risk, lower rewards
- **Volatile Pairs**: Higher risk, higher rewards
- **Single Asset**: Stake single tokens
- **Leveraged Farming**: Use borrowed assets

### Unstaking Process

#### Regular Unstaking
1. Navigate to staking position
2. Click "Unstake"
3. Enter amount to unstake
4. Confirm transaction
5. Receive tokens back

#### Emergency Unstaking
1. Available for emergency situations
2. Higher withdrawal fees (5-10%)
3. Reduced rewards
4. Immediate processing

## DeFi Operations

### Token Swapping

#### Basic Swap
1. Navigate to "Swap"
2. Select input token
3. Select output token
4. Enter amount
5. Review:
   - Exchange rate
   - Slippage tolerance
   - Gas fees
6. Confirm swap

#### Advanced Swap
1. Enable advanced features
2. Set custom slippage
3. Use limit orders
4. Enable multi-hop routing
5. Optimize for gas efficiency

### Liquidity Provision

#### Adding Liquidity
1. Navigate to "Liquidity" → "Add"
2. Select token pair
3. Enter amounts:
   - Equal value required
   - Price impact shown
4. Approve token spending
5. Confirm transaction
6. Receive LP tokens

#### Removing Liquidity
1. Select LP position
2. Enter percentage to remove
3. Review:
   - Token amounts
   - Price impact
   - Impermanent loss
4. Confirm removal

### Lending & Borrowing

#### Lending Assets
1. Navigate to "Lending"
2. Select asset to lend
3. Enter amount
4. Review:
   - Interest rate
   - Utilization rate
   - Risk level
5. Approve transaction
6. Start earning interest

#### Borrowing Assets
1. Navigate to "Borrowing"
2. Select asset to borrow
3. Provide collateral
4. Review:
   - Collateral ratio
   - Interest rate
   - Liquidation threshold
5. Confirm borrowing

### Risk Management

#### Impermanent Loss
- **Definition**: Loss from providing liquidity
- **Calculation**: Based on price changes
- **Mitigation**: Stable pairs, short-term positions

#### Liquidation Risk
- **Triggers**: Low collateral ratio
- **Prevention**: Monitor positions
- **Recovery**: Add collateral or repay debt

## Governance

### Understanding Governance

#### Governance Tokens
- **AGROTM**: Primary governance token
- **Voting Power**: Based on token balance
- **Delegation**: Delegate voting power to others
- **Proposals**: Submit and vote on proposals

#### Proposal Types
- **Protocol Changes**: Smart contract upgrades
- **Parameter Changes**: Fee adjustments, limits
- **Treasury Management**: Fund allocation
- **Community Initiatives**: Marketing, partnerships

### Participating in Governance

#### Voting Process
1. Navigate to "Governance"
2. Browse active proposals
3. Read proposal details
4. Review arguments for/against
5. Cast your vote:
   - **For**: Support the proposal
   - **Against**: Oppose the proposal
   - **Abstain**: No preference

#### Creating Proposals
1. Ensure minimum token requirement
2. Draft proposal with:
   - Clear title and description
   - Technical specifications
   - Implementation timeline
   - Budget requirements
3. Submit for community review
4. Gather support and feedback
5. Submit final proposal

#### Delegation
1. Choose delegate
2. Review delegate's:
   - Voting history
   - Alignment with your views
   - Activity level
3. Delegate voting power
4. Monitor delegate's votes
5. Revoke delegation if needed

## Analytics & Reporting

### Portfolio Analytics

#### Portfolio Overview
- **Total Value**: Combined asset value
- **Asset Allocation**: Token distribution
- **Performance**: Historical returns
- **Risk Metrics**: Volatility, Sharpe ratio

#### Performance Tracking
1. Navigate to "Analytics"
2. Select time period
3. View metrics:
   - Total return
   - Annualized return
   - Best/worst performers
   - Correlation analysis

### Transaction History

#### Viewing Transactions
1. Navigate to "Transactions"
2. Filter by:
   - Transaction type
   - Date range
   - Token/asset
   - Status
3. Export data for tax purposes

#### Transaction Details
- **Transaction Hash**: Blockchain reference
- **Block Number**: Confirmation details
- **Gas Fees**: Transaction costs
- **Status**: Confirmed, pending, failed

### Tax Reporting

#### Export Data
1. Navigate to "Reports"
2. Select tax year
3. Choose format:
   - CSV for spreadsheets
   - PDF for documentation
   - API for integration
4. Download report

#### Tax Categories
- **Capital Gains**: Asset sales
- **Staking Rewards**: Income from staking
- **Yield Farming**: Farming rewards
- **NFT Sales**: NFT trading profits

## Security Best Practices

### Wallet Security

#### Private Key Management
- **Never share**: Keep private keys secret
- **Backup securely**: Use hardware wallets
- **Multiple wallets**: Separate hot/cold storage
- **Regular updates**: Keep wallet software updated

#### Transaction Security
- **Verify addresses**: Double-check recipient addresses
- **Review transactions**: Confirm all details
- **Gas fees**: Understand and set appropriate fees
- **Network selection**: Ensure correct network

### Platform Security

#### Account Security
- **Strong passwords**: Use unique, complex passwords
- **Two-factor authentication**: Enable 2FA
- **Email verification**: Verify email addresses
- **Session management**: Log out from shared devices

#### Phishing Prevention
- **Verify URLs**: Check website addresses
- **Official channels**: Use official communication
- **Suspicious links**: Avoid clicking unknown links
- **Report scams**: Report suspicious activity

### Smart Contract Security

#### Contract Verification
- **Audit reports**: Review security audits
- **Open source**: Prefer open-source contracts
- **Community review**: Check community feedback
- **Bug bounties**: Look for active bug bounties

#### Risk Assessment
- **TVL**: Total value locked
- **Age**: Contract maturity
- **Developer activity**: Ongoing development
- **Community size**: User base and activity

## Troubleshooting

### Common Issues

#### Wallet Connection Problems
**Problem**: Wallet won't connect
**Solutions**:
1. Refresh the page
2. Clear browser cache
3. Check wallet extension
4. Try different browser
5. Update wallet software

#### Transaction Failures
**Problem**: Transactions failing
**Solutions**:
1. Check network congestion
2. Increase gas fees
3. Verify sufficient balance
4. Check slippage tolerance
5. Try smaller amounts

#### KYC Issues
**Problem**: KYC verification failed
**Solutions**:
1. Ensure document quality
2. Check document validity
3. Verify information accuracy
4. Contact support
5. Resubmit with corrections

### Error Messages

#### "Insufficient Balance"
- Check wallet balance
- Include gas fees
- Verify token approval

#### "Transaction Reverted"
- Check contract state
- Verify parameters
- Review error logs

#### "Network Error"
- Check internet connection
- Try different RPC endpoint
- Wait and retry

### Getting Help

#### Support Channels
- **Help Center**: [help.agrotm.com](https://help.agrotm.com)
- **Email Support**: support@agrotm.com
- **Live Chat**: Available on website
- **Community**: [community.agrotm.com](https://community.agrotm.com)
- **Discord**: [discord.gg/agrotm](https://discord.gg/agrotm)

#### Documentation
- **API Docs**: [docs.agrotm.com](https://docs.agrotm.com)
- **Developer Guide**: [dev.agrotm.com](https://dev.agrotm.com)
- **Video Tutorials**: [youtube.com/agrotm](https://youtube.com/agrotm)

## API Reference

### Authentication

#### API Keys
```bash
# Get API key from dashboard
curl -X POST https://api.agrotm.com/auth/api-key \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Rate Limits
- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

### Core Endpoints

#### User Management
```bash
# Get user profile
GET /api/v1/user/profile

# Update profile
PUT /api/v1/user/profile

# Get KYC status
GET /api/v1/user/kyc/status
```

#### NFT Operations
```bash
# List NFTs
GET /api/v1/nfts?category=farm_land&rarity=rare

# Mint NFT
POST /api/v1/nfts
{
  "name": "Farm Land #001",
  "description": "Premium agricultural land",
  "category": "farm_land",
  "rarity": "rare",
  "attributes": [...],
  "image": "ipfs://..."
}

# Get NFT details
GET /api/v1/nfts/{tokenId}
```

#### Staking Operations
```bash
# Get staking pools
GET /api/v1/staking/pools

# Stake tokens
POST /api/v1/staking/stake
{
  "poolId": "pool_123",
  "amount": "1000",
  "token": "AGROTM"
}

# Get staking positions
GET /api/v1/staking/positions
```

#### DeFi Operations
```bash
# Get token prices
GET /api/v1/defi/prices

# Swap tokens
POST /api/v1/defi/swap
{
  "fromToken": "AGROTM",
  "toToken": "ETH",
  "amount": "100",
  "slippage": 0.5
}

# Get liquidity pools
GET /api/v1/defi/pools
```

### WebSocket API

#### Real-time Data
```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api.agrotm.com/ws');

// Subscribe to price updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'prices',
  tokens: ['AGROTM', 'ETH']
}));

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
};
```

### SDK Integration

#### JavaScript SDK
```javascript
import { AGROTMClient } from '@agrotm/sdk';

const client = new AGROTMClient({
  apiKey: 'your_api_key',
  network: 'mainnet'
});

// Mint NFT
const nft = await client.nfts.mint({
  name: 'Farm Land',
  description: 'Agricultural land',
  category: 'farm_land',
  image: 'ipfs://...'
});

// Stake tokens
const position = await client.staking.stake({
  poolId: 'pool_123',
  amount: '1000'
});
```

#### Python SDK
```python
from agrotm import AGROTMClient

client = AGROTMClient(
    api_key="your_api_key",
    network="mainnet"
)

# Get user profile
profile = client.user.get_profile()

# List NFTs
nfts = client.nfts.list(category="farm_land")
```

This comprehensive usage guide provides all the information needed to effectively use the AGROTM platform, from basic operations to advanced features and troubleshooting. 