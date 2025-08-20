import { useState, useEffect } from 'react'

interface AuthState {
  user: any | null
  isAdmin: boolean
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Simular verificação de auth
    setTimeout(() => {
      setAuthState({
        user: null,
        isAdmin: false,
        loading: false,
        error: null
      })
    }, 1000)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = { email, id: '1' }
      setAuthState(prev => ({ 
        ...prev, 
        user: mockUser, 
        isAdmin: email === 'admin@agroisync.com',
        loading: false 
      }))
      
      return { user: mockUser }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, error: 'Erro no login', loading: false }))
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = { email, id: '1' }
      setAuthState(prev => ({ 
        ...prev, 
        user: mockUser, 
        isAdmin: false,
        loading: false 
      }))
      
      return { user: mockUser }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, error: 'Erro no registro', loading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setAuthState({
        user: null,
        isAdmin: false,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      // Simular reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAuthState(prev => ({ ...prev, loading: false }))
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, error: 'Erro ao resetar senha', loading: false }))
      throw error
    }
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  return {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
    clearError
  }
}

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado'
    case 'auth/wrong-password':
      return 'Senha incorreta'
    case 'auth/email-already-in-use':
      return 'Email já está em uso'
    case 'auth/weak-password':
      return 'Senha muito fraca'
    case 'auth/invalid-email':
      return 'Email inválido'
    default:
      return 'Erro de autenticação'
  }
}