import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Wallet, Loader2, CheckCircle, Clock, AlertCircle, DollarSign, Zap, ExternalLink } from 'lucide-react'

const CryptoWalletManager = ({ userId }) => {
  const { t } = useTranslation()
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [activeWallets, setActiveWallets] = useState(0)

  useEffect(() => {
    fetchWalletData()
  }, [userId])

  const fetchWalletData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blockchain/wallets?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setWallets(data.wallets)
        setTotalValue(data.totalValue)
        setActiveWallets(data.activeWallets)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(t('wallet.error', 'Erro ao carregar dados de carteiras'))
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
          {t('wallet.loading', 'Carregando dados de carteiras...')}
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
          <Wallet className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('wallet.title', 'Crypto Wallet Manager')}
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
                {t('wallet.totalValue', 'Valor Total')}
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
                {t('wallet.activeWallets', 'Carteiras Ativas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeWallets}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('wallet.totalWallets', 'Total de Carteiras')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {wallets.length}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Carteiras */}
      {wallets.length === 0 ? (
        <div className="text-center py-8">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('wallet.noWallets', 'Nenhuma carteira encontrada')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {wallet.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(wallet.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('wallet.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${wallet.value.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('wallet.transactions', 'Transações')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {wallet.transactions}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('wallet.fee', 'Taxa')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {wallet.fee}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('wallet.speed', 'Velocidade')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {wallet.speed}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('wallet.lastActivity', 'Última Atividade')}: {wallet.lastActivity}
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

export default CryptoWalletManager