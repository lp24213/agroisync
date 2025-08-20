import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'


// Configuração Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxVxVxVxVxVxVxVxVxVxVxVxVxVxVxVx",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agroisync.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agroisync",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agroisync.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Service centralizado para todas as APIs do AgroSync
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Tipos base para respostas da API
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Tipos para Marketplace
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  owner: string
  location: string
  inStock: boolean
  isFavorite: boolean
  tags: string[]
  stock: number
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  badges: string[]
}

// Tipos para Propriedades
export interface Property {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  size: number
  type: string
  location: string
  owner: string
  image: string
  rating: number
  reviews: number
  isFavorite: boolean
  soilType: string
  climate: string
  infrastructure: string[]
  waterResources: string[]
  access: string
  documents: string[]
  tags: string[]
  crops: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

// Tipos para Dashboard
export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  change7d: number
  balance: number
  value: number
  icon: string
}

export interface StakingPool {
  id: string
  name: string
  apy: number
  tvl: number
  stakedTokens: number
  rewards: number
  lockPeriod: number
  status: 'active' | 'locked' | 'completed'
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'stake' | 'unstake' | 'reward' | 'transfer'
  asset: string
  amount: number
  value: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  hash?: string
}

export interface DashboardData {
  portfolioValue: number
  totalRewards: number
  totalYield: number
  monthlyPerformance: number
  annualPerformance: number
  cryptoAssets: CryptoAsset[]
  stakingPools: StakingPool[]
  recentTransactions: Transaction[]
}

// Tipos para Staking
export interface StakingData {
  totalStaked: number
  totalRewards: number
  activePools: number
  stakingPools: StakingPool[]
  stakingHistory: any[]
}

// Tipos para Chatbot
export interface ChatMessage {
  type: 'text' | 'voice' | 'image'
  content: string
  sessionId: string
}

export interface ChatResponse {
  response: string
  messageId: string
  sessionId: string
}

// Tipos para Traduções
export interface TranslationData {
  translations: Record<string, Record<string, string>>
  categories: string[]
  lastUpdate: Date
}

// Tipos para Upload
export interface UploadData {
  fileId: string
  filename: string
  url: string
  size: number
}

// Tipos para Autenticação
export interface User {
  id: string
  email: string
  name: string
  role: string
  verified: boolean
  profile: any
  preferences: any
}

export interface AuthResponse {
  token: string
  user: User
}

// Função helper para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

// ===== MARKETPLACE API =====
export const marketplaceApi = {
  // Buscar produtos
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<ApiResponse<{ data: Product[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString())
      })
    }
    
    return apiRequest(`/marketplace?${queryParams.toString()}`)
  },

  // Criar produto
  async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<{ data: Product[] }>> {
    return apiRequest('/marketplace', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },
}

// ===== PROPRIEDADES API =====
export const propertiesApi = {
  // Buscar propriedades
  async getProperties(params?: {
    page?: number
    limit?: number
    type?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    minSize?: number
    maxSize?: number
    location?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<ApiResponse<{ data: Property[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString())
      })
    }
    
    return apiRequest(`/properties?${queryParams.toString()}`)
  },

  // Criar propriedade
  async createProperty(propertyData: Omit<Property, 'id'>): Promise<ApiResponse<{ data: Property[] }>> {
    return apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    })
  },
}

// ===== DASHBOARD API =====
export const dashboardApi = {
  // Buscar dados do dashboard
  async getDashboardData(userId: string): Promise<ApiResponse<DashboardData>> {
    return apiRequest(`/dashboard?userId=${userId}`)
  },

  // Criar dados do dashboard
  async createDashboardData(data: {
    type: 'crypto_asset' | 'staking_pool' | 'transaction'
    data: any
    userId: string
  }): Promise<ApiResponse<{ id: string }>> {
    return apiRequest('/dashboard', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ===== STAKING API =====
export const stakingApi = {
  // Buscar dados de staking
  async getStakingData(userId: string): Promise<ApiResponse<StakingData>> {
    return apiRequest(`/staking?userId=${userId}`)
  },

  // Executar ação de staking
  async executeStakingAction(action: 'stake' | 'unstake' | 'claim', data: any): Promise<ApiResponse<{ id: string }>> {
    return apiRequest('/staking', {
      method: 'POST',
      body: JSON.stringify({ action, ...data }),
    })
  },
}

// ===== CHATBOT API =====
export const chatbotApi = {
  // Enviar mensagem
  async sendMessage(message: ChatMessage): Promise<ApiResponse<ChatResponse>> {
    return apiRequest('/chatbot', {
      method: 'POST',
      body: JSON.stringify(message),
    })
  },

  // Buscar histórico
  async getHistory(userId: string, sessionId?: string, limit?: number): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams({ userId })
    if (sessionId) queryParams.append('sessionId', sessionId)
    if (limit) queryParams.append('limit', limit.toString())
    
    return apiRequest(`/chatbot?${queryParams.toString()}`)
  },
}

// ===== TRADUÇÕES API =====
export const translationsApi = {
  // Buscar traduções
  async getTranslations(locale: string = 'pt', category?: string): Promise<ApiResponse<TranslationData>> {
    const queryParams = new URLSearchParams({ locale })
    if (category) queryParams.append('category', category)
    
    return apiRequest(`/translations?${queryParams.toString()}`)
  },

  // Criar/atualizar tradução
  async createTranslation(translation: {
    key: string
    pt: string
    en: string
    es: string
    zh: string
    category: string
    description?: string
  }): Promise<ApiResponse> {
    return apiRequest('/translations', {
      method: 'POST',
      body: JSON.stringify(translation),
    })
  },
}

// ===== UPLOAD API =====
export const uploadApi = {
  // Enviar arquivo
  async uploadFile(formData: FormData): Promise<ApiResponse<UploadData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Upload API Error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro no upload',
      }
    }
  },

  // Listar arquivos
  async getFiles(userId: string, category?: string, limit?: number): Promise<ApiResponse<{ files: any[]; total: number }>> {
    const queryParams = new URLSearchParams({ userId })
    if (category) queryParams.append('category', category)
    if (limit) queryParams.append('limit', limit.toString())
    
    return apiRequest(`/upload?${queryParams.toString()}`)
  },

  // Remover arquivo
  async deleteFile(fileId: string, userId: string): Promise<ApiResponse> {
    return apiRequest('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ fileId, userId }),
    })
  },
}

// ===== AUTENTICAÇÃO API =====
export const authApi = {
  // Login
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password }),
    })
  },

  // Registro
  async register(email: string, password: string, name: string, profile?: any): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', email, password, name, profile }),
    })
  },

  // Verificar token
  async verifyToken(token: string): Promise<ApiResponse<{ user: User }>> {
    return apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'verify', token }),
    })
  },

  // Atualizar usuário
  async updateUser(userId: string, updates: any): Promise<ApiResponse> {
    return apiRequest('/auth', {
      method: 'PUT',
      body: JSON.stringify({ userId, updates }),
    })
  },
}

// ===== HOOKS UTILITÁRIOS =====
export const useApiState = () => {
  return {
    loading: false,
    error: null,
    data: null,
  }
}

// ===== FUNÇÕES UTILITÁRIAS =====
export const apiUtils = {
  // Formatar erro da API
  formatError: (error: any): string => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return 'Erro desconhecido'
  },

  // Verificar se a resposta foi bem-sucedida
  isSuccess: (response: ApiResponse): boolean => {
    return response.success === true
  },

  // Extrair dados da resposta
  extractData: <T>(response: ApiResponse<T>): T | null => {
    return response.success ? response.data || null : null
  },

  // Fallback para português
  getFallbackLocale: (locale: string): string => {
    const supportedLocales = ['pt', 'en', 'es', 'zh']
    return supportedLocales.includes(locale) ? locale : 'pt'
  },
}

export default {
  marketplace: marketplaceApi,
  properties: propertiesApi,
  dashboard: dashboardApi,
  staking: stakingApi,
  chatbot: chatbotApi,
  translations: translationsApi,
  upload: uploadApi,
  auth: authApi,
  utils: apiUtils,
}
