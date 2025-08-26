import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BitcoinIcon, EthereumIcon, USDTIcon, BNBIcon, SolanaIcon
} from '../components/icons/CryptoIcons';
import CryptoTicker from '../components/crypto/CryptoTicker';
import CryptoChart from '../components/crypto/CryptoChart';
import cryptoService from '../services/cryptoService';
import metamaskService from '../services/metamaskService';

const Cripto = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [cryptoQuotes, setCryptoQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [chartData, setChartData] = useState(null);

  // Dados das carteiras suportadas
  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Carteira mais popular do Ethereum', color: 'from-orange-500 to-red-500', secure: true },
    { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Carteira oficial da Solana', color: 'from-purple-500 to-pink-500', secure: true },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Conecte qualquer carteira de forma segura', color: 'from-blue-500 to-cyan-500', secure: true }
  ];

  const acceptedCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', description: 'Pagamento aceito' },
    { symbol: 'ETH', name: 'Ethereum', description: 'Pagamento aceito' },
    { symbol: 'USDT', name: 'Tether', description: 'Pagamento aceito' },
    { symbol: 'BNB', name: 'Binance Coin', description: 'Pagamento aceito' },
    { symbol: 'SOL', name: 'Solana', description: 'Pagamento aceito' },
    { symbol: 'ADA', name: 'Cardano', description: 'Pagamento aceito' },
    { symbol: 'DOT', name: 'Polkadot', description: 'Pagamento aceito' },
    { symbol: 'LINK', name: 'Chainlink', description: 'Pagamento aceito' }
  ];

  // Carregar dados das criptomoedas
  useEffect(() => {
    loadCryptoData();
    loadChartData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadCryptoData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await cryptoService.getCryptoQuotes();
      setCryptoQuotes(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das criptomoedas');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await cryptoService.getCryptoHistory(selectedCrypto, 7);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar gráfico:', error);
    }
  };

  const handleCryptoChange = async (cryptoId) => {
    setSelectedCrypto(cryptoId);
    try {
      const data = await cryptoService.getCryptoHistory(cryptoId, 7);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar gráfico:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!metamaskService.isMetamaskInstalled()) {
        alert('MetaMask não está instalado. Por favor, instale a extensão MetaMask.');
        return;
      }

      const connection = await metamaskService.connect();
      setWalletAddress(connection.account);
      setIsConnected(true);
      
      // Obter saldo real
      const realBalance = await metamaskService.getBalance();
      setBalance(realBalance);
      
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira: ' + error.message);
    }
  };

  const disconnectWallet = () => {
    metamaskService.disconnect();
    setWalletAddress('');
    setIsConnected(false);
    setBalance('0');
  };

  const handleWalletConnect = (walletName) => {
    if (walletName === 'metamask') {
      connectWallet();
    } else {
      // Implementar outras carteiras
      alert(`Carteira ${walletName} será implementada em breve.`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                         Criptomoedas Agroisync
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções em Criptomoedas para o Agronegócio
          </p>
        </div>
      </section>

      {/* Cryptocurrency Ticker */}
      <CryptoTicker />

      {/* Cotações em Tempo Real */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Cotações em Tempo Real
            </h2>
            <p className="text-lg text-gray-600">
              Acompanhe os preços das principais criptomoedas do mercado
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando cotações...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={loadCryptoData}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoQuotes.map((crypto, index) => (
                <motion.div
                  key={crypto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCryptoChange(crypto.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xl">{crypto.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{crypto.symbol}</h3>
                        <p className="text-sm text-gray-600">{crypto.name}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded ${
                      crypto.change >= 0 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-red-600 bg-red-100'
                    }`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold mb-4 text-gray-900">
                    ${crypto.price.toLocaleString()}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Volume 24h: ${(crypto.volume_24h / 1000000).toFixed(1)}M
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cryptocurrency Chart Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Dashboard de Criptomoedas
          </h2>
          {chartData ? (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Criptomoeda:
                </label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => handleCryptoChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {cryptoQuotes.map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.symbol} - {crypto.name}
                    </option>
                  ))}
                </select>
              </div>
              <CryptoChart data={chartData} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando gráfico...</p>
            </div>
          )}
        </div>
      </section>

      {/* Conectar Carteira */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Conectar Carteira
            </h2>
            <p className="text-lg text-gray-600">
              Conecte sua carteira de forma segura para realizar transações
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {walletOptions.map((wallet, index) => (
              <motion.button
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                onClick={() => handleWalletConnect(wallet.name)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-2xl">{wallet.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {wallet.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {wallet.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Pagamentos Aceitos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Pagamentos Aceitos
            </h2>
            <p className="text-lg text-gray-600">
              Aceitamos as principais criptomoedas do mercado
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {acceptedCryptos.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-2xl text-green-600">{crypto.symbol.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{crypto.symbol}</h3>
                <p className="text-sm text-gray-600 mb-2">{crypto.name}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {crypto.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades DeFi Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Funcionalidades DeFi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('crypto.features.staking')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('crypto.features.stakingDesc')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('crypto.features.yieldFarming')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('crypto.features.yieldFarmingDesc')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('crypto.features.liquidityPools')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('crypto.features.liquidityPoolsDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Carteira Blockchain Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center text-gray-900"
          >
            Carteira Blockchain Integrada
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carteira do Usuário */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Sua Carteira
                </h3>
                <p className="text-sm text-gray-600">
                  Custódia descentralizada via MetaMask
                </p>
              </div>

              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-100">
                    <p className="text-xs text-gray-600">
                      Endereço da Carteira
                    </p>
                    <p className="font-mono text-sm break-all text-green-600">
                      {walletAddress}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gray-100">
                    <p className="text-xs text-gray-600">
                      Saldo ETH
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {balance} ETH
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {/* Implementar envio */}}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => {/* Implementar recebimento */}}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Receber
                    </button>
                  </div>

                  <button
                    onClick={disconnectWallet}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={connectWallet}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Conectar MetaMask
                  </button>
                  <p className="text-xs mt-3 text-gray-600">
                    Suas chaves privadas permanecem seguras na sua carteira
                  </p>
                </div>
              )}
            </motion.div>

            {/* Histórico de Transações */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Histórico de Transações
                </h3>
                <p className="text-sm text-gray-600">
                  Todas as suas operações em blockchain
                </p>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {isConnected ? (
                  <>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Recebimento</span>
                        <span className="text-green-500 text-sm">+0.05 ETH</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        De: 0x1234...5678 • 2 horas atrás
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Envio</span>
                        <span className="text-red-500 text-sm">-0.02 ETH</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Para: 0x8765...4321 • 1 dia atrás
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>Conecte sua carteira para ver o histórico</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integração Stripe Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-gray-900"
          >
            Integração com Stripe
          </motion.h2>
          <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {t('crypto.payments.traditional')}
            </h3>
            <p className="text-lg mb-6 text-gray-700">
              {t('crypto.payments.traditionalDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-100">
                <p className="text-sm text-gray-600">
                  {t('crypto.payments.creditCard')}
                </p>
                <p className="font-semibold text-gray-900">
                  {t('crypto.payments.visaMastercard')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-100">
                <p className="text-sm text-gray-600">
                  {t('crypto.payments.pix')}
                </p>
                <p className="font-semibold text-gray-900">
                  {t('crypto.payments.instantTransfer')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-100">
                <p className="text-sm text-gray-600">
                  {t('crypto.payments.boleto')}
                </p>
                <p className="font-semibold text-gray-900">
                  {t('crypto.payments.bankPayment')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 text-white"
          >
            {t('crypto.cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-8"
          >
            {t('crypto.cta.subtitle')}
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={connectWallet}
              className="px-8 py-4 bg-white text-cyan-900 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              {t('crypto.cta.connectWallet')}
            </button>
            <button 
              onClick={() => window.location.href = '/cadastro'}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-cyan-900 transition-colors duration-300"
            >
              Cadastrar na Plataforma
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cripto;
