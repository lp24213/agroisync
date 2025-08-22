'use client'

import { useState, useEffect } from 'react'
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
  region: string
  coordinates: [number, number]
  lastUpdated: Date
}

const mockGrainsData: GrainData[] = [
  {
    id: 'soja',
    name: 'Soja',
    symbol: 'SOJA',
    price: 125.50,
    change24h: 2.30,
    changePercent24h: 1.87,
    region: 'Mato Grosso',
    coordinates: [-15.6014, -56.0979],
    lastUpdated: new Date(),
  },
  {
    id: 'milho',
    name: 'Milho',
    symbol: 'MILHO',
    price: 89.75,
    change24h: -1.25,
    changePercent24h: -1.37,
    region: 'Paraná',
    coordinates: [-25.4284, -49.2733],
    lastUpdated: new Date(),
  },
  {
    id: 'trigo',
    name: 'Trigo',
    symbol: 'TRIGO',
    price: 156.80,
    change24h: 3.20,
    changePercent24h: 2.08,
    region: 'Rio Grande do Sul',
    coordinates: [-30.0346, -51.2177],
    lastUpdated: new Date(),
  },
  {
    id: 'cafe',
    name: 'Café',
    symbol: 'CAFE',
    price: 245.30,
    change24h: 5.80,
    changePercent24h: 2.42,
    region: 'Minas Gerais',
    coordinates: [-19.9167, -43.9345],
    lastUpdated: new Date(),
  },
]

export function GrainsPage() {
  const [grainsData, setGrainsData] = useState<GrainData[]>(mockGrainsData)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedGrain, setSelectedGrain] = useState<string>('all')

  const refreshData = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setGrainsData(prev => 
        prev.map(grain => ({
          ...grain,
          price: grain.price + (Math.random() - 0.5) * 2,
          change24h: grain.change24h + (Math.random() - 0.5) * 0.5,
          changePercent24h: grain.changePercent24h + (Math.random() - 0.5) * 0.2,
          lastUpdated: new Date(),
        }))
      )
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
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
                Preços em tempo real, mapas interativos e análise regional
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
                  Filtros
                </h3>
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
                  {grainsData.slice(0, 4).map((grain) => (
                    <GrainsPriceCard
                      key={grain.id}
                      grain={grain}
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
