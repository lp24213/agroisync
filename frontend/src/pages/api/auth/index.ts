import type { NextApiRequest, NextApiResponse } from 'next'

type AuthResponse = {
  success: boolean
  message: string
  token?: string
  user?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method === 'POST') {
    try {
      const { email, password, metamaskId } = req.body

      // Simular autenticação (será integrada com o backend real)
      if (email && password) {
        // Login tradicional
        return res.status(200).json({
          success: true,
          message: 'Login realizado com sucesso',
          token: 'mock-jwt-token',
          user: { email, id: 'user-123' }
        })
      } else if (metamaskId) {
        // Login com MetaMask
        return res.status(200).json({
          success: true,
          message: 'Login com MetaMask realizado',
          token: 'mock-metamask-token',
          user: { metamaskId, id: 'user-456' }
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      })
    } catch (error) {
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
