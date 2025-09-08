import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Loader2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ExternalLink,
  Coins,
  BarChart3,
  Shield
} from 'lucide-react'

const YieldFarmingManager = ({ userId }) => {
  const { t } = useTranslation()
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)

  const fetchFarmingData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blockchain/yield-farming?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setFarms(data.farms)
        setTotalValue(data.totalValue)
        setTotalRewards(data.totalRewards)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(t('yieldFarming.error', 'Erro ao carregar dados de yield farming'))
    } finally {
      setLoading(false)
    }
  }, [userId, t])

  useEffect(() => {
    fetchFarmingData()
  }, [fetchFarmingData])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('yieldFarming.loading', 'Carregando dados de yield farming...')}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('yieldFarming.title', 'Yield Farming Manager')}
        </h2>
      </div>

      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yieldFarming.totalValue', 'Valor Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yieldFarming.totalRewards', 'Recompensas Totais')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalRewards)}
              </p>
            </div>
            <Coins className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yieldFarming.totalFarms', 'Total de Farms')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {farms.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Farms */}
      {farms.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('yieldFarming.noFarms', 'Nenhuma farm encontrada')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {farms.map((farm) => (
            <div key={farm.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {farm.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {farm.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(farm.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {farm.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yieldFarming.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(farm.value)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yieldFarming.apy', 'APY')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPercentage(farm.apy)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yieldFarming.rewards', 'Recompensas')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(farm.rewards)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yieldFarming.risk', 'Risco')}:
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(farm.risk)}`}>
                    {farm.risk}
                  </span>
                </div>
              </div>

              {/* Progresso */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('yieldFarming.progress', 'Progresso')}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPercentage(farm.progress)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-agro-emerald h-2 rounded-full transition-all duration-300"
                    style={{ width: `${farm.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Tokens */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('yieldFarming.tokens', 'Tokens')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {farm.tokens?.map((token) => (
                    <span
                      key={token.symbol}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      {token.symbol}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('yieldFarming.lastActivity', 'Última Atividade')}: {farm.lastActivity}
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              {t('yieldFarming.warning', 'Aviso de Risco')}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('yieldFarming.warningText', 'Yield farming envolve riscos. Sempre faça sua própria pesquisa antes de investir.')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default YieldFarmingManager