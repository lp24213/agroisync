import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins, Wallet, BarChart3, RefreshCw, Star, Zap, Activity } from 'lucide-react'
import cryptoService from '../services/cryptoService'

const CryptoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState({})
  const [portfolio, setPortfolio] = useState({})
  const [recentTransactions, setRecentTransactions] = useState([])
  // const [watchlist, setWatchlist] = useState([])

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Coins },
    { id: 'portfolio', label: 'Portfólio', icon: Wallet },
    { id: 'market', label: 'Mercado', icon: BarChart3 },
    { id: 'watchlist', label: 'Favoritos', icon: Star },
    { id: 'activity', label: 'Atividade', icon: Activity }
  ]

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Carregar dados em paralelo
      const [marketDataResult, portfolioResult, transactionsResult] = await Promise.all([
        cryptoService.getCryptoPrices(['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']),
        cryptoService.getUserPortfolio(),
        cryptoService.getTransactionHistory()
      ])

      setMarketData(marketDataResult.prices || {})
      setPortfolio(portfolioResult.portfolio || {})
      setRecentTransactions(transactionsResult.transactions || [])
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [loadDashboardData])

  const getPriceChangeColor = change => {
    if (!change) return 'text-gray-500'
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getPriceChangeIcon = change => {
    if (!change) return null
    return change > 0 ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = value => {
    if (!value) return '0.00%'
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const renderOverview = () => (
    <div className='space-y-6'>
      {/* Cards de Resumo */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-blue-100'>Valor Total</p>
              <p className='text-2xl font-bold'>
                {portfolio.totalValue ? formatCurrency(portfolio.totalValue) : 'R$ 0,00'}
              </p>
            </div>
            <Coins className='h-8 w-8 text-blue-200' />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-green-100'>24h %</p>
              <p className='text-2xl font-bold'>
                {portfolio.totalChange24h ? formatPercentage(portfolio.totalChange24h) : '0.00%'}
              </p>
            </div>
            <TrendingUp className='h-8 w-8 text-green-200' />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-purple-100'>Ativos</p>
              <p className='text-2xl font-bold'>{portfolio.assets ? portfolio.assets.length : 0}</p>
            </div>
            <Wallet className='h-8 w-8 text-purple-200' />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-orange-100'>Transações</p>
              <p className='text-2xl font-bold'>{recentTransactions.length}</p>
            </div>
            <Activity className='h-8 w-8 text-orange-200' />
          </div>
        </motion.div>
      </div>

      {/* Top Criptomoedas */}
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Top Criptomoedas</h3>
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className='space-y-3'>
          {Object.entries(marketData).map(([cryptoId, data]) => (
            <motion.div
              key={cryptoId}
              whileHover={{ backgroundColor: '#f8fafc' }}
              className='flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700'
            >
              <div className='flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700'>
                  <span className='text-lg'>{getCryptoIcon(cryptoId)}</span>
                </div>
                <div>
                  <p className='font-medium capitalize text-gray-900 dark:text-white'>{cryptoId}</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {data.brl ? formatCurrency(data.brl) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className='text-right'>
                <div className={`flex items-center space-x-1 ${getPriceChangeColor(data.change24h)}`}>
                  {getPriceChangeIcon(data.change24h)}
                  <span className='font-medium'>{formatPercentage(data.change24h)}</span>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {data.usd ? `$${data.usd.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPortfolio = () => (
    <div className='space-y-6'>
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>Distribuição do Portfólio</h3>

        {portfolio.assets && portfolio.assets.length > 0 ? (
          <div className='space-y-4'>
            {portfolio.assets.map(asset => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.01 }}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700'
              >
                <div className='flex items-center space-x-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white'>
                    {asset.symbol}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>{asset.name}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {asset.amount} {asset.symbol}
                    </p>
                  </div>
                </div>

                <div className='text-right'>
                  <p className='font-semibold text-gray-900 dark:text-white'>{formatCurrency(asset.value)}</p>
                  <div className={`flex items-center space-x-1 ${getPriceChangeColor(asset.change24h)}`}>
                    {getPriceChangeIcon(asset.change24h)}
                    <span className='text-sm'>{formatPercentage(asset.change24h)}</span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {asset.allocation.toFixed(1)}% do portfólio
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='py-8 text-center'>
            <Wallet className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <p className='text-gray-500 dark:text-gray-400'>Nenhum ativo no portfólio ainda</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderMarket = () => (
    <div className='space-y-6'>
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>Análise de Mercado</h3>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <h4 className='mb-3 font-medium text-gray-700 dark:text-gray-300'>Indicadores Técnicos</h4>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>RSI (14)</span>
                <span className='font-medium'>65.4</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>MACD</span>
                <span className='font-medium text-green-600'>+0.0023</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Média Móvel (50)</span>
                <span className='font-medium'>$48,250</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='mb-3 font-medium text-gray-700 dark:text-gray-300'>Estatísticas</h4>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Volume 24h</span>
                <span className='font-medium'>$2.4B</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Cap. de Mercado</span>
                <span className='font-medium'>$950B</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Dominância</span>
                <span className='font-medium'>48.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWatchlist = () => (
    <div className='space-y-6'>
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Lista de Favoritos</h3>
          <button className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
            <Star className='h-4 w-4' />
          </button>
        </div>

        <div className='py-8 text-center'>
          <Star className='mx-auto mb-4 h-16 w-16 text-gray-300' />
          <p className='text-gray-500 dark:text-gray-400'>
            Adicione criptomoedas aos seus favoritos para acompanhar mais de perto
          </p>
        </div>
      </div>
    </div>
  )

  const renderActivity = () => (
    <div className='space-y-6'>
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>Atividade Recente</h3>

        {recentTransactions.length > 0 ? (
          <div className='space-y-3'>
            {recentTransactions.slice(0, 5).map(tx => (
              <motion.div
                key={tx.id}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className='flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      tx.type === 'BUY'
                        ? 'bg-green-100 text-green-600'
                        : tx.type === 'SELL'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {tx.type === 'BUY' ? (
                      <TrendingUp className='h-4 w-4' />
                    ) : tx.type === 'SELL' ? (
                      <TrendingDown className='h-4 w-4' />
                    ) : (
                      <Zap className='h-4 w-4' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {tx.type} {tx.symbol}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(tx.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className='text-right'>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {tx.amount} {tx.symbol}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='py-8 text-center'>
            <Activity className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <p className='text-gray-500 dark:text-gray-400'>Nenhuma transação recente</p>
          </div>
        )}
      </div>
    </div>
  )

  const getCryptoIcon = cryptoId => {
    const icons = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      binancecoin: '🟡',
      cardano: '₳',
      solana: '◎'
    }
    return icons[cryptoId] || cryptoId.toUpperCase().charAt(0)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'portfolio':
        return renderPortfolio()
      case 'market':
        return renderMarket()
      case 'watchlist':
        return renderWatchlist()
      case 'activity':
        return renderActivity()
      default:
        return renderOverview()
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Dashboard de Criptomoedas</h2>
          <p className='text-gray-600 dark:text-gray-400'>Acompanhe seus investimentos e o mercado em tempo real</p>
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className='rounded-xl bg-white p-2 shadow-sm dark:bg-gray-800'>
        <div className='flex space-x-1'>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon className='h-4 w-4' />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CryptoDashboard
