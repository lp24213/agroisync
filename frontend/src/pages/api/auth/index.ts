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
      const { email, password, metamaskId, signature } = req.body

      if (email && password) {
        // Login tradicional - simulado para build
        const result = {
          token: 'mock-jwt-token-' + Date.now(),
          user: { 
            email, 
            id: 'user-' + Date.now(),
            name: 'Usuário Teste'
          }
        }
        
        return res.status(200).json({
          success: true,
          message: 'Login realizado com sucesso',
          token: result.token,
          user: result.user
        })
      } else if (metamaskId && signature) {
        // Login com MetaMask - simulado para build
        const result = {
          token: 'mock-metamask-token-' + Date.now(),
          user: { 
            metamaskId, 
            id: 'user-' + Date.now(),
            name: 'Usuário MetaMask'
          }
        }
        
        return res.status(200).json({
          success: true,
          message: 'Login com MetaMask realizado',
          token: result.token,
          user: result.user
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      })
    } catch (error: any) {
      console.error('Erro na API de autenticação:', error)
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
