import { GrainPrice } from '@/types'

interface AgrolinkConfig {
  apiKey?: string
  baseUrl: string
  timeout: number
  maxRetries: number
}

interface AgrolinkResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

class AgrolinkClient {
  private config: AgrolinkConfig
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor(config: Partial<AgrolinkConfig> = {}) {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_AGROLINK_API_KEY || '',
      baseUrl: 'https://api.agrolink.com.br/v1',
      timeout: 10000,
      maxRetries: 3,
      ...config,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<AgrolinkResponse<T>> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.config.maxRetries) {
          const retryAfter = response.headers.get('Retry-After')
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * (retryCount + 1)
          
          await new Promise(resolve => setTimeout(resolve, delay))
          return this.request(endpoint, options, retryCount + 1)
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      if (retryCount < this.config.maxRetries && this.isRetryableError(error)) {
        const delay = 1000 * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.request(endpoint, options, retryCount + 1)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  private isRetryableError(error: any): boolean {
    if (error.name === 'AbortError') return false
    if (error.message?.includes('429')) return true
    if (error.message?.includes('500')) return true
    if (error.message?.includes('502')) return true
    if (error.message?.includes('503')) return true
    if (error.message?.includes('504')) return true
    return false
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ''
    return `${endpoint}${paramString}`
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  async getGrainPrices(params?: {
    grain?: string
    region?: string
    date?: string
    limit?: number
  }): Promise<AgrolinkResponse<GrainPrice[]>> {
    const cacheKey = this.getCacheKey('/grains/prices', params)
    const cached = this.getCachedData<GrainPrice[]>(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const queryParams = new URLSearchParams()
    if (params?.grain) queryParams.append('grain', params.grain)
    if (params?.region) queryParams.append('region', params.region)
    if (params?.date) queryParams.append('date', params.date)
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const endpoint = `/grains/prices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await this.request<GrainPrice[]>(endpoint)

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getGrainPriceHistory(params: {
    grain: string
    region?: string
    startDate: string
    endDate: string
    interval?: 'daily' | 'weekly' | 'monthly'
  }): Promise<AgrolinkResponse<GrainPrice[]>> {
    const cacheKey = this.getCacheKey('/grains/history', params)
    const cached = this.getCachedData<GrainPrice[]>(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const queryParams = new URLSearchParams({
      grain: params.grain,
      startDate: params.startDate,
      endDate: params.endDate,
    })
    
    if (params.region) queryParams.append('region', params.region)
    if (params.interval) queryParams.append('interval', params.interval)

    const endpoint = `/grains/history?${queryParams.toString()}`
    const response = await this.request<GrainPrice[]>(endpoint)

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getRegions(): Promise<AgrolinkResponse<string[]>> {
    const cacheKey = this.getCacheKey('/regions')
    const cached = this.getCachedData<string[]>(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const response = await this.request<string[]>('/regions')

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getGrainTypes(): Promise<AgrolinkResponse<string[]>> {
    const cacheKey = this.getCacheKey('/grains/types')
    const cached = this.getCachedData<string[]>(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const response = await this.request<string[]>('/grains/types')

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getMarketIndicators(): Promise<AgrolinkResponse<any>> {
    const cacheKey = this.getCacheKey('/market/indicators')
    const cached = this.getCachedData(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const response = await this.request('/market/indicators')

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getWeatherForecast(params: {
    region: string
    days?: number
  }): Promise<AgrolinkResponse<any>> {
    const cacheKey = this.getCacheKey('/weather/forecast', params)
    const cached = this.getCachedData(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const queryParams = new URLSearchParams({
      region: params.region,
    })
    
    if (params.days) queryParams.append('days', params.days.toString())

    const endpoint = `/weather/forecast?${queryParams.toString()}`
    const response = await this.request(endpoint)

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  async getLogisticsInfo(params: {
    origin: string
    destination: string
    grainType?: string
  }): Promise<AgrolinkResponse<any>> {
    const cacheKey = this.getCacheKey('/logistics/info', params)
    const cached = this.getCachedData(cacheKey)
    
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      }
    }

    const queryParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
    })
    
    if (params.grainType) queryParams.append('grainType', params.grainType)

    const endpoint = `/logistics/info?${queryParams.toString()}`
    const response = await this.request(endpoint)

    if (response.success && response.data) {
      this.setCachedData(cacheKey, response.data)
    }

    return response
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

export const agrolinkClient = new AgrolinkClient()

export default AgrolinkClient
