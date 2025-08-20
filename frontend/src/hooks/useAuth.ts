import { useState, useEffect } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../lib/firebase'

interface AuthState {
  user: User | null
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Verificar se é admin
        const isAdmin = user.email === 'luispaulodeoliveira@agrotm.com.br'
        
        // Salvar email no localStorage para verificação de admin
        localStorage.setItem('userEmail', user.email || '')
        
        setAuthState({
          user,
          isAdmin,
          loading: false,
          error: null
        })
      } else {
        // Limpar dados do usuário
        localStorage.removeItem('userEmail')
        setAuthState({
          user: null,
          isAdmin: false,
          loading: false,
          error: null
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code)
      setAuthState(prev => ({ ...prev, error: errorMessage }))
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const register = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code)
      setAuthState(prev => ({ ...prev, error: errorMessage }))
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code)
      setAuthState(prev => ({ ...prev, error: errorMessage }))
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
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

// Função auxiliar para traduzir códigos de erro do Firebase
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado'
    case 'auth/wrong-password':
      return 'Senha incorreta'
    case 'auth/email-already-in-use':
      return 'Este email já está em uso'
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres'
    case 'auth/invalid-email':
      return 'Email inválido'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde'
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet'
    default:
      return 'Erro ao autenticar. Tente novamente'
  }
}
