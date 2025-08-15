import type { NextApiRequest, NextApiResponse } from 'next'

type MarketplaceResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarketplaceResponse>
) {
  if (req.method === 'GET') {
    // Obter produtos do marketplace
    return res.status(200).json({
      success: true,
      message: 'Produtos do marketplace obtidos com sucesso',
      data: {
        products: [
          {
            id: 'prod-1',
            name: 'Sementes de Soja Premium',
            category: 'Sementes',
            price: '150 AGRO',
            description: 'Sementes de soja de alta qualidade',
            seller: 'AgroTech Brasil',
            rating: 4.8,
            stock: 1000
          },
          {
            id: 'prod-2',
            name: 'Fertilizante Orgânico',
            category: 'Fertilizantes',
            price: '80 AGRO',
            description: 'Fertilizante 100% orgânico',
            seller: 'EcoFert',
            rating: 4.6,
            stock: 500
          },
          {
            id: 'prod-3',
            name: 'Pulverizador Automático',
            category: 'Equipamentos',
            price: '2,500 AGRO',
            description: 'Pulverizador com GPS integrado',
            seller: 'AgroEquip',
            rating: 4.9,
            stock: 25
          }
        ],
        categories: ['Sementes', 'Fertilizantes', 'Equipamentos', 'Pesticidas', 'Maquinário']
      }
    })
  }

  if (req.method === 'POST') {
    // Criar produto
    const { name, category, price, description, seller } = req.body

    if (!name || !category || !price || !description || !seller) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: {
        productId: 'prod-new-123',
        name,
        category,
        price,
        description,
        seller,
        timestamp: new Date().toISOString()
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
