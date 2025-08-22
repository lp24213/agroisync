export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  company?: Company
  profile: UserProfile
  preferences: UserPreferences
  kyc?: KYCStatus
  reputation: ReputationScore
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export type UserRole = 'produtor' | 'vendedor' | 'comprador' | 'freteiro' | 'admin'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification'

export interface UserProfile {
  phone?: string
  avatar?: string
  bio?: string
  location?: Location
  documents: Document[]
  verifiedAt?: Date
}

export interface UserPreferences {
  language: 'pt' | 'en' | 'es' | 'zh'
  theme: 'dark' | 'light' | 'auto'
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface Company {
  id: string
  name: string
  type: 'PF' | 'PJ'
  cnpj?: string
  cpf?: string
  ie?: string
  address: Address
  phone: string
  email: string
  website?: string
  logo?: string
  verifiedAt?: Date
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: [number, number]
}

export interface Location {
  city: string
  state: string
  country: string
  coordinates?: [number, number]
}

export interface Document {
  id: string
  type: DocumentType
  url: string
  filename: string
  mimeType: string
  size: number
  verified: boolean
  uploadedAt: Date
  verifiedAt?: Date
}

export type DocumentType = 'cnpj' | 'cpf' | 'ie' | 'cnh' | 'rg' | 'other'

export interface KYCStatus {
  status: 'pending' | 'approved' | 'rejected'
  level: 'basic' | 'enhanced'
  documents: Document[]
  submittedAt: Date
  reviewedAt?: Date
  reviewerId?: string
  notes?: string
}

export interface ReputationScore {
  overall: number
  reliability: number
  communication: number
  punctuality: number
  quality: number
  totalReviews: number
  positiveReviews: number
  negativeReviews: number
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  priceAlerts: boolean
  freightUpdates: boolean
  orderUpdates: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts'
  showLocation: boolean
  showContactInfo: boolean
  allowAnalytics: boolean
  allowCookies: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  subcategory?: string
  price: number
  originalPrice?: number
  stock: number
  minStock: number
  status: ProductStatus
  images: ProductImage[]
  specifications: Record<string, any>
  tags: string[]
  sellerId: string
  seller: User
  rating: number
  reviews: ProductReview[]
  totalReviews: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductCategory = 'sementes' | 'fertilizantes' | 'equipamentos' | 'defensivos' | 'outros'
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued'

export interface ProductImage {
  id: string
  url: string
  alt: string
  order: number
  isPrimary: boolean
}

export interface ProductReview {
  id: string
  userId: string
  user: User
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  reported: boolean
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: User
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  billingAddress: Address
  notes?: string
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
  deliveredAt?: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type PaymentMethod = 'stripe' | 'pix' | 'bank_transfer' | 'crypto'

export interface Freight {
  id: string
  title: string
  origin: Address
  destination: Address
  grainType: GrainType
  weight: number
  unit: WeightUnit
  price: number
  currency: string
  status: FreightStatus
  type: FreightType
  window: {
    start: Date
    end: Date
  }
  requirements: string[]
  documents: Document[]
  offers: FreightOffer[]
  transporterId?: string
  transporter?: User
  shipperId: string
  shipper: User
  insurance?: InsuranceInfo
  route?: RouteInfo
  createdAt: Date
  updatedAt: Date
  acceptedAt?: Date
  startedAt?: Date
  completedAt?: Date
}

export type GrainType = 'soja' | 'milho' | 'trigo' | 'cafe' | 'arroz' | 'feijao' | 'outros'
export type WeightUnit = 'kg' | 'ton' | 'sacas'
export type FreightStatus = 'available' | 'in_transit' | 'completed' | 'cancelled'
export type FreightType = 'full_load' | 'partial' | 'express'

export interface FreightOffer {
  id: string
  transporterId: string
  transporter: User
  price: number
  currency: string
  estimatedTime: number
  notes?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  respondedAt?: Date
}

export interface InsuranceInfo {
  provider: string
  policyNumber: string
  coverage: number
  premium: number
  validUntil: Date
}

export interface RouteInfo {
  distance: number
  estimatedTime: number
  tollCost: number
  fuelCost: number
  totalCost: number
  waypoints: [number, number][]
}

export interface Subscription {
  id: string
  userId: string
  user: User
  planId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  stripeSubscriptionId: string
  stripeCustomerId: string
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionPlan {
  id: string
  name: string
  type: 'store' | 'agroconecta' | 'premium'
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: Record<string, number>
  stripePriceId: string
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'

export interface GrainPrice {
  id: string
  grainType: GrainType
  region: string
  price: number
  currency: string
  unit: WeightUnit
  source: string
  change24h: number
  changePercent24h: number
  volume: number
  timestamp: Date
  type?: string
}

export interface FXRate {
  id: string
  from: string
  to: string
  rate: number
  timestamp: Date
  source: string
  change24h?: number
  changePercent24h?: number
}

export interface CryptoTicker {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  circulatingSupply: number
  maxSupply?: number
  timestamp: Date
  source: string
  currency?: string
}

export interface AuditLog {
  id: string
  userId: string
  user: User
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export interface ChatMessage {
  id: string
  userId: string
  user: User
  type: 'text' | 'image' | 'voice'
  content: string
  sender: 'user' | 'bot'
  metadata?: Record<string, any>
  timestamp: Date
  read: boolean
}

export interface WalletConnection {
  id: string
  userId: string
  user: User
  type: 'metamask' | 'phantom'
  address: string
  network: string
  connected: boolean
  lastConnected: Date
  createdAt: Date
  signature?: string
  provider?: any
}

export interface Notification {
  id: string
  userId: string
  user: User
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
  readAt?: Date
}

export type NotificationType = 'order_update' | 'freight_update' | 'price_alert' | 'system' | 'marketing'

export type AdminTab = 'dashboard' | 'users' | 'orders' | 'products' | 'freights' | 'analytics' | 'settings'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SearchFilters {
  query?: string
  category?: string
  priceRange?: [number, number]
  location?: string
  status?: string
  dateRange?: [Date, Date]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
  expiresAt?: Date
}

export interface FeatureFlag {
  name: string
  enabled: boolean
  rolloutPercentage: number
  conditions: Record<string, any>
}

export interface SystemMetrics {
  users: {
    total: number
    active: number
    new: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    revenue: number
  }
  freights: {
    total: number
    available: number
    inTransit: number
    completed: number
  }
  performance: {
    responseTime: number
    errorRate: number
    uptime: number
  }
}
