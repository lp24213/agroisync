import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Image, Loader2, CheckCircle, Clock, AlertCircle, DollarSign, Zap, ExternalLink } from 'lucide-react'

const NFTManager = ({ userId }) => {
  const { t } = useTranslation()
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [activeNfts, setActiveNfts] = useState(0)

  useEffect(() => {
    fetchNFTData()
  }, [userId])

  const fetchNFTData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blockchain/nfts?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setNfts(data.nfts)
        setTotalValue(data.totalValue)
        setActiveNfts(data.activeNfts)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(t('nft.error', 'Erro ao carregar dados de NFTs'))
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
          {t('nft.loading', 'Carregando dados de NFTs...')}
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
          <Image className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('nft.title', 'NFT Manager')}
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
                {t('nft.totalValue', 'Valor Total')}
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
                {t('nft.activeNfts', 'NFTs Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeNfts}
              </p>
            </div>
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('nft.totalNfts', 'Total de NFTs')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {nfts.length}
              </p>
            </div>
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* NFTs */}
      {nfts.length === 0 ? (
        <div className="text-center py-8">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('nft.noNfts', 'Nenhum NFT encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {nft.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {nft.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(nft.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {nft.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('nft.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${nft.value.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('nft.transactions', 'Transações')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {nft.transactions}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('nft.fee', 'Taxa')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {nft.fee}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('nft.speed', 'Velocidade')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {nft.speed}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('nft.lastActivity', 'Última Atividade')}: {nft.lastActivity}
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

export default NFTManager