import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Lock, 
  AlertCircle, 
  Loader2, 
  Shield
} from 'lucide-react'

const StripeCheckout = ({ orderData, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fees, setFees] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  useEffect(() => {
    calculateFees()
  }, [orderData])

  const calculateFees = async () => {
    try {
      const feesData = await {/* paymentService.calculateFees(
        orderData.total,
        paymentMethod
      ) */}
      setFees(feesData)
    } catch (err) {
      console.error('Erro ao calcular taxas:', err)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: orderData.total,
          paymentMethod,
          cardData
        })
      })

      const data = await response.json()

      if (data.success) {
        // Processar pagamento com Stripe
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
        
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: {
              number: cardData.number,
              exp_month: cardData.expiry.split('/')[0],
              exp_year: cardData.expiry.split('/')[1],
              cvc: cardData.cvc
            },
            billing_details: {
              name: cardData.name
            }
          }
        })

        if (result.error) {
          setError(result.error.message)
        } else {
          onPaymentSuccess?.(result.paymentIntent)
        }
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

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/')
  }

  const formatCVC = (value) => {
    return value.replace(/\D/g, '').substring(0, 4)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-agro-emerald" />
          Checkout Seguro
        </h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">
            SSL Seguro
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Resumo do pedido */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Resumo do Pedido
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Produto:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {orderData.product?.name || 'Produto'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Quantidade:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {orderData.quantity}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(orderData.subtotal)}
            </span>
          </div>
          {fees && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Taxa:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(fees.amount)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(orderData.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Método de pagamento */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Método de Pagamento
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'card'
                ? 'border-agro-emerald bg-agro-emerald/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Cartão de Crédito
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visa, Mastercard, Elo
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('pix')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'pix'
                ? 'border-agro-emerald bg-agro-emerald/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PIX</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  PIX
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pagamento instantâneo
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Dados do cartão */}
      {paymentMethod === 'card' && (
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número do Cartão
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Validade
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/AA"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) => setCardData(prev => ({ ...prev, cvc: formatCVC(e.target.value) }))}
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome no Cartão
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome como está no cartão"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Botão de pagamento */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pagar {formatCurrency(orderData.total)}</span>
          </>
        )}
      </button>

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Pagamento Seguro
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Seus dados são protegidos com criptografia SSL e processados pelo Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StripeCheckout