import { z } from 'zod'

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['produtor', 'vendedor', 'comprador', 'freteiro']),
  phone: z.string().optional(),
  companyType: z.enum(['PF', 'PJ']).optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  acceptMarketing: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export const userLoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional(),
})

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  profileVisibility: z.enum(['public', 'private', 'contacts']),
  showLocation: z.boolean(),
  showContactInfo: z.boolean(),
})

export const companySchema = z.object({
  name: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  type: z.enum(['PF', 'PJ']),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  ie: z.string().optional(),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  website: z.string().url('Website inválido').optional(),
  street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  country: z.string().min(2, 'País deve ter pelo menos 2 caracteres'),
})

export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.enum(['sementes', 'fertilizantes', 'equipamentos', 'defensivos', 'outros']),
  subcategory: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  originalPrice: z.number().min(0.01).optional(),
  stock: z.number().min(0, 'Estoque não pode ser negativo'),
  minStock: z.number().min(0, 'Estoque mínimo não pode ser negativo'),
  specifications: z.record(z.any()).optional(),
  tags: z.array(z.string()).max(10, 'Máximo de 10 tags'),
  featured: z.boolean().optional(),
})

export const freightSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  grainType: z.enum(['soja', 'milho', 'trigo', 'cafe', 'arroz', 'feijao', 'outros']),
  weight: z.number().min(0.01, 'Peso deve ser maior que zero'),
  unit: z.enum(['kg', 'ton', 'sacas']),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  currency: z.string().default('BRL'),
  type: z.enum(['full_load', 'partial', 'express']),
  requirements: z.array(z.string()).optional(),
  windowStart: z.date(),
  windowEnd: z.date(),
  origin: z.object({
    city: z.string().min(2, 'Cidade de origem é obrigatória'),
    state: z.string().min(2, 'Estado de origem é obrigatório'),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
  destination: z.object({
    city: z.string().min(2, 'Cidade de destino é obrigatória'),
    state: z.string().min(2, 'Estado de destino é obrigatório'),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
}).refine((data) => data.windowEnd > data.windowStart, {
  message: 'Data final deve ser posterior à data inicial',
  path: ['windowEnd'],
})

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Produto é obrigatório'),
    quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
  })).min(1, 'Pelo menos um item é obrigatório'),
  shippingAddress: z.object({
    street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
    zipCode: z.string().min(8, 'CEP inválido'),
    country: z.string().min(2, 'País deve ter pelo menos 2 caracteres'),
  }),
  billingAddress: z.object({
    street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
    zipCode: z.string().min(8, 'CEP inválido'),
    country: z.string().min(2, 'País deve ter pelo menos 2 caracteres'),
  }),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
})

export const freightOfferSchema = z.object({
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  currency: z.string().default('BRL'),
  estimatedTime: z.number().min(1, 'Tempo estimado deve ser pelo menos 1 dia'),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  type: z.enum(['general', 'support', 'partnership', 'billing']),
  company: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  acceptMarketing: z.boolean().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Avaliação deve ser de 1 a 5'),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(1000, 'Comentário deve ter no máximo 1000 caracteres'),
})

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
  confirmNewPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmNewPassword'],
})

export const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  marketing: z.boolean(),
  priceAlerts: z.boolean(),
  freightUpdates: z.boolean(),
  orderUpdates: z.boolean(),
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'contacts']),
  showLocation: z.boolean(),
  showContactInfo: z.boolean(),
  allowAnalytics: z.boolean(),
  allowCookies: z.boolean(),
})

export const kycDocumentSchema = z.object({
  type: z.enum(['cnpj', 'cpf', 'ie', 'cnh', 'rg', 'other']),
  documentNumber: z.string().min(1, 'Número do documento é obrigatório'),
  issuingAuthority: z.string().min(2, 'Órgão emissor deve ter pelo menos 2 caracteres'),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  documentImage: z.any().optional(),
})

export const subscriptionPlanSchema = z.object({
  planId: z.string().min(1, 'Plano é obrigatório'),
  paymentMethod: z.enum(['stripe', 'pix', 'bank_transfer']),
  billingCycle: z.enum(['monthly', 'yearly']),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
})

export const fileUploadSchema = z.object({
  file: z.any().refine((file) => file && file.size > 0, 'Arquivo é obrigatório'),
  type: z.enum(['image', 'document']),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).optional(),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Mensagem é obrigatória').max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
  type: z.enum(['text', 'image', 'voice']).default('text'),
  metadata: z.record(z.any()).optional(),
})

export const walletConnectionSchema = z.object({
  type: z.enum(['metamask', 'phantom']),
  address: z.string().min(1, 'Endereço da carteira é obrigatório'),
  network: z.string().min(1, 'Rede é obrigatória'),
  signature: z.string().min(1, 'Assinatura é obrigatória'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})

export const adminUserUpdateSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
  role: z.enum(['produtor', 'vendedor', 'comprador', 'freteiro', 'admin']),
  kycStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  notes: z.string().max(1000, 'Observações devem ter no máximo 1000 caracteres').optional(),
})

export const adminProductUpdateSchema = z.object({
  status: z.enum(['active', 'inactive', 'out_of_stock', 'discontinued']),
  featured: z.boolean(),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  stock: z.number().min(0, 'Estoque não pode ser negativo'),
  notes: z.string().max(1000, 'Observações devem ter no máximo 1000 caracteres').optional(),
})

export const adminFreightUpdateSchema = z.object({
  status: z.enum(['available', 'in_transit', 'completed', 'cancelled']),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  notes: z.string().max(1000, 'Observações devem ter no máximo 1000 caracteres').optional(),
})

export const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().max(500, 'Mensagem deve ter no máximo 500 caracteres').optional(),
  featureFlags: z.record(z.boolean()),
  rateLimits: z.object({
    auth: z.number().min(1),
    api: z.number().min(1),
    upload: z.number().min(1),
  }),
  security: z.object({
    enableCaptcha: z.boolean(),
    enable2FA: z.boolean(),
    sessionTimeout: z.number().min(300), // 5 minutes
    maxLoginAttempts: z.number().min(1).max(10),
  }),
})
