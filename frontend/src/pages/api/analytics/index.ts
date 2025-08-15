import type { NextApiRequest, NextApiResponse } from 'next'

type AnalyticsResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse>
) {
  if (req.method === 'GET') {
    // Obter dados de analytics
    return res.status(200).json({
      success: true,
      message: 'Dados de analytics obtidos com sucesso',
      data: {
        userGrowth: {
          monthly: [1200, 1250, 1300, 1350, 1400, 1450],
          labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        transactionVolume: {
          daily: [50000, 55000, 60000, 65000, 70000, 75000, 80000],
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        },
        topProducts: [
          { name: 'Sementes de Soja', sales: 1500, revenue: '225K AGRO' },
          { name: 'Fertilizante Orgânico', sales: 1200, revenue: '96K AGRO' },
          { name: 'Pulverizador', sales: 25, revenue: '62.5K AGRO' }
        ],
        geographicData: [
          { region: 'Sudeste', users: 450, volume: '1.2M AGRO' },
          { region: 'Sul', users: 380, volume: '800K AGRO' },
          { region: 'Centro-Oeste', users: 320, volume: '500K AGRO' }
        ]
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
