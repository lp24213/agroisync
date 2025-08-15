import type { NextApiRequest, NextApiResponse } from 'next'

type NFTResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NFTResponse>
) {
  if (req.method === 'GET') {
    // Obter NFTs
    return res.status(200).json({
      success: true,
      message: 'NFTs obtidos com sucesso',
      data: {
        nfts: [
          {
            id: 'nft-1',
            name: 'AgroSync Farm #1',
            description: 'Fazenda tokenizada com 100 hectares',
            image: '/images/farm-1.jpg',
            price: '10,000 AGRO',
            owner: '0x1234...5678',
            metadata: {
              hectares: 100,
              location: 'São Paulo, Brasil',
              cropType: 'Soja'
            }
          },
          {
            id: 'nft-2',
            name: 'AgroSync Equipment #1',
            description: 'Trator John Deere 8R 410',
            image: '/images/tractor-1.jpg',
            price: '5,000 AGRO',
            owner: '0x8765...4321',
            metadata: {
              brand: 'John Deere',
              model: '8R 410',
              year: 2023
            }
          }
        ]
      }
    })
  }

  if (req.method === 'POST') {
    // Criar NFT
    const { name, description, price, metadata } = req.body

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'NFT criado com sucesso',
      data: {
        nftId: 'nft-new-123',
        name,
        description,
        price,
        metadata,
        timestamp: new Date().toISOString()
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
