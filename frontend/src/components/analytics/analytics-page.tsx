'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  Truck,
  Globe,
  Activity,
  Calendar,
  Target
} from 'lucide-react'
import { AnalyticsChart } from './analytics-chart'
import { AnalyticsMetric } from './analytics-metric'
import { AnalyticsTable } from './analytics-table'

interface AnalyticsData {
  revenue: number
  users: number
  orders: number
  freight: number
  growth: number
  conversion: number
}

const mockAnalyticsData: AnalyticsData = {
  revenue: 1250000,
  users: 15420,
  orders: 8920,
  freight: 2340,
  growth: 23.5,
  conversion: 8.7,
}

export function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        revenue: prev.revenue + (Math.random() - 0.5) * 10000,
        users: prev.users + Math.floor((Math.random() - 0.5) * 100),
        orders: prev.orders + Math.floor((Math.random() - 0.5) * 50),
        freight: prev.freight + Math.floor((Math.random() - 0.5) * 20),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    {
      title: 'Receita Total',
      value: `R$ ${(analyticsData.revenue / 1000000).toFixed(1)}M`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Usuários Ativos',
      value: analyticsData.users.toLocaleString('pt-BR'),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Pedidos',
      value: analyticsData.orders.toLocaleString('pt-BR'),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Fretes',
      value: analyticsData.freight.toLocaleString('pt-BR'),
      change: '+22.1%',
      changeType: 'positive' as const,
      icon: Truck,
      color: 'from-orange-500 to-red-600',
    },
  ]

  const chartData = [
    { month: 'Jan', revenue: 120000, orders: 450, users: 1200 },
    { month: 'Fev', revenue: 135000, orders: 520, users: 1350 },
    { month: 'Mar', revenue: 142000, orders: 580, users: 1480 },
    { month: 'Abr', revenue: 158000, orders: 620, users: 1620 },
    { month: 'Mai', revenue: 165000, orders: 680, users: 1750 },
    { month: 'Jun', revenue: 178000, orders: 720, users: 1880 },
    { month: 'Jul', revenue: 185000, orders: 780, users: 1950 },
    { month: 'Ago', revenue: 192000, orders: 820, users: 2020 },
    { month: 'Set', revenue: 198000, orders: 860, users: 2080 },
    { month: 'Out', revenue: 205000, orders: 900, users: 2150 },
    { month: 'Nov', revenue: 218000, orders: 950, users: 2280 },
    { month: 'Dez', revenue: 235000, orders: 1000, users: 2420 },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  <span className="gradient-text">Analytics</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Métricas e insights para otimizar sua operação
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="1y">Último ano</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <AnalyticsMetric
                  key={metric.title}
                  metric={metric}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Receita Mensal
                  </h2>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">+{analyticsData.growth}%</span>
                  </div>
                </div>
                <AnalyticsChart
                  data={chartData}
                  type="revenue"
                  height={300}
                />
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Pedidos e Usuários
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400">Crescimento</span>
                  </div>
                </div>
                <AnalyticsChart
                  data={chartData}
                  type="orders"
                  height={300}
                />
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Performance por Região
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Taxa de conversão: {analyticsData.conversion}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Período: {selectedPeriod}
                  </span>
                </div>
              </div>
              <AnalyticsTable />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
