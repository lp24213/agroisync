'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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

interface FreightMapProps {
  freightData: FreightData[]
}

export function FreightMap({ freightData }: FreightMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const mapContainer = mapRef.current
    mapContainer.innerHTML = ''

    const canvas = document.createElement('canvas')
    canvas.width = mapContainer.clientWidth
    canvas.height = 400
    canvas.style.width = '100%'
    canvas.style.height = '400px'
    canvas.style.borderRadius = '12px'
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
    
    mapContainer.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      freightData.forEach((freight) => {
        const originX = (freight.coordinates.origin[1] + 60) * (canvas.width / 120)
        const originY = (freight.coordinates.origin[0] + 35) * (canvas.height / 70)
        const destX = (freight.coordinates.destination[1] + 60) * (canvas.width / 120)
        const destY = (freight.coordinates.destination[0] + 35) * (canvas.height / 70)
        
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'available': return '#10b981'
            case 'in_transit': return '#f59e0b'
            case 'completed': return '#3b82f6'
            default: return '#6b7280'
          }
        }
        
        const color = getStatusColor(freight.status)
        
        ctx.beginPath()
        ctx.moveTo(originX, originY)
        ctx.lineTo(destX, destY)
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
        
        ctx.beginPath()
        ctx.arc(originX, originY, 6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.beginPath()
        ctx.arc(destX, destY, 6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(freight.grainType, (originX + destX) / 2, (originY + destY) / 2 - 10)
        ctx.fillText(`R$ ${freight.price.toLocaleString('pt-BR')}`, (originX + destX) / 2, (originY + destY) / 2 + 5)
      })
    }

    drawMap()

    const handleResize = () => {
      canvas.width = mapContainer.clientWidth
      canvas.height = 400
      drawMap()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [freightData])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div ref={mapRef} className="w-full h-96 rounded-xl overflow-hidden" />
      
        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-foreground">Disponível</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="text-foreground">Em Trânsito</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-foreground">Concluído</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
