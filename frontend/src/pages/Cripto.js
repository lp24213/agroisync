import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, TrendingDown, RefreshCw, DollarSign, 
  Coins, ArrowUpRight, ArrowDownRight, AlertCircle,
  Shield, Zap, Globe, BarChart3, PieChart,
  Lock, Unlock, Eye, EyeOff, Copy, FileText,
  Wallet, Send, Download, History, Star,
  Target, Rocket, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cryptoService } from '../services/cryptoService';
import { metamaskService } from '../services/metamaskService';

const Cripto = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isDark } = useTheme();
  
  // Estados principais
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  
  // Estados para funcionalidades de pagamento
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentType, setPaymentType] = useState('deposit'); // 'deposit', 'withdraw', 'history'
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Estados para Metamask
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  // Estados para funcionalidades avançadas
  const [showStakingPanel, setShowStakingPanel] = useState(false);
  const [showFuturesPanel, setShowFuturesPanel] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');
  const [futuresType, setFuturesType] = useState('buy'); // 'buy', 'sell'
  const [futuresAmount, setFuturesAmount] = useState('');
  const [futuresLeverage, setFuturesLeverage] = useState(1);

  useEffect(() => {
    fetchCryptoData();
    checkMetamaskConnection();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchChartData();
    }
  }, [selectedCrypto, timeframe]);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await cryptoService.getTopCryptos();
      setCryptoData(data);
    } catch (error) {
      console.error('Erro ao buscar dados de criptomoedas:', error);
      setError('Erro ao carregar dados de criptomoedas');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const data = await cryptoService.getChartData(selectedCrypto, timeframe);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const checkMetamaskConnection = async () => {
    try {
      const isConnected = await metamaskService.isConnected();
      setMetamaskConnected(isConnected);
      
      if (isConnected) {
        const address = await metamaskService.getAccount();
        const balance = await metamaskService.getBalance();
        setWalletAddress(address);
        setWalletBalance(balance);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão Metamask:', error);
    }
  };

  const connectMetamask = async () => {
    try {
      await metamaskService.connect();
      await checkMetamaskConnection();
    } catch (error) {
      console.error('Erro ao conectar Metamask:', error);
      setError('Erro ao conectar carteira Metamask');
    }
  };

  const disconnectMetamask = async () => {
    try {
      await metamaskService.disconnect();
      setMetamaskConnected(false);
      setWalletAddress('');
      setWalletBalance('0');
    } catch (error) {
      console.error('Erro ao desconectar Metamask:', error);
    }
  };

  const handlePayment = async (type) => {
    if (!metamaskConnected) {
      setError('Conecte sua carteira Metamask primeiro');
      return;
    }

    setPaymentType(type);
    setShowPaymentPanel(true);
    setShowSecretPanel(false);
  };

  const processPayment = async () => {
    if (!paymentAmount || !paymentAddress) {
      setError('Preencha todos os campos');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPayment = {
        id: Date.now(),
        type: paymentType,
        amount: parseFloat(paymentAmount),
        address: paymentAddress,
        status: 'completed',
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };

      setPaymentHistory(prev => [newPayment, ...prev]);
      setPaymentAmount('');
      setPaymentAddress('');
      setShowPaymentPanel(false);
      
      // Atualizar saldo da carteira
      if (paymentType === 'deposit') {
        setWalletBalance(prev => (parseFloat(prev) + parseFloat(paymentAmount)).toString());
      } else if (paymentType === 'withdraw') {
        setWalletBalance(prev => (parseFloat(prev) - parseFloat(paymentAmount)).toString());
      }
    } catch (error) {
      setError('Erro ao processar pagamento');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleStaking = async () => {
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) {
      setError('Insira um valor válido para staking');
      return;
    }

    try {
      // Simular staking
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError('');
      setStakingAmount('');
      setShowStakingPanel(false);
      // Aqui você implementaria a lógica real de staking
    } catch (error) {
      setError('Erro ao processar staking');
    }
  };

  const handleFutures = async () => {
    if (!futuresAmount || parseFloat(futuresAmount) <= 0) {
      setError('Insira um valor válido para futuros');
      return;
    }

    try {
      // Simular operação de futuros
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError('');
      setFuturesAmount('');
      setFuturesLeverage(1);
      setShowFuturesPanel(false);
      // Aqui você implementaria a lógica real de futuros
    } catch (error) {
      setError('Erro ao processar operação de futuros');
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    // Mostrar feedback visual
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCryptoIcon = (symbol) => {
    const icons = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      binancecoin: 'BNB',
      cardano: 'ADA',
      solana: '◎'
    };
    return icons[symbol] || symbol.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados de criptomoedas...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="title-premium text-4xl font-bold mb-4">
            Criptomoedas & DeFi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Acompanhe cotações em tempo real e gerencie seus ativos digitais
          </p>
        </motion.div>

        {/* Painel de Carteira */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between p-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-agro-green to-agro-yellow rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Carteira Digital
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie seus ativos cripto
                </p>
              </div>
            </div>

            {metamaskConnected ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Endereço</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
                  <p className="font-semibold text-lg text-agro-green">
                    {parseFloat(walletBalance).toFixed(4)} ETH
                  </p>
                </div>
                <button
                  onClick={disconnectMetamask}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <button
                onClick={connectMetamask}
                className="btn-accent-green flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Conectar Metamask</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Painéis de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePayment('deposit')}
            className="card-premium p-6 text-center hover:border-agro-green transition-colors"
          >
            <Download className="w-8 h-8 text-agro-green mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Depósito</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Adicione fundos à sua carteira</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePayment('withdraw')}
            className="card-premium p-6 text-center hover:border-agro-green transition-colors"
          >
            <Send className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Saque</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transfira fundos para outra carteira</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowStakingPanel(true)}
            className="card-premium p-6 text-center hover:border-agro-green transition-colors"
          >
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Staking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ganhe rendimentos com staking</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowFuturesPanel(true)}
            className="card-premium p-6 text-center hover:border-agro-green transition-colors"
          >
            <Rocket className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Futuros</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Opere com alavancagem</p>
          </motion.button>
        </div>

        {/* Cotações em Tempo Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium mb-8"
        >
          <div className="p-6">
            <h2 className="title-premium text-2xl font-bold mb-6">Cotações em Tempo Real</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Moeda</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Preço</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">24h %</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Volume</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Cap. de Mercado</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.slice(0, 10).map((crypto) => (
                    <motion.tr
                      key={crypto.id}
                      whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCryptoIcon(crypto.symbol)}</span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{crypto.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">
                        {formatPrice(crypto.current_price)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`flex items-center justify-end space-x-1 ${
                          crypto.price_change_percentage_24h > 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {crypto.price_change_percentage_24h > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{crypto.price_change_percentage_24h.toFixed(2)}%</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">
                        ${crypto.total_volume.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">
                        ${crypto.market_cap.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Histórico de Transações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium mb-8"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="title-premium text-2xl font-bold">Histórico de Transações</h2>
              <button
                onClick={() => handlePayment('history')}
                className="btn-accent-green flex items-center space-x-2"
              >
                <History className="w-4 h-4" />
                <span>Ver Todas</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {paymentHistory.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {payment.type === 'deposit' ? <Download className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {payment.type === 'deposit' ? 'Depósito' : 'Saque'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.amount.toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.timestamp.toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-6)}
                    </p>
                  </div>
                </div>
              ))}
              
              {paymentHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Painéis Modais */}
        <AnimatePresence>
          {/* Painel de Pagamento */}
          {showPaymentPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card-premium max-w-md w-full"
              >
                <div className="p-6">
                  <h3 className="title-premium text-xl font-bold mb-4">
                    {paymentType === 'deposit' ? 'Depósito' : paymentType === 'withdraw' ? 'Saque' : 'Histórico'}
                  </h3>
                  
                  {paymentType !== 'history' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Valor (ETH)
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="input-premium w-full"
                          placeholder="0.0000"
                          step="0.0001"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {paymentType === 'deposit' ? 'Endereço de Destino' : 'Endereço de Origem'}
                        </label>
                        <input
                          type="text"
                          value={paymentAddress}
                          onChange={(e) => setPaymentAddress(e.target.value)}
                          className="input-premium w-full"
                          placeholder="0x..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowPaymentPanel(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={processPayment}
                          disabled={isProcessingPayment || !paymentAmount || !paymentAddress}
                          className="btn-accent-green flex-1 flex justify-center items-center"
                        >
                          {isProcessingPayment ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            paymentType === 'deposit' ? 'Depositar' : 'Sacar'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {paymentType === 'history' && (
                    <div className="space-y-4">
                      <div className="max-h-64 overflow-y-auto">
                        {paymentHistory.map((payment) => (
                          <div key={payment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="capitalize font-medium">{payment.type}</span>
                              <span className="text-sm text-gray-600">
                                {payment.amount.toFixed(4)} ETH
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {payment.timestamp.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowPaymentPanel(false)}
                        className="w-full btn-accent-green"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Painel de Staking */}
          {showStakingPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card-premium max-w-md w-full"
              >
                <div className="p-6">
                  <h3 className="title-premium text-xl font-bold mb-4">Staking de Criptomoedas</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Ganhe rendimentos anuais de até 12% com staking de seus ativos
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valor para Staking (ETH)
                      </label>
                      <input
                        type="number"
                        value={stakingAmount}
                        onChange={(e) => setStakingAmount(e.target.value)}
                        className="input-premium w-full"
                        placeholder="0.0000"
                        step="0.0001"
                        min="0"
                      />
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 APY estimado: 8-12% ao ano
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowStakingPanel(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleStaking}
                        disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
                        className="btn-accent-green flex-1"
                      >
                        Iniciar Staking
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Painel de Futuros */}
          {showFuturesPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card-premium max-w-md w-full"
              >
                <div className="p-6">
                  <h3 className="title-premium text-xl font-bold mb-4">Trading de Futuros</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Opere com alavancagem e maximize seus lucros
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Operação
                      </label>
                      <select
                        value={futuresType}
                        onChange={(e) => setFuturesType(e.target.value)}
                        className="input-premium w-full"
                      >
                        <option value="buy">Compra (Long)</option>
                        <option value="sell">Venda (Short)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valor (ETH)
                      </label>
                      <input
                        type="number"
                        value={futuresAmount}
                        onChange={(e) => setFuturesAmount(e.target.value)}
                        className="input-premium w-full"
                        placeholder="0.0000"
                        step="0.0001"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alavancagem
                      </label>
                      <select
                        value={futuresLeverage}
                        onChange={(e) => setFuturesLeverage(parseInt(e.target.value))}
                        className="input-premium w-full"
                      >
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={5}>5x</option>
                        <option value={10}>10x</option>
                      </select>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Trading com alavancagem envolve alto risco
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowFuturesPanel(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleFutures}
                        disabled={!futuresAmount || parseFloat(futuresAmount) <= 0}
                        className="btn-accent-green flex-1"
                      >
                        {futuresType === 'buy' ? 'Comprar' : 'Vender'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensagens de Erro */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Cripto;
