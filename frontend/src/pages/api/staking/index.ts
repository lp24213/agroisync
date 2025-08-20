import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

type StakingPool = {
  _id?: string
  name: string
  description: string
  apy: number
  tvl: number
  minStake: number
  maxStake: number
  lockPeriod: number
  totalStaked: number
  userStaked: number
  userRewards: number
  status: 'active' | 'locked' | 'completed'
  risk: 'low' | 'medium' | 'high'
  features: string[]
  icon: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

type StakingHistory = {
  _id?: string
  type: 'stake' | 'unstake' | 'claim'
  amount: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
  pool: string
  userId: string
  createdAt: Date
}

type StakingData = {
  totalStaked: number
  totalRewards: number
  activePools: number
  stakingPools: StakingPool[]
  stakingHistory: StakingHistory[]
}

type StakingResponse = {
  success: boolean
  message: string
  data?: StakingData
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StakingResponse>
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

      // Buscar pools de staking
      const poolsCollection = db.collection('staking_pools')
      const stakingPools = await poolsCollection
        .find({ userId: userId.toString() })
        .sort({ createdAt: -1 })
        .toArray()

      // Buscar histórico de staking
      const historyCollection = db.collection('staking_history')
      const stakingHistory = await historyCollection
        .find({ userId: userId.toString() })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray()

      // Calcular métricas
      const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0)
      const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.userRewards, 0)
      const activePools = stakingPools.filter(pool => pool.status === 'active').length

      // Formatar dados
      const formattedPools = stakingPools.map(pool => ({
        id: pool._id?.toString() || '',
        name: pool.name,
        description: pool.description,
        apy: pool.apy,
        tvl: pool.tvl,
        minStake: pool.minStake,
        maxStake: pool.maxStake,
        lockPeriod: pool.lockPeriod,
        totalStaked: pool.totalStaked,
        userStaked: pool.userStaked,
        userRewards: pool.userRewards,
        status: pool.status,
        risk: pool.risk,
        features: pool.features,
        icon: pool.icon,
        userId: pool.userId,
        createdAt: pool.createdAt,
        updatedAt: pool.updatedAt
      }))

      const formattedHistory = stakingHistory.map(history => ({
        id: history._id?.toString() || '',
        type: history.type,
        amount: history.amount,
        timestamp: history.timestamp,
        status: history.status,
        txHash: history.txHash,
        pool: history.pool,
        userId: history.userId,
        createdAt: history.createdAt
      }))

      const stakingData: StakingData = {
        totalStaked,
        totalRewards,
        activePools,
        stakingPools: formattedPools,
        stakingHistory: formattedHistory
      }

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Dados de staking carregados com sucesso',
        data: stakingData
      })

    } catch (error: any) {
      console.error('Erro na API de staking:', error)
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

      const { action, data, userId } = req.body

      if (!action || !data || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      let result: any

      switch (action) {
        case 'stake':
          // Atualizar pool de staking
          const poolsCollection = db.collection('staking_pools')
          const pool = await poolsCollection.findOne({ 
            _id: new ObjectId(data.poolId),
            userId: userId.toString()
          })

          if (!pool) {
            return res.status(404).json({
              success: false,
              message: 'Pool de staking não encontrado'
            })
          }

          // Atualizar valores
          await poolsCollection.updateOne(
            { _id: new ObjectId(data.poolId) },
            {
              $inc: {
                userStaked: data.amount,
                totalStaked: data.amount
              },
              $set: { updatedAt: new Date() }
            }
          )

          // Registrar histórico
          const historyCollection = db.collection('staking_history')
          result = await historyCollection.insertOne({
            type: 'stake',
            amount: data.amount,
            timestamp: new Date(),
            status: 'completed',
            pool: pool.name,
            userId,
            createdAt: new Date()
          })
          break

        case 'unstake':
          // Atualizar pool de staking
          const poolsCollectionUnstake = db.collection('staking_pools')
          const poolUnstake = await poolsCollectionUnstake.findOne({ 
            _id: new ObjectId(data.poolId),
            userId: userId.toString()
          })

          if (!poolUnstake) {
            return res.status(404).json({
              success: false,
              message: 'Pool de staking não encontrado'
            })
          }

          if (poolUnstake.userStaked < data.amount) {
            return res.status(400).json({
              success: false,
              message: 'Valor para unstake maior que o staked'
            })
          }

          // Atualizar valores
          await poolsCollectionUnstake.updateOne(
            { _id: new ObjectId(data.poolId) },
            {
              $inc: {
                userStaked: -data.amount,
                totalStaked: -data.amount
              },
              $set: { updatedAt: new Date() }
            }
          )

          // Registrar histórico
          const historyCollectionUnstake = db.collection('staking_history')
          result = await historyCollectionUnstake.insertOne({
            type: 'unstake',
            amount: data.amount,
            timestamp: new Date(),
            status: 'completed',
            pool: poolUnstake.name,
            userId,
            createdAt: new Date()
          })
          break

        case 'claim':
          // Buscar pool para claim
          const poolsCollectionClaim = db.collection('staking_pools')
          const poolClaim = await poolsCollectionClaim.findOne({ 
            _id: new ObjectId(data.poolId),
            userId: userId.toString()
          })

          if (!poolClaim) {
            return res.status(404).json({
              success: false,
              message: 'Pool de staking não encontrado'
            })
          }

          if (poolClaim.userRewards <= 0) {
            return res.status(400).json({
              success: false,
              message: 'Não há recompensas para claim'
            })
          }

          // Zerar recompensas
          await poolsCollectionClaim.updateOne(
            { _id: new ObjectId(data.poolId) },
            {
              $set: {
                userRewards: 0,
                updatedAt: new Date()
              }
            }
          )

          // Registrar histórico
          const historyCollectionClaim = db.collection('staking_history')
          result = await historyCollectionClaim.insertOne({
            type: 'claim',
            amount: poolClaim.userRewards,
            timestamp: new Date(),
            status: 'completed',
            pool: poolClaim.name,
            userId,
            createdAt: new Date()
          })
          break

        default:
          return res.status(400).json({
            success: false,
            message: 'Ação inválida'
          })
      }

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Ação executada com sucesso',

      })

    } catch (error: any) {
      console.error('Erro ao executar ação de staking:', error)
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
