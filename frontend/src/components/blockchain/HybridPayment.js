import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { CreditCard, Calculator } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const HybridPayment = ({ 
  amount, 
  currency = 'BRL', 
  onPaymentComplete, 
  onPaymentError,
  allowedMethods = ['fiat', 'crypto', 'hybrid']
}) => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [paymentMethod, setPaymentMethod] = useState('fiat');
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(amount);
  const [cryptoRates, setCryptoRates] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('usdc');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [error, setError] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

Criptomoedas suportadas
  const supportedCryptos = [
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '🔵', stablecoin: true },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '🟡', stablecoin: true },
    { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '🟣', stablecoin: false },
    { id: 'matic', name: 'Polygon', symbol: 'MATIC', icon: '🟣', stablecoin: false }
  ];

Carregar taxas de câmbio
  const loadExchangeRates = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/exchange-rates');
      const data = await response.json();

      if (data.success) {
        setCryptoRates(data.rates);
        
Calcular valor em cripto baseado na moeda selecionada
        const rate = data.rates[selectedCrypto];
        if (rate) {
          setCryptoAmount(fiatAmount / rate);
        }
      }
    } catch (error) {
      console.error('Error loading exchange rates:', error);
    }
  }, [fiatAmount, selectedCrypto]);

Carregar taxas quando moeda ou valor mudarem
useEffect(() => {
    loadExchangeRates();
  }, [loadExchangeRates]);

Calcular valores
  const calculateAmounts = useCallback(() => {
    const rate = cryptoRates[selectedCrypto];
    if (rate) {
      if (paymentMethod === 'crypto') {
        setFiatAmount(cryptoAmount * rate);
      } else if (paymentMethod === 'fiat') {
        setCryptoAmount(fiatAmount / rate);
      } else if (paymentMethod === 'hybrid') {
No modo híbrido, manter os valores independentes
O usuário pode ajustar manualmente
      }
    }
  }, [paymentMethod, cryptoAmount, fiatAmount, selectedCrypto, cryptoRates]);

Processar pagamento
  const processPayment = useCallback(async () => {
    setIsProcessing(true);
    setError('');

    try {
      const paymentData = {
        method: paymentMethod,
        fiatAmount: fiatAmount,
        cryptoAmount: cryptoAmount,
        cryptoCurrency: selectedCrypto,
        totalAmount: amount
      };

      const response = await fetch('/api/payments/hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('completed');
        
        analytics.trackEvent('hybrid_payment_completed', {
          method: paymentMethod,
          fiat_amount: fiatAmount,
          crypto_amount: cryptoAmount,
          crypto_currency: selectedCrypto
        });

        if (onPaymentComplete) {
          onPaymentComplete(data.payment);
        }
      } else {
        setError(data.message || t('payment.error', 'Erro no pagamento'));
        setPaymentStatus('failed');
        
        if (onPaymentError) {
          onPaymentError(data.error);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(t('payment.networkError', 'Erro de conexão'));
      setPaymentStatus('failed');
      
      if (onPaymentError) {
        onPaymentError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, fiatAmount, cryptoAmount, selectedCrypto, amount, analytics, onPaymentComplete, onPaymentError, t]);

Obter ícone do método de pagamento
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'fiat':
        return <CreditCard className="w-5 h-5" />;
      case 'crypto':
        return <Coins className="w-5 h-5" />;
      case 'hybrid':
        return <Zap className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

Obter cor do método de pagamento
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'fiat':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'crypto':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'hybrid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

Obter status do pagamento
  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('payment.title', 'Pagamento Híbrido')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('payment.subtitle', 'Escolha entre pagamento tradicional ou criptomoedas')}
        </p>
      </div>

      {/* Métodos de pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allowedMethods.includes('fiat') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('fiat')}
            className={`p-6 rounded-lg border-2 transition-all ${
paymentMethod === 'fiat'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
paymentMethod === 'fiat' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
              }`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('payment.fiat', 'Pagamento Tradicional')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('payment.fiatDescription', 'Cartão de crédito, PIX, boleto')}
              </p>
            </div>
          </motion.button>
        )}

        {allowedMethods.includes('crypto') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('crypto')}
            className={`p-6 rounded-lg border-2 transition-all ${
paymentMethod === 'crypto'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
paymentMethod === 'crypto' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
              }`}>
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('payment.crypto', 'Criptomoedas')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('payment.cryptoDescription', 'Bitcoin, Ethereum, Solana')}
              </p>
            </div>
          </motion.button>
        )}

        {allowedMethods.includes('hybrid') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('hybrid')}
            className={`p-6 rounded-lg border-2 transition-all ${
paymentMethod === 'hybrid'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
paymentMethod === 'hybrid' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
              }`}>
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('payment.hybrid', 'Híbrido')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('payment.hybridDescription', 'Combinação de FIAT + Crypto')}
              </p>
            </div>
          </motion.button>
        )}
      </div>

      {/* Detalhes do pagamento */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('payment.details', 'Detalhes do Pagamento')}
          </h3>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Calculator className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Valor total */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400">
              {t('payment.totalAmount', 'Valor Total')}:
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              R$ {amount.toFixed(2)}
            </span>
          </div>

          {/* Pagamento FIAT */}
          {paymentMethod !== 'crypto' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('payment.fiatAmount', 'Valor em FIAT')}
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={fiatAmount}
                    onChange={(e) => setFiatAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400">BRL</span>
              </div>
            </div>
          )}

          {/* Pagamento Crypto */}
          {paymentMethod !== 'fiat' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('payment.cryptoAmount', 'Valor em Cripto')}
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {supportedCryptos.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.symbol}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Taxa de câmbio */}
              {cryptoRates[selectedCrypto] && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('payment.exchangeRate', 'Taxa de câmbio')}: 1 {selectedCrypto.toUpperCase()} = R$ {cryptoRates[selectedCrypto].toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Calculadora */}
          <AnimatePresence>
            {showCalculator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('payment.calculator', 'Calculadora')}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('payment.fiatTotal', 'Total FIAT')}:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      R$ {fiatAmount.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('payment.cryptoTotal', 'Total Crypto')}:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {cryptoAmount.toFixed(6)} {selectedCrypto.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('payment.remaining', 'Restante')}:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      R$ {(amount - fiatAmount - (cryptoAmount * (cryptoRates[selectedCrypto] || 0))).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('payment.percentage', 'Percentual')}:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {((fiatAmount + (cryptoAmount * (cryptoRates[selectedCrypto] || 0))) / amount * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status do pagamento */}
      {paymentStatus !== 'pending' && (
        <div className={`p-4 rounded-lg ${
          paymentStatus === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
          paymentStatus === 'failed' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
          'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center">
            {getPaymentStatusIcon(paymentStatus)}
            <span className={`ml-2 font-medium ${
              paymentStatus === 'completed' ? 'text-green-800 dark:text-green-200' :
              paymentStatus === 'failed' ? 'text-red-800 dark:text-red-200' :
              'text-yellow-800 dark:text-yellow-200'
            }`}>
              {paymentStatus === 'completed' ? t('payment.completed', 'Pagamento realizado com sucesso!') :
               paymentStatus === 'failed' ? t('payment.failed', 'Erro no pagamento') :
t('payment.processing', 'Processando pagamento...')}
            </span>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex space-x-4">
        <button
          onClick={processPayment}
          disabled={isProcessing || paymentStatus === 'completed'}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span>
            {isProcessing ? t('payment.processing', 'Processando...') : t('payment.payNow', 'Pagar Agora')}
          </span>
        </button>
      </div>

      {/* Informações de segurança */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              {t('payment.security', 'Segurança')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('payment.securityDescription', 'Todos os pagamentos são processados com criptografia de ponta a ponta e protegidos por blockchain quando aplicável.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridPayment;
