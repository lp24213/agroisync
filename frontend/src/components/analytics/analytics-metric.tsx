'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Metric {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: LucideIcon
  color: string
}

interface AnalyticsMetricProps {
  metric: Metric
  delay: number
}

export function AnalyticsMetric({ metric, delay }: AnalyticsMetricProps) {
  const Icon = metric.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="glass-card p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            metric.changeType === 'positive' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {metric.change}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {metric.title}
          </h3>
          <p className="text-2xl font-bold text-foreground">
            {metric.value}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
