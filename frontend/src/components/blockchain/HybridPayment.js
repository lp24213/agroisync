import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Coins, 
  DollarSign, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Calculator,
  Wallet,
  Banknote,
  Smartphone
} from 'lucide-react'

const HybridPayment = ({ orderId, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('fiat') // 'fiat' ou 'crypto'
  const [selectedCrypto, setSelectedCrypto] = useState('USDC')
  const [amount, setAmount] = useState(0)
  const [cryptoRates, setCryptoRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [exchangeRate, setExchangeRate] = useState(0)
  const [fees, setFees] = useState({ fiat: 0, crypto: 0 })

  const cryptos = [
    { symbol: 'USDC', name: 'USD Coin', icon: '🔵' },
    { symbol: 'USDT', name: 'Tether', icon: '🟢' },
    { symbol: 'SOL', name: 'Solana', icon: '🟣' },
    { symbol: 'MATIC', name: 'Polygon', icon: '🟣' }
  ]

  const fiatMethods = [
    { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'pix', name: 'PIX', icon: Smartphone },
    { id: 'bank_transfer', name: 'Transferência Bancária', icon: Banknote }
  ]

  const loadExchangeRates = useCallback(async () => {
    try {
      const response = await fetch('/api/crypto/rates')
      const data = await response.json()

      if (data.success) {
        setCryptoRates(data.rates)
        setExchangeRate(data.rates[selectedCrypto] || 0)
      }
    } catch (err) {
      console.error('Erro ao carregar taxas:', err)
    }
  }, [selectedCrypto])

  useEffect(() => {
    loadExchangeRates()
  }, [loadExchangeRates])

  const calculateAmounts = useCallback(() => {
    const rate = cryptoRates[selectedCrypto]
    if (rate) {
      if (paymentMethod === 'crypto') {
        return {
          cryptoAmount: amount,
          fiatAmount: amount * rate,
          totalFiat: (amount * rate) + fees.crypto
        }
      } else {
        return {
          cryptoAmount: amount / rate,
          fiatAmount: amount,
          totalFiat: amount + fees.fiat
        }
      }
    }
    return { cryptoAmount: 0, fiatAmount: 0, totalFiat: 0 }
  }, [amount, cryptoRates, selectedCrypto, paymentMethod, fees])

  const amounts = calculateAmounts()

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentMethod,
          amount: paymentMethod === 'crypto' ? amounts.cryptoAmount : amounts.fiatAmount,
          crypto: selectedCrypto,
          exchangeRate
        })
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus('completed')
        onPaymentComplete?.(data.payment)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCrypto = (value, symbol) => {
    return `${value.toFixed(6)} ${symbol}`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-agro-emerald" />
          Pagamento Híbrido
        </h2>
        <button
          onClick={loadExchangeRates}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
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

      {/* Status do pagamento */}
      {paymentStatus !== 'pending' && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(paymentStatus)}
            <span className={`font-medium ${getStatusColor(paymentStatus)}`}>
              Status: {paymentStatus === 'completed' ? 'Concluído' : 'Pendente'}
            </span>
          </div>
        </div>
      )}

      {/* Seleção do método de pagamento */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Método de Pagamento
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('fiat')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'fiat'
                ? 'border-agro-emerald bg-agro-emerald/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Pagamento Fiat
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real (BRL)
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'crypto'
                ? 'border-agro-emerald bg-agro-emerald/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Coins className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Pagamento Crypto
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Criptomoedas
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Seleção de criptomoeda */}
      {paymentMethod === 'crypto' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Criptomoeda
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cryptos.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  selectedCrypto === crypto.symbol
                    ? 'border-agro-emerald bg-agro-emerald/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{crypto.icon}</div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {crypto.symbol}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {crypto.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Valor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valor
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            placeholder="Digite o valor"
          />
          <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
            {paymentMethod === 'crypto' ? selectedCrypto : 'BRL'}
          </div>
        </div>
      </div>

      {/* Cálculo */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Cálculo
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {paymentMethod === 'crypto' ? 'Valor em Crypto:' : 'Valor em Fiat:'}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {paymentMethod === 'crypto' 
                ? formatCrypto(amounts.cryptoAmount, selectedCrypto)
                : formatCurrency(amounts.fiatAmount)
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {paymentMethod === 'crypto' ? 'Valor em Fiat:' : 'Valor em Crypto:'}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {paymentMethod === 'crypto' 
                ? formatCurrency(amounts.fiatAmount)
                : formatCrypto(amounts.cryptoAmount, selectedCrypto)
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Taxa:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(paymentMethod === 'crypto' ? fees.crypto : fees.fiat)}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(amounts.totalFiat)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Taxa de câmbio */}
      {paymentMethod === 'crypto' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 dark:text-blue-400">
              Taxa de câmbio {selectedCrypto}/BRL:
            </span>
            <span className="font-medium text-blue-800 dark:text-blue-300">
              {formatCurrency(exchangeRate)}
            </span>
          </div>
        </div>
      )}

      {/* Botão de pagamento */}
      <button
        onClick={handlePayment}
        disabled={loading || amount <= 0}
        className="w-full px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processando...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Processar Pagamento</span>
          </>
        )}
      </button>

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-green-700 dark:text-green-400 text-sm">
            Pagamento seguro e criptografado
          </span>
        </div>
      </div>
    </div>
  )
}

export default HybridPayment