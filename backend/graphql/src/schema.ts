import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(limit: Int = 10, offset: Int = 0): [User!]!
    
    # Portfolio queries
    portfolio(id: ID!): Portfolio
    portfolios(userId: ID, limit: Int = 10, offset: Int = 0): [Portfolio!]!
    
    # Staking queries
    stakingPool(id: ID!): StakingPool
    stakingPools(limit: Int = 10, offset: Int = 0): [StakingPool!]!
    userStakes(userId: ID!): [UserStake!]!
    
    # Analytics queries
    analytics: Analytics!
    portfolioAnalytics(portfolioId: ID!): PortfolioAnalytics!
    performanceMetrics(timeframe: Timeframe = DAY): PerformanceMetrics!
    marketData(symbol: String!): MarketData!
    
    # NFT queries
    nft(id: ID!): NFT
    nfts(ownerId: ID, limit: Int = 10, offset: Int = 0): [NFT!]!
    nftCollection(id: ID!): NFTCollection
    nftCollections: [NFTCollection!]!
  }

  type Mutation {
    # User mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    
    # Portfolio mutations
    createPortfolio(input: CreatePortfolioInput!): Portfolio!
    updatePortfolio(id: ID!, input: UpdatePortfolioInput!): Portfolio!
    deletePortfolio(id: ID!): Boolean!
    
    # Staking mutations
    createStakingPool(input: CreateStakingPoolInput!): StakingPool!
    stake(input: StakeInput!): UserStake!
    unstake(input: UnstakeInput!): UserStake!
    claimRewards(stakeId: ID!): ClaimRewardsPayload!
    
    # NFT mutations
    mintNFT(input: MintNFTInput!): NFT!
    transferNFT(input: TransferNFTInput!): NFT!
  }

  type Subscription {
    # Real-time subscriptions
    portfolioUpdated(portfolioId: ID!): Portfolio!
    stakingPoolUpdated(poolId: ID!): StakingPool!
    marketDataUpdated(symbol: String!): MarketData!
    userStakeUpdated(userId: ID!): UserStake!
  }

  # User types
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    avatar: String
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    portfolios: [Portfolio!]!
    stakes: [UserStake!]!
    nfts: [NFT!]!
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    firstName: String
    lastName: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    avatar: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Portfolio types
  type Portfolio {
    id: ID!
    name: String!
    description: String
    userId: ID!
    user: User!
    totalValue: Float!
    totalChange: Float!
    totalChangePercent: Float!
    assets: [PortfolioAsset!]!
    transactions: [Transaction!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PortfolioAsset {
    id: ID!
    symbol: String!
    name: String!
    quantity: Float!
    currentPrice: Float!
    totalValue: Float!
    change24h: Float!
    changePercent24h: Float!
  }

  type Transaction {
    id: ID!
    type: TransactionType!
    symbol: String!
    quantity: Float!
    price: Float!
    total: Float!
    timestamp: DateTime!
  }

  enum TransactionType {
    BUY
    SELL
    STAKE
    UNSTAKE
    CLAIM
  }

  input CreatePortfolioInput {
    name: String!
    description: String
  }

  input UpdatePortfolioInput {
    name: String
    description: String
  }

  # Staking types
  type StakingPool {
    id: ID!
    name: String!
    description: String!
    tokenSymbol: String!
    tokenAddress: String!
    totalStaked: Float!
    totalRewards: Float!
    apr: Float!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    stakes: [UserStake!]!
  }

  type UserStake {
    id: ID!
    userId: ID!
    user: User!
    poolId: ID!
    pool: StakingPool!
    amount: Float!
    rewards: Float!
    stakedAt: DateTime!
    lastClaim: DateTime
    isActive: Boolean!
  }

  input CreateStakingPoolInput {
    name: String!
    description: String!
    tokenSymbol: String!
    tokenAddress: String!
    apr: Float!
  }

  input StakeInput {
    poolId: ID!
    amount: Float!
  }

  input UnstakeInput {
    stakeId: ID!
    amount: Float!
  }

  type ClaimRewardsPayload {
    success: Boolean!
    amount: Float!
    stake: UserStake!
  }

  # Analytics types
  type Analytics {
    totalUsers: Int!
    totalPortfolios: Int!
    totalStaked: Float!
    totalVolume: Float!
    activeStakingPools: Int!
    topPerformers: [TopPerformer!]!
    recentTransactions: [Transaction!]!
  }

  type PortfolioAnalytics {
    portfolioId: ID!
    totalValue: Float!
    totalChange: Float!
    totalChangePercent: Float!
    performanceHistory: [PerformancePoint!]!
    assetAllocation: [AssetAllocation!]!
    riskMetrics: RiskMetrics!
  }

  type PerformancePoint {
    timestamp: DateTime!
    value: Float!
    change: Float!
  }

  type AssetAllocation {
    symbol: String!
    percentage: Float!
    value: Float!
  }

  type RiskMetrics {
    volatility: Float!
    sharpeRatio: Float!
    maxDrawdown: Float!
    beta: Float!
  }

  type PerformanceMetrics {
    timeframe: Timeframe!
    totalReturn: Float!
    annualizedReturn: Float!
    volatility: Float!
    sharpeRatio: Float!
    maxDrawdown: Float!
    winRate: Float!
  }

  enum Timeframe {
    HOUR
    DAY
    WEEK
    MONTH
    YEAR
  }

  # Market data types
  type MarketData {
    symbol: String!
    price: Float!
    change24h: Float!
    changePercent24h: Float!
    volume24h: Float!
    marketCap: Float!
    high24h: Float!
    low24h: Float!
    updatedAt: DateTime!
  }

  # NFT types
  type NFT {
    id: ID!
    tokenId: String!
    name: String!
    description: String
    image: String!
    metadata: JSON!
    ownerId: ID!
    owner: User!
    collectionId: ID!
    collection: NFTCollection!
    mintedAt: DateTime!
    lastTransferredAt: DateTime
  }

  type NFTCollection {
    id: ID!
    name: String!
    description: String
    symbol: String!
    contractAddress: String!
    totalSupply: Int!
    floorPrice: Float
    volume24h: Float
    nfts: [NFT!]!
  }

  input MintNFTInput {
    collectionId: ID!
    name: String!
    description: String
    image: String!
    metadata: JSON!
  }

  input TransferNFTInput {
    nftId: ID!
    toUserId: ID!
  }
`; 