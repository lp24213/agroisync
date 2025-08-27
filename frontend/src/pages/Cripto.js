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
  Lock, Unlock, Eye, EyeOff, Copy, CheckCircle, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cripto = () => {
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // CAMADA 2: Dados reais de criptomoedas via CoinGecko API
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Buscar dados reais de criptomoedas via CoinGecko API
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // API CoinGecko - Criptomoedas específicas solicitadas
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=false&locale=pt'
      );
      
      if (response.ok) {
        const data = await response.json();
        setCryptoData(data);
        
        // Buscar dados do gráfico para Bitcoin por padrão
        if (data.length > 0) {
          fetchChartData('bitcoin');
        }
      } else {
        throw new Error('Erro na API CoinGecko');
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      
      // Em caso de erro, tentar novamente em 5 segundos
      setTimeout(() => {
        fetchCryptoData();
      }, 5000);
      
      setError('Erro de conexão. Tentando novamente...');
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados do gráfico para uma criptomoeda específica
  const fetchChartData = async (cryptoId) => {
    try {
      setChartLoading(true);
      
      // API CoinGecko - Dados do gráfico (7 dias)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=daily`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Formatar dados para o gráfico
        const formattedChartData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price: price
        }));
        
        setChartData(formattedChartData);
      } else {
        throw new Error('Erro ao buscar dados do gráfico');
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      
      // Em caso de erro, tentar novamente
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  };

  // Atualizar dados a cada 1 minuto para cotações em tempo real
  useEffect(() => {
    fetchCryptoData();
    
    const interval = setInterval(fetchCryptoData, 60000); // 1 minuto
    
    return () => clearInterval(interval);
  }, []);

  // CAMADA 2: Atualizar gráfico quando criptomoeda selecionada mudar
  useEffect(() => {
    if (selectedCrypto) {
      fetchChartData(selectedCrypto);
    }
  }, [selectedCrypto]);

  // CAMADA 2: Definir título da página
  useEffect(() => {
    document.title = `Agroisync - ${t('crypto.title')}`;
  }, [t]);

  // Função para obter símbolo correto do TradingView
  const getTradingViewSymbol = (cryptoId) => {
    const symbols = {
      'bitcoin': 'BTCUSD',
      'ethereum': 'ETHUSD',
      'solana': 'SOLUSD'
    };
    return symbols[cryptoId] || 'BTCUSD';
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
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatChange = (change) => {
    if (change === null || change === undefined) return '0.00%';
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '$0';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toFixed(2)}`;
  };

  const formatVolume = (volume) => {
    if (!volume) return '$0';
    if (volume >= 1e12) return `$${(volume / 1e12).toFixed(2)}T`;
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
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
      
      {/* Hero Section - Animações reforçadas */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold mb-6 text-slate-800"
          >
            {t('crypto.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            {t('crypto.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => navigate('/cadastro')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300"
            >
              {t('crypto.cta.primary')}
            </motion.button>
            <motion.button
              onClick={() => navigate('/sobre')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors duration-300"
            >
              {t('crypto.cta.secondary')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Principais Criptomoedas - Animações reforçadas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{t('crypto.realTimeQuotes')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t('crypto.realTimeQuotesDesc')}</p>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
              <p className="mt-4 text-slate-600">{t('common.loading')}</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchCryptoData}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-300"
              >
                {t('common.tryAgain')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {cryptoData.map((crypto, index) => (
                <motion.div
                  key={crypto.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <h3 className="font-bold text-slate-800">{crypto.name}</h3>
                        <p className="text-sm text-slate-500">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">
                        ${crypto.current_price.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        {formatChange(crypto.price_change_percentage_24h)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('crypto.details.volume')}:</span>
                      <span className="text-slate-800">${formatVolume(crypto.total_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('crypto.details.marketCap')}:</span>
                      <span className="text-slate-800">${formatMarketCap(crypto.market_cap)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Gráfico em Tempo Real - CoinGecko/TradingView */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              📊 Gráfico em Tempo Real
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Acompanhe as variações das principais criptomoedas com dados atualizados da CoinGecko
            </p>
          </motion.div>

          {/* Seletor de Criptomoeda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {cryptoData.slice(0, 5).map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCrypto === crypto.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full" />
                    <span>{crypto.symbol.toUpperCase()}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Gráfico TradingView */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {cryptoData.find(c => c.id === selectedCrypto)?.name || 'Bitcoin'}
                  </h3>
                  <p className="text-slate-600">
                    {cryptoData.find(c => c.id === selectedCrypto)?.symbol?.toUpperCase() || 'BTC'}/USD
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">
                    ${cryptoData.find(c => c.id === selectedCrypto)?.current_price?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm">
                    {cryptoData.find(c => c.id === selectedCrypto) && 
                      formatChange(cryptoData.find(c => c.id === selectedCrypto).price_change_percentage_24h)
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* TradingView Widget */}
            <div className="h-96 w-full">
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${selectedCrypto}&symbol=${getTradingViewSymbol(selectedCrypto)}&interval=D&hidesidetoolbar=0&hidetrading=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=exchange&withdateranges=1&range=1M&showpopupbutton=1&popupwidth=1000&popupheight=650&locale=pt_BR&utm_source=&utm_medium=widget&utm_campaign=symbol&page-uri=`}
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                allowTransparency={true}
                allowFullScreen={true}
                title={`Gráfico ${getTradingViewSymbol(selectedCrypto)}`}
              />
            </div>
          </motion.div>

          {/* Estatísticas em Tempo Real */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {cryptoData.find(c => c.id === selectedCrypto) && (() => {
              const crypto = cryptoData.find(c => c.id === selectedCrypto);
              return [
                {
                  label: 'Volume 24h',
                  value: `$${formatVolume(crypto.total_volume)}`,
                  icon: '📊',
                  color: 'text-blue-600'
                },
                {
                  label: 'Market Cap',
                  value: `$${formatMarketCap(crypto.market_cap)}`,
                  icon: '💰',
                  color: 'text-emerald-600'
                },
                {
                  label: 'Variação 24h',
                  value: `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`,
                  icon: crypto.price_change_percentage_24h >= 0 ? '📈' : '📉',
                  color: crypto.price_change_percentage_24h >= 0 ? 'text-emerald-600' : 'text-red-600'
                }
              ];
            })().map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Metamask Integration */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              {t('crypto.connectWallet')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('crypto.wallet.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                {t('crypto.wallet.connection')}
              </h3>
              
              {!metamaskConnected ? (
                <div className="space-y-4">
                  <p className="text-slate-600 mb-6">
                    {t('crypto.wallet.connectDescription')}
                  </p>
                  
                  <button
                    onClick={connectMetamask}
                    disabled={paymentLoading}
                    className="w-full px-6 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('crypto.connecting')}</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        <span>{t('crypto.connectMetaMask')}</span>
                      </>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-500">
                      {t('crypto.wallet.supportedWallets')}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mt-2">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">MetaMask</span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">Phantom</span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">WalletConnect</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-emerald-800">{t('crypto.walletConnected')}</h4>
                        <p className="text-sm text-emerald-600">{t('crypto.wallet.address')}: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">{t('crypto.balance')}</p>
                      <p className="text-xl font-bold text-slate-800">{walletBalance} ETH</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">{t('crypto.network')}</p>
                      <p className="text-xl font-bold text-slate-800">Ethereum</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={disconnectMetamask}
                    className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    {t('crypto.disconnect')}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                {t('crypto.transactionHistory')}
              </h3>
              
              {metamaskConnected ? (
                <div className="space-y-4">
                  {/* The original code had transactions.length > 0, but transactions is not defined.
                      Assuming it should be removed or replaced with a placeholder. */}
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">{t('crypto.noTransactions')}</p>
                  </div>
                  
                  <button
                    onClick={() => {/* Função para ver mais transações */}}
                    className="w-full px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors duration-300"
                  >
                    {t('crypto.viewTransactions')}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">{t('crypto.connectToViewHistory')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cripto;
