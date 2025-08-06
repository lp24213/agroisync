'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Chart } from '@/components/analytics/Chart';
import { MetricsCard } from '@/components/analytics/MetricsCard';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/format';
import { cn } from '@/lib/utils';

/**
 * Analytics Dashboard Component - Premium agricultural analytics interface
 * 
 * @description Comprehensive analytics dashboard for agricultural data with
 * real-time metrics, interactive charts, and AI-powered insights.
 * 
 * @features
 * - Real-time farm metrics monitoring
 * - Interactive data visualization
 * - AI-powered productivity analysis
 * - Weather and soil condition tracking
 * - Pest risk assessment
 * - Yield prediction algorithms
 * - Responsive design with animations
 * - Performance optimized
 */

interface FarmMetrics {
  soilPH: number;
  rainMM: number;
  avgTemp: number;
  pestRisk: number;
  humidity: number;
  soilMoisture: number;
  nutrientLevel: number;
  lightExposure: number;
}

interface ProductivityData {
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface AlertData {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export default function AnalyticsDashboard() {
  // Estados principais
  const [metrics, setMetrics] = useState<FarmMetrics>({
    soilPH: 6.2,
    rainMM: 800,
    avgTemp: 24,
    pestRisk: 2,
    humidity: 65,
    soilMoisture: 78,
    nutrientLevel: 85,
    lightExposure: 92
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<keyof FarmMetrics>('soilPH');
  
  // Dados calculados
  const productivity = useMemo<ProductivityData>(() => {
    const { soilPH, rainMM, avgTemp, pestRisk, humidity, soilMoisture, nutrientLevel } = metrics;
    
    // Algoritmo de produtividade baseado em múltiplos fatores
    const phScore = Math.max(0, 100 - Math.abs(soilPH - 6.5) * 20);
    const rainScore = Math.min(100, (rainMM / 1000) * 100);
    const tempScore = Math.max(0, 100 - Math.abs(avgTemp - 25) * 4);
    const pestScore = Math.max(0, 100 - pestRisk * 20);
    const humidityScore = Math.max(0, 100 - Math.abs(humidity - 70) * 2);
    const moistureScore = Math.min(100, soilMoisture);
    const nutrientScore = nutrientLevel;
    
    const current = Math.round(
      (phScore * 0.2 + rainScore * 0.15 + tempScore * 0.15 + 
       pestScore * 0.2 + humidityScore * 0.1 + moistureScore * 0.1 + nutrientScore * 0.1)
    );
    
    const predicted = Math.min(100, current + Math.random() * 10 - 5);
    const trend = predicted > current ? 'up' : predicted < current ? 'down' : 'stable';
    const confidence = Math.min(100, 70 + (current / 100) * 30);
    
    return { current, predicted, trend, confidence };
  }, [metrics]);
  
  const alerts = useMemo<AlertData[]>(() => {
    const alertList: AlertData[] = [];
    
    if (metrics.soilPH < 6.0 || metrics.soilPH > 7.0) {
      alertList.push({
        type: 'warning',
        message: `pH do solo fora do ideal (${metrics.soilPH}). Recomenda-se correção.`,
        priority: 'medium',
        timestamp: new Date()
      });
    }
    
    if (metrics.pestRisk > 3) {
      alertList.push({
        type: 'error',
        message: 'Alto risco de pragas detectado. Ação imediata necessária.',
        priority: 'high',
        timestamp: new Date()
      });
    }
    
    if (metrics.soilMoisture < 50) {
      alertList.push({
        type: 'warning',
        message: 'Umidade do solo baixa. Considere irrigação.',
        priority: 'medium',
        timestamp: new Date()
      });
    }
    
    if (productivity.current > 85) {
      alertList.push({
        type: 'success',
        message: 'Excelentes condições de produtividade!',
        priority: 'low',
        timestamp: new Date()
      });
    }
    
    return alertList;
  }, [metrics, productivity]);
  
  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular dados em tempo real
      setMetrics(prev => ({
        ...prev,
        soilPH: 6.2 + (Math.random() - 0.5) * 0.4,
        rainMM: 800 + (Math.random() - 0.5) * 200,
        avgTemp: 24 + (Math.random() - 0.5) * 6,
        pestRisk: Math.max(1, Math.min(5, 2 + (Math.random() - 0.5) * 2)),
        humidity: 65 + (Math.random() - 0.5) * 20,
        soilMoisture: 78 + (Math.random() - 0.5) * 30,
        nutrientLevel: 85 + (Math.random() - 0.5) * 20,
        lightExposure: 92 + (Math.random() - 0.5) * 10
      }));
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Atualizar dados periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        soilPH: Math.max(5.5, Math.min(7.5, prev.soilPH + (Math.random() - 0.5) * 0.1)),
        avgTemp: Math.max(18, Math.min(35, prev.avgTemp + (Math.random() - 0.5) * 1)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        soilMoisture: Math.max(30, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3))
      }));
    }, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  // Função para atualizar dados
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMetrics(prev => ({
      soilPH: 6.2 + (Math.random() - 0.5) * 0.6,
      rainMM: 800 + (Math.random() - 0.5) * 300,
      avgTemp: 24 + (Math.random() - 0.5) * 8,
      pestRisk: Math.max(1, Math.min(5, 2 + (Math.random() - 0.5) * 3)),
      humidity: 65 + (Math.random() - 0.5) * 25,
      soilMoisture: 78 + (Math.random() - 0.5) * 35,
      nutrientLevel: 85 + (Math.random() - 0.5) * 25,
      lightExposure: 92 + (Math.random() - 0.5) * 15
    }));
    
    setRefreshing(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-agro-light/60">Carregando analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-agro-darker p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-agro-light mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-agro-light/60 text-lg">
              Monitoramento inteligente da produção agrícola
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeRange('24h')}
                className={cn(timeRange === '24h' && 'bg-agro-primary text-white')}
              >
                24h
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeRange('7d')}
                className={cn(timeRange === '7d' && 'bg-agro-primary text-white')}
              >
                7d
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeRange('30d')}
                className={cn(timeRange === '30d' && 'bg-agro-primary text-white')}
              >
                30d
              </Button>
            </div>
            
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="primary"
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>🔄</span>
              )}
              Atualizar
            </Button>
          </div>
        </motion.div>
        
        {/* Alertas */}
        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "p-4 border-l-4",
                      alert.type === 'error' && "border-l-red-500 bg-red-500/10",
                      alert.type === 'warning' && "border-l-yellow-500 bg-yellow-500/10",
                      alert.type === 'success' && "border-l-green-500 bg-green-500/10",
                      alert.type === 'info' && "border-l-blue-500 bg-blue-500/10"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              alert.type === 'error' ? 'error' :
                              alert.type === 'warning' ? 'warning' :
                              alert.type === 'success' ? 'success' : 'info'
                            }
                            className="text-xs"
                          >
                            {alert.priority.toUpperCase()}
                          </Badge>
                          <span className="text-agro-light">{alert.message}</span>
                        </div>
                        <span className="text-xs text-agro-light/60">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Métricas principais */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricsCard
            title="Produtividade"
            value={`${productivity.current}%`}
            change={productivity.trend === 'up' ? '+5.2%' : productivity.trend === 'down' ? '-2.1%' : '0%'}
            trend={productivity.trend}
            icon="📈"
            description="Índice geral de produtividade"
          />
          
          <MetricsCard
            title="pH do Solo"
            value={metrics.soilPH.toFixed(1)}
            change={metrics.soilPH > 6.5 ? 'Ideal' : 'Atenção'}
            trend={metrics.soilPH >= 6.0 && metrics.soilPH <= 7.0 ? 'stable' : 'down'}
            icon="🌱"
            description="Acidez do solo"
          />
          
          <MetricsCard
            title="Temperatura"
            value={`${metrics.avgTemp.toFixed(1)}°C`}
            change={metrics.avgTemp >= 20 && metrics.avgTemp <= 30 ? 'Ideal' : 'Variação'}
            trend={metrics.avgTemp >= 20 && metrics.avgTemp <= 30 ? 'up' : 'stable'}
            icon="🌡️"
            description="Temperatura média"
          />
          
          <MetricsCard
            title="Risco de Pragas"
            value={`Nível ${metrics.pestRisk}`}
            change={metrics.pestRisk <= 2 ? 'Baixo' : metrics.pestRisk <= 3 ? 'Médio' : 'Alto'}
            trend={metrics.pestRisk <= 2 ? 'up' : 'down'}
            icon="🐛"
            description="Avaliação de risco"
          />
        </motion.div>
        
        {/* Gráficos e dados detalhados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico principal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-agro-light">
                  Tendências de Produtividade
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">
                    {formatPercentage(productivity.confidence)} confiança
                  </Badge>
                </div>
              </div>
              
              <Chart 
                data={[
                  { name: 'Jan', value: 78 },
                  { name: 'Fev', value: 82 },
                  { name: 'Mar', value: 85 },
                  { name: 'Abr', value: 79 },
                  { name: 'Mai', value: 88 },
                  { name: 'Jun', value: productivity.current }
                ]}
                type="line"
                height={300}
              />
            </Card>
          </motion.div>
          
          {/* Métricas detalhadas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-agro-light mb-6">
                Métricas Detalhadas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-agro-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <p className="text-sm font-medium text-agro-light">Umidade</p>
                      <p className="text-xs text-agro-light/60">Ar ambiente</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-agro-light">{metrics.humidity.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-agro-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌊</span>
                    <div>
                      <p className="text-sm font-medium text-agro-light">Umidade do Solo</p>
                      <p className="text-xs text-agro-light/60">Saturação hídrica</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-agro-light">{metrics.soilMoisture.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-agro-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧪</span>
                    <div>
                      <p className="text-sm font-medium text-agro-light">Nutrientes</p>
                      <p className="text-xs text-agro-light/60">Nível geral</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-agro-light">{metrics.nutrientLevel.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-agro-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">☀️</span>
                    <div>
                      <p className="text-sm font-medium text-agro-light">Exposição Solar</p>
                      <p className="text-xs text-agro-light/60">Índice diário</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-agro-light">{metrics.lightExposure.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-agro-dark/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌧️</span>
                    <div>
                      <p className="text-sm font-medium text-agro-light">Precipitação</p>
                      <p className="text-xs text-agro-light/60">Acumulado mensal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-agro-light">{formatNumber(metrics.rainMM)}mm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-agro-primary/20 to-agro-secondary/20 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-agro-light/80 mb-2">Previsão de Produtividade</p>
                  <p className="text-2xl font-bold text-agro-primary">
                    {productivity.predicted.toFixed(1)}%
                  </p>
                  <p className="text-xs text-agro-light/60 mt-1">
                    Próximos 30 dias
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}