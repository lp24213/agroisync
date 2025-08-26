import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { cryptoService } from '../services/cryptoService';
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
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-stone-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800">
            {t('crypto.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('crypto.description')}
          </p>
        </div>
      </section>

      {/* Crypto Overview */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Total Market Cap */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Market Cap Total</p>
                  <p className="text-2xl font-bold text-slate-800">$2.1T</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            {/* 24h Volume */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Volume 24h</p>
                  <p className="text-2xl font-bold text-slate-800">$89.2B</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            {/* BTC Dominance */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Dominância BTC</p>
                  <p className="text-2xl font-bold text-slate-800">48.2%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            {/* Fear & Greed */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Fear & Greed</p>
                  <p className="text-2xl font-bold text-slate-800">65</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crypto Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Top Criptomoedas</h2>
                <button
                  onClick={fetchCryptoData}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchCryptoData}
                  className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">Moeda</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-800">Preço</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-800">24h %</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-800">7d %</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-800">Market Cap</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-800">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cryptoData.map((crypto, index) => (
                      <tr key={crypto.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-slate-700">
                                {getCryptoIcon(crypto.symbol)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{crypto.name}</p>
                              <p className="text-sm text-slate-600">{crypto.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-slate-800">
                          {formatPrice(crypto.current_price)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          {formatChange(crypto.price_change_percentage_24h)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          {formatChange(crypto.price_change_percentage_7d_in_currency)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-800">
                          ${(crypto.market_cap / 1e9).toFixed(2)}B
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-800">
                          ${(crypto.total_volume / 1e6).toFixed(2)}M
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Metamask Integration */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              {t('crypto.metamask.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('crypto.metamask.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-card p-8 border border-slate-200"
          >
            {!metamaskConnected ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Conectar Metamask
                </h3>
                <p className="text-slate-600 mb-8">
                  Conecte sua carteira Metamask para fazer pagamentos em criptomoedas
                </p>
                <button
                  onClick={connectMetamask}
                  disabled={paymentLoading}
                  className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {paymentLoading ? 'Conectando...' : 'Conectar Metamask'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Metamask Conectado
                  </h3>
                  <p className="text-slate-600">
                    Sua carteira está conectada e pronta para transações
                  </p>
                </div>

                {/* Wallet Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      Endereço da Carteira
                    </h4>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm text-slate-700 bg-white px-3 py-2 rounded-lg flex-1">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </code>
                      <button
                        onClick={() => copyAddress(walletAddress)}
                        id="copy-button"
                        className="p-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Coins className="w-5 h-5 mr-2" />
                      Saldo ETH
                    </h4>
                    <p className="text-2xl font-bold text-slate-800">
                      {parseFloat(walletBalance).toFixed(4)} ETH
                    </p>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Fazer Pagamento
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Valor em ETH
                      </label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0.01"
                        step="0.001"
                        min="0.001"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading || !paymentAmount}
                      className="w-full px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
                    >
                      {paymentLoading ? 'Processando...' : 'Enviar Pagamento'}
                    </button>
                  </div>
                </div>

                {/* Disconnect Button */}
                <div className="text-center">
                  <button
                    onClick={disconnectMetamask}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-300"
                  >
                    Desconectar Metamask
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              {t('crypto.features.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('crypto.features.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Segurança',
                description: 'Transações seguras e verificadas na blockchain Ethereum'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Rapidez',
                description: 'Confirmações rápidas e taxas competitivas'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global',
                description: 'Aceite pagamentos de qualquer lugar do mundo'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cripto;
