import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import cryptoService from '../services/cryptoService';
import metamaskService from '../services/metamaskService';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, TrendingDown, DollarSign, Coins, Wallet, 
  ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle,
  Shield, Zap, Globe, BarChart3, PieChart, Activity,
  Lock, Unlock, Eye, EyeOff, Copy, CheckCircle
} from 'lucide-react';

const Cripto = () => {
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    document.title = 'Criptomoedas - Agroisync';
    fetchCryptoData();
    checkMetamaskConnection();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await cryptoService.getTopCryptos();
      setCryptoData(data);
    } catch (error) {
      setError('Erro ao carregar dados das criptomoedas');
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMetamaskConnection = async () => {
    try {
      if (metamaskService.isMetamaskInstalled()) {
        const accounts = await metamaskService.getAccounts();
        if (accounts.length > 0) {
          setMetamaskConnected(true);
          setWalletAddress(accounts[0]);
          const balance = await metamaskService.getBalance();
          setWalletBalance(balance);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão Metamask:', error);
    }
  };

  const connectMetamask = async () => {
    try {
      setPaymentLoading(true);
      const connection = await metamaskService.connect();
      if (connection.success) {
        setMetamaskConnected(true);
        setWalletAddress(connection.address);
        const balance = await metamaskService.getBalance();
        setWalletBalance(balance);
      }
    } catch (error) {
      setError('Erro ao conectar Metamask: ' + error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const disconnectMetamask = () => {
    setMetamaskConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
  };

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Por favor, insira um valor válido');
      return;
    }

    try {
      setPaymentLoading(true);
      setError('');

      // Endereço da carteira do AgroSync
      const ownerWallet = process.env.REACT_APP_OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      const payment = await metamaskService.sendPayment(
        ownerWallet, 
        parseFloat(paymentAmount), 
        'Pagamento AgroSync'
      );

      // Aguardar confirmação
      let confirmations = 0;
      while (confirmations < 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const status = await metamaskService.getTransactionStatus(payment.hash);
        confirmations = status.confirmations;
      }

      // Verificar pagamento no backend
      const verification = await cryptoService.verifyPayment(payment.hash, paymentAmount);
      
      if (verification.success) {
        alert('Pagamento confirmado com sucesso!');
        setPaymentAmount('');
        // Atualizar status do usuário
        window.location.reload();
      } else {
        setError('Falha na verificação do pagamento');
      }

    } catch (error) {
      setError('Erro no pagamento: ' + error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    // Mostrar feedback visual
    const button = document.getElementById('copy-button');
    if (button) {
      button.innerHTML = '<CheckCircle className="w-4 h-4" />';
      setTimeout(() => {
        button.innerHTML = '<Copy className="w-4 h-4" />';
      }, 2000);
    }
  };

  const formatPrice = (price) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${(price / 1000).toFixed(2)}K`;
    }
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const getCryptoIcon = (symbol) => {
    const icons = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'BNB': 'BNB',
      'ADA': '₳',
      'SOL': '◎',
      'DOT': '●',
      'MATIC': 'MATIC',
      'LINK': '🔗'
    };
    return icons[symbol] || symbol;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            Criptomoedas
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-4xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
          >
            Acompanhe o mercado de criptomoedas em tempo real e gerencie seus ativos digitais com segurança
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
          >
            Integração completa com Metamask, gráficos interativos e histórico de transações para uma experiência completa de trading
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Crypto List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Principais Criptomoedas</h3>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Carregando dados...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cryptoData.map((crypto, index) => (
                      <motion.div
                        key={crypto.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onClick={() => setSelectedCrypto(crypto.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedCrypto === crypto.id 
                            ? 'bg-slate-100 border-2 border-slate-300' 
                            : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <Coins className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{crypto.name}</h4>
                              <p className="text-sm text-slate-600">{crypto.symbol.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-800">${crypto.current_price?.toFixed(2) || '0.00'}</p>
                            <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Chart and Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Gráfico de Preços</h3>
                  <div className="flex space-x-2">
                    {['24h', '7d', '30d', '1y'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          timeframe === period
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="h-80 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Gráfico Interativo</p>
                    <p className="text-sm text-slate-500">Integração com TradingView ou CoinGecko</p>
                  </div>
                </div>

                {/* Crypto Details */}
                {selectedCrypto && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">Detalhes da Criptomoeda</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Preço Atual</p>
                        <p className="font-bold text-slate-800">$0.00</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Variação 24h</p>
                        <p className="font-bold text-emerald-600">+0.00%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Volume</p>
                        <p className="font-bold text-slate-800">$0.00</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Market Cap</p>
                        <p className="font-bold text-slate-800">$0.00</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Metamask Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Integração com Metamask</h3>
              <p className="text-lg text-slate-600">Conecte sua carteira digital para gerenciar seus ativos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Wallet Connection */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center text-white">
                  <Wallet className="w-10 h-10" />
                </div>
                
                {!metamaskConnected ? (
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Conectar Carteira</h4>
                    <p className="text-slate-600 mb-6">Clique no botão abaixo para conectar sua carteira Metamask</p>
                    <button
                      onClick={connectMetamask}
                      disabled={paymentLoading}
                      className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
                    >
                      {paymentLoading ? 'Conectando...' : 'Conectar Metamask'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Carteira Conectada</h4>
                    <p className="text-slate-600 mb-2">Endereço: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                    <p className="text-slate-600 mb-6">Saldo: {walletBalance} ETH</p>
                    <button
                      onClick={disconnectMetamask}
                      className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Desconectar
                    </button>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center text-white">
                  <Activity className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-4">Histórico de Transações</h4>
                <p className="text-slate-600 mb-6">Visualize todas as suas operações em criptomoedas</p>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-500">Nenhuma transação encontrada</p>
                  <p className="text-xs text-slate-400">As transações aparecerão aqui após conectar sua carteira</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Cripto;
