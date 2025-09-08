import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth service
export const authService = {
  // Esqueci minha senha - AWS SES
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Email de recuperação enviado com sucesso!'
        }
      } else {
        throw new Error(response.data.message || 'Erro ao enviar email de recuperação')
      }
    } catch (error) {
      console.error('Erro no forgot password:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao solicitar recuperação de senha'
      throw new Error(errorMessage)
    }
  },

  // Reset de senha com JWT token (15 minutos)
  async resetPassword(token, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      if (password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres')
      }

      const response = await api.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      })

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Senha alterada com sucesso!'
        }
      } else {
        throw new Error(response.data.message || 'Erro ao redefinir senha')
      }
    } catch (error) {
      console.error('Erro no reset password:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao redefinir senha'
      throw new Error(errorMessage)
    }
  },

  // Enviar OTP via SMS - AWS SNS
  async sendOTP(phoneNumber, userId = null) {
    try {
      const payload = { phoneNumber }
      if (userId) {
        payload.userId = userId
      }

      const response = await api.post('/auth/send-otp', payload)

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP enviado com sucesso!',
          expiresIn: response.data.expiresIn || 300 // 5 minutos em segundos
        }
      } else {
        throw new Error(response.data.message || 'Erro ao enviar OTP')
      }
    } catch (error) {
      console.error('Erro ao enviar OTP:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao enviar OTP'
      throw new Error(errorMessage)
    }
  },

  // Verificar OTP 6-digit
  async verifyOTP(otpCode, phoneNumber, userId = null) {
    try {
      if (!otpCode || otpCode.length !== 6) {
        throw new Error('OTP deve ter 6 dígitos')
      }

      const payload = { otpCode, phoneNumber }
      if (userId) {
        payload.userId = userId
      }

      const response = await api.post('/auth/verify-otp', payload)

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP verificado com sucesso!',
          user: response.data.user,
          token: response.data.token
        }
      } else {
        throw new Error(response.data.message || 'OTP inválido ou expirado')
      }
    } catch (error) {
      console.error('Erro ao verificar OTP:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao verificar OTP'
      throw new Error(errorMessage)
    }
  },

  // Verificar se token de reset é válido
  async verifyResetToken(token) {
    try {
      const response = await api.post('/auth/verify-reset-token', { token })

      if (response.data.success) {
        return {
          success: true,
          email: response.data.email,
          message: 'Token válido'
        }
      } else {
        throw new Error(response.data.message || 'Token inválido ou expirado')
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Token inválido ou expirado'
      throw new Error(errorMessage)
    }
  },

  // Ativar/Desativar 2FA para usuário
  async toggle2FA(userId, enabled, phoneNumber = null) {
    try {
      const response = await api.post('/auth/toggle-2fa', {
        userId,
        enabled,
        phoneNumber
      })

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || '2FA configurado com sucesso!',
          twoFAEnabled: response.data.twoFAEnabled
        }
      } else {
        throw new Error(response.data.message || 'Erro ao configurar 2FA')
      }
    } catch (error) {
      console.error('Erro ao configurar 2FA:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao configurar 2FA'
      throw new Error(errorMessage)
    }
  },

  // Verificar status do 2FA
  async get2FAStatus(userId) {
    try {
      const response = await api.get(`/auth/2fa-status/${userId}`)

      if (response.data.success) {
        return {
          success: true,
          twoFAEnabled: response.data.twoFAEnabled,
          phoneNumber: response.data.phoneNumber,
          lastOTPSent: response.data.lastOTPSent
        }
      } else {
        throw new Error(response.data.message || 'Erro ao verificar status do 2FA')
      }
    } catch (error) {
      console.error('Erro ao verificar status do 2FA:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao verificar status do 2FA'
      throw new Error(errorMessage)
    }
  }
}

export default authService
