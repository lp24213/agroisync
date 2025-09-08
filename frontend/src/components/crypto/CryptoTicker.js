import React, { useState, useEffect } from 'react'
import cryptoService from '../../services/cryptoService'

const CryptoTicker = () => {
  const [tickerData, setTickerData] = useState([])
  const [loading, setLoading] = useState(true)
  const [marketData, setMarketData] = useState(null)

  useEffect(() => {
    loadTickerData()
    const interval = setInterval(loadTickerData, 15000); // Atualizar a cada 15 segundos
    return () => clearInterval(interval)
  }, [])

  const loadTickerData = async () => {
    try {
      setLoading(true)
      const [cryptoData, market] = await Promise.all([cryptoService.getTopCryptos(15), cryptoService.getMarketData()])

      setTickerData(cryptoData)
      setMarketData(market)
    } catch (error) {
      console.error('Erro ao carregar dados do ticker:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = price => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else {
      return `$${price.toFixed(6)}`
    }
  }

  const formatPercentage = percentage => {
    const isPositive = percentage >= 0
    return (
      <span className={`font-mono text-xs ${isPositive ? 'text-blue-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}
        {percentage.toFixed(2)}%
      </span>
    )
  }

  const formatMarketCap = value => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    } else {
      return `$${value.toLocaleString()}`
    }
  }

  if (loading) {
    return (
      <div className='w-full overflow-hidden bg-gray-900 py-4'>
        <div className='flex items-center justify-center space-x-4'>
          <div className='h-4 w-4 animate-pulse rounded-full bg-purple-500'></div>
          <div className='h-4 w-4 animate-pulse rounded-full bg-pink-500'></div>
          <div className='h-4 w-4 animate-pulse rounded-full bg-red-500'></div>
          <span className='text-sm text-gray-400'>Carregando cotações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full border-b border-gray-700 bg-gray-900'>
      {/* Market Overview */}
      {marketData && (
        <div className='border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-pink-900/20 px-4 py-3'>
          <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 text-sm text-gray-300'>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-400'>Cap Total:</span>
              <span className='font-semibold text-white'>{formatMarketCap(marketData.totalMarketCap)}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-400'>Volume 24h:</span>
              <span className='font-semibold text-white'>{formatMarketCap(marketData.totalVolume)}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-400'>Variação 24h:</span>
              <span
                className={`font-semibold ${
                  marketData.marketCapChangePercentage24h >= 0 ? 'text-blue-400' : 'text-red-400'
                }`}
              >
                {marketData.marketCapChangePercentage24h >= 0 ? '+' : ''}
                {marketData.marketCapChangePercentage24h.toFixed(2)}%
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-400'>Criptos Ativas:</span>
              <span className='font-semibold text-white'>{marketData.activeCryptocurrencies.toLocaleString()}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-gray-400'>Última Atualização:</span>
              <span className='font-semibold text-white'>
                {new Date(marketData.lastUpdated).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ticker Bar */}
      <div className='relative overflow-hidden'>
        <div className='animate-scroll flex'>
          {/* Primeira passagem */}
          <div className='flex items-center space-x-8 whitespace-nowrap px-4 py-4'>
            {tickerData.map(crypto => (
              <div
                key={`first-${crypto.id}`}
                className='flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-gray-600'
              >
                <img src={crypto.image} alt={crypto.name} className='h-6 w-6 rounded-full' />
                <div className='text-center'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-semibold text-white'>{crypto.symbol}</span>
                    {formatPercentage(crypto.priceChangePercentage24h)}
                  </div>
                  <div className='text-sm font-bold text-white'>{formatPrice(crypto.price)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Segunda passagem (para loop infinito) */}
          <div className='flex items-center space-x-8 whitespace-nowrap px-4 py-4'>
            {tickerData.map(crypto => (
              <div
                key={`second-${crypto.id}`}
                className='flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-gray-600'
              >
                <img src={crypto.image} alt={crypto.name} className='h-6 w-6 rounded-full' />
                <div className='text-center'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-semibold text-white'>{crypto.symbol}</span>
                    {formatPercentage(crypto.priceChangePercentage24h)}
                  </div>
                  <div className='text-sm font-bold text-white'>{formatPrice(crypto.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de atualização */}
        <div className='absolute right-4 top-2 flex items-center space-x-2'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
          <span className='text-xs font-medium text-blue-400'>LIVE</span>
        </div>
      </div>
    </div>
  )
}

export default CryptoTicker
