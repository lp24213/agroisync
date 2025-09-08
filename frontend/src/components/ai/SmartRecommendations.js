import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Lightbulb, 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Filter,
  Target,
  Zap
} from 'lucide-react'

const SmartRecommendations = ({ userId }) => {
  const { t } = useTranslation()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priority, setPriority] = useState('all')

  const categories = [
    { id: 'all', name: t('recommendations.all', 'Todas'), icon: Lightbulb },
    { id: 'products', name: t('recommendations.products', 'Produtos'), icon: Package },
    { id: 'freights', name: t('recommendations.freights', 'Fretes'), icon: Truck },
    { id: 'pricing', name: t('recommendations.pricing', 'Preços'), icon: DollarSign },
    { id: 'market', name: t('recommendations.market', 'Mercado'), icon: TrendingUp },
    { id: 'logistics', name: t('recommendations.logistics', 'Logística'), icon: MapPin }
  ]

  const priorities = [
    { id: 'all', name: t('recommendations.allPriorities', 'Todas'), color: 'gray' },
    { id: 'high', name: t('recommendations.high', 'Alta'), color: 'red' },
    { id: 'medium', name: t('recommendations.medium', 'Média'), color: 'yellow' },
    { id: 'low', name: t('recommendations.low', 'Baixa'), color: 'green' }
  ]

  const loadRecommendations = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/ai/recommendations?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(t('recommendations.error', 'Erro ao carregar recomendações'))
    } finally {
      setLoading(false)
    }
  }, [userId, t])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <Clock className="w-4 h-4" />
      case 'low':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category)
    return categoryData ? categoryData.icon : Lightbulb
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory
    const priorityMatch = priority === 'all' || rec.priority === priority
    return categoryMatch && priorityMatch
  })

  const handleApplyRecommendation = async (recommendationId) => {
    try {
      const response = await fetch(`/api/ai/recommendations/${recommendationId}/apply`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        // Atualizar a lista de recomendações
        loadRecommendations()
      }
    } catch (err) {
      console.error('Erro ao aplicar recomendação:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-agro-emerald" />
          {t('recommendations.title', 'Recomendações Inteligentes')}
        </h2>
        <button
          onClick={loadRecommendations}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de recomendações */}
      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('recommendations.noRecommendations', 'Nenhuma recomendação encontrada')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('recommendations.noRecommendationsDesc', 'Tente ajustar os filtros ou aguarde novas recomendações')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => {
            const CategoryIcon = getCategoryIcon(recommendation.category)
            
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-agro-emerald/10 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-agro-emerald" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {recommendation.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(recommendation.createdAt)}</span>
                        <span>•</span>
                        <span>{recommendation.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(recommendation.priority)}
                        <span>{recommendation.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impacto esperado */}
                {recommendation.expectedImpact && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Impacto Esperado:
                      </span>
                      <span className="text-sm text-blue-600 dark:text-blue-300">
                        {recommendation.expectedImpact}
                      </span>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {recommendation.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApplyRecommendation(recommendation.id)}
                      className="px-4 py-2 bg-agro-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{t('recommendations.apply', 'Aplicar')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SmartRecommendations