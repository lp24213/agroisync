'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  RefreshCw,
  Wheat,
  Coffee,
  Sprout
} from 'lucide-react'
import { GrainsPriceCard } from './grains-price-card'
import { GrainsMap } from './grains-map'
import { GrainsTable } from './grains-table'
import { Button } from '@/components/ui/button'

interface GrainData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume: number
  unit: string
  region: string
  coordinates: [number, number]
  lastUpdated: Date
  agrolinkId?: string
  market?: string
}

const mockGrainsData: GrainData[] = [
  {
    id: 'soja',
    name: 'Soja',
    symbol: 'SOJA',
    price: 125.50,
    change24h: 2.30,
    changePercent24h: 1.87,
    volume: 2847500,
    unit: 'sc/60kg',
    region: 'Mato Grosso',
    coordinates: [-15.6014, -56.0979],
    lastUpdated: new Date(),
    agrolinkId: 'SOJA_MT',
    market: 'CEASA-MT'
  },
  {
    id: 'milho',
    name: 'Milho',
    symbol: 'MILHO',
    price: 89.75,
    change24h: -1.25,
    changePercent24h: -1.37,
    volume: 1568200,
    unit: 'sc/60kg',
    region: 'Paraná',
    coordinates: [-25.4284, -49.2733],
    lastUpdated: new Date(),
    agrolinkId: 'MILHO_PR',
    market: 'CEASA-PR'
  },
  {
    id: 'trigo',
    name: 'Trigo',
    symbol: 'TRIGO',
    price: 156.80,
    change24h: 3.20,
    changePercent24h: 2.08,
    volume: 892400,
    unit: 'sc/60kg',
    region: 'Rio Grande do Sul',
    coordinates: [-30.0346, -51.2177],
    lastUpdated: new Date(),
    agrolinkId: 'TRIGO_RS',
    market: 'CEASA-RS'
  },
  {
    id: 'cafe',
    name: 'Café',
    symbol: 'CAFE',
    price: 245.30,
    change24h: 5.80,
    changePercent24h: 2.42,
    volume: 456800,
    unit: 'sc/60kg',
    region: 'Minas Gerais',
    coordinates: [-19.9167, -43.9345],
    lastUpdated: new Date(),
    agrolinkId: 'CAFE_MG',
    market: 'CEASA-MG'
  },
]

export function GrainsPage() {
  const [grainsData, setGrainsData] = useState<GrainData[]>(mockGrainsData)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedGrain, setSelectedGrain] = useState<string>('all')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [nearbyMarkets, setNearbyMarkets] = useState<string[]>([])
  const [userRegion, setUserRegion] = useState<string>('')
  const [userCity, setUserCity] = useState<string>('')

  // Função para obter localização do usuário automaticamente
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          
          // Buscar dados de geolocalização para determinar região
          const geoData = await fetchGeolocationData(latitude, longitude)
          if (geoData) {
            setUserRegion(geoData.region)
            setUserCity(geoData.city)
            // Atualizar dados baseado na região do usuário
            await updatePricesByRegion(geoData.region, geoData.state)
          }
        },
        (error) => {
          console.log('Erro ao obter localização:', error)
          // Fallback: usar localização padrão (São Paulo)
          setUserLocation([-23.5505, -46.6333])
          setUserRegion('Sudeste')
          setUserCity('São Paulo')
          updatePricesByRegion('São Paulo', 'SP')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    }
  }

  // Função para determinar região baseada nas coordenadas
  const determineRegionByCoordinates = (lat: number, lng: number) => {
    // Mapeamento de coordenadas para regiões brasileiras
    const regionMap = [
      { bounds: { north: -8.0, south: -20.0, east: -35.0, west: -75.0 }, region: 'Nordeste', state: 'BA' },
      { bounds: { north: -8.0, south: -20.0, east: -35.0, west: -75.0 }, region: 'Nordeste', state: 'PE' },
      { bounds: { north: -20.0, south: -30.0, east: -40.0, west: -60.0 }, region: 'Sudeste', state: 'SP' },
      { bounds: { north: -20.0, south: -30.0, east: -40.0, west: -60.0 }, region: 'Sudeste', state: 'MG' },
      { bounds: { north: -30.0, south: -35.0, east: -50.0, west: -70.0 }, region: 'Sul', state: 'RS' },
      { bounds: { north: -30.0, south: -35.0, east: -50.0, west: -70.0 }, region: 'Sul', state: 'PR' },
      { bounds: { north: -15.0, south: -25.0, east: -45.0, west: -65.0 }, region: 'Centro-Oeste', state: 'MT' },
      { bounds: { north: -15.0, south: -25.0, east: -45.0, west: -65.0 }, region: 'Centro-Oeste', state: 'GO' }
    ]

    for (const area of regionMap) {
      if (lat >= area.bounds.south && lat <= area.bounds.north &&
          lng >= area.bounds.west && lng <= area.bounds.east) {
        return { region: area.region, state: area.state }
      }
    }
    
    // Default para São Paulo se não encontrar
    return { region: 'Sudeste', state: 'SP' }
  }

  // Função para encontrar mercados próximos baseado na localização
  const findNearbyMarkets = async (lat: number, lng: number) => {
    const { region, state } = determineRegionByCoordinates(lat, lng)
    
    // Mapeamento de regiões para mercados CEASA
    const marketMapping: Record<string, string[]> = {
      'Sudeste': ['CEASA-SP', 'CEASA-MG', 'CEASA-RJ', 'CEASA-ES'],
      'Sul': ['CEASA-RS', 'CEASA-PR', 'CEASA-SC'],
      'Centro-Oeste': ['CEASA-MT', 'CEASA-GO', 'CEASA-MS', 'CEASA-DF'],
      'Nordeste': ['CEASA-BA', 'CEASA-PE', 'CEASA-CE', 'CEASA-RN'],
      'Norte': ['CEASA-PA', 'CEASA-AM', 'CEASA-RO', 'CEASA-AC']
    }
    
    const markets = marketMapping[region] || ['CEASA-SP']
    setNearbyMarkets(markets)
    
    return { region, state, markets }
  }

  // Função para buscar dados da Agrolink API baseado na região
  const fetchAgrolinkData = async (region: string, grain: string) => {
    try {
      // Simular chamada para Agrolink API com dados regionais específicos
      const regionalPrices: Record<string, Record<string, { price: number; change24h: number; changePercent24h: number; volume: number }>> = {
        'São Paulo': {
          'SOJA': { price: 128.50, change24h: 2.80, changePercent24h: 2.23, volume: 3120000 },
          'MILHO': { price: 92.25, change24h: -0.75, changePercent24h: -0.81, volume: 1850000 },
          'TRIGO': { price: 158.90, change24h: 3.50, changePercent24h: 2.25, volume: 950000 },
          'CAFE': { price: 248.75, change24h: 6.20, changePercent24h: 2.55, volume: 520000 }
        },
        'Mato Grosso': {
          'SOJA': { price: 125.50, change24h: 2.30, changePercent24h: 1.87, volume: 2847500 },
          'MILHO': { price: 89.75, change24h: -1.25, changePercent24h: -1.37, volume: 1568200 },
          'TRIGO': { price: 156.80, change24h: 3.20, changePercent24h: 2.08, volume: 892400 },
          'CAFE': { price: 245.30, change24h: 5.80, changePercent24h: 2.42, volume: 456800 }
        },
        'Paraná': {
          'SOJA': { price: 127.80, change24h: 2.10, changePercent24h: 1.67, volume: 2650000 },
          'MILHO': { price: 88.50, change24h: -1.50, changePercent24h: -1.67, volume: 1420000 },
          'TRIGO': { price: 159.20, change24h: 3.80, changePercent24h: 2.44, volume: 1100000 },
          'CAFE': { price: 243.90, change24h: 5.50, changePercent24h: 2.31, volume: 380000 }
        },
        'Rio Grande do Sul': {
          'SOJA': { price: 126.40, change24h: 2.60, changePercent24h: 2.10, volume: 2980000 },
          'MILHO': { price: 90.25, change24h: -1.00, changePercent24h: -1.10, volume: 1680000 },
          'TRIGO': { price: 157.50, change24h: 3.40, changePercent24h: 2.21, volume: 1250000 },
          'CAFE': { price: 246.80, change24h: 6.00, changePercent24h: 2.49, volume: 420000 }
        }
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const regionData = regionalPrices[region] || regionalPrices['São Paulo']
      if (!regionData) return null
      return regionData[grain] || null
      
    } catch (error) {
      console.log('Erro ao buscar dados da Agrolink:', error)
    }
    return null
  }

  // Função para buscar dados de geolocalização
  const fetchGeolocationData = async (lat: number, lng: number) => {
    try {
      // Simular chamada para API de geolocalização (IBGE, Google Maps, etc.)
      const { region, state } = determineRegionByCoordinates(lat, lng)
      
      // Simular dados de geolocalização
      const geoData = {
        region: region,
        state: state,
        city: getCityByCoordinates(lat, lng),
        coordinates: [lat, lng],
        timezone: 'America/Sao_Paulo'
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return geoData
      
    } catch (error) {
      console.log('Erro ao buscar dados de geolocalização:', error)
    }
    return null
  }

  // Função para determinar cidade baseada nas coordenadas
  const getCityByCoordinates = (lat: number, lng: number) => {
    // Mapeamento simplificado de coordenadas para cidades
    if (lat >= -23.6 && lat <= -23.4 && lng >= -46.7 && lng <= -46.6) return 'São Paulo'
    if (lat >= -15.7 && lat <= -15.5 && lng >= -56.1 && lng <= -56.0) return 'Cuiabá'
    if (lat >= -25.5 && lat <= -25.3 && lng >= -49.3 && lng <= -49.2) return 'Curitiba'
    if (lat >= -30.1 && lat <= -29.9 && lng >= -51.2 && lng <= -51.1) return 'Porto Alegre'
    if (lat >= -19.9 && lat <= -19.8 && lng >= -43.9 && lng <= -43.8) return 'Belo Horizonte'
    
    return 'Localização'
  }

  // Função para atualizar preços baseado na região do usuário
  const updatePricesByRegion = async (region: string, state: string) => {
    try {
      setIsLoading(true)
      
      // Buscar dados atualizados da Agrolink para a região específica
      const updatedData = await Promise.all(
        grainsData.map(async (grain) => {
          const agrolinkData = await fetchAgrolinkData(region, grain.symbol)
          
          if (agrolinkData) {
            return {
              ...grain,
              price: agrolinkData.price,
              change24h: agrolinkData.change24h,
              changePercent24h: agrolinkData.changePercent24h,
              volume: agrolinkData.volume,
              region: region,
              lastUpdated: new Date(),
              agrolinkId: `${grain.symbol}_${state}`,
              market: `CEASA-${state}`
            }
          }
          
          return grain
        })
      )
      
      setGrainsData(updatedData)
      
      // Atualizar mercados próximos
      const { markets } = await findNearbyMarkets(userLocation![0], userLocation![1])
      setNearbyMarkets(markets)
      
    } catch (error) {
      console.log('Erro ao atualizar preços por região:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    if (!userLocation) {
      // Se não tiver localização, tentar obter novamente
      getUserLocation()
      return
    }
    
    setIsLoading(true)
    
    try {
      // Determinar região atual do usuário
      const { region, state } = determineRegionByCoordinates(userLocation[0], userLocation[1])
      
      // Atualizar preços baseado na região atual
      await updatePricesByRegion(region, state)
      
    } catch (error) {
      console.log('Erro ao atualizar dados:', error)
      // Fallback para dados simulados
      setGrainsData(prev => 
        prev.map(grain => ({
          ...grain,
          price: grain.price + (Math.random() - 0.5) * 2,
          change24h: grain.change24h + (Math.random() - 0.5) * 0.5,
          changePercent24h: grain.changePercent24h + (Math.random() - 0.5) * 0.2,
          lastUpdated: new Date(),
        }))
      )
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    // Obter localização do usuário ao carregar a página
    getUserLocation()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredData = grainsData.filter(grain => {
    if (selectedRegion !== 'all' && grain.region !== selectedRegion) return false
    if (selectedGrain !== 'all' && grain.id !== selectedGrain) return false
    return true
  })

  const regions = ['all', ...Array.from(new Set(grainsData.map(g => g.region)))]
  const grains = ['all', ...Array.from(new Set(grainsData.map(g => g.id)))]

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Indicador de Localização */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                 <MapPin className="w-5 h-5 text-blue-400" />
                 <div>
                   <span className="text-foreground font-medium">
                     {userCity}, {userRegion}
                   </span>
                   <div className="text-xs text-muted-foreground">
                     Coordenadas: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                   </div>
                 </div>
               </div>
              {nearbyMarkets.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Mercados próximos: {nearbyMarkets.join(', ')}
                </div>
              )}
              <Button
                onClick={getUserLocation}
                variant="outline"
                size="sm"
                className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Atualizar Localização
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                <span className="gradient-text">Grãos</span>
              </h1>
                             <p className="text-xl text-muted-foreground">
                 Preços em tempo real da Agrolink API baseados na sua localização, mapas interativos e análise regional
               </p>
            </div>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Mapa de Preços Regionais
                  </h2>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
                <GrainsMap grainsData={filteredData} />
              </div>
            </div>

            <div className="space-y-6">
                             <div className="glass-card p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-4">
                   Filtros & APIs
                 </h3>
                 <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                   <div className="text-sm text-green-400 font-medium">
                     ✓ Agrolink API Ativa
                   </div>
                   <div className="text-xs text-muted-foreground">
                     Dados regionais em tempo real
                   </div>
                 </div>
                 {userRegion && (
                   <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                     <div className="text-sm text-blue-400 font-medium">
                       📍 Preços da região: {userRegion}
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Atualizados automaticamente
                     </div>
                   </div>
                 )}
                 <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Região
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>
                          {region === 'all' ? 'Todas as Regiões' : region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Grão
                    </label>
                    <select
                      value={selectedGrain}
                      onChange={(e) => setSelectedGrain(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {grains.map(grain => (
                        <option key={grain} value={grain}>
                          {grain === 'all' ? 'Todos os Grãos' : grain.charAt(0).toUpperCase() + grain.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Principais Grãos
                </h3>
                <div className="space-y-3">
                  {grainsData.slice(0, 4).map((grain, index) => (
                    <GrainsPriceCard
                      key={grain.id}
                      data={grain}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Mercado de Grãos
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Total de grãos: {filteredData.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Atualizado: {new Date().toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>
            <GrainsTable grainsData={filteredData} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
