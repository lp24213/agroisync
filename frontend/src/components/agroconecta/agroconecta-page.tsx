'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  MapPin, 
  Package, 
  DollarSign,
  Filter,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  User
} from 'lucide-react'
import { FreightCard } from './freight-card'
import { FreightForm } from './freight-form'
import { FreightMap } from './freight-map'
import { Button } from '@/components/ui/button'

interface FreightData {
  id: string
  title: string
  origin: string
  destination: string
  grainType: string
  weight: number
  price: number
  status: 'available' | 'in_transit' | 'completed'
  transporter: string
  createdAt: Date
  coordinates: {
    origin: [number, number]
    destination: [number, number]
  }
}

const mockFreightData: FreightData[] = [
  {
    id: '1',
    title: 'Frete Soja MT → SP',
    origin: 'Cuiabá, MT',
    destination: 'São Paulo, SP',
    grainType: 'Soja',
    weight: 30000,
    price: 4500,
    status: 'available',
    transporter: 'Transportadora Norte',
    createdAt: new Date(),
    coordinates: {
      origin: [-15.6014, -56.0979],
      destination: [-23.5505, -46.6333],
    },
  },
  {
    id: '2',
    title: 'Frete Milho PR → RS',
    origin: 'Curitiba, PR',
    destination: 'Porto Alegre, RS',
    grainType: 'Milho',
    weight: 25000,
    price: 3200,
    status: 'available',
    transporter: 'Logística Sul',
    createdAt: new Date(),
    coordinates: {
      origin: [-25.4284, -49.2733],
      destination: [-30.0346, -51.2177],
    },
  },
  {
    id: '3',
    title: 'Frete Trigo RS → MG',
    origin: 'Pelotas, RS',
    destination: 'Belo Horizonte, MG',
    grainType: 'Trigo',
    weight: 20000,
    price: 3800,
    status: 'in_transit',
    transporter: 'Expresso Central',
    createdAt: new Date(),
    coordinates: {
      origin: [-31.7719, -52.3428],
      destination: [-19.9167, -43.9345],
    },
  },
]

export function AgroConectaPage() {
  const [freightData, setFreightData] = useState<FreightData[]>(mockFreightData)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGrain, setSelectedGrain] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const refreshData = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setFreightData(prev => 
        prev.map(freight => ({
          ...freight,
          price: freight.price + (Math.random() - 0.5) * 100,
          createdAt: new Date(),
        }))
      )
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredData = freightData.filter(freight => {
    if (selectedStatus !== 'all' && freight.status !== selectedStatus) return false
    if (selectedGrain !== 'all' && freight.grainType !== selectedGrain) return false
    if (searchTerm && !freight.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const statuses = ['all', 'available', 'in_transit', 'completed']
  const grains = ['all', ...Array.from(new Set(freightData.map(f => f.grainType)))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400'
      case 'in_transit': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'in_transit': return 'Em Trânsito'
      case 'completed': return 'Concluído'
      default: return status
    }
  }

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
                <span className="gradient-text">AgroConecta</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Marketplace de fretes agrícolas - Conectando transportadores e produtores
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={refreshData}
                disabled={isLoading}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-neon-blue to-neon-cyan"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Frete</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Mapa de Fretes
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Total: {filteredData.length} fretes
                    </span>
                  </div>
                </div>
                <FreightMap freightData={filteredData} />
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
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'all' ? 'Todos os Status' : getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tipo de Grão
                    </label>
                    <select
                      value={selectedGrain}
                      onChange={(e) => setSelectedGrain(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {grains.map(grain => (
                        <option key={grain} value={grain}>
                          {grain === 'all' ? 'Todos os Grãos' : grain}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar fretes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Estatísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de Fretes</span>
                    <span className="font-semibold text-foreground">{freightData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Disponíveis</span>
                    <span className="font-semibold text-green-400">
                      {freightData.filter(f => f.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Em Trânsito</span>
                    <span className="font-semibold text-yellow-400">
                      {freightData.filter(f => f.status === 'in_transit').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Concluídos</span>
                    <span className="font-semibold text-blue-400">
                      {freightData.filter(f => f.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Fretes Disponíveis
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Mostrando {filteredData.length} de {freightData.length} fretes
                </span>
              </div>
            </div>
            
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum frete encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou criar um novo frete.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((freight) => (
                  <FreightCard
                    key={freight.id}
                    freight={freight}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showForm && (
        <FreightForm
          onClose={() => setShowForm(false)}
          onSubmit={(newFreight) => {
            setFreightData(prev => [newFreight, ...prev])
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}
