import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { BarChart3, Search, Globe, Bitcoin, Rocket, Zap, Network } from 'lucide-react';
import NFTMinting from '../components/illustrations/NFTMinting';
import PremiumFarmer from '../components/illustrations/PremiumFarmer';
import InteractiveDashboard from '../components/illustrations/InteractiveDashboard';
import StakingFarming from '../components/illustrations/StakingFarming';
import CyberDefense from '../components/illustrations/CyberDefense';
import SmartFarming from '../components/illustrations/SmartFarming';
import WeatherWidget from '../components/WeatherWidget';
import NewsWidget from '../components/NewsWidget';

const Home = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const highlightCards = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('home.highlights.realTimeData'),
      description: t('home.highlights.realTimeDataDesc'),
      illustration: <InteractiveDashboard className="w-16 h-16" />
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t('home.highlights.advancedAnalytics'),
      description: t('home.highlights.advancedAnalyticsDesc'),
      illustration: <CyberDefense className="w-16 h-16" />
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('home.highlights.marketIntelligence'),
      description: t('home.highlights.marketIntelligenceDesc'),
      illustration: <SmartFarming className="w-16 h-16" />
    },
    {
      icon: <Bitcoin className="w-8 h-8" />,
      title: t('home.highlights.cryptoTrading'),
      description: t('home.highlights.cryptoTradingDesc'),
      illustration: <NFTMinting className="w-20 h-20" />
    }
  ];

  const featureCards = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t('home.features.feature1.title'),
      description: t('home.features.feature1.description'),
      illustration: <PremiumFarmer className="w-20 h-20" />
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('home.features.feature2.title'),
      description: t('home.features.feature2.description'),
      illustration: <StakingFarming className="w-20 h-20" />
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: t('home.features.feature3.title'),
      description: t('home.features.feature3.description'),
      illustration: <SmartFarming className="w-20 h-20" />
    }
  ];

  return (
    <div className={`min-h-screen relative z-10 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradiente de fundo baseado no tema */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
        }`} />
        
        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className={`text-5xl md:text-7xl font-bold mb-6 font-orbitron ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'
              }`}
            >
              {t('home.hero.title')}
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className={`text-xl md:text-2xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('home.hero.subtitle')}
            </motion.p>
            
            <motion.p
              variants={itemVariants}
              className={`text-lg mb-12 max-w-2xl mx-auto ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('home.hero.description')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/cadastro"
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-600/25'
                }`}
              >
                {t('home.hero.ctaPrimary')}
              </Link>
              
              <Link
                to="/sobre"
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? 'border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white'
                    : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDark ? 'border-cyan-400/50' : 'border-green-600/50'
          }`}>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1 h-3 rounded-full mt-2 ${
                isDark ? 'bg-cyan-400' : 'bg-green-600'
              }`}
            />
          </div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-orbitron ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.highlights.title')}
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('home.highlights.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlightCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'bg-green-600/20 text-green-600'
                }`}>
                  {card.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.title}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {card.description}
                </p>
                <div className="mt-4 flex justify-center">
                  {card.illustration}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-orbitron ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.features.title')}
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500'
                }`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'bg-green-600/20 text-green-600'
                }`}>
                  {card.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.title}
                </h3>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {card.description}
                </p>
                <div className="mt-6 flex justify-center">
                  {card.illustration}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Informações em Tempo Real Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-orbitron ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Informações em Tempo Real
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Clima local e notícias do agronegócio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Widget de Clima */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <WeatherWidget showForecast={true} />
            </motion.div>

            {/* Widget de Notícias */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <NewsWidget limit={4} showBreaking={true} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
