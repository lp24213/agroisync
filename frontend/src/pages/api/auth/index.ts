import type { NextApiRequest, NextApiResponse } from 'next'
import { authService } from '@/services/api'

type AuthResponse = {
  success: boolean
  message: string
  token?: string
  user?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) => {
  if (req.method === 'POST') {
    try {
      const { email, password, metamaskId, signature } = req.body

      if (email && password) {
        // Login tradicional - usar serviço real
        try {
          const result = await authService.login(email, password)
          return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            token: result.token,
            user: result.user
          })
        } catch (error: any) {
          return res.status(400).json({
            success: false,
            message: error.response?.data?.message || 'Erro no login'
          })
        }
      } else if (metamaskId && signature) {
        // Login com MetaMask - usar serviço real
        try {
          const result = await authService.loginWithMetamask(metamaskId, signature)
          return res.status(200).json({
            success: true,
            message: 'Login com MetaMask realizado',
            token: result.token,
            user: result.user
          })
        } catch (error: any) {
          return res.status(400).json({
            success: false,
            message: error.response?.data?.message || 'Erro no login com MetaMask'
          })
        }
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
