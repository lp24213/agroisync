import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Company, WalletConnection } from '@/types'

interface AuthState {
  user: User | null
  company: Company | null
  isAuthenticated: boolean
  isLoading: boolean
  walletConnection: WalletConnection | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User>) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  updateCompany: (companyData: Partial<Company>) => void
  connectWallet: (connection: WalletConnection) => void
  disconnectWallet: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      isAuthenticated: false,
      isLoading: false,
      walletConnection: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          set({
            user: data.user,
            company: data.company,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData: Partial<User>) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          const data = await response.json()
          set({
            user: data.user,
            company: data.company,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          company: null,
          isAuthenticated: false,
          walletConnection: null,
        })
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },

      updateCompany: (companyData: Partial<Company>) => {
        const { company } = get()
        if (company) {
          set({ company: { ...company, ...companyData } })
        }
      },

      connectWallet: (connection: WalletConnection) => {
        set({ walletConnection: connection })
      },

      disconnectWallet: () => {
        set({ walletConnection: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        isAuthenticated: state.isAuthenticated,
        walletConnection: state.walletConnection,
      }),
    }
  )
)
