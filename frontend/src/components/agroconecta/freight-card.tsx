'use client'

import { motion } from 'framer-motion'
import { Truck, MapPin, Package, DollarSign, Calendar, User } from 'lucide-react'

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

interface FreightCardProps {
  freight: FreightData
}

export function FreightCard({ freight }: FreightCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in_transit': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-muted text-muted-foreground border-border'
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
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="glass-card p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {freight.title}
            </h3>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="text-foreground font-medium">Origem</div>
              <div className="text-muted-foreground">{freight.origin}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="text-foreground font-medium">Destino</div>
              <div className="text-muted-foreground">{freight.destination}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="text-foreground font-medium">Tipo de Grão</div>
              <div className="text-muted-foreground">{freight.grainType}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{freight.transporter}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              {freight.createdAt.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
