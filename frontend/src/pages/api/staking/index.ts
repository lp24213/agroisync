import type { NextApiRequest, NextApiResponse } from 'next'

type StakingResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StakingResponse>
) {
  if (req.method === 'GET') {
    // Obter pools de staking
    return res.status(200).json({
      success: true,
      message: 'Pools de staking obtidos com sucesso',
      data: {
        pools: [
          {
            id: 'pool-1',
            name: 'AGRO Token Staking',
            apy: '12.5%',
            totalStaked: '1,000,000 AGRO',
            minStake: '100 AGRO'
          },
          {
            id: 'pool-2',
            name: 'Liquidity Provider',
            apy: '18.2%',
            totalStaked: '500,000 AGRO',
            minStake: '500 AGRO'
          }
        ]
      }
    })
  }

  if (req.method === 'POST') {
    // Criar stake
    const { amount, poolId, walletAddress } = req.body

    if (!amount || !poolId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Stake criado com sucesso',
      data: {
        stakeId: 'stake-123',
        amount,
        poolId,
        walletAddress,
        timestamp: new Date().toISOString()
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
