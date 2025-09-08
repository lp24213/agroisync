import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  Shield,
  Zap,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  FileText,
  Star,
  Heart,
  Share2,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

const CryptoCard = ({ crypto, onFavorite, onView, onTrade, onStake, userType }) => {
  const [isFavorite, setIsFavorite] = useState(crypto.isFavorite || false)
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite(crypto.id, !isFavorite)
  }

  const handleView = () => {
    if (onView) onView(crypto)
  }

  const handleTrade = () => {
    if (onTrade) onTrade(crypto)
  }

  const handleStake = () => {
    if (onStake) onStake(crypto)
  }

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatPrice = price => {
    if (typeof price === 'number') {
      if (price >= 1) {
        return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      } else {
        return `$${price.toFixed(6)}`
      }
    }
    return price
  }

  const formatPercentage = percentage => {
    if (typeof percentage === 'number') {
      const sign = percentage >= 0 ? '+' : ''
      return `${sign}${percentage.toFixed(2)}%`
    }
    return percentage
  }

  const formatVolume = volume => {
    if (typeof volume === 'number') {
      if (volume >= 1e9) {
        return `$${(volume / 1e9).toFixed(2)}B`
      } else if (volume >= 1e6) {
        return `$${(volume / 1e6).toFixed(2)}M`
      } else if (volume >= 1e3) {
        return `$${(volume / 1e3).toFixed(2)}K`
      } else {
        return `$${volume.toFixed(2)}`
      }
    }
    return volume
  }

  const formatMarketCap = marketCap => {
    if (typeof marketCap === 'number') {
      if (marketCap >= 1e12) {
        return `$${(marketCap / 1e12).toFixed(2)}T`
      } else if (marketCap >= 1e9) {
        return `$${(marketCap / 1e9).toFixed(2)}B`
      } else if (marketCap >= 1e6) {
        return `$${(marketCap / 1e6).toFixed(2)}M`
      } else {
        return `$${marketCap.toFixed(2)}`
      }
    }
    return marketCap
  }

  const getPriceChangeColor = percentage => {
    if (typeof percentage === 'number') {
      return percentage >= 0 ? 'text-emerald-600' : 'text-red-600'
    }
    return 'text-slate-600'
  }

  const getPriceChangeBgColor = percentage => {
    if (typeof percentage === 'number') {
      return percentage >= 0 ? 'bg-emerald-100' : 'bg-red-100'
    }
    return 'bg-slate-100'
  }

  const getPriceChangeIcon = percentage => {
    if (typeof percentage === 'number') {
      return percentage >= 0 ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />
    }
    return <Activity className='h-4 w-4' />
  }

  const getCryptoIcon = cryptoId => {
    const icons = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      solana: '◎',
      cardano: '₳',
      polkadot: '●',
      chainlink: '🔗',
      litecoin: 'Ł',
      'bitcoin-cash': '₿',
      stellar: '★',
      ripple: '✕'
    }
    return icons[cryptoId] || '₿'
  }

  const getCryptoColor = cryptoId => {
    const colors = {
      bitcoin: 'from-orange-500 to-yellow-500',
      ethereum: 'from-blue-500 to-purple-500',
      solana: 'from-purple-500 to-pink-500',
      cardano: 'from-blue-600 to-indigo-600',
      polkadot: 'from-pink-500 to-red-500',
      chainlink: 'from-blue-500 to-cyan-500',
      litecoin: 'from-slate-400 to-gray-500',
      'bitcoin-cash': 'from-orange-400 to-yellow-400',
      stellar: 'from-cyan-500 to-blue-500',
      ripple: 'from-slate-600 to-gray-700'
    }
    return colors[cryptoId] || 'from-emerald-500 to-blue-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className='group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl'
    >
      {/* Header com ícone e favorito */}
      <div className='p-6 pb-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className={`h-12 w-12 bg-gradient-to-r ${getCryptoColor(crypto.id)} flex items-center justify-center rounded-xl text-2xl font-bold text-white`}
            >
              {getCryptoIcon(crypto.id)}
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-800'>{crypto.name}</h3>
              <p className='text-sm text-slate-600'>{crypto.symbol.toUpperCase()}</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={`rounded-lg p-2 transition-colors duration-200 ${
                isFavorite
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(!showDetails)}
              className='rounded-lg bg-slate-100 p-2 transition-colors duration-200 hover:bg-slate-200'
            >
              <MoreVertical className='h-4 w-4 text-slate-600' />
            </motion.button>
          </div>
        </div>

        {/* Preço principal */}
        <div className='mb-4'>
          <div className='flex items-center justify-between'>
            <span className='text-3xl font-bold text-slate-800'>{formatPrice(crypto.current_price)}</span>
            <div
              className={`rounded-full px-3 py-1 ${getPriceChangeBgColor(crypto.price_change_percentage_24h)} ${getPriceChangeColor(crypto.price_change_percentage_24h)} flex items-center space-x-1`}
            >
              {getPriceChangeIcon(crypto.price_change_percentage_24h)}
              <span className='text-sm font-medium'>{formatPercentage(crypto.price_change_percentage_24h)}</span>
            </div>
          </div>
        </div>

        {/* Informações principais */}
        <div className='mb-4 grid grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <BarChart3 className='h-4 w-4 text-slate-400' />
            <span className='text-sm text-slate-600'>{formatVolume(crypto.total_volume)}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Globe className='h-4 w-4 text-slate-400' />
            <span className='text-sm text-slate-600'>{formatMarketCap(crypto.market_cap)}</span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className='flex space-x-3'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleView}
            className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200'
          >
            <Eye className='h-4 w-4' />
            <span>Ver Detalhes</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrade}
            className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg'
          >
            <Zap className='h-4 w-4' />
            <span>Comprar</span>
          </motion.button>
        </div>

        {/* Botões adicionais */}
        <div className='mt-3 flex space-x-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStake}
            className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 transition-colors duration-200 hover:bg-yellow-200'
          >
            <Star className='h-4 w-4' />
            <span>Staking</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(crypto.id)}
            className='flex items-center justify-center space-x-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-200'
          >
            {copied ? <CheckCircle className='h-4 w-4 text-emerald-500' /> : <Copy className='h-4 w-4' />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </motion.button>
        </div>
      </div>

      {/* Detalhes expandidos */}
      <motion.div
        initial={false}
        animate={{ height: showDetails ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        {showDetails && (
          <div className='border-t border-slate-200 px-6 pb-6 pt-4'>
            <div className='space-y-3 text-sm'>
              {/* Informações técnicas */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='font-medium text-slate-700'>Ranking:</span>
                  <p className='mt-1 text-slate-600'>#{crypto.market_cap_rank || 'N/A'}</p>
                </div>
                <div>
                  <span className='font-medium text-slate-700'>Circulação:</span>
                  <p className='mt-1 text-slate-600'>
                    {crypto.circulating_supply ? `${(crypto.circulating_supply / 1e6).toFixed(2)}M` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Links úteis */}
              <div className='border-t border-slate-100 pt-3'>
                <h4 className='mb-2 font-medium text-slate-700'>Links Úteis</h4>
                <div className='flex space-x-2'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://coingecko.com/en/coins/${crypto.id}`, '_blank')}
                    className='flex items-center space-x-1 rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-700 transition-colors duration-200 hover:bg-blue-200'
                  >
                    <ExternalLink className='h-3 w-3' />
                    <span>CoinGecko</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://coinmarketcap.com/currencies/${crypto.id}/`, '_blank')}
                    className='flex items-center space-x-1 rounded-lg bg-purple-100 px-3 py-1 text-xs text-purple-700 transition-colors duration-200 hover:bg-purple-200'
                  >
                    <ExternalLink className='h-3 w-3' />
                    <span>CMC</span>
                  </motion.button>
                </div>
              </div>

              {/* Última atualização */}
              <div className='border-t border-slate-100 pt-3'>
                <div className='flex items-center justify-between text-xs text-slate-500'>
                  <span>Última atualização:</span>
                  <span>{crypto.last_updated ? new Date(crypto.last_updated).toLocaleString('pt-BR') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Botão para expandir detalhes */}
      <div className='px-6 pb-4'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(!showDetails)}
          className='flex w-full items-center justify-center space-x-2 py-2 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-700'
        >
          <span>{showDetails ? 'Ocultar detalhes' : 'Ver mais detalhes'}</span>
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowUpRight className='h-4 w-4' />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CryptoCard
