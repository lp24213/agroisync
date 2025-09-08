import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Lock,
  DollarSign,
  Coins,
  RefreshCw,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'
import cryptoService from '../services/cryptoService'

const DeFiOperations = () => {
  const [operationType, setOperationType] = useState('buy'); // buy, sell, stake
  const [selectedCrypto, setSelectedCrypto] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cryptoPrices, setCryptoPrices] = useState({})
  const [portfolio, setPortfolio] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])

  const popularCryptos = useMemo(
    () => [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
      { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
      { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
      { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
    ],
    []
  )

  const loadCryptoPrices = useCallback(async () => {
    try {
      const symbols = popularCryptos.map(crypto => crypto.id)
      const prices = await cryptoService.getCryptoPrices(symbols)
      setCryptoPrices(prices)
    } catch (error) {
      console.error('Erro ao carregar preços:', error)
    }
  }, [popularCryptos])

  const loadPortfolio = useCallback(async () => {
    try {
      const userPortfolio = await cryptoService.getUserPortfolio()
      setPortfolio(userPortfolio)
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error)
    }
  }, [])

  const loadTransactionHistory = useCallback(async () => {
    try {
      const history = await cryptoService.getTransactionHistory()
      setTransactionHistory(history)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }, [])

  useEffect(() => {
    loadCryptoPrices()
    loadPortfolio()
    loadTransactionHistory()

    // Atualizar preços a cada 30 segundos
    const interval = setInterval(loadCryptoPrices, 30000)

    return () => clearInterval(interval)
  }, [loadCryptoPrices, loadPortfolio, loadTransactionHistory])

  useEffect(() => {
    if (selectedCrypto && cryptoPrices[selectedCrypto]) {
      setPrice(cryptoPrices[selectedCrypto].usd.toString())
    }
  }, [selectedCrypto, cryptoPrices])

  const handleOperation = async () => {
    if (!selectedCrypto || !amount || !price) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result
      const numericAmount = parseFloat(amount)
      const numericPrice = parseFloat(price)

      switch (operationType) {
        case 'buy':
          result = await cryptoService.simulateBuy(numericAmount, selectedCrypto, numericPrice)
          break
        case 'sell':
          result = await cryptoService.simulateSell(numericAmount, selectedCrypto, numericPrice)
          break
        case 'stake':
          result = await cryptoService.simulateStake(numericAmount, selectedCrypto, 12.5); // 12.5% APY
          break
        default:
          throw new Error('Tipo de operação inválido')
      }

      if (result.success) {
        setSuccess(
          `Operação de ${operationType === 'buy' ? 'compra' : operationType === 'sell' ? 'venda' : 'staking'} realizada com sucesso!`
        )
        setAmount('')
        setPrice('')
        setSelectedCrypto('')

        // Recarregar dados
        await Promise.all([loadPortfolio(), loadTransactionHistory()])
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalValue = () => {
    if (!amount || !price) return '0.00'
    const total = parseFloat(amount) * parseFloat(price)
    return total.toFixed(2)
  }

  const getOperationIcon = type => {
    switch (type) {
      case 'buy':
        return <TrendingUp className='h-5 w-5 text-green-600' />
      case 'sell':
        return <TrendingDown className='h-5 w-5 text-red-600' />
      case 'stake':
        return <Lock className='h-5 w-5 text-blue-600' />
      default:
        return <DollarSign className='h-5 w-5 text-gray-600' />
    }
  }

  const getOperationColor = type => {
    switch (type) {
      case 'buy':
        return 'border-green-200 bg-green-50'
      case 'sell':
        return 'border-red-200 bg-red-50'
      case 'stake':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = value => {
    return `${value.toFixed(2)}%`
  }

  const getCryptoIcon = symbol => {
    const crypto = popularCryptos.find(c => c.symbol === symbol)
    return crypto ? crypto.icon : '₿'
  }

  return (
    <div className='mx-auto max-w-6xl space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-4 text-3xl font-bold text-gray-900'>Operações DeFi</h2>
        <p className='mx-auto max-w-2xl text-gray-600'>
          Execute operações de compra, venda e staking de criptomoedas de forma segura e transparente
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Painel de Operações */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Seleção de Tipo de Operação */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>Tipo de Operação</h3>

            <div className='grid grid-cols-3 gap-4'>
              {[
                { type: 'buy', label: 'Comprar', description: 'Adquirir criptomoedas' },
                { type: 'sell', label: 'Vender', description: 'Vender criptomoedas' },
                { type: 'stake', label: 'Staking', description: 'Earn rewards' }
              ].map(op => (
                <button
                  key={op.type}
                  onClick={() => setOperationType(op.type)}
                  className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
                    operationType === op.type ? getOperationColor(op.type) : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='flex flex-col items-center space-y-2'>
                    {getOperationIcon(op.type)}
                    <span className='font-medium text-gray-900'>{op.label}</span>
                    <span className='text-xs text-gray-500'>{op.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de Operação */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>Detalhes da Operação</h3>

            <div className='space-y-4'>
              {/* Seleção de Criptomoeda */}
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Criptomoeda</label>
                <select
                  value={selectedCrypto}
                  onChange={e => setSelectedCrypto(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                >
                  <option value=''>Selecione uma criptomoeda</option>
                  {popularCryptos.map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.icon} {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Quantidade</label>
                <div className='relative'>
                  <input
                    type='number'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder='0.00'
                    step='0.0001'
                    min='0'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                  />
                  {selectedCrypto && (
                    <span className='absolute right-3 top-2 text-sm text-gray-500'>
                      {popularCryptos.find(c => c.id === selectedCrypto)?.symbol}
                    </span>
                  )}
                </div>
              </div>

              {/* Preço */}
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Preço por unidade (USD)</label>
                <input
                  type='number'
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                />
              </div>

              {/* Valor Total */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700'>Valor Total:</span>
                  <span className='text-lg font-bold text-gray-900'>{formatCurrency(calculateTotalValue())}</span>
                </div>
              </div>

              {/* Botão de Execução */}
              <button
                onClick={handleOperation}
                disabled={loading || !selectedCrypto || !amount || !price}
                className='flex w-full items-center justify-center space-x-2 rounded-lg bg-emerald-600 py-3 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : getOperationIcon(operationType)}
                <span>
                  {loading
                    ? 'Processando...'
                    : operationType === 'buy'
                      ? 'Comprar'
                      : operationType === 'sell'
                        ? 'Vender'
                        : 'Fazer Staking'}
                </span>
              </button>
            </div>
          </div>

          {/* Mensagens de Status */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='rounded-lg border border-red-200 bg-red-50 p-4'
              >
                <div className='flex items-center space-x-2'>
                  <XCircle className='h-5 w-5 text-red-600' />
                  <span className='font-medium text-red-800'>Erro</span>
                </div>
                <p className='mt-1 text-sm text-red-700'>{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='rounded-lg border border-green-200 bg-green-50 p-4'
              >
                <div className='flex items-center space-x-2'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  <span className='font-medium text-green-800'>Sucesso</span>
                </div>
                <p className='mt-1 text-sm text-green-700'>{success}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - Portfólio e Preços */}
        <div className='space-y-6'>
          {/* Preços em Tempo Real */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Preços em Tempo Real</h3>
              <button
                onClick={loadCryptoPrices}
                className='p-2 text-gray-400 transition-colors hover:text-gray-600'
                title='Atualizar preços'
              >
                <RefreshCw className='h-4 w-4' />
              </button>
            </div>

            <div className='space-y-3'>
              {popularCryptos.map(crypto => {
                const price = cryptoPrices[crypto.id]
                const priceChange = price?.price_change_percentage_24h || 0

                return (
                  <div key={crypto.id} className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                    <div className='flex items-center space-x-3'>
                      <span className='text-lg'>{crypto.icon}</span>
                      <div>
                        <div className='font-medium text-gray-900'>{crypto.symbol}</div>
                        <div className='text-xs text-gray-500'>{crypto.name}</div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-gray-900'>{price ? formatCurrency(price.usd) : '...'}</div>
                      <div className={`text-xs ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {priceChange >= 0 ? '+' : ''}
                        {formatPercentage(priceChange)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Portfólio */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>Meu Portfólio</h3>

            {portfolio.length === 0 ? (
              <div className='py-8 text-center'>
                <Coins className='mx-auto mb-3 h-12 w-12 text-gray-300' />
                <p className='text-gray-500'>Nenhum ativo no portfólio</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {portfolio.map((asset, index) => (
                  <div key={index} className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                    <div className='flex items-center space-x-3'>
                      <span className='text-lg'>{getCryptoIcon(asset.symbol)}</span>
                      <div>
                        <div className='font-medium text-gray-900'>{asset.symbol}</div>
                        <div className='text-xs text-gray-500'>{asset.amount}</div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-gray-900'>{formatCurrency(asset.value)}</div>
                      <div className={`text-xs ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change >= 0 ? '+' : ''}
                        {formatPercentage(asset.change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Histórico de Transações */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Histórico de Transações</h3>

        {transactionHistory.length === 0 ? (
          <div className='py-8 text-center'>
            <Activity className='mx-auto mb-3 h-12 w-12 text-gray-300' />
            <p className='text-gray-500'>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Data</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Tipo</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Cripto</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Quantidade</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Preço</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Total</th>
                  <th className='px-4 py-3 text-left font-medium text-gray-700'>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((tx, index) => (
                  <tr key={index} className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='px-4 py-3 text-sm text-gray-600'>
                      {new Date(tx.timestamp).toLocaleDateString('pt-BR')}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          tx.type === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : tx.type === 'sell'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {getOperationIcon(tx.type)}
                        <span className='ml-1'>
                          {tx.type === 'buy' ? 'Compra' : tx.type === 'sell' ? 'Venda' : 'Staking'}
                        </span>
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      {getCryptoIcon(tx.symbol)} {tx.symbol}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{tx.amount}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{formatCurrency(tx.price)}</td>
                    <td className='px-4 py-3 text-sm font-medium text-gray-900'>{formatCurrency(tx.total)}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.status === 'completed' ? 'Concluída' : tx.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeFiOperations
