import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link, Loader2, CheckCircle, Clock, AlertCircle, DollarSign, Zap, ExternalLink } from 'lucide-react'

const CrossChainManager = ({ userId }) => {
  const { t } = useTranslation()
  const [crossChains, setCrossChains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [activeCrossChains, setActiveCrossChains] = useState(0)

  useEffect(() => {
    fetchCrossChainData()
  }, [userId])

  const fetchCrossChainData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blockchain/crosschains?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setCrossChains(data.crossChains)
        setTotalValue(data.totalValue)
        setActiveCrossChains(data.activeCrossChains)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(t('crosschain.error', 'Erro ao carregar dados de cross-chain'))
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('crosschain.loading', 'Carregando dados de cross-chain...')}
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
          <Link className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('crosschain.title', 'Cross-Chain Manager')}
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
                {t('crosschain.totalValue', 'Valor Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('crosschain.activeCrossChains', 'Cross-Chains Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeCrossChains}
              </p>
            </div>
            <Link className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('crosschain.totalCrossChains', 'Total de Cross-Chains')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {crossChains.length}
              </p>
            </div>
            <Link className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Cross-Chains */}
      {crossChains.length === 0 ? (
        <div className="text-center py-8">
          <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('crosschain.noCrossChains', 'Nenhum cross-chain encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {crossChains.map((crossChain) => (
            <div key={crossChain.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {crossChain.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {crossChain.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(crossChain.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {crossChain.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('crosschain.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${crossChain.value.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('crosschain.transactions', 'Transações')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {crossChain.transactions}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('crosschain.fee', 'Taxa')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {crossChain.fee}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('crosschain.speed', 'Velocidade')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {crossChain.speed}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('crosschain.lastActivity', 'Última Atividade')}: {crossChain.lastActivity}
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Zap className="w-4 h-4" />
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
    </motion.div>
  )
}

export default CrossChainManager