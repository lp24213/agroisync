import type { NextApiRequest, NextApiResponse } from 'next'

type UserResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method === 'GET') {
    // Obter usuários
    return res.status(200).json({
      success: true,
      message: 'Usuários obtidos com sucesso',
      data: {
        users: [
          {
            id: 'user-1',
            email: 'joao@email.com',
            name: 'João Silva',
            walletAddress: '0x1234...5678',
            joinDate: '2024-01-01T00:00:00Z',
            status: 'active',
            totalStaked: '5000 AGRO',
            totalRewards: '250 AGRO'
          },
          {
            id: 'user-2',
            email: 'maria@email.com',
            name: 'Maria Santos',
            walletAddress: '0x8765...4321',
            joinDate: '2024-01-05T00:00:00Z',
            status: 'active',
            totalStaked: '3000 AGRO',
            totalRewards: '150 AGRO'
          }
        ],
        totalUsers: 1250,
        activeUsers: 1180,
        newUsersThisMonth: 45
      }
    })
  }

  if (req.method === 'POST') {
    // Criar usuário
    const { email, name, walletAddress } = req.body

    if (!email || !name || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      })
    }

    const newUser = {
      id: 'user-new-123',
      email,
      name,
      walletAddress,
      joinDate: new Date().toISOString(),
      status: 'active',
      totalStaked: '0 AGRO',
      totalRewards: '0 AGRO'
    }

    return res.status(200).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: newUser
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
