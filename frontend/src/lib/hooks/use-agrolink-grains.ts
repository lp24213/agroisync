import { useState, useEffect, useCallback } from 'react'
import { agrolinkClient } from '@/lib/api/agrolink-client'
import { useGeolocation } from './use-geolocation'

interface GrainPrice {
  id: string
  grain: string
  symbol: string
  price: number
  change24h: number
  volume: number
  unit: string
  region: string
  state: string
  city: string
  lastUpdate: string
  source: string
}

interface MarketData {
  grain: string
  currentPrice: number
  previousPrice: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  region: string
}

interface UseAgrolinkGrainsReturn {
  grainsData: GrainPrice[]
  marketData: MarketData[]
  loading: boolean
  error: string | null
  refreshData: () => void
  getGrainByRegion: (grain: string, region?: string) => GrainPrice | undefined
  getMarketTrends: (grain: string) => MarketData | undefined
}

export function useAgrolinkGrains(): UseAgrolinkGrainsReturn {
  const { location, regionInfo } = useGeolocation()
  const [grainsData, setGrainsData] = useState<GrainPrice[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar dados da API do Agrolink
  const fetchGrainsData = useCallback(async () => {
    if (!regionInfo) {
      setError('Região não identificada')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Buscar preços de grãos para a região do usuário
      const grainsResponse = await agrolinkClient.getGrainPrices({
        region: regionInfo.region,
        limit: 20,
      })

      if (grainsResponse.success && grainsResponse.data) {
        const processedGrains: GrainPrice[] = grainsResponse.data.map((grain: any) => ({
          id: grain.id || `${grain.symbol}-${regionInfo.region}`,
          grain: grain.name || grain.grain,
          symbol: grain.symbol,
          price: grain.price || 0,
          change24h: grain.change24h || 0,
          volume: grain.volume || 0,
          unit: grain.unit || 'sc/60kg',
          region: regionInfo.region,
          state: regionInfo.state,
          city: regionInfo.city,
          lastUpdate: grain.timestamp || new Date().toISOString(),
          source: 'Agrolink API',
        }))

        setGrainsData(processedGrains)

        // Processar dados de mercado
        const processedMarketData: MarketData[] = processedGrains.map((grain) => ({
          grain: grain.grain,
          currentPrice: grain.price,
          previousPrice: grain.price - (grain.price * (grain.change24h / 100)),
          changePercent: grain.change24h,
          volume: grain.volume,
          high24h: grain.price * 1.05, // Simulado
          low24h: grain.price * 0.95, // Simulado
          region: grain.region,
        }))

        setMarketData(processedMarketData)
      } else {
        // Fallback para dados simulados baseados na região
        const fallbackData = generateFallbackData(regionInfo)
        setGrainsData(fallbackData.grains)
        setMarketData(fallbackData.market)
      }
    } catch (err) {
      console.error('Erro ao buscar dados do Agrolink:', err)
      setError('Erro ao carregar dados de grãos')
      
      // Usar dados de fallback em caso de erro
      if (regionInfo) {
        const fallbackData = generateFallbackData(regionInfo)
        setGrainsData(fallbackData.grains)
        setMarketData(fallbackData.market)
      }
    } finally {
      setLoading(false)
    }
  }, [regionInfo])

  // Função para gerar dados de fallback baseados na região
  const generateFallbackData = (region: any) => {
    const basePrices: Record<string, { base: number; variation: number }> = {
      'Soja': { base: 125.50, variation: 0.15 },
      'Milho': { base: 78.25, variation: 0.12 },
      'Trigo': { base: 95.80, variation: 0.18 },
      'Café': { base: 185.30, variation: 0.25 },
      'Arroz': { base: 45.90, variation: 0.10 },
      'Feijão': { base: 125.75, variation: 0.20 },
    }

    // Ajustar preços baseados na região
    const regionMultipliers: Record<string, number> = {
      'Sudeste': 1.0,
      'Sul': 0.95,
      'Centro-Oeste': 0.90,
      'Nordeste': 1.05,
      'Norte': 1.10,
    }

    const multiplier = regionMultipliers[region.region] || 1.0

    const grains: GrainPrice[] = Object.entries(basePrices).map(([grain, data], index) => {
      const adjustedPrice = data.base * multiplier
      const change24h = (Math.random() - 0.5) * data.variation * 100
      const volume = Math.floor(Math.random() * 1000000) + 500000

      return {
        id: `${grain.toLowerCase()}-${region.region}-${index}`,
        grain,
        symbol: grain.toUpperCase().substring(0, 4),
        price: parseFloat(adjustedPrice.toFixed(2)),
        change24h: parseFloat(change24h.toFixed(2)),
        volume,
        unit: grain === 'Arroz' ? 'sc/50kg' : 'sc/60kg',
        region: region.region,
        state: region.state,
        city: region.city,
        lastUpdate: new Date().toISOString(),
        source: 'Sistema Local',
      }
    })

    const market: MarketData[] = grains.map((grain) => ({
      grain: grain.grain,
      currentPrice: grain.price,
      previousPrice: grain.price - (grain.price * (grain.change24h / 100)),
      changePercent: grain.change24h,
      volume: grain.volume,
      high24h: grain.price * (1 + Math.abs(grain.change24h) / 100),
      low24h: grain.price * (1 - Math.abs(grain.change24h) / 100),
      region: grain.region,
    }))

    return { grains, market }
  }

  // Função para buscar dados específicos de um grão por região
  const getGrainByRegion = useCallback(
    (grain: string, region?: string): GrainPrice | undefined => {
      const targetRegion = region || regionInfo?.region
      return grainsData.find(
        (g) => g.grain.toLowerCase() === grain.toLowerCase() && g.region === targetRegion
      )
    },
    [grainsData, regionInfo]
  )

  // Função para obter tendências de mercado de um grão específico
  const getMarketTrends = useCallback(
    (grain: string): MarketData | undefined => {
      return marketData.find((m) => m.grain.toLowerCase() === grain.toLowerCase())
    },
    [marketData]
  )

  // Função para atualizar dados
  const refreshData = useCallback(() => {
    fetchGrainsData()
  }, [fetchGrainsData])

  // Buscar dados automaticamente quando a região mudar
  useEffect(() => {
    if (regionInfo) {
      fetchGrainsData()
    }
  }, [regionInfo, fetchGrainsData])

  // Atualizar dados a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (regionInfo) {
        fetchGrainsData()
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [regionInfo, fetchGrainsData])

  return {
    grainsData,
    marketData,
    loading,
    error,
    refreshData,
    getGrainByRegion,
    getMarketTrends,
  }
}
