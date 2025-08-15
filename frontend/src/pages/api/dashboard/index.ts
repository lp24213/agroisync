import type { NextApiRequest, NextApiResponse } from 'next'

type DashboardResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse>
) {
  if (req.method === 'GET') {
    // Obter dados do dashboard
    return res.status(200).json({
      success: true,
      message: 'Dados do dashboard obtidos com sucesso',
      data: {
        overview: {
          totalUsers: 1250,
          totalTransactions: 5678,
          totalVolume: '2.5M AGRO',
          activeStakes: 89
        },
        recentTransactions: [
          {
            id: 'tx-1',
            type: 'Stake',
            amount: '500 AGRO',
            user: '0x1234...5678',
            timestamp: '2024-01-15T10:30:00Z'
          },
          {
            id: 'tx-2',
            type: 'NFT Purchase',
            amount: '10,000 AGRO',
            user: '0x8765...4321',
            timestamp: '2024-01-15T09:15:00Z'
          }
        ],
        marketStats: {
          agrotokenPrice: '0.85 USD',
          marketCap: '8.5M USD',
          volume24h: '250K USD',
          priceChange24h: '+5.2%'
        },
        topStakers: [
          {
            address: '0x1234...5678',
            stakedAmount: '50,000 AGRO',
            rewards: '2,500 AGRO'
          },
          {
            address: '0x8765...4321',
            stakedAmount: '35,000 AGRO',
            rewards: '1,750 AGRO'
          }
        ]
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
