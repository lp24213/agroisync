import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BitcoinIcon, EthereumIcon, USDTIcon, BNBIcon, SolanaIcon,
  MetaMaskIcon, PhantomIcon, WalletConnectIcon 
} from '../components/icons/CryptoIcons';
import CryptoTicker from '../components/crypto/CryptoTicker';
import CryptoChart from '../components/crypto/CryptoChart';
import GlobalTicker from '../components/GlobalTicker';
import Navbar from '../components/Navbar';

const Cripto = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask');

  // Dados simulados mais profissionais de cotações em tempo real
  const cryptoQuotes = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250, change: 2.1, volume24h: 25000000000, icon: <BitcoinIcon className="w-8 h-8" />, description: 'Criptomoeda líder do mercado' },
    { symbol: 'ETH', name: 'Ethereum', price: 2680, change: -0.5, volume24h: 15000000000, icon: <EthereumIcon className="w-8 h-8" />, description: 'Plataforma de contratos inteligentes' },
    { symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.0, volume24h: 80000000000, icon: <USDTIcon className="w-8 h-8" />, description: 'Stablecoin atrelada ao dólar' },
    { symbol: 'BNB', name: 'Binance Coin', price: 315, change: 1.8, volume24h: 2000000000, icon: <BNBIcon className="w-8 h-8" />, description: 'Token nativo da Binance' },
    { symbol: 'SOL', name: 'Solana', price: 98.50, change: 3.2, volume24h: 5000000000, icon: <SolanaIcon className="w-8 h-8" />, description: 'Blockchain de alta performance' }
  ];

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

  const handleWalletConnect = (walletName) => {
    setSelectedWallet(walletName);
    // Simular conexão segura sem expor dados
    setLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
      // Não expor endereço real - apenas simular
      setWalletAddress('0x****' + Math.random().toString(36).substr(2, 4));
    }, 2000);
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          
          // Simular balance
          const mockBalance = (Math.random() * 10).toFixed(4);
          setBalance(mockBalance);
        }
      } else {
        alert(t('crypto.metamaskNotInstalled'));
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert(t('crypto.walletConnectionError'));
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setBalance('0');
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-green-500';
    if (change.startsWith('-')) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <GlobalTicker />
      <Navbar />
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Cotações em Tempo Real
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Acompanhe as principais criptomoedas do mercado
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptoQuotes.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                } transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {crypto.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {crypto.symbol}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {crypto.name}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${
                    crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <div className="text-lg font-bold">
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </div>
                </div>
                
                <div className={`text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  ${crypto.price.toLocaleString()}
                </div>
                
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Volume 24h: ${crypto.volume24h.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cryptocurrency Chart Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard de Criptomoedas
          </h2>
          <CryptoChart />
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Conectar Carteira
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onClick={() => handleWalletConnect(wallet.name)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-2xl">{wallet.icon}</span>
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {wallet.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Pagamentos Aceitos
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                className={`p-6 rounded-xl border text-center ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {crypto.symbol.charAt(0)}
                  </span>
                </div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {crypto.symbol}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {crypto.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades DeFi Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Funcionalidades DeFi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                  : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('crypto.features.staking')}
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('crypto.features.stakingDesc')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                  : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('crypto.features.yieldFarming')}
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('crypto.features.yieldFarmingDesc')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                  : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('crypto.features.liquidityPools')}
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('crypto.features.liquidityPoolsDesc')}
              </p>
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
            className={`text-3xl font-bold mb-8 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Integração com Stripe
          </motion.h2>
          <div className={`p-8 rounded-2xl ${
            isDark
              ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700'
              : 'bg-white/80 backdrop-blur-xl border border-gray-200'
          }`}>
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('crypto.payments.traditional')}
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('crypto.payments.traditionalDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('crypto.payments.creditCard')}
                </p>
                <p className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('crypto.payments.visaMastercard')}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('crypto.payments.pix')}
                </p>
                <p className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('crypto.payments.instantTransfer')}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('crypto.payments.boleto')}
                </p>
                <p className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
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
