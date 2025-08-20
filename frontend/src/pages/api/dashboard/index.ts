import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

type CryptoAsset = {
  _id?: string
  symbol: string
  name: string
  price: number
  change24h: number
  change7d: number
  balance: number
  value: number
  icon: string
  userId: string
  updatedAt: Date
}

type StakingPool = {
  _id?: string
  name: string
  apy: number
  tvl: number
  stakedTokens: number
  rewards: number
  lockPeriod: number
  status: 'active' | 'locked' | 'completed'
  userId: string
  createdAt: Date
}

type Transaction = {
  _id?: string
  type: 'buy' | 'sell' | 'stake' | 'unstake' | 'reward' | 'transfer'
  asset: string
  amount: number
  value: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  hash?: string
  userId: string
  createdAt: Date
}

type DashboardData = {
  portfolioValue: number
  totalRewards: number
  totalYield: number
  monthlyPerformance: number
  annualPerformance: number
  cryptoAssets: CryptoAsset[]
  stakingPools: StakingPool[]
  recentTransactions: Transaction[]
}

type DashboardResponse = {
  success: boolean
  message: string
  data?: DashboardData
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse>
) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      // Parâmetros de query
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        })
      }

      // Buscar ativos de criptomoedas
      const cryptoCollection = db.collection('crypto_assets')
      const cryptoAssets = await cryptoCollection
        .find({ userId: userId.toString() })
        .sort({ updatedAt: -1 })
        .limit(10)
        .toArray()

      // Buscar pools de staking
      const stakingCollection = db.collection('staking_pools')
      const stakingPools = await stakingCollection
        .find({ userId: userId.toString() })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()

      // Buscar transações recentes
      const transactionsCollection = db.collection('transactions')
      const recentTransactions = await transactionsCollection
        .find({ userId: userId.toString() })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray()

      // Calcular métricas
      const portfolioValue = cryptoAssets.reduce((sum, asset) => sum + asset.value, 0)
      const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0)
      const totalYield = stakingPools.reduce((sum, pool) => {
        const poolValue = (pool.stakedTokens / 100) * (pool.tvl / 1000000) * 1000
        return sum + (poolValue * pool.apy / 100)
      }, 0)

      // Calcular performance (simulado para demonstração)
      const monthlyPerformance = 8.5
      const annualPerformance = 42.3

      // Formatar dados
      const formattedCryptoAssets = cryptoAssets.map(asset => ({
        id: asset._id?.toString() || '',
        symbol: asset.symbol,
        name: asset.name,
        price: asset.price,
        change24h: asset.change24h,
        change7d: asset.change7d,
        balance: asset.balance,
        value: asset.value,
        icon: asset.icon,
        userId: asset.userId,
        updatedAt: asset.updatedAt
      }))

      const formattedStakingPools = stakingPools.map(pool => ({
        id: pool._id?.toString() || '',
        name: pool.name,
        apy: pool.apy,
        tvl: pool.tvl,
        stakedTokens: pool.stakedTokens,
        rewards: pool.rewards,
        lockPeriod: pool.lockPeriod,
        status: pool.status,
        userId: pool.userId,
        createdAt: pool.createdAt
      }))

      const formattedTransactions = recentTransactions.map(tx => ({
        id: tx._id?.toString() || '',
        type: tx.type,
        asset: tx.asset,
        amount: tx.amount,
        value: tx.value,
        timestamp: tx.timestamp,
        status: tx.status,
        hash: tx.hash,
        userId: tx.userId,
        createdAt: tx.createdAt
      }))

      const dashboardData: DashboardData = {
        portfolioValue,
        totalRewards,
        totalYield,
        monthlyPerformance,
        annualPerformance,
        cryptoAssets: formattedCryptoAssets,
        stakingPools: formattedStakingPools,
        recentTransactions: formattedTransactions
      }

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Dados do dashboard carregados com sucesso',
        data: dashboardData
      })

    } catch (error: any) {
      console.error('Erro na API de dashboard:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const { type, data, userId } = req.body

      if (!type || !data || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      let result: any

      switch (type) {
        case 'crypto_asset':
          const cryptoCollection = db.collection('crypto_assets')
          result = await cryptoCollection.insertOne({
            ...data,
            userId,
            updatedAt: new Date()
          })
          break

        case 'staking_pool':
          const stakingCollection = db.collection('staking_pools')
          result = await stakingCollection.insertOne({
            ...data,
            userId,
            createdAt: new Date()
          })
          break

        case 'transaction':
          const transactionsCollection = db.collection('transactions')
          result = await transactionsCollection.insertOne({
            ...data,
            userId,
            createdAt: new Date()
          })
          break

        default:
          return res.status(400).json({
            success: false,
            message: 'Tipo de dado inválido'
          })
      }

      await client.close()

      return res.status(201).json({
        success: true,
        message: 'Dado criado com sucesso',

      })

    } catch (error: any) {
      console.error('Erro ao criar dado do dashboard:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
