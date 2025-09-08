import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Target,
  Zap
} from 'lucide-react'

const PricePrediction = ({ userId }) => {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [predictions, setPredictions] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [confidence, setConfidence] = useState(0)

  const products = [
    { id: 'soja', name: 'Soja', category: 'Grãos' },
    { id: 'milho', name: 'Milho', category: 'Grãos' },
    { id: 'cafe', name: 'Café', category: 'Commodities' },
    { id: 'acucar', name: 'Açúcar', category: 'Commodities' },
    { id: 'algodao', name: 'Algodão', category: 'Fibras' },
    { id: 'boi', name: 'Boi Gordo', category: 'Pecuária' }
  ]

  const regions = [
    { id: 'sp', name: 'São Paulo' },
    { id: 'mg', name: 'Minas Gerais' },
    { id: 'pr', name: 'Paraná' },
    { id: 'rs', name: 'Rio Grande do Sul' },
    { id: 'mt', name: 'Mato Grosso' },
    { id: 'go', name: 'Goiás' }
  ]

  const periods = [
    { id: '7', name: '7 dias' },
    { id: '30', name: '30 dias' },
    { id: '90', name: '90 dias' },
    { id: '180', name: '180 dias' },
    { id: '365', name: '1 ano' }
  ]

  useEffect(() => {
    if (selectedProduct && selectedRegion) {
      generatePrediction()
    }
  }, [selectedProduct, selectedRegion, selectedPeriod])

  const generatePrediction = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockPrediction = {
        currentPrice: Math.random() * 100 + 50,
        predictedPrice: Math.random() * 100 + 50,
        change: (Math.random() - 0.5) * 20,
        confidence: Math.random() * 30 + 70,
        factors: [
          { name: 'Demanda', impact: Math.random() * 20 - 10, weight: 0.3 },
          { name: 'Oferta', impact: Math.random() * 20 - 10, weight: 0.25 },
          { name: 'Clima', impact: Math.random() * 20 - 10, weight: 0.2 },
          { name: 'Câmbio', impact: Math.random() * 20 - 10, weight: 0.15 },
          { name: 'Política', impact: Math.random() * 20 - 10, weight: 0.1 }
        ],
        historicalData: generateHistoricalData(),
        recommendations: [
          'Aguardar melhor momento para venda',
          'Considerar hedge com derivativos',
          'Monitorar indicadores climáticos'
        ]
      }
      
      setPredictions(mockPrediction)
      setConfidence(mockPrediction.confidence)
    } catch (err) {
      setError('Erro ao gerar previsão')
    } finally {
      setIsLoading(false)
    }
  }

  const generateHistoricalData = () => {
    const data = []
    const days = parseInt(selectedPeriod)
    const basePrice = Math.random() * 100 + 50
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: basePrice + (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000 + 100
      })
    }
    
    return data
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-agro-emerald" />
          Previsão de Preços
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Produto
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Região
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Selecione uma região</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
        </div>
      ) : predictions ? (
        <div className="space-y-6">
          {/* Resumo da previsão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preço Atual
                </h3>
                <DollarSign className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(predictions.currentPrice)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preço Previsto
                </h3>
                <Target className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(predictions.predictedPrice)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Variação
                </h3>
                <div className={`flex items-center ${getChangeColor(predictions.change)}`}>
                  {getChangeIcon(predictions.change)}
                </div>
              </div>
              <p className={`text-2xl font-bold ${getChangeColor(predictions.change)}`}>
                {formatChange(predictions.change)}
              </p>
            </div>
          </div>

          {/* Confiança da previsão */}
          <div className="bg-gradient-to-r from-agro-emerald to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Confiança da Previsão</h3>
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-2xl font-bold">{confidence.toFixed(1)}%</span>
            </div>
          </div>

          {/* Fatores de influência */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fatores de Influência
            </h3>
            <div className="space-y-3">
              {predictions.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-agro-emerald rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {factor.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      factor.impact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Peso: {(factor.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recomendações
            </h3>
            <div className="space-y-3">
              {predictions.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span className="text-blue-700 dark:text-blue-400">
                    {recommendation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Selecione um produto e região
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Escolha os filtros acima para gerar uma previsão de preços
          </p>
        </div>
      )}
    </div>
  )
}

export default PricePrediction