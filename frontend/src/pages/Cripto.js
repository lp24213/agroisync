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

const Cripto = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask');

  // Dados simulados de cotações em tempo real
  const cryptoQuotes = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,250', change: '+2.1%', icon: <BitcoinIcon className="w-8 h-8" /> },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,680', change: '-0.5%', icon: <EthereumIcon className="w-8 h-8" /> },
    { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '0.0%', icon: <USDTIcon className="w-8 h-8" /> },
    { symbol: 'BNB', name: 'Binance Coin', price: '$315', change: '+1.8%', icon: <BNBIcon className="w-8 h-8" /> },
    { symbol: 'SOL', name: 'Solana', price: '$98.50', change: '+3.2%', icon: <SolanaIcon className="w-8 h-8" /> }
  ];

  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: <MetaMaskIcon className="w-6 h-6" />, color: 'from-orange-500 to-red-500' },
    { id: 'phantom', name: 'Phantom', icon: <PhantomIcon className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' },
    { id: 'walletconnect', name: 'WalletConnect', icon: <WalletConnectIcon className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' }
  ];

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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} text-white`}>
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {t('crypto.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {t('crypto.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Cryptocurrency Ticker */}
      <CryptoTicker />

      {/* Cotações em Tempo Real Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-4xl font-bold text-center mb-16 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('crypto.realTimeQuotes')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cryptoQuotes.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
                }`}
              >
                <div className="flex justify-center mb-4">
                  {crypto.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {crypto.name}
                </h3>
                <p className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-cyan-400' : 'text-green-600'
                }`}>
                  {crypto.price}
                </p>
                <p className={`text-sm font-medium ${getChangeColor(crypto.change)}`}>
                  {crypto.change}
                </p>
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

      {/* Conectar Carteira Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl ${
              isDark
                ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700'
                : 'bg-white/80 backdrop-blur-xl border border-gray-200'
            }`}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('crypto.connectWallet')}
            </h2>
            
            {!isConnected ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <p className={`text-lg mb-8 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Escolha sua carteira preferida para conectar
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {walletOptions.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedWallet === wallet.id
                          ? (isDark
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-green-500 bg-green-500/10')
                          : (isDark
                              ? 'border-gray-600 hover:border-gray-500'
                              : 'border-gray-300 hover:border-gray-400')
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {wallet.icon}
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {wallet.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {loading ? t('crypto.connecting') : t('crypto.connectMetaMask')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('crypto.walletConnected')}
                    </p>
                    <p className={`font-mono text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('crypto.balance')}
                    </p>
                    <p className="text-green-400 font-bold">{balance} ETH</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={disconnectWallet}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors duration-300"
                  >
                    {t('crypto.disconnect')}
                  </button>
                  <button
                    onClick={() => alert('Funcionalidade em desenvolvimento')}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-300"
                  >
                    {t('crypto.viewTransactions')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pagamentos Aceitos Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-4xl font-bold text-center mb-16 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('crypto.acceptedPayments')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cryptoQuotes.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
                }`}
              >
                <div className="flex justify-center mb-4">
                  {crypto.icon}
                </div>
                <h3 className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {crypto.name}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Aceito para pagamentos
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
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-cyan-900 transition-colors duration-300">
              {t('crypto.cta.learnMore')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cripto;
