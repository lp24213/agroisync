'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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

interface GrainsMapProps {
  grainsData: GrainData[]
}

export function GrainsMap({ grainsData }: GrainsMapProps) {
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
      
      grainsData.forEach((grain, index) => {
        const x = (grain.coordinates[1] + 60) * (canvas.width / 120)
        const y = (grain.coordinates[0] + 35) * (canvas.height / 70)
        
        const isPositive = grain.changePercent24h >= 0
        const color = isPositive ? '#10b981' : '#ef4444'
        
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = '12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(grain.symbol, x, y + 20)
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '10px Inter, sans-serif'
        ctx.fillText(`R$ ${grain.price.toFixed(2)}`, x, y + 35)
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
  }, [grainsData])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div ref={mapRef} className="w-full h-96 rounded-xl overflow-hidden" />
      
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className="text-foreground">Alta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-foreground">Baixa</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
