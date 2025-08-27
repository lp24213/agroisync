import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Wallet, TrendingUp, BarChart3, 
  Settings, Shield, Zap, Globe
} from 'lucide-react';
import Web3Wallet from '../components/Web3Wallet';
import DeFiOperations from '../components/DeFiOperations';
import MarketAnalysis from '../components/MarketAnalysis';

const CryptoPlatform = () => {
  const [activeTab, setActiveTab] = useState('wallet');

  const tabs = [
    {
      id: 'wallet',
      label: 'Carteira Web3',
      icon: Wallet,
      description: 'Conecte e gerencie sua carteira Metamask',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'defi',
      label: 'Operações DeFi',
      icon: TrendingUp,
      description: 'Compra, venda e staking de criptomoedas',
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 'analysis',
      label: 'Análise de Mercado',
      icon: BarChart3,
      description: 'Indicadores técnicos e análise fundamental',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallet':
        return <Web3Wallet />;
      case 'defi':
        return <DeFiOperations />;
      case 'analysis':
        return <MarketAnalysis />;
      default:
        return <Web3Wallet />;
    }
  };

  const getActiveTab = () => tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Coins className="w-10 h-10" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold mb-4"
            >
              Plataforma de Criptomoedas
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-emerald-100 max-w-3xl mx-auto"
            >
              Acesse o futuro das finanças com nossa plataforma completa de criptomoedas, 
              DeFi e análise de mercado
            </motion.p>
          </div>

          {/* Estatísticas Rápidas */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { label: 'Criptomoedas', value: '100+', icon: Coins },
              { label: 'Redes Suportadas', value: '3', icon: Globe },
              { label: 'Operações DeFi', value: '24/7', icon: Zap },
              { label: 'Segurança', value: '100%', icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-emerald-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex flex-col items-center p-6 transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white` 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${isActive ? 'rounded-lg' : ''}`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-semibold text-lg mb-1">{tab.label}</span>
                  <span className={`text-sm text-center ${isActive ? 'text-white text-opacity-90' : 'text-gray-500'}`}>
                    {tab.description}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Seção de Recursos */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma solução completa e segura para suas necessidades de criptomoedas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Segurança Máxima',
                description: 'Carteiras seguras com chaves privadas em seu controle e integração com Metamask',
                color: 'text-blue-600'
              },
              {
                icon: Zap,
                title: 'Operações DeFi',
                description: 'Acesse protocolos DeFi para staking, yield farming e liquidez',
                color: 'text-emerald-600'
              },
              {
                icon: BarChart3,
                title: 'Análise Avançada',
                description: 'Indicadores técnicos profissionais e dados de mercado em tempo real',
                color: 'text-purple-600'
              },
              {
                icon: Globe,
                title: 'Multi-Rede',
                description: 'Suporte para Ethereum, Binance Smart Chain e Polygon',
                color: 'text-orange-600'
              },
              {
                icon: TrendingUp,
                title: 'Preços em Tempo Real',
                description: 'Dados atualizados da CoinGecko e Binance para decisões informadas',
                color: 'text-green-600'
              },
              {
                icon: Settings,
                title: 'Interface Intuitiva',
                description: 'Design responsivo e fácil de usar para todos os níveis de experiência',
                color: 'text-gray-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Comece sua jornada no mundo das criptomoedas
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-emerald-100 mb-8"
          >
            Conecte sua carteira, explore DeFi e tome decisões informadas com nossa plataforma
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('wallet')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Conectar Carteira
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CryptoPlatform;
