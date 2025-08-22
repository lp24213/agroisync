'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ChartData {
  month: string
  revenue: number
  orders: number
  users: number
}

interface AnalyticsChartProps {
  data: ChartData[]
  type: 'revenue' | 'orders'
  height: number
}

export function AnalyticsChart({ data, type, height }: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = height
    }

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2
      
      const maxValue = Math.max(...data.map(d => type === 'revenue' ? d.revenue : d.orders))
      const minValue = 0
      
      const xStep = chartWidth / (data.length - 1)
      const yStep = chartHeight / (maxValue - minValue)
      
      ctx.strokeStyle = type === 'revenue' ? '#10b981' : '#3b82f6'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      data.forEach((point, index) => {
        const x = padding + index * xStep
        const y = canvas.height - padding - (type === 'revenue' ? point.revenue : point.orders) * yStep
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      
      data.forEach((point, index) => {
        const x = padding + index * xStep
        const y = canvas.height - padding - (type === 'revenue' ? point.revenue : point.orders) * yStep
        
        ctx.fillStyle = type === 'revenue' ? '#10b981' : '#3b82f6'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = '12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(point.month, x, canvas.height - 10)
      })
    }

    resizeCanvas()
    drawChart()

    const handleResize = () => {
      resizeCanvas()
      drawChart()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [data, type, height])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
        />
      </div>
    </motion.div>
  )
}
